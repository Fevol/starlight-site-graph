import type { LinkData, NodeData } from '../types';
import type { GraphEngineHost } from '../types';
import type { GraphRenderer } from '../render/engine';

import type { WorkerMessage } from './worker/types';

import { GraphCamera } from './camera';
import { GraphTransform } from '../transform';
import {
	captureTopologyNodeState,
	createColliderRadii,
	normalizeTopology,
	restoreTopologyNodeState,
	initializeNodePositions,
} from './layout';
import {
	enableClick,
	enableDrag,
	enableHover,
	enableZoom,
	clearHoverIntent,
	clickRequiresDoubleClick,
	removeNodeHover,
} from './interactions';

import {
	DEFAULT_COLLISION_STRENGTH,
	DEFAULT_SIMULATION_RESTART_ALPHA,
	SPATIAL_HASH_MULTIPLIER,
	SPATIAL_HASH_OFFSET,
} from './constants';
import { GRAPH_EPSILON } from '../constants';

export class GraphSimulator {
	container!: HTMLCanvasElement;
	renderer!: GraphRenderer;
	host!: GraphEngineHost;

	clickEnabled = true;

	worker: Worker | undefined;

	nodes!: NodeData[];
	links!: LinkData[];

	currentNode: NodeData | undefined;

	currentlyHovered: string = '';
	pendingHovered: string = '';
	hoverIntentTimeout: ReturnType<typeof setTimeout> | undefined;
	isHovering: boolean = false;

	lastClick: number = 0;
	lastClickedNode: NodeData | undefined;
	requireDblClick: boolean = false;

	ready: boolean = false;
	graphDrawRequested = true;

	camera: GraphCamera;

	private topologyNodeState = new Map<string, Pick<NodeData, 'x' | 'y' | 'vx' | 'vy' | 'fx' | 'fy'>>();

	private spatialGrid = new Map<number, NodeData[]>();
	private spatialGridCellSize = 1;
	private spatialMaxRadius = 0;

	interactionCleanups: Array<() => void> = [];
	activeDrag?:
		| {
				pointerId: number;
				node: NodeData;
				worldX: number;
				worldY: number;
				didDrag: boolean;
				fixAnimationFrame?: number | undefined;
		  }
		| undefined;
	activePan?:
		| {
				pointerId: number;
				startClientX: number;
				startClientY: number;
				startTransform: GraphTransform;
				didPan: boolean;
		  }
		| undefined;
	touchPoints = new Map<number, { clientX: number; clientY: number }>();
	activePinch?:
		| {
				distance: number;
				transform: GraphTransform;
		  }
		| undefined;
	suppressClickUntil = 0;


	constructor() {
		this.camera = new GraphCamera(this);
	}

	attach(host: GraphEngineHost, renderer: GraphRenderer) {
		this.host = host;
		this.renderer = renderer;
	}

	get config() {
		return this.host.config;
	}

	get animation() {
		return this.host.animation;
	}

	get transformScale() {
		return this.camera.transform.k;
	}

	get mounted() {
		return this.worker !== undefined;
	}

	initializeTopology(nodes: NodeData[], links: LinkData[], currentNode: NodeData | undefined, scale: number = 1.0) {
		this.topologyNodeState.clear();
		this.nodes = nodes;
		this.links = links;
		this.currentNode = currentNode;

		this.container = this.renderer.canvas;
		this.camera.syncViewportSize(this.renderer.container.clientWidth, this.renderer.container.clientHeight);

		this.requireDblClick = clickRequiresDoubleClick(this);
		this.ready = false;
		this.camera.initializeView(scale);

		// Assign stable indices before resolving links and seeding positions.
		const nodeMap = normalizeTopology(nodes, links);
		initializeNodePositions(this.nodes, this.currentNode, nodeMap);
		this.rebuildSpatialGrid();
		this.camera.updateCenterTransform();
		this.camera.updateTransform(true);

		this.worker = new Worker(new URL('./worker/index.ts', import.meta.url), {
			type: 'module',
			name: 'Graph Simulation Worker',
		});

		this.worker.onmessage = (e: MessageEvent) => {
			const msg = e.data as { type: string; data?: Float32Array };
			if (msg.type === 'tick' && msg.data) {
				for (let i = 0; i < this.nodes.length; i++) {
					const node = this.nodes[i]!;
					node.x = msg.data[4 * i]!;
					node.y = msg.data[4 * i + 1]!;
					node.vx = msg.data[4 * i + 2]!;
					node.vy = msg.data[4 * i + 3]!;
				}

				this.rebuildSpatialGrid();
				this.camera.syncToCenterOnTick();
				if (!this.ready) {
					this.ready = true;
					this.host.onSimulationReady();
				}
				this.requestGraphDraw();
			}
		};

		this.initializeWorker(1.0);
	}

