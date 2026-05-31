import type { InitializeMessage, SimulationExports, WorkerMessage } from './types';

import {
	CELL_BYTES, LINK_BYTES, NODE_BYTES, QUAD_CTX_BYTES,
	WASM_MEMORY_SLACK_BYTES, WASM_PAGE_BYTES, WORKER_TICK_INTERVAL_MS,
	DEFAULT_ALPHA, DEFAULT_ALPHA_DECAY, DEFAULT_ALPHA_MIN, DEFAULT_ALPHA_TARGET,
	DEFAULT_CENTER_STRENGTH, DEFAULT_COLLISION_STRENGTH, DEFAULT_LINK_DISTANCE, DEFAULT_LINK_STRENGTH,
	DEFAULT_REPEL_STRENGTH, DEFAULT_THETA, DEFAULT_VELOCITY_DECAY,
} from './constants';

let wasm: SimulationExports | null = null;
let wasmMemory: WebAssembly.Memory | null = null;

let nodeCount = 0;
let linkCount = 0;
let alpha = DEFAULT_ALPHA;
let alphaTarget = DEFAULT_ALPHA_TARGET;
let alphaDecay = DEFAULT_ALPHA_DECAY;
let centerStrength = DEFAULT_CENTER_STRENGTH;
let linkStrength = DEFAULT_LINK_STRENGTH;
let linkDistance = DEFAULT_LINK_DISTANCE;
let repelStrength = DEFAULT_REPEL_STRENGTH;
let collisionStrength = DEFAULT_COLLISION_STRENGTH;

// These force parameters have no main-thread setter; they always use their defaults.
const alphaMin = DEFAULT_ALPHA_MIN;
const velocityDecay = DEFAULT_VELOCITY_DECAY;
const theta = DEFAULT_THETA;
let running = false;
let tickInterval: ReturnType<typeof setInterval> | null = null;

const fixed = new Map<number, [number, number]>();

// EXPL: We cannot make assumptions on how many nodes that the WASM will need to be initialized with,
//       so we pre-allocate memory based on the maximal memory requirements given initial nodes input
function computeInitialPages(): number {
	const power = nodeCount <= 1 ? 1 : 1 << Math.ceil(Math.log2(nodeCount) / 2);
	// EXPL: finest Barnes-Hut grid dimension (used for manyBody in C code)
	const recurseLevel = Math.max(1, power >> 1);

	// NOTE: covers all tree levels from recurseLevel*recurseLevel down to 1x1
	let treeLevelBytes = 0;
	for (let level = recurseLevel; level >= 1; level >>= 1) {
		treeLevelBytes += level * level * CELL_BYTES;
	}

	const needed =
		nodeCount    * NODE_BYTES              +   // node array
		linkCount    * LINK_BYTES              +   // link array
		nodeCount    * 4                       +   // per-node linked-list pointer
		recurseLevel * recurseLevel * 4        +   // per-cell list head at lowest level
		QUAD_CTX_BYTES                         +   // QuadCtx traversal context struct
		treeLevelBytes                         +   // Barnes-Hut cell data (all tree levels)
		WASM_MEMORY_SLACK_BYTES;

	return Math.ceil(needed / WASM_PAGE_BYTES);
}

function ensureSufficientMemory(): void {
	const needed = computeInitialPages();
	const current = wasmMemory!.buffer.byteLength / WASM_PAGE_BYTES;
	if (current < needed) {
		wasmMemory!.grow(needed - current);
	}
}

async function loadWasm(): Promise<SimulationExports> {
	wasmMemory = new WebAssembly.Memory({ initial: computeInitialPages() });

	const response = await fetch(new URL('./simulation.wasm', import.meta.url));
	if (!response.ok) {
		throw new Error(`Failed to load simulation.wasm: ${response.status} ${response.statusText}`.trim());
	}

	const result = await WebAssembly.instantiateStreaming(response, { env: { memory: wasmMemory } });
	return result.instance.exports as unknown as SimulationExports;
}

function initializeSimulation(msg: InitializeMessage): void {
	ensureSufficientMemory();

	const nodes = new Float32Array(wasmMemory!.buffer);
	const links = new Int32Array(wasmMemory!.buffer);
	const linkBase = nodeCount * 6;   // link array starts at byte nodeCount*24 = int32 nodeCount*6

	for (let i = 0; i < nodeCount; i++) {
		nodes[6 * i]     = msg.positions[2 * i]!;       	// x
		nodes[6 * i + 1] = msg.positions[2 * i + 1]!;   	// y
		nodes[6 * i + 2] = 0;                            	// vx
		nodes[6 * i + 3] = 0;                            	// vy
		nodes[6 * i + 4] = 0;                            	// size/weight
		nodes[6 * i + 5] = msg.colliderRadii[i]!;        	// collider size
	}

	for (let i = 0; i < linkCount; i++) {
		links[linkBase + 3 * i]     = msg.linkSrc[i]!;   	// source index
		links[linkBase + 3 * i + 1] = msg.linkDst[i]!;   	// target index
	}

	wasm!.init(0, nodeCount, linkCount);
}

