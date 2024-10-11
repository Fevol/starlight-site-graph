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

export const nonInteractiveConfig = {
	...frozenConfig,
	enableHover: false,
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
	centerForce: 0.001,
}



export const singleNodeSitemap = generateSitemap([{ id: 'node' }]);

export const twoNodeSitemap = generateSitemap([{ id: 'node' }, { id: 'other-node', nodeStyle: config.graphConfig.nodeDefaultStyle }]);

export const threeNodeSitemap = generateSitemap([{ id: 'node', links: ['other-node'] }, { id: 'other-node', links: ['another-node'] }, { id: 'another-node', links: ['node'] }]);

export const fourNodeSitemap  = generateSitemap([{ id: 'node', links: ['other-node'], tags: ["Tag"] }, { id: 'other-node', links: ['another-node'] }, { id: 'another-node', links: ['node'] }]);


export const fourtyNodeSitemap = generateSitemap([{ id: 'node' }, ...Array.from({ length: 39 }, (_, i) => ({ id: `node${i + 1}`, nodeStyle: config.graphConfig.nodeDefaultStyle }))]);

export const starNodeSitemap = generateSitemap([{ id: 'node', backlinks: Array.from({ length: 6 }, (_, i) => `node${i + 1}/`) }, ...Array.from({ length: 6 }, (_, i) => ({ id: `node${i + 1}`, nodeStyle: config.graphConfig.nodeDefaultStyle, links: ["node/"] }))]);

export const randomNodeSitemap = generateRandomSitemap([{ id: 'node', connectPct: 0.2 }], 19, 0.15, 0.1, 0.1);

export const largeRandomNodeSitemap = generateRandomSitemap([{ id: 'node', connectPct: 0.15 }], 49, 0.025, 0, 0);

export const specialNodeSitemap = generateSitemap([{ id: 'node', links: ['basic-node', 'external-node', 'unresolved-node'] }, { id: 'basic-node' }, { id: 'external-node', external: true }, { id: 'unresolved-node', exists: false } ]);


export const stylesDropdown = (styleType: string, style: object, selected?: string) => {
	const style_obj = {
		[styleType]: {
			"Default Node": { [styleType]: nodeDefaultStyleConfig },
			"Current Node": { [styleType]: nodeCurrentStylePartialConfig },
			"Visited Node": { [styleType]: nodeVisitedStylePartialConfig },
			"External Node": { [styleType]: nodeExternalStylePartialConfig },
			"Unresolved Node": { [styleType]: nodeUnresolvedStylePartialConfig },
			"Default Tag": { [styleType]: tagDefaultStylesPartialConfig },
			"Red Color":  { [styleType]: { shapeColor: "nodeColor1" } },
			"Yellow Star": { [styleType]: { shape: "star", shapePoints: 5, shapeColor: "nodeColor3", shapeCornerRadius: "20%", cornerType: "round" } },
			"Rounded Square": { [styleType]: { shape: "square", shapeCornerRadius: "40%", cornerType: "round" } },
			"Hollow Circle": { [styleType]: { shape: "circle", strokeWidth: 4, shapeColor: "backgroundColor", strokeColor: "nodeColor" } },
			"Hollow Hexagon": { [styleType]: { shape: "polygon", shapePoints: 6, strokeWidth: 8, shapeColor: "backgroundColor", strokeColor: "nodeColor" } },
			"Beveled Triangle": { [styleType]: { shape: "triangle", shapeCornerRadius: "40%", cornerType: "bevel" } },
		}
	};
	for (const key in style_obj[styleType]) {
		style_obj[styleType][key][styleType] = { ...style, ...style_obj[styleType][key][styleType] };
	}
	if (selected) {
		style_obj[styleType][selected][styleType].selected = true;
	}

	return style_obj;
}

export const nodeDefaultStyleConfig = {
	shape: "circle",
	shapePoints: 0,
	shapeSize: 10,
	shapeColor: "nodeColor",
	shapeRotation: 0,
	shapeCornerRadius: "0%",

	strokeWidth: 0,
	strokeColor: "inherit",
	strokeCornerRadius: "0%",

	cornerType: "normal",

	colliderScale: 1,
	nodeScale: 1,
	neighborScale: 1,
};

export const nodeCurrentStylePartialConfig = {
	shapeColor: "nodeColorCurrent"
};

export const nodeVisitedStylePartialConfig = {
	shapeColor: "nodeColorVisited"
};

export const nodeExternalStylePartialConfig = {
	shape: "square",
	shapeColor: "nodeColorExternal",
	strokeColor: "inherit",
	nodeScale: 0.8,
};

export const nodeUnresolvedStylePartialConfig = {
	shapeColor: "nodeColorUnresolved",
};

export const tagDefaultStylesPartialConfig = {
	shape: 'circle',
	shapeSize: 6,
	shapeColor: 'backgroundColor',
	strokeColor: "nodeColorTag",
	strokeWidth: 1,
	colliderScale: 1,
	nodeScale: 1,
	neighborScale: 0.7
};


export const nodeVisitedStyleConfig = { ...nodeDefaultStyleConfig, ...nodeVisitedStylePartialConfig };
export const nodeExternalStyleConfig = { ...nodeDefaultStyleConfig, ...nodeExternalStylePartialConfig };
export const tagDefaultStylesConfig = { ...nodeDefaultStyleConfig, ...tagDefaultStylesPartialConfig };
export const nodeCurrentStyleConfig = { ...nodeDefaultStyleConfig, ...nodeCurrentStylePartialConfig };
export const nodeUnresolvedStyleConfig = { ...nodeDefaultStyleConfig, ...nodeUnresolvedStylePartialConfig };
