import type { GraphConfig, Sitemap } from './config/types';
import type { GraphHostHooks } from './types';

import { AnimationState } from './render/transitions';
import { ConfigController, TopologyController, StyleController, FullscreenController, LifecycleController, ViewportController } from './controllers';
import { parseSitemap } from './topology/topology';

import { GraphRenderer } from './render/engine';
import { GraphSimulator } from './simulation/simulation';

import { setSlashes } from './shared/path';

export class GraphComponent extends HTMLElement {
	graphContainer: HTMLElement;
	actionContainer!: HTMLElement;

	debug = false;
	trailingSlashes = true;

	renderer!: GraphRenderer;
	simulator!: GraphSimulator;

	config!: GraphConfig;
	sitemap!: Sitemap;

	animationState: AnimationState;

	enableClick = true;
	currentPage!: string;

	hooks: GraphHostHooks = {};

	propertyObserver!: MutationObserver;

	configController: ConfigController;
	styleController: StyleController;
	fullscreenController: FullscreenController;
	lifecycleController: LifecycleController;
	viewportController: ViewportController;
	topologyController: TopologyController;

	constructor() {
		super();
		this.style.visibility = 'hidden';

		this.configController = new ConfigController(this);

		try {
			this.configController.initialize(this.dataset['config']);
			this.sitemap = parseSitemap(this.dataset['sitemap']);
			// TODO: Trailing slashes as a config option?
			this.trailingSlashes = this.dataset['trailingSlashes'] === 'true';
			this.currentPage = setSlashes(this.dataset['slug'] || location.pathname, true, this.trailingSlashes);
			this.debug = this.dataset['debug'] === 'true';
		} catch (e) {
			console.error('[STARLIGHT-SITE-GRAPH] ' + (e instanceof Error ? e.message : e));
		}

		this.classList.add('slsg-graph-component');

		this.graphContainer = document.createElement('div');
		this.graphContainer.classList.add('slsg-graph-container');

		this.graphContainer.tabIndex = 0;
		this.appendChild(this.graphContainer);

		this.fullscreenController = new FullscreenController(this);
		this.animationState = new AnimationState();
		this.styleController = new StyleController(this);
		this.lifecycleController = new LifecycleController(this);
		this.viewportController = new ViewportController(this);
		this.topologyController = new TopologyController(this);

		this.renderer = new GraphRenderer(this);
		this.simulator = new GraphSimulator(this);

		this.lifecycleController.initialize();
	}

	setHooks(hooks: Partial<GraphHostHooks>) {
		this.hooks = { ...this.hooks, ...hooks };
	}

	override remove() {
		this.lifecycleController.destroy();
		super.remove();
	}
}