function applyFixed(): void {
	if (fixed.size !== 0) {
		const nodes = new Float32Array(wasmMemory!.buffer);
		for (const [idx, [x, y]] of fixed) {
			nodes[6 * idx]     = x;		// x
			nodes[6 * idx + 1] = y;		// y
			nodes[6 * idx + 2] = 0;   	// vx - zero velocity so node stays put
			nodes[6 * idx + 3] = 0;		// vy - idem
		}
	}
}

function tick(): void {
	if (!wasm || !running) {
		return;
	}

	applyFixed();

	wasm.simulate(
		0, nodeCount, linkCount,
		alpha, centerStrength, linkStrength, linkDistance,
		repelStrength, theta, collisionStrength,
	);
	wasm.complete(0, nodeCount, velocityDecay);

	// NOTE: re-apply after integration so fixed nodes don't drift one step
	applyFixed();

	const nodes = new Float32Array(wasmMemory!.buffer);
	const data = new Float32Array(nodeCount * 4);
	for (let i = 0; i < nodeCount; i++) {
		data[4 * i]     = nodes[6 * i]!;       // x
		data[4 * i + 1] = nodes[6 * i + 1]!;   // y
		data[4 * i + 2] = nodes[6 * i + 2]!;   // vx
		data[4 * i + 3] = nodes[6 * i + 3]!;   // vy
	}
	(self as unknown as Worker).postMessage({ type: 'tick', data }, [data.buffer]);

	alpha += (alphaTarget - alpha) * alphaDecay;

	if (alpha < alphaMin && alphaTarget <= 0) {
		stopLoop();
		(self as unknown as Worker).postMessage({ type: 'end' });
	}
}

function startLoop(): void {
	if (!running) {
		running = true;
		if (wasm) {
			tick();
			tickInterval = setInterval(tick, WORKER_TICK_INTERVAL_MS);
		}
	}
}

function stopLoop(): void {
	running = false;
	if (tickInterval !== null) {
		clearInterval(tickInterval);
		tickInterval = null;
	}
}

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
	const msg = e.data;
	switch (msg.type) {
		case 'init': {
			stopLoop();
			nodeCount = msg.nodeCount;
			linkCount = msg.linkCount;
			fixed.clear();
			alpha = msg.alpha ?? DEFAULT_ALPHA;

			if (!wasm) {
				loadWasm().then(exports => {
					wasm = exports;
					initializeSimulation(msg);
					if (running) {
						tick();
						tickInterval = setInterval(tick, WORKER_TICK_INTERVAL_MS);
					}
				}).catch(err => {
					(self as unknown as Worker).postMessage({ type: 'error', message: String(err) });
				});
			} else {
				initializeSimulation(msg);
			}
			break;
		}
		case 'forces': {
			if (msg.centerStrength !== undefined) centerStrength = msg.centerStrength;
			if (msg.linkStrength !== undefined) linkStrength = msg.linkStrength;
			if (msg.linkDistance !== undefined) linkDistance = msg.linkDistance;
			if (msg.repelStrength !== undefined) repelStrength = msg.repelStrength;
			if (msg.alphaDecay !== undefined) alphaDecay = msg.alphaDecay;
			if (msg.alphaTarget !== undefined) alphaTarget = msg.alphaTarget;
			if (msg.collisionStrength !== undefined) collisionStrength = msg.collisionStrength;
			if (msg.restartAlpha !== undefined) {
				if (msg.restartAlpha > alpha) {
					alpha = msg.restartAlpha;
				}
				startLoop();
			}
			break;
		}
		case 'colliders': {
			if (!wasm) {
				break;
			}

			const nodes = new Float32Array(wasmMemory!.buffer);
			for (let i = 0; i < nodeCount; i++) {
				nodes[6 * i + 5] = msg.colliderRadii[i]!;
			}
			break;
		}
		case 'fix': {
			if (msg.x === null || msg.y === null) {
				fixed.delete(msg.index);
			} else {
				fixed.set(msg.index, [msg.x, msg.y]);
			}
			break;
		}
		case 'restart': {
			if (msg.alpha !== undefined && msg.alpha > alpha) {
				alpha = msg.alpha;
			}
			startLoop();
			break;
		}
		case 'stop': {
			stopLoop();
			break;
		}
	}
};
