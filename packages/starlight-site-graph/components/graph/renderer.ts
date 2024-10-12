import * as PIXI from './pixi/pixi';
import type { LinkData, NodeData } from './types';

import type { NodeShapeType } from '../../config';
import { type GraphComponent } from './graph-component';

// prettier-ignore
import {
	LABEL_DEFAULT_Z_INDEX,
	ARROW_DEFAULT_Z_INDEX, ARROW_HOVER_Z_INDEX, ARROW_MUTED_Z_INDEX,
	LINK_DEFAULT_Z_INDEX, LINK_HOVER_Z_INDEX, LINK_MUTED_Z_INDEX,
	NODE_DEFAULT_Z_INDEX, NODE_HOVER_Z_INDEX, NODE_MUTED_Z_INDEX,
	STROKE_DEFAULT_Z_INDEX, STROKE_HOVER_Z_INDEX, STROKE_MUTED_Z_INDEX,
	DEFAULT_ARROW_SCALE, STAR_LINE_DEPTH
} from './constants';
import type { GraphSimulator } from './simulator';

// TODO: Shared graphicsContext would improve performance (investigate whether context would share zIndex/...)
export class GraphRenderer {
	app: PIXI.Application;
	container!: HTMLElement;
	simulator!: GraphSimulator;

	linkGraphics!: PIXI.Graphics;
	linkHoverGraphics!: PIXI.Graphics;
	arrowGraphics!: PIXI.Graphics;
	arrowHoverGraphics!: PIXI.Graphics;

	visibilityObserver!: IntersectionObserver;

	constructor(private context: GraphComponent) {
		this.app = new PIXI.Application();
	}

	async mount(simulator: GraphSimulator, container: HTMLElement) {
		this.simulator = simulator;
		this.container = container;
		// this.container.replaceChildren();
		await this.app.init({
			antialias: true,
			backgroundAlpha: 0,
			resolution: Object.keys(this.context.sitemap).length > 5000 ? 2 : 4,
			resizeTo: this.container,
		} as PIXI.ApplicationOptions);
		this.container.appendChild(this.app.canvas);

		this.visibilityObserver = new IntersectionObserver((entries) => {
			if (entries[0]?.isIntersecting) {
				this.resize();
			}
		});
		this.visibilityObserver.observe(this.container);

		this.app.stage.addChild(this.linkGraphics = new PIXI.Graphics());
		this.app.stage.addChild(this.linkHoverGraphics = new PIXI.Graphics());
		this.app.stage.addChild(this.arrowGraphics = new PIXI.Graphics());
		this.app.stage.addChild(this.arrowHoverGraphics = new PIXI.Graphics());
		this.linkHoverGraphics.zIndex = LINK_HOVER_Z_INDEX;
		this.arrowHoverGraphics.zIndex = ARROW_HOVER_Z_INDEX;

		this.app.stage.sortableChildren = true;
		this.app.ticker.add((ticker: PIXI.Ticker) => {
			this.tick(ticker);
		});

		if (import.meta.env.DEV && this.context.debug) {
			setTimeout(async () => {
				try {
					const pixistats = await import('pixi-stats');
					const stats = pixistats.addStats(document, this.app);
					this.app.ticker.add(stats.update, stats, PIXI.UPDATE_PRIORITY.UTILITY);
					stats.stats.domElement.id = 'graph-stats';
				} catch (e) {
					console.error(
						'[STARLIGHT-SITE-GRAPH] Failed to load pixi-stats, to enable the FPS counter for the graph view, make sure to install the dependency. Disable this message by setting `debug` to false in the graph component.',
					);
				}
			}, 500);
		}
	}

	get canvas() {
		return this.app.canvas;
	}

	get mounted() {
		return this.context !== undefined;
	}

	resize() {
		this.app.renderer.resize(this.container.clientWidth, this.container.clientHeight);
	}

	initialize() {
		this.initializeNodes(this.simulator.nodes);
	}

	cleanup() {
		this.app.stage.removeChildren();
		this.app.stage.addChild(this.linkGraphics.clear());
		this.app.stage.addChild(this.linkHoverGraphics.clear());
		this.app.stage.addChild(this.arrowGraphics.clear());
		this.app.stage.addChild(this.arrowHoverGraphics.clear());
	}

	destroy() {
		this.app.destroy();
		this.app = undefined!;
		this.simulator = undefined!;
		this.context = undefined!;
		this.visibilityObserver.disconnect();
	}

