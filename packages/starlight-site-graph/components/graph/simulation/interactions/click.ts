import type { NodeData } from '../../types';
import type { GraphSimulator } from '../simulation';

import { getWorldPoint } from '../../transform';
import { addListener } from './utils';
import { ensureLeadingSlash } from '../../shared/path';

import { DOUBLE_CLICK_MS } from '../constants';


export function clickRequiresDoubleClick(simulator: GraphSimulator) {
	if (simulator.context.config.enableClick === 'dblclick') {
		return true;
	} else if (simulator.context.config.enableClick !== 'auto') {
		return false;
	} else {
		return matchMedia('(pointer: coarse)').matches;
	}
}

export function isClickable(simulator: GraphSimulator, node: NodeData) {
	return node.exists && !(node.type === 'tag' || node.id === simulator.currentNode?.id);
}

export function enableClick(simulator: GraphSimulator) {
	addListener(simulator, simulator.container, 'click', (event: MouseEvent) => {
		if (Date.now() < simulator.suppressClickUntil) {
			return;
		}

		const [x, y] = getWorldPoint(simulator.context.animationState.renderedTransform, simulator.container, event);
		const closestNode = simulator.findOverlappingNode(x, y);
		if (!closestNode || !isClickable(simulator, closestNode)) {
			return;
		}

		const clickTime = Date.now();
		if (
			!simulator.requireDblClick ||
			(clickTime - simulator.lastClick < DOUBLE_CLICK_MS && closestNode === simulator.lastClickedNode)
		) {
			if (closestNode.external) {
				window.open(closestNode.id, '_blank');
			} else if (simulator.context.config.followLink === 'graph') {
				simulator.context.lifecycleController.setCurrentPage(closestNode.id);
			} else {
				window.open(
					ensureLeadingSlash(closestNode.id),
					simulator.context.config.followLink === 'new-tab' ? '_blank' : '_self',
				);
			}

			simulator.context.hooks.onNodeClick?.(closestNode, event);
		}

		simulator.lastClick = clickTime;
		simulator.lastClickedNode = closestNode;
	});
}
