import type { LinkData, NodeData } from './types';
import * as d3 from 'd3';

import { prefetch } from 'astro:prefetch';
import { ensureLeadingSlash, addToVisitedEndpoints } from '../util';
import { type GraphRenderer } from './renderer';
import { type GraphComponent } from './graph-component';

export class GraphSimulator {
	container!: HTMLCanvasElement;
	renderer!: GraphRenderer;

	simulation!: d3.Simulation<NodeData, undefined>;

	nodes!: NodeData[];
	links!: LinkData[];

	currentNode: NodeData | undefined;
	currentlyHovered: string = '';
	isHovering: boolean = false;

	lastClick: number = 0;
	lastClickedNode: NodeData | undefined;
	requireDblClick: boolean = false;

	scale: number = 1;
	transform: d3.ZoomTransform = d3.zoomIdentity;
	zoomTransform: d3.ZoomTransform = d3.zoomIdentity;
	centerTransform: d3.ZoomTransform = d3.zoomIdentity;

	animateZoomOverride: boolean = false;
	userZoomed: boolean = false;

	requestRender = true;
	zoomBehavior!: d3.ZoomBehavior<HTMLCanvasElement, unknown>;

	constructor(private context: GraphComponent) {}

	mount(renderer: GraphRenderer) {
		this.renderer = renderer;
	}

	get mounted() {
		return this.simulation !== undefined;
	}

	initialize(nodes: NodeData[], links: LinkData[], currentNode: NodeData | undefined, scale: number) {
		this.nodes = nodes;
		this.links = links;
		this.currentNode = currentNode;

		this.container = this.renderer.canvas;
		this.simulation = d3.forceSimulation<NodeData>(this.nodes);

		this.requireDblClick = this.context.config.enableClick === 'dblclick';
		this.zoomTransform = this.zoomTransform.scale(scale);
		this.scale = scale;

		this.simulation.on('tick', () => {
			this.requestRender = true;
		});
	}

	cleanup() {
		this.currentlyHovered = '';
		this.zoomTransform = d3.zoomIdentity;
		this.centerTransform = d3.zoomIdentity;
		this.transform = d3.zoomIdentity;

		this.simulation.stop();
		this.simulation.nodes([]);
		this.simulation.force('link', null);
	}

	destroy() {
		this.cleanup();
		this.simulation = undefined!;
		this.renderer = undefined!;
		this.context = undefined!;
	}

	update() {
		const linkForce = d3.forceLink(this.links).id((d: any) => d.id);
		if (this.context.config.linkDistance) {
			linkForce.distance(this.context.config.linkDistance);
		}

		this.simulation
			.stop()
			.force('link', linkForce)
			.force('charge', d3.forceManyBody().distanceMax(500).strength(-this.context.config.repelForce))
			.force('forceX', d3.forceX().strength(this.context.config.nodeForce))
			.force('forceY', d3.forceY().strength(this.context.config.nodeForce))
			.force(
				'collision',
				d3
					.forceCollide()
					.radius(node => (node as NodeData).colliderSize! + this.context.config.colliderPadding),
			)
			.force('center', d3.forceCenter(this.context.config.centerForce))
			.alpha(1)
			.restart();
	}

	findOverlappingNode(x: number, y: number): NodeData | undefined {
		for (const node of this.simulation.nodes()) {
			if ((node.x! - x) ** 2 + (node.y! - y) ** 2 <= node.fullRadius! ** 2) {
				return node;
			}
		}

		return undefined;
	}

