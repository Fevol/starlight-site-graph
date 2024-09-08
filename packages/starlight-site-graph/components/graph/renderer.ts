import * as PIXI from './pixi/pixi';
import type { LinkData, NodeData } from './types';

import type { NodeShapeType } from '../../config';
import { type GraphComponent } from './graph-component';

// prettier-ignore
import {
	LABEL_DEFAULT_Z_INDEX,
	ARROW_DEFAULT_Z_INDEX, ARROW_HOVER_Z_INDEX,
	LINK_DEFAULT_Z_INDEX, LINK_HOVER_Z_INDEX,
	NODE_DEFAULT_Z_INDEX, NODE_HOVER_Z_INDEX, NODE_MUTED_Z_INDEX,
	STROKE_DEFAULT_Z_INDEX, STROKE_HOVER_Z_INDEX, STROKE_MUTED_Z_INDEX,
	DEFAULT_ARROW_SCALE, STAR_LINE_DEPTH
} from './constants';
import type { GraphSimulator } from './simulator';

// TODO: Shared graphicsContext would improve performance (investigate whether context would share zIndex/...)
export class GraphRenderer {
	app: PIXI.Application;
	links!: PIXI.Graphics;
	arrows!: PIXI.Graphics;
	container!: HTMLElement;

	simulator!: GraphSimulator;

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
			resolution: 4,
			resizeTo: this.container,
		} as PIXI.ApplicationOptions);
		this.container.appendChild(this.app.canvas);

		this.links = new PIXI.Graphics();
		this.arrows = new PIXI.Graphics();
		this.app.stage.sortableChildren = true;
		this.app.stage.addChild(this.links);
		this.app.stage.addChild(this.arrows);
		this.app.ticker.add((ticker: PIXI.Ticker) => {
			this.tick(ticker);
		});

		if (this.context.debug) {
			setTimeout(async () => {
				try {
					const pixistats = await import('pixi-stats');
					const stats = pixistats.addStats(document, this.app);
					this.app.ticker.add(stats.update, stats, PIXI.UPDATE_PRIORITY.UTILITY);
					stats.stats.domElement.id = 'graphStats';
				} catch (e) {
					console.error(
						'[STARLIGHT-SITE-GRAPH] Failed to load pixi-stats, to enable the FPS counter for the graph view, make sure to install all devDependencies.',
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
		this.app.stage.addChild(this.links);
		this.app.stage.addChild(this.arrows);
		this.links.clear();
		this.arrows.clear();
	}

	destroy() {
		this.app.destroy();
		this.app = undefined!;
		this.simulator = undefined!;
		this.context = undefined!;
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

	drawNodeShape(node: NodeData, hovered?: boolean) {
		node.node!.clear();
		this.drawNode(
			node.node!,
			node.shape!,
			node.computedSize! - node.shapeCornerRadius!,
			node.shapeRotation!,
			node.shapePoints!,
		).fill(0xffffff)._zIndex =
			hovered === undefined ? NODE_DEFAULT_Z_INDEX : hovered ? NODE_HOVER_Z_INDEX : NODE_MUTED_Z_INDEX;
		node.node!.tint = this.context.animator.getValue((node.shapeColor + (hovered ? 'Hover' : '')) as any) as string;

		if (node.shapeCornerRadius) {
			node.node!.stroke({
				color: 0xffffff,
				width: node.shapeCornerRadius!,
				join: node.cornerType!,
			});
		}
	}

	drawNodeStroke(node: NodeData, hovered?: boolean) {
		let strokeFill, strokeTint;
		if (node.strokeColor === 'inherit') {
			strokeFill = node.node!.tint;
			strokeTint = node.node!.tint;
		} else {
			strokeFill = 0xffffff;
			strokeTint = this.context.animator.getValue((node.strokeColor + (hovered ? 'Hover' : '')) as any) as string;
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
			const isHovered = this.simulator.currentlyHovered !== '' && node.id === this.simulator.currentlyHovered;
			if (node.strokeWidth && node.strokeColor) {
				this.drawNodeStroke(node, isHovered);
				node.stroke!.position.set(node.x!, node.y!);
			}
			this.drawNodeShape(node, isHovered);

			if (this.context.config.renderLabels) {
				this.updateLabel(node, isHovered);
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

	drawLink(link: LinkData, isHovered: boolean) {
		const linkZoomLevel = this.context.config.scaleLinks ? this.context.animator.getValue('zoom') : 1;
		const incAngle = Math.atan2(link.target.y! - link.source.y!, link.target.x! - link.source.x!);
		const outAngle = Math.atan2(link.source.y! - link.target.y!, link.source.x! - link.target.x!);

		const [xStart, yStart] = this.getLinkOffset(link.source, outAngle);
		const [xEnd, yEnd] = this.getLinkOffset(link.target, incAngle);

		// DEBUG: Draw "correct" edge connection points (cf. circle positions, line should go straight through both)
		// this.links.circle(...this.nodeCircleOffset({...link.source, shape: "circle"}, outAngle), 2).fill(0x00ff00)
		// this.links.circle(...this.nodeCircleOffset({...link.target, shape: "circle"}, incAngle), 2).fill(0xff0000)

		// FIXME: Find a good way to only draw hovered links above other nodes
		this.links
			.moveTo(xStart, yStart)
			.lineTo(xEnd, yEnd)
			.stroke({
				color: isHovered
					? this.context.animator.getValue('linkColorHover')
					: this.context.animator.getValue('linkColor'),
				width: this.context.config.linkWidth / linkZoomLevel,
			});
		this.links.zIndex = isHovered && this.simulator.isHovering ? LINK_HOVER_Z_INDEX : LINK_DEFAULT_Z_INDEX;

		if (this.context.config.renderArrows && this.simulator.zoomTransform.k > this.context.config.minZoomArrows) {
			this.drawArrowHead(xEnd, yEnd, incAngle, isHovered);
		}
	}

	drawArrowHead(nodeX: number, nodeY: number, nodeAngle: number, isHovered: boolean) {
		const arrowZoomLevel = this.context.config.scaleArrows ? this.context.animator.getValue('zoom') : 2;
		const x =
			nodeX - (this.context.config.linkWidth / arrowZoomLevel / 2) * Math.cos(this.context.config.arrowAngle);
		const y =
			nodeY - (this.context.config.linkWidth / arrowZoomLevel / 2) * Math.sin(this.context.config.arrowAngle);
		const arrowSize = (DEFAULT_ARROW_SCALE * this.context.config.arrowSize) / arrowZoomLevel;
		this.arrows
			.moveTo(x, y)
			.lineTo(
				x - arrowSize * Math.cos(nodeAngle - this.context.config.arrowAngle),
				y - arrowSize * Math.sin(nodeAngle - this.context.config.arrowAngle),
			)
			.lineTo(
				x - arrowSize * Math.cos(nodeAngle + this.context.config.arrowAngle),
				y - arrowSize * Math.sin(nodeAngle + this.context.config.arrowAngle),
			)
			.lineTo(x, y)
			.fill(
				isHovered
					? this.context.animator.getValue('linkColorHover')
					: this.context.animator.getValue('linkColor'),
			).zIndex = isHovered ? ARROW_HOVER_Z_INDEX : ARROW_DEFAULT_Z_INDEX;
	}

	drawLinks(links: LinkData[]) {
		this.links.clear();
		this.arrows.clear();

		const adjacentLinks = [];
		// FIXME: make adjacent links render above other links, probably some drawing order stuff
		for (const link of links) {
			let isAdjacent =
				this.simulator.currentlyHovered !== '' &&
				(link.source.id === this.simulator.currentlyHovered ||
					link.target.id === this.simulator.currentlyHovered);

			if (isAdjacent) {
				adjacentLinks.push(link);
			} else {
				this.drawLink(link, false);
			}
		}

		for (const link of adjacentLinks) {
			this.drawLink(link, true);
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

	updateLabel(node: NodeData, hovered?: boolean) {
		const labelOffset = node.fullRadius! +
			(hovered ? this.context.animator.getValue('labelOffset') : this.context.config.labelOffset);
		const labelOpacity = hovered
			? this.context.animator.getValue('labelOpacityHover')
			: this.context.animator.getValue('labelOpacity');
		const labelColor = this.context.animator.getValue(hovered ? 'labelColorHover' : 'labelColor');

		node.label!.scale.set(1);
		node.label!.position.set(node.x!, node.y! + labelOffset);
		node.label!.alpha = labelOpacity;
		node.label!.tint = labelColor;
	}
}