	tick(ticker: PIXI.Ticker) {
		this.context.animator.update(ticker.deltaMS);

		if (!this.simulator.userZoomed) {
			const updated = this.simulator.updateCenterTransform();
			if (updated) {
				this.simulator.updateTransform();
			}
		}

		if (this.zoomIsAnimating()) {
			this.app.stage.updateTransform({
				scaleX: this.context.animator.getValue('zoom'),
				scaleY: this.context.animator.getValue('zoom'),
				x: this.context.animator.getValue('transformX'),
				y: this.context.animator.getValue('transformY'),
			});
			this.simulator.animateZoomOverride = false;
		}

		if (this.simulator.requestRender || this.context.animator.anyAnimating) {
			this.simulator.requestRender = false;
			this.drawNodes(this.simulator.nodes);
			this.drawLinks(this.simulator.links);
		}
		this.linkHoverGraphics.alpha = this.context.animator.getValue('linkOpacityHover');
		this.arrowHoverGraphics.alpha = this.context.animator.getValue('linkOpacityHover');
	}

	resetZoom(zoomTransform: { k: number; x: number; y: number }) {
		// @ts-expect-error __zoom is a private property
		this.app.canvas.__zoom = zoomTransform;
	}

	zoomIsAnimating() {
		if (this.simulator.animateZoomOverride) {
			return true;
		}
		return (
			this.context.animator.isAnimating('zoom') ||
			this.context.animator.isAnimating('transformX') ||
			this.context.animator.isAnimating('transformY')
		);
	}

	initializeNodes(nodes: NodeData[]) {
		for (const node of nodes) {
			node.node = new PIXI.Graphics();
			if (node.strokeWidth) {
				node.stroke = new PIXI.Graphics();
				this.drawNodeStroke(node);
				this.app.stage.addChild(node.stroke);
			}

			this.drawNodeShape(node);
			this.app.stage.addChild(node.node);

			if (this.context.config.renderLabels) {
				this.createLabel(node);
				this.app.stage.addChild(node.label);
			}
		}
	}

	drawNodeShape(node: NodeData, hovered?: boolean, adjacent?: boolean) {
		node.node!.clear();
		this.drawNode(
			node.node!,
			node.shape!,
			node.computedSize! - node.shapeCornerRadius!,
			node.shapeRotation!,
			node.shapePoints!,
		).fill(0xffffff)._zIndex =
			hovered === undefined ? NODE_DEFAULT_Z_INDEX : hovered ? NODE_HOVER_Z_INDEX : NODE_MUTED_Z_INDEX;
		node.node!.tint = this.context.animator.getValue((node.shapeColor + (hovered ? 'Hover' : (adjacent ? 'Adjacent' : ''))) as any) as string;

		if (node.shapeCornerRadius) {
			node.node!.stroke({
				color: 0xffffff,
				width: node.shapeCornerRadius!,
				join: node.cornerType!,
			});
		}
	}

	drawNodeStroke(node: NodeData, hovered?: boolean, adjacent?: boolean) {
		let strokeFill, strokeTint;
		if (node.strokeColor === 'inherit') {
			strokeFill = node.node!.tint;
			strokeTint = node.node!.tint;
		} else {
			strokeFill = 0xffffff;
			strokeTint = this.context.animator.getValue((node.strokeColor + (hovered ? 'Hover' : (adjacent ? 'Adjacent' : ''))) as any) as string;
		}

		node.stroke!.clear();
		node.stroke!._zIndex =
			hovered === undefined ? STROKE_DEFAULT_Z_INDEX : hovered ? STROKE_HOVER_Z_INDEX : STROKE_MUTED_Z_INDEX;
		this.drawNode(
			node.stroke!,
			node.shape!,
			node.fullRadius! - node.strokeCornerRadius! / 2,
			node.shapeRotation!,
			node.shapePoints!,
		).fill(strokeFill);
		node.stroke!.tint = strokeTint;

		if (node.strokeCornerRadius) {
			node.stroke!.stroke({
				color: strokeFill,
				width: node.strokeCornerRadius!,
				join: node.cornerType!,
			});
		}
	}

	drawNode(
		graphics: PIXI.Graphics,
		shape: NodeShapeType,
		size: number,
		rotation: number,
		points?: number,
	): PIXI.Graphics {
		if (shape === 'circle') {
			graphics.circle(0, 0, size);
		} else if (shape === 'polygon') {
			const angle = (Math.PI * 2) / points!;
			graphics.moveTo(size, 0);
			for (let i = 0; i < points!; i++) {
				graphics.lineTo(size * Math.cos(-angle * i), size * Math.sin(-angle * i));
			}
			graphics.closePath();

			// DEBUG: Render drawing order of the polygon vertices
			// graphics.circle(size, 0, 2);
			// for (let i = 0; i < points!; i++) {
			// 	graphics.circle(size * Math.cos(- angle * i), size * Math.sin(- angle * i), 2 + i / 4);
			// }
		} else if (shape === 'star') {
			graphics.moveTo(0, -size);
			for (let i = 0; i < 2 * points!; i++) {
				const angle = (Math.PI * 2 * i) / (2 * points!);
				const r = i % 2 === 0 ? size : size * STAR_LINE_DEPTH;
				graphics.lineTo(r * Math.sin(angle), -r * Math.cos(angle));
			}
			graphics.closePath();
		} else {
			console.error('[STARLIGHT-SITE-GRAPH] Invalid shape type: ' + shape);
		}
		graphics.rotation = rotation!;

		return graphics;
	}

