import type { GraphComponent } from '../graph-component';
import type { GraphColorConfig } from '../color';

import { getGraphColors } from '../color';

export class StyleController {
	private themeObserver: MutationObserver | undefined;
	private resolvedColors: GraphColorConfig = {};
	private colorSources: GraphColorConfig = {};
	private colorSetupKey: string | undefined;

	constructor(private context: GraphComponent) {}

	initialize() {
		this.themeObserver = new MutationObserver(() => this.onThemeChange());
		this.themeObserver.observe(document.documentElement, { attributeFilter: ['data-theme'] });
	}

	destroy() {
		this.themeObserver?.disconnect();
		this.themeObserver = undefined;
	}

	get colors() {
		return this.resolvedColors;
	}

	onThemeChange() {
		if (Object.keys(this.colorSources).length === 0) {
			return;
		}

		this.refreshColors();
	}

	refreshColors(immediate = false) {
		this.resolvedColors = getGraphColors(this.context, this.colorSources);
		this.context.animationState.syncColors(this.resolvedColors, this.context.config, immediate);
		this.context.lifecycleController.requestGraphDraw();
	}

	syncColorPalette(colors: GraphColorConfig) {
		const colorSetupKey = JSON.stringify(colors);
		this.colorSources = colors;
		const nextColors = getGraphColors(this.context, colors);
		if (
			this.colorSetupKey === colorSetupKey &&
			!Object.keys(colors).some(color => this.resolvedColors[color] !== nextColors[color])
		) {
			return;
		}

		this.colorSetupKey = colorSetupKey;
		this.resolvedColors = nextColors;

		this.context.animationState.syncColors(nextColors, this.context.config);
		this.context.lifecycleController.requestGraphDraw();
	}

	setStyleDefault() {
		this.context.animationState.setHoverActive(false, this.context.config);
		this.context.animationState.setLabelOpacityBase(
			this.context.simulator.camera.getCurrentLabelOpacity(),
			this.context.config,
		);
	}

	setStyleHovered() {
		this.context.animationState.setHoverActive(true, this.context.config);
	}
}
