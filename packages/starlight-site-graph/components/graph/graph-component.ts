import type { GraphConfig } from '../../config';
import type { Sitemap } from '../../types';

import { Animator } from '../animator';
import { animatables, animated_colors } from './animatables';

import { GraphRenderer } from './renderer';
import { renderActionContainer } from './action-element';
import { processSitemapData } from './preprocess-sitemap';
import { getGraphColors, type GraphColorConfig } from '../../color';

import { onClickOutside, stripSlashes, ensureTrailingSlash } from '../util';
import { GraphSimulator } from './simulator';

export class GraphComponent extends HTMLElement {
	graphContainer: HTMLElement;
	mockGraphContainer: HTMLElement;
	actionContainer: HTMLElement;
	blurContainer: HTMLElement;

	debug: boolean = false;

	renderer!: GraphRenderer;
	simulator!: GraphSimulator;

	config!: GraphConfig;
	sitemap!: Sitemap;

	defaultColorTransitions = Object.fromEntries(
		animated_colors.flatMap(color => [
			[`${color}`, 'default'],
			[`${color}Hover`, 'default'],
		]),
	);
	hoverColorTransitions = Object.fromEntries(
		animated_colors.flatMap(color => [
			[`${color}`, 'blur'],
			[`${color}Hover`, 'hover'],
		]),
	);
	colors!: GraphColorConfig;
	animator: Animator<ReturnType<typeof animatables>>;

	isFullscreen: boolean = false;
	fullscreenExitHandler?: (options?: boolean | EventListenerOptions | undefined) => void;

	currentPage!: string;

	themeObserver: MutationObserver;
	propertyObserver: MutationObserver;

	constructor() {
		super();
		try {
			this.config = JSON.parse(this.dataset['config'] || '{}');
			this.sitemap = JSON.parse(this.dataset['sitemap'] || '{}');
			this.currentPage = ensureTrailingSlash(this.dataset['slug'] || stripSlashes(location.pathname));
			this.debug = this.dataset['debug'] !== undefined;
		} catch (e) {
			console.error('[STARLIGHT-SITE-GRAPH] ' + (e instanceof Error ? e.message : e));
		}

		this.classList.add('graph-component');

		this.graphContainer = document.createElement('div');
		this.graphContainer.classList.add('graph-container');
		this.graphContainer.onkeyup = e => {
			if (e.key === 'f') this.enableFullscreen();
		};
		this.graphContainer.tabIndex = 0;
		this.appendChild(this.graphContainer);

		this.actionContainer = document.createElement('div');
		this.actionContainer.classList.add('graph-action-container');
		renderActionContainer(this);
		this.graphContainer.appendChild(this.actionContainer);

		this.mockGraphContainer = document.createElement('div');
		this.mockGraphContainer.classList.add('graph-container');

		this.blurContainer = document.createElement('div');
		this.blurContainer.classList.add('background-blur');

		this.colors = getGraphColors(this.graphContainer);

		this.animator = new Animator<ReturnType<typeof animatables>>(animatables(this.config, this.colors));
		this.themeObserver = new MutationObserver(() => {
			this.colors = getGraphColors(this.graphContainer);
			for (const color of animated_colors) {
				const key = color.slice(0, color.indexOf('Color') + 5);
				this.animator.setProperties(`${color}`, {
					default: this.colors[color],
					blur: this.colors[(key + 'Muted') as keyof GraphColorConfig],
				});
				this.animator.setProperties(`${color}Hover`, {
					default: this.colors[color],
					hover: this.colors[(key + 'Hover') as keyof GraphColorConfig],
				});
			}

			this.animator.startAnimationsTo(this.defaultColorTransitions, { duration: 200 });
		});
		this.themeObserver.observe(document.querySelector(':root')!, {
			attributeFilter: ['data-theme'],
		});

		this.renderer = new GraphRenderer(this);
		this.simulator = new GraphSimulator(this);

		this.renderer.mount(this.simulator, this.graphContainer).then(() => {
			this.setup();
		});
		this.simulator.mount(this.renderer);

		// Add listeners for chang on dataset-config and dataset-sitemap
		this.propertyObserver = new MutationObserver(mutations => {
			mutations.forEach(mutation => {
				if (mutation.attributeName === 'data-config') {
					this.config = JSON.parse(this.dataset['config'] || '{}');
					this.setup();
				}
				if (mutation.attributeName === 'data-sitemap') {
					this.sitemap = JSON.parse(this.dataset['sitemap'] || '{}');
					this.setup();
				}
			});
		});
		this.propertyObserver.observe(this, { attributes: true });
	}