	drawNodes(nodes: NodeData[]) {
		for (const node of nodes) {
			const hovered = this.simulator.currentlyHovered !== '' && node.id === this.simulator.currentlyHovered;
			let adjacent = false;
			if (!hovered && this.simulator.currentlyHovered !== '') {
				adjacent = node.adjacent.has(this.simulator.currentlyHovered);
			}
			if (node.strokeWidth && node.strokeColor) {
				this.drawNodeStroke(node, hovered);
				node.stroke!.position.set(node.x!, node.y!);
			}
			this.drawNodeShape(node, hovered, adjacent);

			if (this.context.config.renderLabels) {
				this.updateLabel(node, hovered, adjacent);
			}

			node.node!.position.set(node.x!, node.y!);
		}
	}

	/**
	 * No, this spa-hetti code took practically no time at all, why do you ask?
	 */
	getLinkOffset(node: NodeData, angle: number): [number, number] {
		let x = node.x!,
			y = node.y!,
			radius = node.fullRadius!;
		if (node.shape === 'circle') {
			const sin = Math.sin(angle),
				cos = Math.cos(angle);
			return [x - radius * cos, y - radius * sin];
		} else if (node.shape === 'polygon') {
			const points = node.shapePoints!;
			const segmentAngle = (2 * Math.PI) / points;

			angle += Math.PI - node.shapeRotation!;
			const segment = Math.floor(angle / segmentAngle);
			const t = (segmentAngle * (segment + 1) - angle) / segmentAngle;

			return [
				x +
					radius *
						(t * Math.cos(node.shapeRotation! + segment * segmentAngle) +
							(1 - t) * Math.cos(node.shapeRotation! + (segment + 1) * segmentAngle)),
				y +
					radius *
						(t * Math.sin(node.shapeRotation! + segment * segmentAngle) +
							(1 - t) * Math.sin(node.shapeRotation! + (segment + 1) * segmentAngle)),
			];
		} else if (node.shape === 'star') {
			const points = node.shapePoints!;
			const segmentAngle = Math.PI / points;
			let rotation = node.shapeRotation!;
			if (points & 1) {
				rotation += Math.PI / 2;
			} else if (points % 4 === 0) {
				rotation += segmentAngle;
			} else {
				rotation += 0;
			}

			angle += Math.PI - rotation;
			const segment = Math.floor(angle / segmentAngle);
			const t = (segmentAngle * (segment + 1) - angle) / segmentAngle;
			const r1 = radius * (segment & 1 ? STAR_LINE_DEPTH : 1);
			const r2 = radius * (segment & 1 ? 1 : STAR_LINE_DEPTH);

			return [
				x +
					(t * r2 * Math.cos(rotation + segment * segmentAngle) +
					(1 - t) * r1 * Math.cos(rotation + (segment + 1) * segmentAngle)),
				y +
					(t * r2 * Math.sin(rotation + segment * segmentAngle) +
					(1 - t) * r1 * Math.sin(rotation + (segment + 1) * segmentAngle)),
			];
		} else {
			console.error('[STARLIGHT-SITE-GRAPH] Invalid shape type: ' + node.shape);
			return [x, y];
		}
	}

