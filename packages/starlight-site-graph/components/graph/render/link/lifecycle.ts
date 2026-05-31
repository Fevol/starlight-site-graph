import type * as PIXI from 'pixi.js';

import type { LinkData } from '../../types';
import type { LinkDisplay } from '../types';
import type { GraphRenderer } from '../engine';

import { computeLinkKey } from '../../utils';
import { destroyDisplayObject, hideDisplayObjects } from '../utils';


export function adoptLinkDisplay(renderer: GraphRenderer, nextLink: LinkData, sourceDisplay: LinkDisplay) {
	renderer.linkDisplays.set(computeLinkKey(nextLink), sourceDisplay);
	renderer.linkDisplayCache.set(nextLink, sourceDisplay);
}

export function hideLinkDisplay(renderer: GraphRenderer, link: LinkData) {
	const display = renderer.linkDisplays.get(computeLinkKey(link));
	if (display) {
		hideDisplayObjects(display.line, display.hoverLine, display.arrow, display.hoverArrow);

		if (display.visual) {
			display.visual.visible = false;
		}
	}
}

export function freeLinkDisplay(stage: PIXI.Container, display: LinkDisplay) {
	destroyDisplayObject(stage, display.line);
	destroyDisplayObject(stage, display.hoverLine);
	destroyDisplayObject(stage, display.arrow);
	destroyDisplayObject(stage, display.hoverArrow);

	delete display.line;
	delete display.hoverLine;
	delete display.arrow;
	delete display.hoverArrow;
	delete display.visual;
}

function destroyLinkDisplay(renderer: GraphRenderer, link: LinkData) {
	const key = computeLinkKey(link);
	const display = renderer.linkDisplays.get(key) ?? renderer.exitingLinkDisplays.get(key);

	if (display) {
		freeLinkDisplay(renderer.app.stage, display);
		renderer.linkDisplays.delete(key);
		renderer.exitingLinkDisplays.delete(key);
	}
}

export function removeLinkDisplay(renderer: GraphRenderer, link: LinkData) {
	const key = computeLinkKey(link);
	const display = renderer.linkDisplays.get(key);
	renderer.linkDisplayCache.delete(link);

	if (display?.visual?.visible === false) {
		hideDisplayObjects(display.line, display.hoverLine, display.arrow, display.hoverArrow);
		renderer.pendingDisposal.links.push(display);
		renderer.linkDisplays.delete(key);
	} else {
		if (display?.line || display?.hoverLine || display?.arrow || display?.hoverArrow) {
			renderer.exitingLinkDisplays.set(key, display);
			renderer.linkDisplays.delete(key);
			renderer.simulator.requestGraphDraw();
		} else {
			destroyLinkDisplay(renderer, link);
		}
	}
}