	override remove() {
		this.renderer.destroy();
		this.simulator.destroy();
		this.graphContainer.remove();
		this.mockGraphContainer.remove();
		this.blurContainer.remove();

		this.themeObserver.disconnect();
		this.propertyObserver.disconnect();

		super.remove();
	}

	cleanup() {
		if (this.simulator.mounted) {
			this.renderer.cleanup();
			this.simulator.cleanup();
		}
	}

	setup() {
		this.cleanup();

		const { nodes, links } = processSitemapData(this, this.sitemap);

		const currentNode = nodes.find(node => node.id === this.currentPage);

		this.simulator.initialize(nodes, links, currentNode, this.config.scale);
		this.renderer.initialize();
		this.simulator.update();

		if (this.config.enableDrag) this.simulator.enableDrag();

		if (this.config.enableHover) this.simulator.enableHover();

		if (this.config.enableClick !== 'disable') this.simulator.enableClick();

		if (this.config.enableZoom || this.config.enablePan) this.simulator.enableZoom();
	}

	enableFullscreen() {
		if (this.isFullscreen) return;

		this.isFullscreen = true;

		this.graphContainer.classList.toggle('is-fullscreen', true);
		this.appendChild(this.mockGraphContainer);
		this.appendChild(this.blurContainer);
		this.fullscreenExitHandler = onClickOutside(this.graphContainer, () => {
			this.disableFullscreen();
		});
		this.graphContainer.onkeyup = e => {
			if (e.key === 'Escape' || e.key === 'f') this.disableFullscreen();
		};
		renderActionContainer(this);
		this.renderer.resize();
		this.colors = getGraphColors(this.graphContainer);
		this.animator.setValue('backgroundColor', this.colors.backgroundColor);
		this.animator.setAllProperties('backgroundColor', this.colors.backgroundColor);
		this.animator.setAllProperties('backgroundColorHover', this.colors.backgroundColor);

		this.simulator.resetZoom(true);
	}

	disableFullscreen() {
		if (!this.isFullscreen) return;

		this.isFullscreen = false;

		this.graphContainer.classList.toggle('is-fullscreen', false);
		this.removeChild(this.mockGraphContainer);
		this.removeChild(this.blurContainer);
		this.fullscreenExitHandler!();
		this.graphContainer.onkeyup = e => {
			if (e.key === 'f') this.enableFullscreen();
		};
		renderActionContainer(this);

		this.renderer.resize();
		this.colors = getGraphColors(this.graphContainer);
		this.animator.setValue('backgroundColor', this.colors.backgroundColor);
		this.animator.setAllProperties('backgroundColor', this.colors.backgroundColor);
		this.animator.setAllProperties('backgroundColorHover', this.colors.backgroundColor);

		this.simulator.resetZoom(true);
	}

	setStyleDefault() {
		this.animator.startAnimationsTo({
			...this.defaultColorTransitions,
			labelOffset: 'default',
		});
		this.animator.startAnimation('labelOpacity', this.simulator.getCurrentLabelOpacity());
		this.animator.startAnimation('labelOpacityHover', this.simulator.getCurrentLabelOpacity());
	}

	setStyleHovered() {
		this.animator.startAnimationsTo({
			...this.hoverColorTransitions,

			labelOpacity: 'blur',
			labelOpacityHover: 'hover',
			labelOffset: 'hover',
		});
	}
}
