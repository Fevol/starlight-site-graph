import type { GraphRenderer } from '../engine';
import type { LinkVisualState } from '../types';
import type { LinkData, LinkVisualRole } from '../../types';

export function createLinkVisualState(): LinkVisualState {
	return {
		visible: false,
		hovered: false,
		lineAlpha: 1,
		overlayAlpha: 0,
	};
}

export function resetLinkDisplayState(renderer: GraphRenderer, link: LinkData) {
	const display = renderer.getLinkDisplay(link);
	display.visual = createLinkVisualState();
}

export function getLinkVisualRole(link: LinkData, hoveredId: string): LinkVisualRole {
	if (!hoveredId) {
		return 'default';
	} else {
		return (link.source.id === hoveredId || link.target.id === hoveredId)
			? 'hovered'
			: 'muted';
	}
}
