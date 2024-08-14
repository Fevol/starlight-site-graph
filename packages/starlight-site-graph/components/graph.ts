import * as d3 from 'd3';
import { Application, Graphics, Text, Ticker } from 'pixi.js';
import config from 'virtual:starlight-site-graph/config';
import type { GraphConfig } from '../config';
import { Animator } from './animator';
import { showContextMenu } from './context-menu';
import {
	addToVisitedEndpoints,
	getRelativePath,
	getVisitedEndpoints,
	onClickOutside,
	simplifySlug,
	stripSlashes,
} from './util';
import type { ContentDetails, LinkData, NodeData } from './types';
import {ARROW_ANGLE, ARROW_SIZE, LABEL_OFFSET, NODE_SIZE, NODE_SIZE_MODIFIER} from './constants';
import { animatables } from './animatables';
import { icons } from './icons';

const MAX_DEPTH = 6;

export class GraphComponent extends HTMLElement {
	graphContainer: HTMLElement;
	mockGraphContainer: HTMLElement;
	actionContainer: HTMLElement;
	blurContainer: HTMLElement;

	app!: Application;
	simulation!: d3.Simulation<NodeData, undefined>;
	zoomBehavior!: d3.ZoomBehavior<HTMLCanvasElement, unknown>;
	zoomTransform: d3.ZoomTransform;
	centerTransform: d3.ZoomTransform;
	transform: d3.ZoomTransform;
	userZoomed: boolean = false;
	currentNode!: NodeData;

	links!: Graphics;
	arrows!: Graphics;

	config!: GraphConfig;
	processedData!: ReturnType<typeof this.processSitemapData>;
	animator: Animator<ReturnType<typeof animatables>>;

	currentlyHovered: string = '';
	isFullscreen: boolean = false;
	fullscreenExitHandler?: () => void;

	currentPage: string = stripSlashes(location.pathname) + '/';

	visitedPages: Set<string> = getVisitedEndpoints();

	constructor() {
		super();

		this.config = config.graphConfig;
		this.config.depth = Math.min(this.config.depth, 5);

		this.zoomTransform = d3.zoomIdentity;
		this.centerTransform = d3.zoomIdentity;
		this.transform = d3.zoomIdentity;

		this.classList.add('graph-component');

		this.graphContainer = document.createElement('div');
		this.graphContainer.classList.add('graph-container');
		this.graphContainer.onkeyup = e => {
			if (e.key === 'f') this.enableFullscreen();
		};
		this.graphContainer.tabIndex = 0;
		this.appendChild(this.graphContainer);

		this.actionContainer = document.createElement('div');
		this.actionContainer.classList.add('graph-action-container');
		this.renderActionContainer();
		this.graphContainer.appendChild(this.actionContainer);

		this.mockGraphContainer = document.createElement('div');
		this.mockGraphContainer.classList.add('graph-container');

		this.blurContainer = document.createElement('div');
		this.blurContainer.classList.add('background-blur');

		this.animator = new Animator<ReturnType<typeof animatables>>(animatables(config.graphConfig));

		this.mountGraph().then(() => {
			this.setup();
		});
	}

	override remove() {
		this.app.destroy();
		this.graphContainer.remove();
		this.mockGraphContainer.remove();
		this.blurContainer.remove();

		super.remove();
	}

	enableFullscreen() {
		if (this.isFullscreen) return;

		this.isFullscreen = true;

		this.graphContainer.classList.toggle('is-fullscreen', true);
		this.appendChild(this.mockGraphContainer);
		this.appendChild(this.blurContainer);
		this.fullscreenExitHandler = onClickOutside(this.graphContainer, () => {
			this.disableFullscreen();
		});
		this.graphContainer.onkeyup = e => {
			if (e.key === 'Escape' || e.key === 'f') this.disableFullscreen();
		};
		this.renderActionContainer();

		this.app.renderer.resize(this.graphContainer.clientWidth, this.graphContainer.clientHeight);

		this.resetZoom(true);
	}

