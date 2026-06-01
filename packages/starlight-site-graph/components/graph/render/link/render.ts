import * as PIXI from 'pixi.js';

import type { GraphRenderer } from '../engine';
import type { LinkData, LinkVisualRole } from '../../types';
import type { LinkDisplay, NodeVisualState } from '../types';

import { hideLinkDisplay } from './lifecycle';
import { getViewportBounds } from '../../transform';
import { getNodeLinkBoundaryGeometry } from '../node/geometry';
import { computeLinkGeometry, linkIntersectsViewport } from './geometry';
import { createLinkVisualState, getLinkVisualRole } from './state';

import {
	DEFAULT_ARROW_SCALE, ARROW_TRIM_SCALE, UNSCALED_ARROW_ZOOM,
	LINK_VIEWPORT_PADDING, MIN_RENDER_ZOOM, MIN_VISIBLE_ALPHA,
	ARROW_DEFAULT_Z_INDEX, ARROW_HOVER_Z_INDEX, ARROW_MUTED_Z_INDEX,
	LINK_DEFAULT_Z_INDEX, LINK_HOVER_Z_INDEX, LINK_MUTED_Z_INDEX,
} from '../constants';
import { GRAPH_EPSILON } from '../../constants';

function createLinkLine(zIndex: number) {
	const line: PIXI.Sprite & { __slsgLinkDisplay?: boolean } = new PIXI.Sprite({ texture: PIXI.Texture.WHITE });
	line.__slsgLinkDisplay = true;
	line.anchor.set(0, 0.5);
	line.visible = false;
	line.zIndex = zIndex;

	return line;
}

// TODO: Potential for more arrow options here.
function redrawArrowGraphic(renderer: GraphRenderer, graphic: PIXI.Graphics) {
	const spread = Math.tan(renderer.config.arrowAngle);
	graphic.clear();
	graphic.moveTo(0, 0)
		.lineTo(-1, -spread).lineTo(-1, spread).lineTo(0, 0).closePath()
		.fill(0xffffff);
}

function createArrowGraphic(renderer: GraphRenderer) {
	const graphic: PIXI.Graphics & { __slsgLinkDisplay?: boolean } = new PIXI.Graphics();
	redrawArrowGraphic(renderer, graphic);
	graphic.__slsgLinkDisplay = true;
	return graphic;
}

export function createLinkDisplays(renderer: GraphRenderer, links: LinkData[]) {
	for (const link of links) {
		// EXPL: Hovered graphics are hidden by default, and smoothly transitioned to visible when node is hovered
		const display = renderer.getLinkDisplay(link);
		display.visual = createLinkVisualState();

		display.line = createLinkLine(LINK_DEFAULT_Z_INDEX);
		renderer.app.stage.addChild(display.line);

		display.hoverLine = createLinkLine(LINK_HOVER_Z_INDEX);
		renderer.app.stage.addChild(display.hoverLine);

		display.arrow = createArrowGraphic(renderer);
		display.arrow.visible = false;
		display.arrow.zIndex = ARROW_DEFAULT_Z_INDEX;
		renderer.app.stage.addChild(display.arrow);

		display.hoverArrow = createArrowGraphic(renderer);
		display.hoverArrow.visible = false;
		display.hoverArrow.zIndex = ARROW_HOVER_Z_INDEX;
		renderer.app.stage.addChild(display.hoverArrow);
	}
}

export function syncArrowGeometry(renderer: GraphRenderer, links: LinkData[]) {
	for (const link of links) {
		const display = renderer.getLinkDisplay(link);

		if (display.arrow) {
			redrawArrowGraphic(renderer, display.arrow);
		}

		if (display.hoverArrow) {
			redrawArrowGraphic(renderer, display.hoverArrow);
		}
	}
}

function getArrowSize(renderer: GraphRenderer, hovered: boolean) {
	const zoom = renderer.config.scaleArrows ? renderer.animation.zoom.value : UNSCALED_ARROW_ZOOM;
	const width = hovered ? renderer.animation.linkWidthHover.value : renderer.config.linkWidth;

	return (DEFAULT_ARROW_SCALE * (renderer.config.arrowSize + width)) / zoom;
}

function setLineProps(
	sprite: PIXI.Sprite,
	xStart: number, yStart: number,
	rotation: number,
	length: number, height: number,
	tint: string, alpha: number,
	zIndex: number,
) {
	sprite.visible = true;
	sprite.position.set(xStart, yStart);
	sprite.rotation = rotation;
	sprite.width = length;
	sprite.height = height;
	sprite.tint = tint;
	sprite.alpha = alpha;
	sprite.zIndex = zIndex;
}

function updateArrow(
	renderer: GraphRenderer, arrow: PIXI.Graphics,
	nodeX: number, nodeY: number,
	hovered: boolean, nodeAngle: number,
	tint: string, alpha: number, zIndex: number,
) {
	arrow.position.set(nodeX, nodeY);
	arrow.rotation = nodeAngle;
	arrow.scale.set(getArrowSize(renderer, hovered));
	arrow.tint = tint;
	arrow.alpha = alpha;
	arrow.zIndex = zIndex;
	arrow.visible = true;
}

function computeLinkDisplayGeometry(renderer: GraphRenderer, link: LinkData, sourceVisual: NodeVisualState, targetVisual: NodeVisualState) {
	return computeLinkGeometry(
		link,
		getNodeLinkBoundaryGeometry(renderer, link.source, sourceVisual),
		getNodeLinkBoundaryGeometry(renderer, link.target, targetVisual),
	);
}

