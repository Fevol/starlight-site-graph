import config from 'virtual:starlight-site-graph/config';
import { generateRandomSitemap, generateSitemap } from './generationUtil.ts';

export const baseConfig = config.graphConfig;
export const maxDepthConfig = {
	...baseConfig,
	depth: 8,
}

export const frozenConfig = {
	...maxDepthConfig,
	enablePan: false,
	enableZoom: false,
	enableDrag: false,
	enableClick: "disable",
	prefetchPages: false,
	actions: []
}

export const largeFrozenSitemapConfig = {
	...frozenConfig,
	scale: 0.55,
}

export const focusSingleNode = {
	...frozenConfig,
	scale: 3,
	nodeCurrentStyle: {},
	renderLabels: false,
}



export const singleNodeSitemap = generateSitemap([{ id: 'node' }]);

export const twoNodeSitemap = generateSitemap([{ id: 'node' }, { id: 'other-node', nodeStyle: config.graphConfig.nodeDefaultStyle }]);

export const threeNodeSitemap = generateSitemap([{ id: 'node', links: ['other-node'] }, { id: 'other-node', links: ['another-node'] }, { id: 'another-node', links: ['node'] }]);

export const fourtyNodeSitemap = generateSitemap([{ id: 'node' }, ...Array.from({ length: 39 }, (_, i) => ({ id: `node${i + 1}`, nodeStyle: config.graphConfig.nodeDefaultStyle }))]);

export const starNodeSitemap = generateSitemap([{ id: 'node', backlinks: Array.from({ length: 6 }, (_, i) => `node${i + 1}/`) }, ...Array.from({ length: 6 }, (_, i) => ({ id: `node${i + 1}`, nodeStyle: config.graphConfig.nodeDefaultStyle, links: ["node/"] }))]);

export const randomNodeSitemap = generateRandomSitemap([{ id: 'node', connectPct: 0.2 }], 19, 0.15, 0.1, 0.1);

export const largeRandomNodeSitemap = generateRandomSitemap([{ id: 'node', connectPct: 0.15 }], 49, 0.025, 0, 0);

export const specialNodeSitemap = generateSitemap([{ id: 'node', links: ['basic-node', 'external-node', 'unresolved-node'] }, { id: 'basic-node' }, { id: 'external-node', external: true }, { id: 'unresolved-node', exists: false } ]);
