import type { GraphConfig, Sitemap } from './config/types';
import type { GraphHostHooks, GraphEngineHost, NodeData } from './types';

import { AnimationState } from './render/transitions';
import { ConfigController, TopologyController, StyleController, FullscreenController, LifecycleController } from './controllers';

import { GraphRenderer } from './render/engine';
import { GraphSimulator } from './simulation/simulation';

import { setSlashes, ensureLeadingSlash } from './shared/path';

export interface GraphOptions {
	config?: Partial<GraphConfig>;
	sitemap?: Sitemap;
	currentPage?: string;
	debug?: boolean;
	trailingSlashes?: boolean;
	hooks?: Partial<GraphHostHooks>;
}

export class Graph implements GraphEngineHost {
	element: HTMLElement;
	graphContainer: HTMLElement;
	actionContainer!: HTMLElement;

	debug: boolean;
	trailingSlashes: boolean;

	renderer: GraphRenderer;
	simulator: GraphSimulator;

	config!: GraphConfig;
	sitemap: Sitemap;

	animationState: AnimationState;

	currentPage: string;

	hooks: GraphHostHooks;

	configController: ConfigController;
	styleController: StyleController;
	fullscreenController: FullscreenController;
	lifecycleController: LifecycleController;
	topologyController: TopologyController;

	constructor(element: HTMLElement, options: GraphOptions = {}) {
		this.element = element;
		this.element.style.visibility = 'hidden';
		this.element.classList.add('slsg-graph-component');

		this.debug = options.debug ?? false;
		this.trailingSlashes = options.trailingSlashes ?? true;
		this.hooks = { ...options.hooks };
		this.sitemap = options.sitemap ?? {};
		this.currentPage = setSlashes(options.currentPage || location.pathname, true, this.trailingSlashes);

		this.configController = new ConfigController(this);
		this.configController.initialize(options.config ?? {});

		this.graphContainer = document.createElement('div');
		this.graphContainer.classList.add('slsg-graph-container');
		this.graphContainer.tabIndex = 0;
		this.element.appendChild(this.graphContainer);

		this.animationState = new AnimationState();
		this.fullscreenController = new FullscreenController(this);
		this.styleController = new StyleController(this);
		this.lifecycleController = new LifecycleController(this);
		this.topologyController = new TopologyController(this);

		this.renderer = new GraphRenderer();
		this.simulator = new GraphSimulator();

		this.lifecycleController.initialize();
	}

	get animation() {
		return this.animationState;
	}

	setConfig(config: Partial<GraphConfig>) {
		this.configController.merge(config);
	}

	replaceConfig(config: Partial<GraphConfig>) {
		this.configController.replace(config);
	}

	setSitemap(sitemap: Sitemap) {
		this.lifecycleController.setSitemap(sitemap);
	}

	setCurrentPage(slug: string) {
		this.lifecycleController.setCurrentPage(setSlashes(slug, true, this.trailingSlashes));
	}

	setHooks(hooks: Partial<GraphHostHooks>) {
		this.hooks = { ...this.hooks, ...hooks };
	}

	destroy() {
		this.lifecycleController.destroy();
	}

	onSimulationReady() {
		this.lifecycleController.onSimulationReady();
	}

	onContainerResize() {
		this.lifecycleController.resize();
	}

	onNodeActivate(node: NodeData, event: MouseEvent) {
		if (node.external) {
			window.open(node.id, '_blank');
		} else if (this.config.followLink === 'graph') {
			this.lifecycleController.setCurrentPage(node.id);
		} else {
			window.open(ensureLeadingSlash(node.id), this.config.followLink === 'new-tab' ? '_blank' : '_self');
		}
		this.hooks.onNodeClick?.(node, event);
	}

	onNodeHoverChange(node: NodeData | null) {
		if (node) {
			this.hooks.onNodeHover?.(node);
		} else {
			this.hooks.onNodeUnhover?.();
		}
		this.renderer.setHoverState(node !== null);
	}
}