export function drawLinks(renderer: GraphRenderer, links: LinkData[], extraLinks: Iterable<LinkData> = []) {
	const zoomLevel = renderer.config.scaleLinks ? renderer.animation.zoom.value : 1;

	const width = renderer.config.linkWidth;
	const hoverWidth = renderer.animation.linkWidthHover.value;

	const color = renderer.animation.linkColor.value;
	const hoverColor = renderer.animation.linkColorHover.value;
	const mutedColor = renderer.animation.linkColorMuted.value;

	const renderArrows = renderer.config.renderArrows && renderer.simulator.camera.zoomTransform.k > renderer.config.minZoomArrows;

	const viewport = getViewportBounds(
		renderer.renderedTransform, renderer.viewportWidth, renderer.viewportHeight,
		LINK_VIEWPORT_PADDING / Math.max(renderer.animation.zoom.value, MIN_RENDER_ZOOM),
	);

	const processLink = (link: LinkData) => {
		const display = renderer.getLinkDisplay(link);
		const sourceVisual = renderer.getNodeVisual(link.source);
		const targetVisual = renderer.getNodeVisual(link.target);

		if (!sourceVisual.rendered || !targetVisual.rendered) {
			hideLinkDisplay(renderer, link);
		} else if (!display.line || !display.hoverLine || !display.arrow || !display.hoverArrow) {
			createLinkDisplays(renderer, [link]);
		} else if (!linkIntersectsViewport(link, viewport)) {
			hideLinkDisplay(renderer, link);
		} else {
			const role = getLinkVisualRole(link, renderer.simulator.currentlyHovered);
			const geometry = computeLinkDisplayGeometry(renderer, link, sourceVisual, targetVisual);

			if (!geometry) {
				hideLinkDisplay(renderer, link);
			} else {
				applyLinkDisplay(
					renderer, display, sourceVisual, targetVisual, geometry, role, zoomLevel,
					width, hoverWidth,
					color, hoverColor, mutedColor,
					renderArrows, renderer.simulator.currentlyHovered !== '',
				);
			}
		}
	};

	for (const link of links) {
		processLink(link);
	}
	for (const link of extraLinks) {
		processLink(link);
	}
}

function applyLinkDisplay(
	renderer: GraphRenderer,
	display: LinkDisplay,
	sourceVisual: NodeVisualState,
	targetVisual: NodeVisualState,
	geometry: { xStart: number; yStart: number; xEnd: number; yEnd: number; angle: number; segmentAngle: number },
	role: LinkVisualRole,
	linkZoomLevel: number,
	linkWidth: number, linkWidthHover: number,
	linkColor: string, linkColorHover: string, linkColorMuted: string,
	renderArrows: boolean,
	hasHover: boolean,
) {
	const line = display.line!;
	const hoverLine = display.hoverLine!;
	const arrow = display.arrow!;
	const hoverArrow = display.hoverArrow!;

	const hovered = role === 'hovered';
	const lineColor = role === 'muted' ? linkColorMuted : linkColor;

	const endpointAlpha = Math.min(sourceVisual.alpha.value, targetVisual.alpha.value);
	const showHoverOverlay = hovered || (!hasHover && display.visual!.overlayAlpha > MIN_VISIBLE_ALPHA);
	const overlayAlpha = (showHoverOverlay ? renderer.animation.linkOpacityHover.value : 0) * endpointAlpha;
	const lineDistance = Math.hypot(geometry.xEnd - geometry.xStart, geometry.yEnd - geometry.yStart);
	const lineAlpha = display.visual!.lineAlpha * endpointAlpha * (
		hovered && linkWidthHover < linkWidth ? 1 - overlayAlpha / Math.max(endpointAlpha, GRAPH_EPSILON) : 1
	);
	const arrowTrim = renderArrows ? getArrowSize(renderer, false) * ARROW_TRIM_SCALE : 0;
	const hoverArrowTrim = renderArrows ? getArrowSize(renderer, true) * ARROW_TRIM_SCALE : 0;

	setLineProps(line,
		geometry.xStart, geometry.yStart, geometry.segmentAngle,
		Math.max(0, lineDistance - arrowTrim), linkWidth / linkZoomLevel,
		lineColor, lineAlpha,
		hasHover ? LINK_MUTED_Z_INDEX : LINK_DEFAULT_Z_INDEX,
	);

	display.visual!.visible = true;
	display.visual!.hovered = hovered;
	display.visual!.overlayAlpha = overlayAlpha;

	hoverLine.visible = showHoverOverlay;
	if (showHoverOverlay) {
		setLineProps(hoverLine,
			geometry.xStart, geometry.yStart, geometry.segmentAngle,
			Math.max(0, lineDistance - hoverArrowTrim), linkWidthHover / linkZoomLevel,
			linkColorHover, overlayAlpha,
			LINK_HOVER_Z_INDEX,
		);
	}

	arrow.visible = false;
	hoverArrow.visible = false;
	if (renderArrows) {
		updateArrow(
			renderer, arrow, geometry.xEnd, geometry.yEnd, false, geometry.angle,
			lineColor, lineAlpha, hasHover ? ARROW_MUTED_Z_INDEX : ARROW_DEFAULT_Z_INDEX
		);

		if (showHoverOverlay) {
			updateArrow(
				renderer, hoverArrow, geometry.xEnd, geometry.yEnd, true, geometry.angle,
				linkColorHover, overlayAlpha, ARROW_HOVER_Z_INDEX
			);
		}
	}
}
