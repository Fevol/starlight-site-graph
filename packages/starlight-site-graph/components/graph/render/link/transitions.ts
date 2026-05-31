import type { GraphRenderer } from '../engine';

import { deferLinkDisposal } from '../lifecycle';
import { fadeOutExiting } from '../transitions';


export function updateExitingLinks(renderer: GraphRenderer, deltaMS: number) {
	fadeOutExiting(
		renderer,
		deltaMS,
		renderer.exitingLinkDisplays,
		(display, maxDelta) => {
			const visual = display.visual!;
			visual.lineAlpha = Math.max(0, visual.lineAlpha - maxDelta);
			visual.overlayAlpha = Math.max(0, visual.overlayAlpha - maxDelta);
			if (display.line) {
				display.line.alpha = visual.lineAlpha;
			}
			if (display.hoverLine) {
				display.hoverLine.alpha = visual.overlayAlpha;
			}
			if (display.arrow) {
				display.arrow.alpha = visual.lineAlpha;
			}
			if (display.hoverArrow) {
				display.hoverArrow.alpha = visual.overlayAlpha;
			}
			return visual.lineAlpha <= 0 && visual.overlayAlpha <= 0;
		},
		display => [display.line, display.hoverLine, display.arrow, display.hoverArrow],
		deferLinkDisposal,
	);
}
