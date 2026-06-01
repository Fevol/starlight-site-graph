import * as PIXI from 'pixi.js';

import type { GraphEngineHost } from '../types';
import type { GraphSimulator } from '../simulation/simulation';

import type { LinkData, NodeData } from '../types';
import type { LinkDisplay, NodeDisplay } from './types';
import type { GraphColorConfig } from '../color';

import {
	cleanupLifecycle,
	hasPendingDisposals,
	hasPendingInitializations,
	processPendingDisposals,
	processPendingInitializations,
	syncTopologyLifecycle,
} from './lifecycle';

import { createLinkVisualState } from './link/state';
import { createLinkDisplays, drawLinks, syncArrowGeometry } from './link/render';
import { updateExitingLinks } from './link/transitions';

import { syncLabelResolution } from './label/render';

import { createNodeVisualState } from './node/state';
import { getRenderedNodeRadius } from './node/geometry';
import { drawNodes } from './node/render';
import { updateExitingNodes, updateNodeVisuals } from './node/transitions';
import { queueNodeDisplays, refreshNodeDisplays } from './node/lifecycle';

import { computeLinkKey } from '../utils';
import { getCurrentLabelOpacity } from '../transform';

import {
	DEBUG_STATS_LOAD_DELAY_MS,
	RENDERER_DEFAULT_RESOLUTION,
	RENDERER_LABEL_MAX_RESOLUTION,
	RENDERER_LARGE_GRAPH_NODE_THRESHOLD,
	RENDERER_LARGE_GRAPH_RESOLUTION,
	RENDERER_MAX_BACKING_DIMENSION,
	RENDERER_MAX_BACKING_PIXELS,
} from './constants';


export class GraphRenderer {
	app: PIXI.Application;
	container!: HTMLElement;
	simulator!: GraphSimulator;
	host!: GraphEngineHost;
	palette: GraphColorConfig = {};

	viewportWidth = 0;
	viewportHeight = 0;

	private readonly tickHandler: (ticker: PIXI.Ticker) => void;
	private tickerActive = false;
	private baseResolution = RENDERER_DEFAULT_RESOLUTION;

	visibilityObserver!: IntersectionObserver;
	resizeObserver!: ResizeObserver;

	private debugStats: { hidePanel(): void } | undefined;
	private debugStatsLoadTimeout: ReturnType<typeof setTimeout> | undefined;
	private debugStatsKeepTickerAlive = false;

	private destroyed = false;
	private appInitialized = false;
	private readonly onPageVisibilityChange: () => void;

	fadeInEnabled = true;
	pendingInitialization = {
		nodes: [] as NodeData[],
		nodeCursor: 0,
	};

	nodeDisplays = new Map<string, NodeDisplay>();
	linkDisplays = new Map<string, LinkDisplay>();
	linkDisplayCache = new WeakMap<LinkData, LinkDisplay>();

	exitingNodeDisplays = new Map<string, NodeDisplay>();
	exitingLinkDisplays = new Map<string, LinkDisplay>();
	pendingDisposal = {
		nodes: [] as NodeDisplay[],
		links: [] as LinkDisplay[],
		nodeCursor: 0,
		linkCursor: 0,
	};

	constructor() {
		this.app = new PIXI.Application();
		this.tickHandler = (ticker: PIXI.Ticker) => this.tick(ticker);
		this.onPageVisibilityChange = () => {
			if (document.hidden) {
				this.sleepTicker();
			} else {
				if (this.debugStatsKeepTickerAlive) {
					this.ensureTickerActive();
				}
				this.simulator?.requestGraphDraw();
			}
		};
	}

	get canvas() {
		return this.app.canvas;
	}

	get config() {
		return this.host.config;
	}

	get animation() {
		return this.host.animation;
	}

	get mounted() {
		return this.host !== undefined;
	}

	get renderedTransform() {
		return this.animation.renderedTransform;
	}

	get labelResolution() {
		return Math.max(this.app.renderer.resolution, Math.min(this.baseResolution, RENDERER_LABEL_MAX_RESOLUTION));
	}

	getNodeDisplay(node: NodeData): NodeDisplay {
		let display = this.nodeDisplays.get(node.id);
		if (!display) {
			display = {};
			this.nodeDisplays.set(node.id, display);
		}
		return display;
	}

	getLinkDisplay(link: LinkData): LinkDisplay {
		let display = this.linkDisplayCache.get(link);
		if (display) {
			return display;
		}

		const key = computeLinkKey(link);
		display = this.linkDisplays.get(key);
		if (!display) {
			display = {};
			this.linkDisplays.set(key, display);
		}
		this.linkDisplayCache.set(link, display);
		return display;
	}