	disableFullscreen() {
		if (!this.isFullscreen) return;

		this.isFullscreen = false;

		this.graphContainer.classList.toggle('is-fullscreen', false);
		this.removeChild(this.mockGraphContainer);
		this.removeChild(this.blurContainer);
		this.fullscreenExitHandler!();
		this.graphContainer.onkeyup = e => {
			if (e.key === 'f') this.enableFullscreen();
		};
		this.renderActionContainer();

		this.app.renderer.resize(this.graphContainer.clientWidth, this.graphContainer.clientHeight);

		this.resetZoom(true);
	}

	renderActionContainer() {
		this.actionContainer.replaceChildren();
		for (const action of ['fullscreen', 'depth', 'reset-zoom']) {
			const actionElement = document.createElement('button');
			actionElement.classList.add('graph-action-button');
			this.actionContainer.appendChild(actionElement);

			if (action === 'fullscreen') {
				actionElement.innerHTML = this.isFullscreen ? icons.minimize : icons.maximize;
				actionElement.onclick = e => {
					this.isFullscreen ? this.disableFullscreen() : this.enableFullscreen();
					e.stopPropagation();
				};
				actionElement.oncontextmenu = e => {
					e.preventDefault();
					e.stopPropagation();
					showContextMenu(e, [
						{ text: 'Minimize', icon: icons.minimize, onClick: () => this.disableFullscreen() },
						{ text: 'Maximize', icon: icons.maximize, onClick: () => this.enableFullscreen() },
					]);
				};
			} else if (action === 'depth') {
				actionElement.innerHTML = icons[('graph' + this.config.depth) as keyof typeof icons];
				actionElement.onclick = () => {
					this.config.depth = (this.config.depth + 1) % MAX_DEPTH;
					this.setup();
					this.renderActionContainer();
				};
				actionElement.oncontextmenu = e => {
					e.preventDefault();
					e.stopPropagation();
					showContextMenu(
						e,
						Array.from({ length: MAX_DEPTH }, (_, i) => ({
							text:
								i === MAX_DEPTH - 1
									? 'Show Entire Graph'
									: i === 0
										? 'Show Only Current'
										: i === 1
											? 'Show Adjacent'
											: `Show Distance ${i}`,
							icon: icons[('graph' + i) as keyof typeof icons],
							onClick: () => {
								if (this.config.depth !== i) {
									this.config.depth = i;
									this.setup();
									this.renderActionContainer();
								}
							},
						})),
					);
				};
			} else if (action === 'reset-zoom') {
				actionElement.innerHTML = icons.focus;
				actionElement.onclick = () => {
					this.resetZoom();
				};
			}
		}
	}

	async mountGraph() {
		this.app = new Application();
		await this.app.init({
			antialias: true,
			backgroundAlpha: 0,
			resolution: 4,
			resizeTo: this.graphContainer,
		});
		this.graphContainer.appendChild(this.app.canvas);

		this.links = new Graphics();
		this.arrows = new Graphics();
		this.app.stage.sortableChildren = true;
		this.app.stage.addChild(this.links);
		this.app.stage.addChild(this.arrows);
		this.app.ticker.add(ticker => {
			this.tick(ticker);
		});
	}