	updateTopology(nodes: NodeData[], links: LinkData[], currentNode: NodeData | undefined) {
		if (!this.worker) {
			this.initializeTopology(nodes, links, currentNode, this.camera.scale);
		} else {
			this.topologyNodeState = captureTopologyNodeState(this.nodes);
			restoreTopologyNodeState(nodes, this.nodes, this.topologyNodeState);

			const previousCurrentNodeId = this.currentNode?.id;
			this.nodes = nodes;
			this.links = links;
			this.currentNode = currentNode;

			if (currentNode?.id !== previousCurrentNodeId) {
				this.camera.pendingCenterAnimation = true;
			}

			if (this.currentlyHovered && !nodes.some(node => node.id === this.currentlyHovered)) {
				this.currentlyHovered = '';
				this.pendingHovered = '';
				this.isHovering = false;
			}

			const nodeMap = normalizeTopology(nodes, links);
			initializeNodePositions(this.nodes, this.currentNode, nodeMap);
			this.initializeWorker(0);
		}
	}

	private sendToWorker(msg: WorkerMessage, transfers?: Transferable[]) {
		this.worker!.postMessage(msg, transfers ?? []);
	}

	private initializeWorker(alpha: number = 1.0): void {
		const positions = new Float32Array(this.nodes.length * 2);
		const colliderRadii = createColliderRadii(this.nodes, this.config.colliderPadding);
		for (let i = 0; i < this.nodes.length; i++) {
			positions[2 * i] = this.nodes[i]!.x ?? 0;
			positions[2 * i + 1] = this.nodes[i]!.y ?? 0;
		}

		const linkSrc = new Int32Array(this.links.length);
		const linkDst = new Int32Array(this.links.length);
		for (let i = 0; i < this.links.length; i++) {
			const link = this.links[i]!;
			linkSrc[i] = link.source.index ?? 0;
			linkDst[i] = link.target.index ?? 0;
		}

		this.sendToWorker(
			{ type: 'init', nodeCount: this.nodes.length, linkCount: this.links.length, positions, colliderRadii, linkSrc, linkDst, alpha },
			[positions.buffer, colliderRadii.buffer, linkSrc.buffer, linkDst.buffer],
		);
	}

	syncColliders(reheat?: number) {
		if (this.worker) {
			const colliderRadii = createColliderRadii(this.nodes, this.config.colliderPadding);
			this.sendToWorker({ type: 'colliders', colliderRadii }, [colliderRadii.buffer]);
			this.syncForces(reheat ?? DEFAULT_SIMULATION_RESTART_ALPHA);
		}
	}

	cleanup() {
		clearHoverIntent(this);
		this.currentlyHovered = '';
		this.camera.clear();
		if (this.activeDrag?.fixAnimationFrame !== undefined) {
			cancelAnimationFrame(this.activeDrag.fixAnimationFrame);
		}
		this.activeDrag = undefined;
		this.activePan = undefined;
		this.activePinch = undefined;
		this.touchPoints.clear();

		this.topologyNodeState.clear();

		if (this.worker) {
			this.sendToWorker({ type: 'stop' });
			this.worker.terminate();
			this.worker = undefined;
		}

		if (this.container) {
			this.unbindInteractions();
		}
	}

	destroy() {
		this.cleanup();
		this.renderer = undefined!;
		this.host = undefined!;
	}

	syncForces(reheat?: number) {
		if (this.worker) {
			this.sendToWorker({
				type: 'forces',
				centerStrength: this.config.centerForce,
				linkStrength: 1.0,
				linkDistance: this.config.linkDistance,
				repelStrength: -this.config.repelForce,
				alphaDecay: this.config.alphaDecay,
				alphaTarget: 0,
				collisionStrength: DEFAULT_COLLISION_STRENGTH,
				restartAlpha: reheat ?? 1,
			});
		}
	}

