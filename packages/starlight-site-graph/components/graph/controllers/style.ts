import type { Graph } from '../graph';
import type { GraphColorConfig } from '../color';

import { getGraphColors } from '../color';

export class StyleController {
	private themeObserver: MutationObserver | undefined;
	private resolvedColors: GraphColorConfig = {};
	private colorSources: GraphColorConfig = {};
	private colorSetupKey: string | undefined;

	constructor(private context: Graph) {}

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
		this.resolvedColors = getGraphColors(this.context.element,this.colorSources);
		this.context.renderer.syncColors(this.resolvedColors, immediate);
	}

	syncColorPalette(colors: GraphColorConfig) {
		const colorSetupKey = JSON.stringify(colors);
		this.colorSources = colors;
		const nextColors = getGraphColors(this.context.element,colors);
		if (
			this.colorSetupKey === colorSetupKey &&
			!Object.keys(colors).some(color => this.resolvedColors[color] !== nextColors[color])
		) {
			return;
		}

		this.colorSetupKey = colorSetupKey;
		this.resolvedColors = nextColors;

		this.context.renderer.syncColors(nextColors);
	}

}