	processSitemapData(siteData: Record<string, ContentDetails>): { nodes: NodeData[]; links: LinkData[] } {
		let slug = this.currentPage;
		const links: LinkData[] = [];
		const tags: string[] = [];
		const data: Map<string, ContentDetails> = new Map(
			Object.entries<ContentDetails>(siteData).map(([k, v]) => [simplifySlug(k), v]),
		);

		let depth = this.config.depth;
		if (depth >= 5) depth = -1;

		const validLinks = new Set(data.keys());
		for (const [source, details] of data.entries()) {
			const outgoing = details.links ?? [];
			for (const dest of outgoing) {
				if (validLinks.has(dest)) {
					links.push({ source: source as unknown as NodeData, target: dest as unknown as NodeData });
				}
			}

			if (this.config.showTags) {
				const localTags = details.tags
					.filter(tag => !this.config.removeTags.includes(tag))
					.map(tag => simplifySlug('tags/' + tag));

				tags.push(...localTags.filter(tag => !tags.includes(tag)));

				for (const tag of localTags) {
					links.push({ source: source as unknown as NodeData, target: tag as unknown as NodeData });
				}
			}
		}

		const neighbourhood = new Set<string>();
		// __SENTINEL is used to separate levels in the BFS
		const queue: (string | '__SENTINEL')[] = [slug, '__SENTINEL'];

		if (depth !== -1) {
			while (depth >= 0 && queue.length > 0) {
				const current = queue.shift()!;

				if (current === '__SENTINEL') {
					depth -= 1;
					if (queue.length === 0) {
						break;
					}
					queue.push('__SENTINEL');
				} else if (neighbourhood.has(current)) {
					continue;
				} else {
					neighbourhood.add(current);
					const outgoing = links.filter(l => (l.source as unknown as string) === current);
					const incoming = links.filter(l => (l.target as unknown as string) === current);
					queue.push(
						...outgoing.map(l => l.target as unknown as string),
						...incoming.map(l => l.source as unknown as string),
					);
				}
			}
		} else {
			validLinks.forEach(id => neighbourhood.add(id));
			if (this.config.showTags) tags.forEach(tag => neighbourhood.add(tag));
		}

		return {
			nodes: [...neighbourhood].map(url => {
				return {
					id: url,
					text: url.startsWith('tags/') ? '#' + url.substring(5) : (data.get(url)?.title ?? url),
					tags: data.get(url)?.tags ?? [],
					neighborCount: (data.get(url)?.links?.length ?? 0) + (data.get(url)?.backlinks?.length ?? 0),
					size: NODE_SIZE + ((data.get(url)?.links?.length ?? 0) + (data.get(url)?.backlinks?.length ?? 0)) * NODE_SIZE_MODIFIER
				};
			}),
			links: links.filter(
				l =>
					neighbourhood.has(l.source as unknown as string) &&
					neighbourhood.has(l.target as unknown as string),
			),
		};
	}

	simulationUpdate() {
		this.simulation
			.stop()
			.force(
				'link',
				d3.forceLink(this.processedData.links).id((d: any) => d.id),
				// .distance(250),
			)
			.force('charge', d3.forceManyBody().distanceMax(500).strength(-100))
			.force('forceX', d3.forceX().strength(0.01))
			.force('forceY', d3.forceY().strength(0.01))
			.restart();
	}

	resetStyle() {
		this.animator.startAnimationsTo({
			nodeColorHover: 'default',
			nodeColor: 'default',
			visitedNodeColorHover: 'default',
			visitedNodeColor: 'default',
			currentNodeColorHover: 'default',
			currentNodeColor: 'default',

			linkColorHover: 'default',
			linkColor: 'default',

			labelOffset: 'default',
		});
		this.animator.startAnimation('labelOpacity', this.getCurrentLabelOpacity());
		this.animator.startAnimation('labelOpacityHover', this.getCurrentLabelOpacity());
	}

	resetZoom(immediate: boolean = false) {
		this.userZoomed = false;
		// @ts-ignore
		this.app.canvas.__zoom = d3.zoomIdentity;
		this.zoomTransform = d3.zoomIdentity;
		this.updateCenterTransform(immediate);
	}

	getCurrentLabelOpacity(k: number = this.transform.k): number {
		return Math.max((k * this.config.opacityScale - 1) / 3.75, 0);
	}

	cleanup() {
		if (this.simulation) {
			this.app.stage.removeChildren();
			this.app.stage.addChild(this.links);
			this.app.stage.addChild(this.arrows);
			this.links.clear();
			this.arrows.clear();
			this.simulation.stop();
			this.simulation.nodes([]);
			this.simulation.force('link', null);
			this.currentlyHovered = '';
			this.zoomTransform = d3.zoomIdentity;
			this.centerTransform = d3.zoomIdentity;
			this.transform = d3.zoomIdentity;
		}
	}

	getNodeColor(node: NodeData, hover: boolean): string {
		let color = '';
		if (node.id === this.currentPage) {
			color = 'currentNodeColor';
		} else if (this.visitedPages.has(node.id)) {
			color = 'visitedNodeColor';
		} else {
			color = 'nodeColor';
		}
		// @ts-ignore ts does not understand that the keys are valid
		return this.animator.getValue(color + (hover ? 'Hover' : ''));
	}

