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
	placeholderContainer: HTMLElement;

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
			[`${color}Adjacent`, 'default'],
		]),
	);
	hoverColorTransitions = Object.fromEntries(
		animated_colors.flatMap(color => [
			[`${color}`, 'blur'],
			[`${color}Hover`, 'hover'],
			[`${color}Adjacent`, 'adjacent'],
		]),
	);
	colors!: GraphColorConfig;
	animator: Animator<ReturnType<typeof animatables>>;

	isFullscreen: boolean = false;
	fullscreenExitHandler?: (options?: boolean | EventListenerOptions | undefined) => void;

	enableClick: boolean = true;

	currentPage!: string;

	ignoreConfigUpdate: boolean = false;
	themeObserver: MutationObserver;
	propertyObserver: MutationObserver;

	constructor() {
		super();
		this.placeholderContainer = this.previousElementSibling as HTMLElement;
		this.style.visibility = 'hidden';

		try {
			this.setConfigListener(this.dataset['config']);
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
				this.animator.setProperties(`${color}Adjacent`, {
					default: this.colors[color],
					adjacent: this.colors[(key + 'Adjacent') as keyof GraphColorConfig],
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

		this.propertyObserver = new MutationObserver(mutations => {
			mutations.forEach(mutation => {
				if (!this.ignoreConfigUpdate && mutation.attributeName === 'data-config') {
					this.setConfigListener(this.dataset['config']);
					this.setup();
				}
				if (mutation.attributeName === 'data-sitemap') {
					this.sitemap = JSON.parse(this.dataset['sitemap'] || '{}');
					this.setup();
				}
				this.ignoreConfigUpdate = false;
			});
		});
		this.propertyObserver.observe(this, { attributes: true });
	}

	override remove() {
		this.renderer.destroy();
		this.simulator.destroy();
		this.placeholderContainer.remove();
		this.graphContainer.remove();
		this.mockGraphContainer.remove();
		this.blurContainer.remove();

		this.themeObserver.disconnect();
		this.propertyObserver.disconnect();

		super.remove();
	}

	setConfigListener(config?: string) {
		this.config = new Proxy(JSON.parse(config || '{}'), {
			set: (target, prop, value) => {
				target[prop as keyof GraphConfig] = value;
				this.dataset['config'] = JSON.stringify(this.config);
				this.ignoreConfigUpdate = true;
				return true;
			},
		});
	}

	cleanup() {
		if (this.simulator.mounted) {
			this.renderer.cleanup();
			this.simulator.cleanup();
		}
	}

	full_refresh() {
		this.setup();
		renderActionContainer(this);
		this.simulator.resetZoom();
	}

	setup() {
		this.placeholderContainer.style.display = '';
		this.style.visibility = 'hidden';

		this.cleanup();
		const { nodes, links } = processSitemapData(this, this.sitemap);

		const currentNode = nodes.find(node => node.id === this.currentPage);
		this.enableClick = this.config.enableClick !== 'disable';

		this.simulator.initialize(nodes, links, currentNode, this.config.scale);
		this.renderer.initialize();
		this.simulator.update();

		if (this.config.enableDrag) this.simulator.enableDrag();

		if (this.config.enableHover) this.simulator.enableHover();

		if (this.enableClick) this.simulator.enableClick();

		if (this.config.enableZoom || this.config.enablePan) this.simulator.enableZoom();

		this.placeholderContainer.style.display = 'none';
		this.style.visibility = 'visible';
		this.renderer.resize();
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
		this.toggleFullscreen();
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
		this.toggleFullscreen();
	}

	toggleFullscreen() {
		renderActionContainer(this);
		this.renderer.resize();
		this.colors = getGraphColors(this.graphContainer);
		this.animator.setValue('backgroundColor', this.colors.backgroundColor);
		this.animator.setAllProperties('backgroundColor', this.colors.backgroundColor);
		this.animator.setAllProperties('backgroundColorHover', this.colors.backgroundColor);
		this.simulator.resetZoom(true);
		this.simulator.requestRender = true;
	}

	setStyleDefault() {
		this.animator.startAnimationsTo({
			...this.defaultColorTransitions,
			linkOpacityHover: 'default',
			linkWidthHover: 'default',
			labelOffset: 'default',
			labelScaleHover: 'default',
		});
		this.animator.startAnimation('labelOpacity', this.simulator.getCurrentLabelOpacity());
		this.animator.startAnimation('labelOpacityHover', this.simulator.getCurrentLabelOpacity());
		this.animator.startAnimation('labelOpacityAdjacent', this.simulator.getCurrentLabelOpacity());
	}

	setStyleHovered() {
		this.animator.startAnimationsTo({
			...this.hoverColorTransitions,

			linkOpacityHover: 'hover',
			linkWidthHover: 'hover',
			labelOpacity: 'blur',
			labelOpacityHover: 'hover',
			labelOpacityAdjacent: 'adjacent',
			labelOffset: 'hover',
			labelScaleHover: 'hover',
		});
	}
}