	getNodeVisual(node: NodeData) {
		const display = this.getNodeDisplay(node);
		return (display.visual ??= createNodeVisualState(node));
	}

	getLinkVisual(link: LinkData) {
		const display = this.getLinkDisplay(link);
		return (display.visual ??= createLinkVisualState());
	}

	async attach(host: GraphEngineHost, simulator: GraphSimulator, container: HTMLElement) {
		this.host = host;
		this.simulator = simulator;
		this.container = container;
		this.baseResolution = this.resolveBaseResolution();
		await this.app.init({
			antialias: true,
			backgroundAlpha: 0,
			eventFeatures: {
				click: false,
				globalMove: false,
				move: false,
				wheel: false,
			},
			eventMode: 'none',
			resolution: this.resolveResolution(this.container.clientWidth, this.container.clientHeight),
			resizeTo: this.container,
		} as PIXI.ApplicationOptions);

		this.appInitialized = true;
		if (this.destroyed) {
			this.destroyPixiApp();
			return;
		}

		this.container.appendChild(this.app.canvas);

		this.visibilityObserver = new IntersectionObserver(entries => {
			if (entries[0]?.isIntersecting) {
				this.host.onContainerResize();
			}
		});
		this.visibilityObserver.observe(this.container);

		this.resizeObserver = new ResizeObserver(() => this.host.onContainerResize());
		this.resizeObserver.observe(this.container);

		this.app.stage.sortableChildren = true;
		this.app.stage.eventMode = 'none';
		document.addEventListener('visibilitychange', this.onPageVisibilityChange);
		this.ensureTickerActive();

		if (import.meta.env.DEV && this.host.debug) {
			this.debugStatsLoadTimeout = setTimeout(async () => {
				try {
					const { Stats } = await import('pixi-stats');
					if (!this.destroyed) {
						const stats = new Stats(undefined as never, this.app.ticker);
						this.debugStats = stats;
						this.debugStatsKeepTickerAlive = true;

						stats.domElement!.id = 'slsg-graph-stats';
						this.ensureTickerActive();
					}
				} catch (e) {
					console.error(
						'[STARLIGHT-SITE-GRAPH] Failed to load pixi-stats, to enable the FPS counter for the graph view, make sure to install the dependency. Disable this message by setting `debug` to false in the graph component.' +
							e,
					);
				}
			}, DEBUG_STATS_LOAD_DELAY_MS);
		}
	}

	resize(): boolean {
		const width = this.container.clientWidth;
		const height = this.container.clientHeight;
		const changed = width !== this.viewportWidth || height !== this.viewportHeight;
		this.viewportWidth = width;
		this.viewportHeight = height;
		this.syncRendererResolution();
		this.app.renderer.resize(this.viewportWidth, this.viewportHeight);
		return changed;
	}

	initializeTopology() {
		queueNodeDisplays(this, this.simulator.nodes);
		processPendingInitializations(this);
		createLinkDisplays(this, this.simulator.links);
	}

	syncTopology(
		previousNodes: NodeData[],
		previousLinks: LinkData[],
		nextNodes: NodeData[],
		nextLinks: LinkData[],
		previousGeometrySignatures?: Map<string, string>,
	) {
		syncTopologyLifecycle(this, previousNodes, previousLinks, nextNodes, nextLinks, previousGeometrySignatures);
	}

	cleanup() {
		cleanupLifecycle(this);
	}

	destroy() {
		if (!this.destroyed) {
			this.destroyed = true;
			if (this.debugStatsLoadTimeout) {
				clearTimeout(this.debugStatsLoadTimeout);
				this.debugStatsLoadTimeout = undefined;
			}
			this.debugStatsKeepTickerAlive = false;
			this.debugStats?.hidePanel();
			this.debugStats = undefined;
			document.removeEventListener('visibilitychange', this.onPageVisibilityChange);
			if (this.appInitialized) {
				this.destroyPixiApp();
			}
			this.simulator = undefined!;
			this.host = undefined!;
			this.visibilityObserver?.disconnect();
			this.resizeObserver?.disconnect();
		}
	}

	private destroyPixiApp() {
		this.sleepTicker();
		this.app.destroy();
		this.app = undefined!;
	}

	private resolveBaseResolution() {
		return Object.keys(this.host.sitemap).length > RENDERER_LARGE_GRAPH_NODE_THRESHOLD
			? RENDERER_LARGE_GRAPH_RESOLUTION
			: RENDERER_DEFAULT_RESOLUTION;
	}

