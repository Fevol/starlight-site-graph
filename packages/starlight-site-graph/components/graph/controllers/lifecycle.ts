import type { GraphComponent } from '../graph-component';

import { parseSitemap } from '../topology/topology';
import { renderActionContainer } from '../ui';

export class LifecycleController {
	private placeholderContainer!: HTMLElement;
	private graphReady = false;
	private initialized = false;

	constructor(private context: GraphComponent) {}

	initialize() {
		if (this.initialized) {
			return;
		}
		this.initialized = true;

		this.placeholderContainer = this.context.previousElementSibling instanceof HTMLElement
			? this.context.previousElementSibling
			: document.createElement('div');

		this.context.styleController.initialize();
		this.context.fullscreenController.initialize();
		this.renderActions();

		this.context.renderer.initialize(this.context.simulator, this.context.graphContainer).then(() => {
			if (this.initialized) {
				this.loadGraph();
			}
		});
		this.context.simulator.initialize(this.context.renderer);

		this.context.propertyObserver = new MutationObserver(mutations => {
			for (const mutation of mutations) {
				if (mutation.attributeName === 'data-config') {
					this.context.configController.onAttributeChange();
				}
				if (mutation.attributeName === 'data-sitemap') {
					this.onSitemapAttributeChange();
				}
			}
		});
		this.context.propertyObserver.observe(this.context, { attributes: true });
	}

	destroy() {
		if (!this.initialized) {
			return;
		}
		this.initialized = false;

		this.context.propertyObserver?.disconnect();
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
		this.context.style.visibility = 'hidden';
		this.graphReady = false;
		this.unloadGraph();

		const { nodes, links, colors } = this.context.topologyController.getProcessedGraphData();
		this.context.styleController.syncColorPalette(colors);
		this.context.enableClick = this.context.config.enableClick !== 'disable';

		this.context.simulator.initializeTopology(
			nodes,
			links,
			nodes.find(node => node.id === this.context.currentPage),
			this.context.config.scale,
		);
		this.context.renderer.initializeTopology();
		this.context.simulator.update();

		this.context.animationState.setLabelsEnabled(this.context.config.renderLabels, this.context.config, true);
		this.context.animationState.setLabelOpacityBase(
			this.context.simulator.camera.getCurrentLabelOpacity(),
			this.context.config,
			true,
		);
		this.context.animationState.syncColors(this.context.styleController.colors, this.context.config, true);
		this.context.simulator.refreshInteractions();
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
		this.context.viewportController.resetZoom();
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

		this.context.styleController.setStyleDefault();
	}

	onSimulationReady() {
		if (this.graphReady) {
			return;
		}
		this.graphReady = true;

		this.placeholderContainer.style.display = 'none';
		this.context.style.visibility = 'visible';

		this.syncLayout({ refreshColors: false, renderActions: false });
	}

	onSitemapAttributeChange() {
		this.context.sitemap = parseSitemap(this.context.dataset['sitemap']);
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

		this.context.renderer.resize();

		if (refreshColors) {
			this.context.styleController.refreshColors(immediate);
		}

		if (resetZoom) {
			this.context.viewportController.resetZoom(immediate);
		}

		this.requestGraphDraw();
	}

	renderActions() {
		renderActionContainer(this.context);
	}

	requestGraphDraw() {
		this.context.simulator.requestGraphDraw();
	}
}
