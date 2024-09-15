import config from 'virtual:starlight-site-graph/config';
import { generateSitemap, randomlyLinkNodes } from './generationUtil.ts';

export const baseConfig = config.graphConfig;
export const frozenConfig = {
	...baseConfig,
	depth: 8,
	enablePan: false,
	enableZoom: false,
	enableDrag: false,
	enableClick: "disable",
	prefetchPages: false,
	actions: []
}
export const focusSingleNode = {
	...frozenConfig,
	scale: 3,
	nodeCurrentStyle: {},
	renderLabels: false,
}



export const singleNodeSitemap = generateSitemap([{ name: 'node' }]);

export const twoNodeSitemap = generateSitemap([{ name: 'node' }, { name: 'other-node', config: config.graphConfig.nodeDefaultStyle }]);

export const fourtyNodeSitemap = generateSitemap([{ name: 'node' }, ...Array.from({ length: 39 }, (_, i) => ({ name: `node${i + 1}`, config: config.graphConfig.nodeDefaultStyle }))]);

export const starNodeSitemap = generateSitemap([{ name: 'node', backlinks: Array.from({ length: 6 }, (_, i) => `node${i + 1}/`) }, ...Array.from({ length: 6 }, (_, i) => ({ name: `node${i + 1}`, config: config.graphConfig.nodeDefaultStyle, links: ["node/"] }))]);

export const randomNodeSitemap = randomlyLinkNodes([{ name: 'node', connectPct: 0.8 }, ...Array.from({ length: 19 }, (_, i) => ({ name: `node${i + 1}`, config: config.graphConfig.nodeDefaultStyle }))], 0.05);