	findOverlappingNode(x: number, y: number): NodeData | undefined {
		for (const node of this.simulation.nodes()) {
			if ((node.x! - x) ** 2 + (node.y! - y) ** 2 <= node.size! ** 2) {
				return node;
			}
		}

		return undefined;
	}

	renderNodes() {
		for (const node of this.simulation.nodes()) {
			const nodeDot = new Graphics();
			nodeDot.zIndex = 1;
			nodeDot.circle(0, 0, node.size!).fill(this.getNodeColor(node, false));

			const nodeText = new Text({
				text: node.text || node.id,
				style: {
					fill: 0xffffff,
					fontSize: 12,
				},
				zIndex: 100,
			});
			nodeText.anchor.set(0.5, 0.5);
			nodeText.alpha = this.animator.getValue('labelOpacity');

			node.node = nodeDot;
			node.label = nodeText;
			this.app.stage.addChild(nodeText);
			this.app.stage.addChild(nodeDot);
		}
	}

	setup() {
		this.cleanup();

		this.processedData = this.processSitemapData(config.sitemap as Record<string, ContentDetails>);

		this.currentNode =
			this.processedData.nodes.find(node => node.id === this.currentPage) ?? this.processedData.nodes[0]!;

		this.simulation = d3.forceSimulation<NodeData>(this.processedData.nodes);
		this.simulationUpdate();

		this.renderNodes();

		let dragX = 0;
		let dragY = 0;
		d3.select(this.app.canvas).call(
			(d3.drag().container(this.app.canvas) as unknown as d3.DragBehavior<HTMLCanvasElement, unknown, unknown>)
				.subject(event => {
					const [x, y] = this.transform.invert([event.x, event.y]);
					return this.findOverlappingNode(x, y);
				})
				.on('start', e => {
					if (!e.subject) return;

					this.userZoomed = true;

					if (!e.active) this.simulation.alphaTarget(0.3).restart();

					e.subject.fx = e.subject.x;
					e.subject.fy = e.subject.y;
					dragX = e.x;
					dragY = e.y;
				})
				.on('drag', e => {
					if (!e.subject) return;

					dragX += e.dx / this.animator.getValue('zoom');
					dragY += e.dy / this.animator.getValue('zoom');

					e.subject.fx = dragX;
					e.subject.fy = dragY;
				})
				.on('end', e => {
					if (!e.subject) return;

					if (!e.active) this.simulation.alphaTarget(0);
					e.subject.fx = null;
					e.subject.fy = null;
				}),
		);

		d3.select(this.app.canvas).on('mousemove', (e: MouseEvent) => {
			const [x, y] = this.transform.invert([e.offsetX, e.offsetY]);
			const closestNode = this.findOverlappingNode(x, y);

			if (closestNode) {
				this.currentlyHovered = closestNode.id;
				this.animator.startAnimationsTo({
					nodeColorHover: 'hover',
					nodeColor: 'blur',
					visitedNodeColorHover: 'hover',
					visitedNodeColor: 'blur',
					currentNodeColorHover: 'hover',
					currentNodeColor: 'blur',

					linkColorHover: 'hover',
					linkColor: 'blur',

					labelOpacityHover: 'hover',
					labelOpacity: 'blur',
					labelOffset: 'hover',
				});
			} else if (this.currentlyHovered) {
				this.resetStyle();
				this.animator.setOnFinished('nodeColorHover', () => {
					this.currentlyHovered = '';
				});
			}
		});

		d3.select(this.app.canvas).on('click', (e: MouseEvent) => {
			const [x, y] = this.transform.invert([e.offsetX, e.offsetY]);
			const closestNode = this.findOverlappingNode(x, y);
			if (closestNode) {
				addToVisitedEndpoints(closestNode.id);
				window.location.assign(getRelativePath(this.currentPage, closestNode.id));
			}
		});

		d3.select(this.app.canvas as HTMLCanvasElement).call(
			(this.zoomBehavior = (d3.zoom() as d3.ZoomBehavior<HTMLCanvasElement, unknown>)
				.scaleExtent([0.05, 4])
				.on('zoom', ({ transform }: { transform: d3.ZoomTransform }) => {
					this.userZoomed = true;

					this.zoomTransform = transform;
					this.updateTransform();
				})),
		);
	}

