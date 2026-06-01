import type { Graph } from '../graph';
import type { Sitemap } from '../config/types';

import { renderActionContainer } from '../ui';

export class LifecycleController {
	private placeholderContainer!: HTMLElement;
	private graphReady = false;
	private initialized = false;

	constructor(private context: Graph) {}

	initialize() {
		if (this.initialized) {
			return;
		}
		this.initialized = true;

		this.placeholderContainer = this.context.element.previousElementSibling instanceof HTMLElement
			? this.context.element.previousElementSibling
			: document.createElement('div');

		this.context.styleController.initialize();
		this.context.fullscreenController.initialize();
		this.renderActions();

		this.context.renderer.attach(this.context, this.context.simulator, this.context.graphContainer).then(() => {
			if (this.initialized) {
				this.loadGraph();
			}
		});
		this.context.simulator.attach(this.context, this.context.renderer);
	}

	destroy() {
		if (!this.initialized) {
			return;
		}
		this.initialized = false;

		this.context.fullscreenController.destroy();
		this.unloadGraph();

		this.context.styleController.destroy();
		this.context.topologyController.destroy();
		this.context.animationState.destroy();

		this.context.simulator.destroy();
		this.context.renderer.destroy();

		this.context.actionContainer?.remove();
		this.context.graphContainer.remove();
		this.placeholderContainer.remove();
	}

	loadGraph() {
		this.placeholderContainer.style.display = '';
		this.context.element.style.visibility = 'hidden';
		this.graphReady = false;
		this.unloadGraph();

		const { nodes, links, colors } = this.context.topologyController.getProcessedGraphData();
		this.context.styleController.syncColorPalette(colors);

		this.context.simulator.initializeTopology(
			nodes,
			links,
			nodes.find(node => node.id === this.context.currentPage),
			this.context.config.scale,
		);
		this.context.renderer.initializeTopology();
		this.context.simulator.syncForces();

		this.context.renderer.syncLabels(true);
		this.context.renderer.syncColors(this.context.styleController.colors, true);
		this.context.simulator.syncInteractions();
	}

	unloadGraph() {
		if (this.context.renderer.mounted) {
			this.context.renderer.cleanup();
		}

		if (this.context.simulator.mounted) {
			this.context.simulator.cleanup();
		}
	}

	rebuildGraph() {
		this.loadGraph();
		this.renderActions();
		this.context.simulator.resetView();
	}

	setCurrentPage(currentPage: string) {
		if (this.context.currentPage === currentPage) {
			return;
		}

		this.context.currentPage = currentPage;
		if (!this.context.topologyController.refreshTopology()) {
			this.rebuildGraph();
			return;
		}

		this.context.renderer.setHoverState(false);
	}

	onSimulationReady() {
		if (this.graphReady) {
			return;
		}
		this.graphReady = true;

		this.placeholderContainer.style.display = 'none';
		this.context.element.style.visibility = 'visible';

		this.syncLayout({ refreshColors: false, renderActions: false });
	}

	setSitemap(sitemap: Sitemap) {
		this.context.sitemap = sitemap;
		this.context.topologyController.invalidateCache();
		if (!this.context.topologyController.refreshTopology()) {
			this.loadGraph();
		}
	}

	syncLayout(options: {
		refreshColors?: boolean;
		renderActions?: boolean;
		resetZoom?: boolean;
		immediate?: boolean;
	} = {}) {
		const { refreshColors = true, renderActions = true, resetZoom = false, immediate = true } = options;

		if (renderActions) {
			this.renderActions();
		}

		if (this.context.renderer.resize()) {
			const { viewportWidth, viewportHeight } = this.context.renderer;
			if (viewportWidth > 0 && viewportHeight > 0) {
				this.context.simulator.syncViewport(viewportWidth, viewportHeight, false);
			}
		}

		if (refreshColors) {
			this.context.styleController.refreshColors(immediate);
		}

		if (resetZoom) {
			this.context.simulator.resetView(immediate);
		}

		this.requestGraphDraw();
	}

	resize() {
		if (!this.context.renderer.container) {
			return;
		}

		const sizeChanged = this.context.renderer.resize();
		const { viewportWidth, viewportHeight } = this.context.renderer;
		if (sizeChanged && viewportWidth > 0 && viewportHeight > 0) {
			this.context.simulator.syncViewport(viewportWidth, viewportHeight, true);
		}
	}

	renderActions() {
		renderActionContainer(this.context);
	}

	requestGraphDraw() {
		this.context.simulator.requestGraphDraw();
	}
}
