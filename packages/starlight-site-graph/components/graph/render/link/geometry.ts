import type { BoundsData } from 'pixi.js';

import type { LinkData, NodeData } from '../../types';
import type { NodeLinkBoundaryGeometry } from '../types';

import { SHAPE_STAR_LINE_DEPTH } from '../constants';

export function linkIntersectsViewport(link: LinkData, viewport: BoundsData) {
	const minX = Math.min(link.source.x!, link.target.x!);
	const minY = Math.min(link.source.y!, link.target.y!);

	const maxX = Math.max(link.source.x!, link.target.x!);
	const maxY = Math.max(link.source.y!, link.target.y!);

	return !(maxX < viewport.minX || minX > viewport.maxX || maxY < viewport.minY || minY > viewport.maxY);
}

function getLinkOffset(node: NodeData, angle: number, geometry: NodeLinkBoundaryGeometry): [number, number] {
	const style = node.visualStates.default;
	const fallbackRadius = geometry.pathRadius + geometry.cornerRadius / 2;

	if (style.shape === 'circle') {
		return [
			node.x! - geometry.radius * Math.cos(angle),
			node.y! - geometry.radius * Math.sin(angle)
		];
	}

	if (geometry.outline) {
		const n = geometry.outline.length / 2;

		const baseIndex = (-(angle + Math.PI - geometry.rotation) / (Math.PI * 2)) * n;
		const i0 = ((Math.floor(baseIndex) % n) + n) % n;
		const i1 = (i0 + 1) % n;

		const r0 = Math.hypot(geometry.outline[i0 * 2]!, geometry.outline[i0 * 2 + 1]!);
		const r1 = Math.hypot(geometry.outline[i1 * 2]!, geometry.outline[i1 * 2 + 1]!);

		const t = baseIndex - Math.floor(baseIndex);

		const outlineRadius = (r0 + (r1 - r0) * t) * geometry.pathRadius + geometry.cornerRadius / 2;

		return [
			node.x! - outlineRadius * Math.cos(angle),
			node.y! - outlineRadius * Math.sin(angle)
		];
	}

	if (style.shape === 'polygon') {
		const points = Number(style.shapePoints ?? 0);
		const segmentAngle = (2 * Math.PI) / points;
		angle += Math.PI - geometry.rotation;

		const segment = Math.floor(angle / segmentAngle);
		const segmentStartAngle = geometry.rotation + segment * segmentAngle;
		const segmentEndAngle = geometry.rotation + (segment + 1) * segmentAngle;

		const t = (segmentAngle * (segment + 1) - angle) / segmentAngle;

		return [
			node.x! + fallbackRadius * (t * Math.cos(segmentStartAngle) + (1 - t) * Math.cos(segmentEndAngle)),
			node.y! + fallbackRadius * (t * Math.sin(segmentStartAngle) + (1 - t) * Math.sin(segmentEndAngle))
		];

	} else if (style.shape === 'star') {
		const points = Number(style.shapePoints ?? 0);
		const segmentAngle = Math.PI / points;
		let starRotation = geometry.rotation;

		if (points & 1) {
			starRotation += Math.PI / 2;
		} else if (points % 4 === 0) {
			starRotation += segmentAngle;
		}
		angle += Math.PI - starRotation;

		const segment = Math.floor(angle / segmentAngle);
		const r1 = fallbackRadius * (segment & 1 ? SHAPE_STAR_LINE_DEPTH : 1);
		const r2 = fallbackRadius * (segment & 1 ? 1 : SHAPE_STAR_LINE_DEPTH);

		const segmentStartAngle = starRotation + segment * segmentAngle;
		const segmentEndAngle = starRotation + (segment + 1) * segmentAngle;

		const t = (segmentAngle * (segment + 1) - angle) / segmentAngle;

		return [
			node.x! + (t * r2 * Math.cos(segmentStartAngle) + (1 - t) * r1 * Math.cos(segmentEndAngle)),
			node.y! + (t * r2 * Math.sin(segmentStartAngle) + (1 - t) * r1 * Math.sin(segmentEndAngle))
		];
	}

	console.error('[STARLIGHT-SITE-GRAPH] Invalid shape type: ' + style.shape);
	return [node.x!, node.y!];
}

function getCircleLinkOffset(
	node: NodeData,
	dx: number, dy: number,
	distance: number, outgoing: boolean, radius: number,
): [number, number] {
	const scale = radius / distance;
	const direction = outgoing ? 1 : -1;

	return [
		node.x! + dx * scale * direction,
		node.y! + dy * scale * direction
	];
}

export function computeLinkGeometry(link: LinkData, source: NodeLinkBoundaryGeometry, target: NodeLinkBoundaryGeometry) {
	const dx = link.target.x! - link.source.x!;
	const dy = link.target.y! - link.source.y!;
	const pythDistance = dx * dx + dy * dy;

	if (pythDistance === 0) {
		return undefined;
	}

	const distance = Math.sqrt(pythDistance);

	let incAngle = link.source.shape === 'circle' ? undefined : Math.atan2(dy, dx);

	const [xStart, yStart] = link.source.shape === 'circle'
		? getCircleLinkOffset(link.source, dx, dy, distance, true, source.radius)
		: getLinkOffset(link.source, incAngle! + Math.PI, source);

	if (incAngle === undefined) {
		incAngle = Math.atan2(dy, dx);
	}

	const [xEnd, yEnd] = link.target.shape === 'circle'
		? getCircleLinkOffset(link.target, dx, dy, distance, false, target.radius)
		: getLinkOffset(link.target, incAngle, target);

	return {
		xStart, yStart, xEnd, yEnd,
		angle: incAngle, segmentAngle: Math.atan2(yEnd - yStart, xEnd - xStart)
	};
}
