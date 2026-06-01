import type { GraphSimulator } from '../simulation';
import type { NodeData } from '../../types';

import { getWorldPoint } from '../../transform';
import { addListener } from './utils';
import { isClickable } from './click';

const HOVER_INTENT_DELAY_MS = 1;

export function clearHoverIntent(simulator: GraphSimulator) {
	if (simulator.hoverIntentTimeout) {
		clearTimeout(simulator.hoverIntentTimeout);
	}
	simulator.hoverIntentTimeout = undefined;
	simulator.pendingHovered = '';
}

function applyNodeHover(simulator: GraphSimulator, node: NodeData) {
	simulator.currentlyHovered = node.id;
	simulator.isHovering = true;
	simulator.host.onNodeHoverChange(node);
	simulator.requestGraphDraw();
	simulator.container.style.cursor =
		simulator.clickEnabled && isClickable(simulator, node) ? 'pointer' : 'default';
}

export function removeNodeHover(simulator: GraphSimulator) {
	clearHoverIntent(simulator);
	simulator.isHovering = false;
	simulator.currentlyHovered = '';
	simulator.host.onNodeHoverChange(null);
	simulator.requestGraphDraw();
	simulator.container.style.cursor = 'default';
}

export function enableHover(simulator: GraphSimulator) {
	addListener(simulator, simulator.container, 'pointermove', (event: PointerEvent) => {
		if (simulator.activeDrag || simulator.activePan || simulator.activePinch) {
			return;
		}

		const [x, y] = getWorldPoint(simulator.animation.renderedTransform, simulator.container, event);
		const closestNode = simulator.findOverlappingNode(x, y);
		if (closestNode) {
			if (simulator.currentlyHovered === closestNode.id) {
				return;
			}

			if (simulator.pendingHovered === closestNode.id) {
				return;
			}

			if (simulator.currentlyHovered) {
				removeNodeHover(simulator);
			}

			clearHoverIntent(simulator);

			simulator.pendingHovered = closestNode.id;
			simulator.hoverIntentTimeout = setTimeout(() => {
				simulator.hoverIntentTimeout = undefined;
				if (simulator.pendingHovered !== closestNode.id) {
					return;
				}
				simulator.pendingHovered = '';
				applyNodeHover(simulator, closestNode);
			}, HOVER_INTENT_DELAY_MS);

			simulator.container.style.cursor =
				simulator.clickEnabled && isClickable(simulator, closestNode) ? 'pointer' : 'default';
		} else {
			clearHoverIntent(simulator);
			if (simulator.currentlyHovered) {
				removeNodeHover(simulator);
			} else {
				simulator.container.style.cursor = 'default';
			}
		}
	});

	addListener(simulator, simulator.container, 'pointerleave', () => {
		clearHoverIntent(simulator);
		if (simulator.currentlyHovered) {
			removeNodeHover(simulator);
		}
	});

	addListener(simulator, simulator.container, 'mouseleave', (event: MouseEvent) => {
		clearHoverIntent(simulator);
		if (simulator.currentlyHovered && !event.buttons) {
			removeNodeHover(simulator);
		}
	});
}
