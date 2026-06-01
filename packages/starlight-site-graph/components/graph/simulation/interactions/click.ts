import type { NodeData } from '../../types';
import type { GraphSimulator } from '../simulation';

import { getWorldPoint } from '../../transform';
import { addListener } from './utils';

import { DOUBLE_CLICK_MS } from '../constants';


export function clickRequiresDoubleClick(simulator: GraphSimulator) {
	if (simulator.config.enableClick === 'dblclick') {
		return true;
	} else if (simulator.config.enableClick !== 'auto') {
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

		const [x, y] = getWorldPoint(simulator.animation.renderedTransform, simulator.container, event);
		const closestNode = simulator.findOverlappingNode(x, y);
		if (!closestNode || !isClickable(simulator, closestNode)) {
			return;
		}

		const clickTime = Date.now();
		if (
			!simulator.requireDblClick ||
			(clickTime - simulator.lastClick < DOUBLE_CLICK_MS && closestNode === simulator.lastClickedNode)
		) {
			simulator.host.onNodeActivate(closestNode, event);
		}

		simulator.lastClick = clickTime;
		simulator.lastClickedNode = closestNode;
	});
}