	updateTransform(immediate: boolean = false) {
		this.transform = this.zoomTransform
			.translate(this.centerTransform.x, this.centerTransform.y)
			.scale(this.centerTransform.k);

		if (immediate) {
			this.animator.setValues({
				zoom: this.transform.k,
				transformX: this.transform.x,
				transformY: this.transform.y,
				labelOpacity: this.getCurrentLabelOpacity(this.transform.k),
			});
		} else {
			this.animator.startAnimations({
				zoom: this.transform.k,
				transformX: this.transform.x,
				transformY: this.transform.y,
				labelOpacity: this.getCurrentLabelOpacity(this.transform.k),
			});
		}
	}

	updateCenterTransform(immediate: boolean = false) {
		const k = 1;
		const closestNode = this.simulation.find(0, 0)!;
		const x = this.graphContainer.clientWidth / 2 - closestNode.x! * k;
		const y = this.graphContainer.clientHeight / 2 - closestNode.y! * k;

		this.centerTransform = new d3.ZoomTransform(k, x, y);

		this.updateTransform(immediate);
	}

	tick(ticker: Ticker) {
		this.animator.update(ticker.deltaMS);

		if (!this.userZoomed) {
			this.updateCenterTransform();
		}

		if (this.animator.isAnimating('zoom')) {
			this.app.stage.updateTransform({
				scaleX: this.animator.getValue('zoom'),
				scaleY: this.animator.getValue('zoom'),
				x: this.animator.getValue('transformX'),
				y: this.animator.getValue('transformY'),
			});
		}

		// FIXME: Disable redrawing when group "hover" is not animating
		for (const node of this.simulation.nodes()) {
			const isHovered = this.currentlyHovered !== '' && node.id === this.currentlyHovered;

			const labelOffset = isHovered ? this.animator.getValue('labelOffset') + node.size! : LABEL_OFFSET + node.size!;
			const labelOpacity = isHovered
				? this.animator.getValue('labelOpacityHover')
				: this.animator.getValue('labelOpacity');
			const nodeZIndex = isHovered ? 100 : 1;

			// nodeColorHover is used here in place for all the different hover color animations
			if (this.animator.isAnimating('nodeColorHover')) {
				let nodeColor = this.getNodeColor(node, isHovered);
				node.node!.clear().circle(0, 0, node.size!).fill(nodeColor);
			}

			node.label!.scale.set(1);
			node.label!.position.set(node.x!, node.y! + labelOffset);
			node.label!.alpha = labelOpacity;

			node.node!.position.set(node.x!, node.y!);
			node.node!.zIndex = nodeZIndex;
		}

		this.links.clear();
		this.arrows.clear();
		for (const link of this.processedData.links) {
			let isAdjacent =
				this.currentlyHovered !== '' &&
				(link.source.id === this.currentlyHovered || link.target.id === this.currentlyHovered);
			this.links
				.moveTo(link.source.x!, link.source.y!)
				.lineTo(link.target.x!, link.target.y!)
				.fill()
				.stroke({
					color: isAdjacent ? this.animator.getValue('linkColorHover') : this.animator.getValue('linkColor'),
					width: 1 / this.animator.getValue('zoom'),
				});

			if (this.config.renderArrows) {
				let {x, y} = link.target as { x: number, y: number };
				const angle = (Math.atan2(link.target.y! - link.source.y!, link.target.x! - link.source.x!));
				x -= link.target.size! * Math.cos(angle);
				y -= link.target.size! * Math.sin(angle);
				this.arrows
					.moveTo(x, y)
					.lineTo(x - ARROW_SIZE * Math.cos(angle - ARROW_ANGLE), y - ARROW_SIZE * Math.sin(angle - ARROW_ANGLE))
					.lineTo(x - ARROW_SIZE * Math.cos(angle + ARROW_ANGLE), y - ARROW_SIZE * Math.sin(angle + ARROW_ANGLE))
					.lineTo(x, y)
					.fill(isAdjacent ? this.animator.getValue('linkColorHover') : this.animator.getValue('linkColor'));
			}
		}
	}
}

customElements.define('graph-component', GraphComponent);