	private resolveResolution(width: number, height: number) {
		// EXPL: Chrome has some internal limits on how large the backing store of a canvas can be.
		//		 If it gets too large (e.g. when going fullscreen), the node hover areas are offset from the actual positions.
		//		 To prevent this, we dynamically cap the resolution based on viewport size.
		if (width <= 0 || height <= 0) {
			return this.baseResolution;
		} else {
			const dimensionLimit = RENDERER_MAX_BACKING_DIMENSION / Math.max(width, height);
			const pixelLimit = Math.sqrt(RENDERER_MAX_BACKING_PIXELS / (width * height));
			const cappedResolution = Math.min(this.baseResolution, dimensionLimit, pixelLimit);

			return Math.max(1, Math.floor(cappedResolution));
		}
	}

	private syncRendererResolution() {
		this.app.renderer.resolution = this.resolveResolution(this.viewportWidth, this.viewportHeight);
		syncLabelResolution(this);
	}

	ensureTickerActive() {
		if (!this.tickerActive) {
			this.app.ticker.add(this.tickHandler);
			this.app.ticker.start();
			this.tickerActive = true;
		}
	}

	sleepTicker() {
		if (this.tickerActive) {
			this.app.ticker.remove(this.tickHandler);
			this.app.ticker.stop();
			this.tickerActive = false;
		}
	}

	tick(ticker: PIXI.Ticker) {
		this.animation.tick(ticker.deltaMS, this.config);

		this.simulator.camera.syncToCenter();

		if (this.simulator.camera.animateZoomOverride || this.animation.cameraAnimating) {
			this.app.stage.updateTransform({
				scaleX: this.animation.zoom.value,
				scaleY: this.animation.zoom.value,
				x: this.animation.transformX.value,
				y: this.animation.transformY.value,
			});
			this.simulator.camera.animateZoomOverride = false;
		}

		processPendingInitializations(this);
		updateNodeVisuals(this, this.simulator.nodes, ticker.deltaMS);
		updateExitingNodes(this, ticker.deltaMS);
		updateExitingLinks(this, ticker.deltaMS);
		processPendingDisposals(this);

		const graphDrawRequested = this.simulator.consumeGraphDrawRequest();
		const cameraRenderRequested = this.simulator.camera.consumeCameraRenderRequest();

		const shouldDraw =
			graphDrawRequested ||
			this.animation.drawAnimating ||
			hasPendingInitializations(this) ||
			this.exitingNodeDisplays.size > 0 ||
			this.exitingLinkDisplays.size > 0;

		if (shouldDraw) {
			drawNodes(this, this.simulator.nodes);
			drawLinks(this, this.simulator.links);
		} else if (
			!cameraRenderRequested &&
			!this.animation.cameraAnimating &&
			!hasPendingDisposals(this) &&
			!(this.debugStatsKeepTickerAlive && !document.hidden)
		) {
			this.sleepTicker();
		}
	}

	resetZoom(zoomTransform: { k: number; x: number; y: number }) {
		// @ts-expect-error __zoom is a private property
		this.app.canvas.__zoom = zoomTransform;
	}

	syncColors(palette: GraphColorConfig, immediate = false) {
		this.palette = palette;
		this.animation.syncColors(palette, this.config, immediate);
		this.simulator.requestGraphDraw();
	}

	syncLabels(immediate = false) {
		refreshNodeDisplays(this, this.simulator.nodes);
		this.animation.setLabelsEnabled(this.config.renderLabels, this.config, immediate);
		this.animation.setLabelOpacityBase(
			getCurrentLabelOpacity(this.simulator.transformScale, this.config.labelZoomOpacityScale),
			this.config,
			immediate,
		);
		for (const node of this.simulator.nodes) {
			const visual = this.getNodeDisplay(node).visual;
			if (visual) {
				visual.animating = true;
			}
		}
		this.simulator.requestGraphDraw();
	}

	syncTransitions(options: { syncArrowGeometry?: boolean; immediate?: boolean } = {}) {
		if (options.syncArrowGeometry) {
			syncArrowGeometry(this, this.simulator.links);
		}
		this.animation.syncConfig(this.config, options.immediate ?? !this.config.smoothTransitions);
		this.simulator.requestGraphDraw();
	}

	setHoverState(hovered: boolean) {
		this.animation.setHoverActive(hovered, this.config);
		if (!hovered) {
			this.animation.setLabelOpacityBase(
				getCurrentLabelOpacity(this.simulator.transformScale, this.config.labelZoomOpacityScale),
				this.config,
			);
		}
		this.simulator.requestGraphDraw();
	}

	getRenderedNodeRadius(node: NodeData) {
		return getRenderedNodeRadius(this, node);
	}
}