	drawLink(link: LinkData, hovered: boolean) {
		const linkZoomLevel = this.context.config.scaleLinks ? this.context.animator.getValue('zoom') : 1;
		const incAngle = Math.atan2(link.target.y! - link.source.y!, link.target.x! - link.source.x!);
		const outAngle = Math.atan2(link.source.y! - link.target.y!, link.source.x! - link.target.x!);

		const [xStart, yStart] = this.getLinkOffset(link.source, outAngle);
		const [xEnd, yEnd] = this.getLinkOffset(link.target, incAngle);
		let width, color;
		if (hovered) {
			width = this.context.animator.getValue('linkWidthHover');
			color = this.context.animator.getValue('linkColorHover');
		} else {
			width = this.context.config.linkWidth;
			color = this.context.animator.getValue('linkColor');
		}

		this.linkGraphics.moveTo(xStart, yStart)
			 .lineTo(xEnd, yEnd)
			 .stroke({ width: width / linkZoomLevel, color: color });
		if (hovered) {
			this.linkHoverGraphics.moveTo(xStart, yStart)
				.lineTo(xEnd, yEnd)
				.stroke({ width: width / linkZoomLevel, color: color });
		}

		// DEBUG: Draw "correct" edge connection points (cf. circle positions, line should go straight through both)
		// layer.circle(...this.nodeCircleOffset({...link.source, shape: "circle"}, outAngle), 2).fill(0x00ff00)
		// layer.circle(...this.nodeCircleOffset({...link.target, shape: "circle"}, incAngle), 2).fill(0xff0000)

		if (this.context.config.renderArrows && this.simulator.zoomTransform.k > this.context.config.minZoomArrows) {
			this.drawArrowHead(xEnd, yEnd, width, incAngle, hovered);
		}
	}

	drawArrowHead(nodeX: number, nodeY: number, linkWidth: number, nodeAngle: number, hovered: boolean) {
		const arrowZoomLevel = this.context.config.scaleArrows ? this.context.animator.getValue('zoom') : 2;
		const x = nodeX - (linkWidth / arrowZoomLevel / 2) * Math.cos(this.context.config.arrowAngle);
		const y = nodeY - (linkWidth / arrowZoomLevel / 2) * Math.sin(this.context.config.arrowAngle);
		const arrowSize = (DEFAULT_ARROW_SCALE * (this.context.config.arrowSize + linkWidth)) / arrowZoomLevel;
		const xLeft = x - arrowSize * Math.cos(nodeAngle - this.context.config.arrowAngle),
			  yLeft = y - arrowSize * Math.sin(nodeAngle - this.context.config.arrowAngle);
		const xRight = x - arrowSize * Math.cos(nodeAngle + this.context.config.arrowAngle),
			  yRight = y - arrowSize * Math.sin(nodeAngle + this.context.config.arrowAngle);

		this.arrowGraphics
			.moveTo(x, y)
			.lineTo(xLeft, yLeft)
			.lineTo(xRight, yRight)
			.lineTo(x, y)
			.fill(this.context.animator.getValue('linkColor'));
		if (hovered) {
			this.arrowHoverGraphics.moveTo(x, y)
				.lineTo(xLeft, yLeft)
				.lineTo(xRight, yRight)
				.lineTo(x, y)
				.fill(this.context.animator.getValue('linkColorHover'));
		}
	}

	drawLinks(links: LinkData[]) {
		const hovered = this.simulator.currentlyHovered !== '';

		this.linkGraphics.clear().zIndex = hovered ? LINK_MUTED_Z_INDEX : LINK_DEFAULT_Z_INDEX;
		this.linkHoverGraphics.clear();
		this.arrowGraphics.clear().zIndex = hovered ? ARROW_MUTED_Z_INDEX : ARROW_DEFAULT_Z_INDEX;
		this.arrowHoverGraphics.clear();

		for (const link of links) {
			this.drawLink(link, hovered &&
				(link.source.id === this.simulator.currentlyHovered ||
				 link.target.id === this.simulator.currentlyHovered));
		}
	}

	createLabel(node: NodeData) {
		node.label = new PIXI.Text({
			text: node.text || node.id,
			style: {
				fill: 0xffffff,
				fontSize: this.context.config.labelFontSize,
			},
			zIndex: LABEL_DEFAULT_Z_INDEX,
		});
		node.label.anchor.set(0.5, 0.5);
		node.label.alpha = this.context.animator.getValue('labelOpacity');
	}

	updateLabel(node: NodeData, hovered?: boolean, adjacent?: boolean) {
		let labelOffset, labelOpacity, labelColor, labelScale;
		if (hovered) {
			labelOffset = this.context.animator.getValue('labelOffset');
			labelOpacity = this.context.animator.getValue('labelOpacityHover');
			labelColor = this.context.animator.getValue('labelColorHover');
			labelScale = this.context.animator.getValue('labelScaleHover');
		} else {
			labelOffset = this.context.config.labelOffset;
			labelOpacity = this.context.animator.getValue('labelOpacity' + (adjacent ? 'Adjacent' : ''));
			labelColor = this.context.animator.getValue('labelColor');
			labelScale = 1;
		}

		node.label!.scale.set(labelScale);
		node.label!.position.set(node.x!, node.y! + node.fullRadius! + labelOffset);
		node.label!.alpha = labelOpacity;
		node.label!.tint = labelColor;
	}
}
