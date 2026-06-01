import type { Graph } from '../graph';
import type { GraphConfig } from '../config/types';
import type { BooleanConfigKey, GraphAction } from '../types';
import type { ActionButtonOption } from './types';

import { ACTION_LABELS, SETTINGS_SLIDERS } from './constants';
import { MAX_DEPTH } from '../constants';

import { icons, attachContextMenu, showPopupMenu, createValueSlider, el } from '../ui';

function createActionButtonElement(context: Graph, icon: string, text: string) {
	const button = el('button', 'sg-graph-action-button', { parent: context.actionContainer, html: icon });
	button.title = text;
	button.ariaLabel = text;
	return button;
}

function createActionButton(
	context: Graph,
	options: ActionButtonOption[],
	activeIndex: number,
	onClick = options[activeIndex]!.onClick,
	icon = options[activeIndex]!.icon,
) {
	const button = createActionButtonElement(context, icon, options[activeIndex]!.text);
	button.onclick = () => onClick();

	if (options.length > 1) {
		attachContextMenu(button, options);
	}

	return button;
}

function updateConfigValue<K extends keyof GraphConfig>(context: Graph, key: K, value: GraphConfig[K]) {
	if (context.config[key] !== value) {
		context.config[key] = value;
		context.lifecycleController.renderActions();
	}
}

function renderFullscreenAction(context: Graph) {
	createActionButton(context, [
		{
			text: ACTION_LABELS.fullscreen.exit,
			icon: icons['minimize'],
			onClick: () => context.fullscreenController.disable(),
		},
		{
			text: ACTION_LABELS.fullscreen.enter,
			icon: icons['maximize'],
			onClick: () => context.fullscreenController.enable(),
		},
	], context.fullscreenController.isFullscreen ? 0 : 1);
}

function renderDepthAction(context: Graph) {
	createActionButton(
		context,
		Array.from({ length: MAX_DEPTH }, (_, depth) => ({
			text: ACTION_LABELS.depth[depth as keyof typeof ACTION_LABELS.depth],
			icon: icons[`graph${depth}` as keyof typeof icons],
			onClick: () => updateConfigValue(context, 'depth', depth),
		})),
		(context.config.depth + 1) % MAX_DEPTH,
		() => updateConfigValue(context, 'depth', (context.config.depth + 1) % MAX_DEPTH),
		icons[`graph${context.config.depth}` as keyof typeof icons],
	);
}

function renderResetZoomAction(context: Graph) {
	createActionButton(context, [
		{
			text: ACTION_LABELS.resetZoom,
			icon: icons['focus'],
			onClick: () => context.simulator.resetView(),
		},
	], 0);
}

function renderBooleanToggle(
	context: Graph,
	key: BooleanConfigKey,
	enabled: { icon: keyof typeof icons; text: string },
	disabled: { icon: keyof typeof icons; text: string },
) {
	const active = context.config[key];
	createActionButton(
		context,
		[
			{ text: enabled.text, icon: icons[enabled.icon], onClick: () => updateConfigValue(context, key, true) },
			{ text: disabled.text, icon: icons[disabled.icon], onClick: () => updateConfigValue(context, key, false) },
		],
		active ? 1 : 0,
		undefined,
		active ? icons[enabled.icon] : icons[disabled.icon],
	);
}

function renderSettingsAction(context: Graph) {
	let closeSettingsMenu: (() => void) | undefined;
	const button = createActionButtonElement(context, icons['settings'], ACTION_LABELS.settings);
	button.onclick = () => {
		if (closeSettingsMenu) {
			closeSettingsMenu();
			return;
		}
		closeSettingsMenu = showPopupMenu(
			context.actionContainer,
			SETTINGS_SLIDERS.map(([label, key, min, max, step]) =>
				createValueSlider(label, context.config[key], min, max, step, value => {
					context.config[key] = value;
				}),
			),
			() => {
				closeSettingsMenu = undefined;
			},
		);
	};
}

const ACTION_RENDERERS = {
	'fullscreen': renderFullscreenAction,
	'depth': renderDepthAction,
	'reset-zoom': renderResetZoomAction,
	'settings': renderSettingsAction,
	'render-arrows': context =>
		renderBooleanToggle(
			context,
			'renderArrows',
			{ icon: 'arrow', text: ACTION_LABELS.arrows.render },
			{ icon: 'line', text: ACTION_LABELS.arrows.hide },
		),
	'render-external': context =>
		renderBooleanToggle(
			context,
			'renderExternal',
			{ icon: 'link', text: ACTION_LABELS.external.show },
			{ icon: 'unlink', text: ACTION_LABELS.external.hide },
		),
	'render-unresolved': context =>
		renderBooleanToggle(
			context,
			'renderUnresolved',
			{ icon: 'unresolved', text: ACTION_LABELS.unresolved.show },
			{ icon: 'resolved', text: ACTION_LABELS.unresolved.hide },
		),
} satisfies Record<GraphAction, (context: Graph) => void>;

export function renderActionContainer(context: Graph) {
	if (context.actionContainer == null) {
		context.actionContainer = document.createElement('div');
		context.actionContainer.classList.add('sg-graph-action-container');
		context.graphContainer.appendChild(context.actionContainer);
	} else {
		context.actionContainer.replaceChildren();
	}

	for (const action of context.config.actions) {
		ACTION_RENDERERS[action as keyof typeof ACTION_RENDERERS](context);
	}
}
