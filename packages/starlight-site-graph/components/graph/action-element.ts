import { icons } from '../elements/icons';
import { showContextMenu } from '../elements/context-menu';
import { createValueSlider } from '../util';
import { showPopupMenu } from '../elements/popup-menu';
// prettier-ignore
import {
	MAX_DEPTH,
	CENTER_FORCE_SLIDER_MIN, CENTER_FORCE_SLIDER_MAX, CENTER_FORCE_SLIDER_STEP,
	CHARGE_FORCE_SLIDER_MIN, CHARGE_FORCE_SLIDER_MAX, CHARGE_FORCE_SLIDER_STEP,
	COLLIDER_PADDING_SLIDER_MIN, COLLIDER_PADDING_SLIDER_MAX, COLLIDER_PADDING_SLIDER_STEP,
	LINK_DISTANCE_SLIDER_MIN, LINK_DISTANCE_SLIDER_MAX, LINK_DISTANCE_SLIDER_STEP,
	ALPHA_DECAY_SLIDER_MIN, ALPHA_DECAY_SLIDER_MAX, ALPHA_DECAY_SLIDER_STEP,
} from './constants';
import type { GraphComponent } from './graph-component';

export function renderActionContainer(context: GraphComponent) {
	context.actionContainer.replaceChildren();
	for (const action of context.config.actions) {
		const actionElement = document.createElement('button');
		actionElement.classList.add('slsg-graph-action-button');
		context.actionContainer.appendChild(actionElement);

		if (action === 'fullscreen') {
			actionElement.innerHTML = context.isFullscreen ? icons.minimize : icons.maximize;
			actionElement.onclick = e => {
				context.isFullscreen ? context.disableFullscreen() : context.enableFullscreen();
				e.stopPropagation();
			};
			actionElement.oncontextmenu = e => {
				showContextMenu(e, [
					{ text: 'Minimize', icon: icons.minimize, onClick: () => context.disableFullscreen() },
					{ text: 'Maximize', icon: icons.maximize, onClick: () => context.enableFullscreen() },
				]);
			};
		} else if (action === 'depth') {
			actionElement.innerHTML = icons[('graph' + context.config.depth) as keyof typeof icons] ?? icons.graph5;
			actionElement.onclick = e => {
				context.config.depth = (context.config.depth + 1) % MAX_DEPTH;
				context.setup();
				renderActionContainer(context);
				context.simulator.resetZoom();
				e.stopPropagation();
			};
			actionElement.oncontextmenu = e => {
				showContextMenu(
					e,
					Array.from({ length: MAX_DEPTH }, (_, i) => ({
						text:
							i === MAX_DEPTH - 1
								? 'Show Entire Graph'
								: i === 0
									? 'Show Only Current'
									: i === 1
										? 'Show Adjacent'
										: `Show Distance ${i}`,
						icon: icons[('graph' + i) as keyof typeof icons],
						onClick: () => {
							if (context.config.depth !== i) {
								context.config.depth = i;
								context.full_refresh();
							}
						},
					})),
				);
			};
		} else if (action === 'reset-zoom') {
			actionElement.innerHTML = icons.focus;
			actionElement.onclick = e => {
				context.simulator.resetZoom();
				e.stopPropagation();
			};
		} else if (action === 'render-arrows') {
			actionElement.innerHTML = context.config.renderArrows ? icons.arrow : icons.line;
			actionElement.onclick = e => {
				context.config.renderArrows = !context.config.renderArrows;
				context.simulator.requestRender = true;
				renderActionContainer(context);
				e.stopPropagation();
			};
			actionElement.oncontextmenu = e => {
				showContextMenu(e, [
					{ text: 'Render Arrows', icon: icons.arrow, onClick: () => (context.config.renderArrows = true) },
					{ text: 'Render Lines', icon: icons.line, onClick: () => (context.config.renderArrows = false) },
				]);
			};
		} else if (action === "settings") {
			actionElement.innerHTML = icons.settings;
			actionElement.onclick = (_) => {
				const chargeForceSlider = createValueSlider('Repel Force', context.config.repelForce, CHARGE_FORCE_SLIDER_MIN, CHARGE_FORCE_SLIDER_MAX, CHARGE_FORCE_SLIDER_STEP, (value) => {
						context.config.repelForce = value;
						context.simulator.update();
				});

				const centerForceSlider = createValueSlider('Center Force', context.config.centerForce, CENTER_FORCE_SLIDER_MIN, CENTER_FORCE_SLIDER_MAX, CENTER_FORCE_SLIDER_STEP, (value) => {
						context.config.centerForce = value;
						context.simulator.update();
				});

				const colliderPaddingSlider = createValueSlider('Collider Padding', context.config.colliderPadding, COLLIDER_PADDING_SLIDER_MIN, COLLIDER_PADDING_SLIDER_MAX, COLLIDER_PADDING_SLIDER_STEP, (value) => {
						context.config.colliderPadding = value;
						context.simulator.update();
				});

				const linkDistanceSlider = createValueSlider('Link Distance', context.config.linkDistance, LINK_DISTANCE_SLIDER_MIN, LINK_DISTANCE_SLIDER_MAX, LINK_DISTANCE_SLIDER_STEP, (value) => {
						context.config.linkDistance = value;
						context.simulator.update();
				});

				const alphaDecaySlider = createValueSlider('Alpha Decay', context.config.alphaDecay, ALPHA_DECAY_SLIDER_MIN, ALPHA_DECAY_SLIDER_MAX, ALPHA_DECAY_SLIDER_STEP, (value) => {
					context.config.alphaDecay = value;
					context.simulator.update();
				});

				showPopupMenu(context.actionContainer, [
					chargeForceSlider,
					centerForceSlider,
					colliderPaddingSlider,
					linkDistanceSlider,
					alphaDecaySlider
				]);
			};
		} else if (action === 'render-external') {
			actionElement.innerHTML = context.config.renderExternal ? icons.link : icons.unlink;
			actionElement.onclick = e => {
				context.config.renderExternal = !context.config.renderExternal;
				context.full_refresh();
				e.stopPropagation();
			};
			actionElement.oncontextmenu = e => {
				showContextMenu(e, [
					{ text: 'Show External Pages', icon: icons.link, onClick: () => {
						context.config.renderExternal = true;
						context.full_refresh();
						e.stopPropagation();
					}},
					{ text: 'Hide External Pages', icon: icons.unlink, onClick: () => {
						context.config.renderExternal = false;
						context.full_refresh();
						e.stopPropagation();
					}},
				]);
			};
		} else if (action === 'render-unresolved') {
			actionElement.innerHTML = context.config.renderUnresolved ? icons.resolved : icons.unresolved;
			actionElement.onclick = e => {
				context.config.renderUnresolved = !context.config.renderUnresolved;
				context.full_refresh();
				e.stopPropagation();
			};
			actionElement.oncontextmenu = e => {
				showContextMenu(e, [
					{ text: 'Show Unresolved Pages', icon: icons.resolved, onClick: () => {
						context.config.renderUnresolved = true;
						context.full_refresh();
						e.stopPropagation();
					}},
					{ text: 'Hide Unresolved Pages', icon: icons.unresolved, onClick: () => {
						context.config.renderUnresolved = false;
						context.full_refresh();
						e.stopPropagation();
					}},
				]);
			};
		}
	}
}