	requestGraphDraw() {
		this.graphDrawRequested = true;
		this.renderer?.ensureTickerActive();
	}

	consumeGraphDrawRequest() {
		const requested = this.graphDrawRequested;
		this.graphDrawRequested = false;
		return requested;
	}

	private spatialKey(cx: number, cy: number): number {
		return (cx + SPATIAL_HASH_OFFSET) * SPATIAL_HASH_MULTIPLIER + (cy + SPATIAL_HASH_OFFSET);
	}

	rebuildSpatialGrid() {
		this.spatialGrid.clear();
		this.spatialMaxRadius = 0;

		for (const node of this.nodes) {
			if ((node.fullRadius ?? 0) > this.spatialMaxRadius) {
				this.spatialMaxRadius = node.fullRadius ?? 0;
			}
		}

		this.spatialGridCellSize = Math.max(this.spatialMaxRadius * 2, 1);
		const cs = this.spatialGridCellSize;

		for (const node of this.nodes) {
			if (node.x === undefined || node.y === undefined) {
				continue;
			}

			const key = this.spatialKey(Math.floor(node.x / cs), Math.floor(node.y / cs));
			let cell = this.spatialGrid.get(key);
			if (!cell) {
				cell = []; this.spatialGrid.set(key, cell);
			}

			cell.push(node);
		}
	}

	findOverlappingNode(x: number, y: number): NodeData | undefined {
		const cs = this.spatialGridCellSize;
		const zoom = this.renderer.animation.zoom.value;
		const searchRadius = this.spatialMaxRadius * Math.sqrt(1 / Math.max(zoom, GRAPH_EPSILON));

		const minCX = Math.floor((x - searchRadius) / cs);
		const maxCX = Math.floor((x + searchRadius) / cs);
		const minCY = Math.floor((y - searchRadius) / cs);
		const maxCY = Math.floor((y + searchRadius) / cs);

		for (let cx = minCX; cx <= maxCX; cx++) {
			for (let cy = minCY; cy <= maxCY; cy++) {
				const cell = this.spatialGrid.get(this.spatialKey(cx, cy));
				if (cell) {
					for (const node of cell) {
						const radius = this.renderer.getRenderedNodeRadius(node);
						if ((node.x! - x) ** 2 + (node.y! - y) ** 2 <= radius * radius) {
							return node;
						}
					}
				}
			}
		}
		return undefined;
	}

	private unbindInteractions() {
		clearHoverIntent(this);
		for (const cleanup of this.interactionCleanups) {
			cleanup();
		}

		this.interactionCleanups.length = 0;
		if (this.activeDrag?.fixAnimationFrame !== undefined) {
			cancelAnimationFrame(this.activeDrag.fixAnimationFrame);
		}

		this.activeDrag = undefined;
		this.activePan = undefined;
		this.activePinch = undefined;
		this.touchPoints.clear();
		this.container.style.cursor = 'default';
		document.body.style.cursor = 'default';
	}

	syncInteractions() {
		if (this.container) {
			this.clickEnabled = this.config.enableClick !== 'disable';
			this.requireDblClick = clickRequiresDoubleClick(this);
			this.unbindInteractions();
			if (!this.config.enableHover && this.currentlyHovered) {
				removeNodeHover(this);
			}
			if (this.config.enableDrag) {
				enableDrag(this);
			}
			if (this.config.enableHover) {
				enableHover(this);
			}
			if (this.clickEnabled) {
				enableClick(this);
			}
			if (this.config.enableZoom || this.config.enablePan) {
				enableZoom(this);
			}
		}
	}

	syncScale(immediate = false) {
		this.camera.scale = this.config.scale;
		if (!this.camera.userZoomed) {
			this.camera.resetZoom(immediate);
		} else {
			this.camera.updateZoom(this.config.scale, undefined, undefined, immediate);
		}
	}

	syncZoomLimits(immediate = false) {
		if (!this.camera.userZoomed) {
			this.camera.resetZoom(immediate);
		} else {
			this.camera.refreshZoomConstraints(immediate);
		}
	}

	resetView(immediate = false) {
		this.camera.resetZoom(immediate);
	}

	syncViewport(width: number, height: number, recenter = false) {
		this.camera.syncViewportSize(width, height);
		if (recenter) {
			this.camera.updateCenterTransform();
			this.camera.updateTransform(true);
			this.requestGraphDraw();
		}
	}
}