	enableDrag() {
		let dragX = 0;
		let dragY = 0;
		d3.select(this.container).call(
			(d3.drag().container(this.container) as unknown as d3.DragBehavior<HTMLCanvasElement, unknown, unknown>)
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

					dragX += e.dx / this.context.animator.getValue('zoom');
					dragY += e.dy / this.context.animator.getValue('zoom');

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
	}

	enableHover() {
		d3.select(this.container).on('mousemove', (e: MouseEvent) => {
			const [x, y] = this.transform.invert([e.offsetX, e.offsetY]);
			const closestNode = this.findOverlappingNode(x, y);

			if (closestNode) {
				this.currentlyHovered = closestNode.id;
				this.isHovering = true;
				prefetch(ensureLeadingSlash(closestNode.id));
				this.context.setStyleHovered();
				this.requestRender = true;
				this.container.style.cursor = this.isClickable(closestNode) ? 'pointer' : 'default';
			} else if (this.currentlyHovered) {
				this.unhoverNode();
			}
		});

		d3.select(this.container).on('mouseleave', () => {
			if (this.currentlyHovered) {
				this.unhoverNode();
			}
		});
	}

	unhoverNode() {
		this.isHovering = false;
		this.context.setStyleDefault();
		this.context.animator.setOnFinished('nodeColorHover', () => {
			this.currentlyHovered = '';
			this.requestRender = false;
		});
		this.container.style.cursor = 'default';
	}

	enableClick() {
		d3.select(this.container).on('click', (e: MouseEvent) => {
			const [x, y] = this.transform.invert([e.offsetX, e.offsetY]);
			const closestNode = this.findOverlappingNode(x, y);
			if (closestNode && this.isClickable(closestNode)) {
				const clickTime = Date.now();
				if (
					!this.requireDblClick ||
					(clickTime - this.lastClick < 500 && closestNode === this.lastClickedNode)
				) {
					if (closestNode.external) {
						window.open(closestNode.id, '_blank');
					} else {
						if (this.context.config.trackVisitedPages) {
							addToVisitedEndpoints(closestNode.id);
						}
						window.open(ensureLeadingSlash(closestNode.id), '_self');
					}
				}
				this.lastClick = clickTime;
				this.lastClickedNode = closestNode;
			}
		});
	}

	enableZoom() {
		d3.select(this.container as HTMLCanvasElement).call(
			(this.zoomBehavior = (d3.zoom() as d3.ZoomBehavior<HTMLCanvasElement, unknown>)
				.scaleExtent([this.context.config.minZoom, this.context.config.maxZoom])
				.on('zoom', ({ transform }: { transform: d3.ZoomTransform }) => {
					this.userZoomed = true;
					if (!this.context.config.enablePan) {
						// D3 zoom to origin (instead of to mouse position)
						this.zoomTransform.k = transform.k;
						const offset = Math.min(this.container.clientWidth, this.container.clientHeight) / 2 * (1 - this.zoomTransform.k);
						this.zoomTransform.x = offset;
						this.zoomTransform.y = offset;
					} else {
						this.zoomTransform = transform;
					}

					this.updateTransform();
				})),
		);

		if (!this.context.config.enablePan) {
			this.zoomBehavior.filter((event) => {
				return event.type !== 'mousedown';
			});
		}

		if (!this.context.config.enableZoom) {
			this.zoomBehavior.filter((event) => {
				return event.type !== 'wheel' && !(event.type === 'touchstart' && event.touches.length >= 2);
			});
		}
	}

	isClickable(node: NodeData): boolean {
		return node.exists && !(node.type === 'tag' || node.id === this.currentNode?.id);
	}

	resetZoom(immediate: boolean = false) {
		this.userZoomed = false;
		this.renderer.resetZoom(d3.zoomIdentity);
		this.zoomTransform = d3.zoomIdentity.scale(this.scale);
		this.updateCenterTransform();

		this.updateTransform(immediate);
	}

	getCurrentLabelOpacity(k: number = this.transform.k): number {
		return Math.max((k * this.context.config.labelOpacityScale - 1) / 3.75, 0);
	}

	updateTransform(immediate: boolean = false) {
		this.transform = this.zoomTransform
			.translate(this.centerTransform.x, this.centerTransform.y)
			.scale(this.centerTransform.k);

		const values: { zoom: number; transformX: number; transformY: number; labelOpacity?: number } = {
			zoom: this.transform.k,
			transformX: this.transform.x,
			transformY: this.transform.y,
		};
		if (!this.currentlyHovered) {
			values.labelOpacity = this.getCurrentLabelOpacity(this.transform.k);
		}

		if (immediate) {
			this.animateZoomOverride = true;
			this.context.animator.setValues(values);
		} else {
			this.context.animator.startAnimations(values);
		}
	}

	/**
	 * Updates the center transform to keep the current node in the center of the screen.
	 * @returns {boolean} Whether the transform was updated.
	 */
	updateCenterTransform(): boolean {
		let x;
		let y;

		if (this.currentNode) {
			x = this.container.clientWidth / (2 * this.scale) - this.scale * this.currentNode.x!;
			y = this.container.clientHeight / (2 * this.scale) - this.scale * this.currentNode.y!;
		} else {
			x = this.container.clientWidth / (2 * this.scale);
			y = this.container.clientHeight / (2 * this.scale);
		}

		if (this.centerTransform.x !== x || this.centerTransform.y !== y) {
			this.centerTransform = new d3.ZoomTransform(this.scale, x, y);
			return true;
		}

		return false;
	}
}