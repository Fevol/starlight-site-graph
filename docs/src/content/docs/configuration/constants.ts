import config from 'virtual:starlight-site-graph/config';
import { generateRandomSitemap, generateSitemap, overrideConfig } from './generationUtil.ts';

export const baseConfig = {
	"graphConfig": {
		"actions": [],
		"tagStyles": {},
		"tagRenderMode": "none",
		"enableDrag": false,
		"enableZoom": false,
		"enablePan": false,
		"enableHover": true,
		"enableClick": "disable",
		"depth": 1,
		"depthDirection": "both",
		"followLink": "same",
		"scale": 1.1,
		"minZoom": 0.05,
		"maxZoom": 4,
		"renderLabels": true,
		"renderArrows": true,
		"renderUnresolved": false,
		"renderExternal": true,
		"scaleLinks": true,
		"scaleArrows": true,
		"minZoomArrows": 0.8,
		"labelOpacityScale": 1.3,
		"labelMutedOpacity": 0,
		"labelHoverOpacity": 1,
		"labelAdjacentOpacity": 1,
		"labelFontSize": 12,
		"labelHoverScale": 1,
		"labelOffset": 10,
		"labelHoverOffset": 14,
		"zoomDuration": 75,
		"zoomEase": "out_quad",
		"hoverDuration": 200,
		"hoverEase": "out_quad",
		"nodeDefaultStyle": {
			"shape": "circle",
			"shapeColor": "nodeColor",
			"shapeSize": 10,
			"strokeWidth": 0,
			"colliderScale": 1,
			"nodeScale": 1,
			"neighborScale": 0.5
		},
		"nodeVisitedStyle": {
			"shapeColor": "nodeColorVisited"
		},
		"nodeCurrentStyle": {
			"shapeColor": "nodeColorCurrent"
		},
		"nodeUnresolvedStyle": {
			"shapeColor": "nodeColorUnresolved"
		},
		"nodeExternalStyle": {
			"shape": "square",
			"shapeColor": "nodeColorExternal",
			"strokeColor": "inherit",
			"nodeScale": 0.6
		},
		"tagDefaultStyle": {
			"shape": "circle",
			"shapeSize": 6,
			"shapeColor": "backgroundColor",
			"strokeColor": "nodeColorTag",
			"strokeWidth": 1,
			"colliderScale": 1,
			"nodeScale": 1,
			"neighborScale": 0.7
		},
		"linkWidth": 1,
		"linkHoverWidth": 1,
		"arrowSize": 5,
		"arrowAngle": 0.5235987755982988,
		"centerForce": 0.05,
		"colliderPadding": 20,
		"repelForce": 200,
		"linkDistance": 0,
		"alphaDecay": 0.0228,
		"visibilityRules": [
			"**/*"
		],
		"prefetchPages": false
	},
	"sitemapConfig": {},
	"backlinksConfig": {}
};

export const maxDepthConfig = overrideConfig(baseConfig, { graphConfig: { depth: 8 } });

export const frozenConfig = overrideConfig(baseConfig, {
	graphConfig: {
		enablePan: false,
		enableZoom: false,
		enableDrag: false,
		enableClick: "disable",
		prefetchPages: false,
		actions: []
	}
});

export const zoomedOutConfig = overrideConfig(frozenConfig, {
	graphConfig: {
		scale: 1.2,
		labelOpacityScale: 2,
	}
});

export const nonInteractiveConfig = overrideConfig(frozenConfig, {
	graphConfig: {
		enableHover: false,
	}
});

export const largeFrozenSitemapConfig = overrideConfig(frozenConfig, {
	graphConfig: {
		scale: 0.55,
		enableHover: false,
		depth: 5,
		renderLabels: false,
	}
});

export const focusSingleNode = overrideConfig(frozenConfig, {
	graphConfig: {
		scale: 3,
		nodeCurrentStyle: {
			shapeColor: "nodeColor",
		},
		renderLabels: false,
		centerForce: 0.001,
	}
});

export const focusSingleNodeWithLabels = overrideConfig(frozenConfig, {
	graphConfig: {
		scale: 1.8,
		renderLabels: true,
	}
});


export const singleNodeSitemap = generateSitemap([{ id: 'node' }]);

export const myPageNodeSitemap = generateSitemap([{ id: 'my-page' }]);

export const twoNodeSitemap = generateSitemap([{ id: 'node' }, { id: 'other-node', nodeStyle: config.graphConfig.nodeDefaultStyle }]);

export const threeNodeSitemap = generateSitemap([{ id: 'node', links: ['other-node'] }, { id: 'other-node', links: ['another-node'] }, { id: 'another-node', links: ['node'] }]);

export const fourNodeSitemap  = generateSitemap([{ id: 'node', links: ['other-node'], tags: ["Tag"] }, { id: 'other-node', links: ['another-node'] }, { id: 'another-node', links: ['node'] }]);

export const twoTagSitemap = generateSitemap([{ id: 'node', tags: ['Tag 1', 'Tag 2'], links: ['other-node'] }, { id: 'other-node', tags: ['Tag 1'] }, { id: 'another-node', tags: ['Tag 2', 'Tag 1'] }]);

export const fourtyNodeSitemap = generateSitemap([{ id: 'node' }, ...Array.from({ length: 39 }, (_, i) => ({ id: `node${i + 1}`, nodeStyle: config.graphConfig.nodeDefaultStyle }))]);

export const starNodeSitemap = generateSitemap([{ id: 'node', backlinks: Array.from({ length: 6 }, (_, i) => `node${i + 1}/`) }, ...Array.from({ length: 6 }, (_, i) => ({ id: `node${i + 1}`, links: ["node/"] }))]);

export const randomNodeSitemap = generateRandomSitemap([{ id: 'node', connectPct: 0.2 }], 19, 0.15, 0.1, 0.1);

export const largeRandomNodeSitemap = generateRandomSitemap([{ id: 'node', connectPct: 0.15 }], 49, 0.025, 0, 0, 0.01);

export const specialNodeSitemap = generateSitemap([{ id: 'node', links: ['basic-node', 'external-node', 'unresolved-node'] }, { id: 'basic-node' }, { id: 'external-node', external: true }, { id: 'unresolved-node', exists: false } ]);

export const exampleSitemap = generateSitemap([{ id: 'node', links: ['custom-node', 'external'], tags: ['Tag'] }, { id: 'custom-node', nodeStyle: { shapeColor: "nodeColor3" } }, { id: 'external', external: true }]);

export const nameExampleSitemap = generateSitemap([{ id: 'node', links: ['https://astro.build/']}, { id: 'https://astro.build/', title: "showcase", external: true} ]);

export const styleRulesExampleSitemap = generateSitemap([{ id: 'node', title: 'node/', links: ['dir/a' ] }, { id: 'dir/a', title: "dir/a/" }, { id: 'dir/b', title: "dir/b/", links: ['dir/a', 'dir/node'] }, { id: 'dir/node', title: "dir/node/" }]);

export const directoryLinkExampleSitemap = generateSitemap([{ id: 'my-page', links: ['another-page/', 'dir/my-page'] }, { id: 'another-page/' }, { id: 'dir/my-page', title: "Dir Page" }]);

export const directoriesExampleSitemap = generateSitemap([{ id: '1', title: '/1/' }, { id: '2', title: '/2/' }, { id: 'a/1', title: '/a/1/' }, { id: 'a/x/1', title: '/a/x/1/' }, { id: 'a/x/2', title: '/a/x/2/' }, { id: 'a/y/1', title: '/a/y/1/' }]);

export const stylesDropdown = (styleType: string, style: object, selected?: string, partial: boolean = true) => {
	const partial_object = partial ? {} : nodeDefaultStyleConfig;
	const style_obj = {
		[styleType]: {
			"Default Node": { graphConfig: { [styleType]: partial_object }},
			"Current Node": { graphConfig: { [styleType]: { ...partial_object, ...nodeCurrentStylePartialConfig } }},
			"Visited Node": { graphConfig: { [styleType]: { ...partial_object, ...nodeVisitedStylePartialConfig } }},
			"External Node": { graphConfig: { [styleType]: { ...partial_object, ...nodeExternalStylePartialConfig } }},
			"Unresolved Node": { graphConfig: { [styleType]: { ...partial_object, ...nodeUnresolvedStylePartialConfig } }},
			"Default Tag": { graphConfig: { [styleType]: { ...partial_object, ...tagDefaultStylesPartialConfig } }},
			"Large Node":  { graphConfig: { [styleType]: { ...partial_object, shapeSize: 20 } }},
			"Red Color":  { graphConfig: { [styleType]: { ...partial_object, shapeColor: "nodeColor1" } }},
			"Yellow Star": { graphConfig: { [styleType]: { ...partial_object, shape: "star", shapePoints: 5, shapeColor: "nodeColor3", shapeCornerRadius: "20%", cornerType: "round" } }},
			"Rounded Square": { graphConfig: { [styleType]: { ...partial_object, shape: "square", shapeCornerRadius: "40%", cornerType: "round" } }},
			"Hollow Circle": { graphConfig: { [styleType]: { ...partial_object, shape: "circle", strokeWidth: 4, shapeColor: "backgroundColor", strokeColor: "nodeColor" } }},
			"Hollow Hexagon": { graphConfig: { [styleType]: { ...partial_object, shape: "polygon", shapePoints: 6, strokeWidth: 8, shapeColor: "backgroundColor", strokeColor: "nodeColor" } }},
			"Beveled Triangle": { graphConfig: { [styleType]: { ...partial_object, shape: "triangle", shapeCornerRadius: "40%", cornerType: "bevel" } }},
		}
	};
	for (const key in style_obj[styleType]) {
		// @ts-expect-error I don't really want to fix these typings
		style_obj[styleType][key]["graphConfig"][styleType] = { ...style, ...style_obj[styleType][key]["graphConfig"][styleType] };
	}
	if (selected) {
		// @ts-expect-error See above
		style_obj[styleType][selected]["graphConfig"][styleType].selected = true;
	}

	return style_obj;
}

export const graphColors = [
	"nodeColor",
	"--my-custom-color", "#2bf4b6",
	"nodeColorVisited", "nodeColorCurrent", "nodeColorUnresolved", "nodeColorExternal", "nodeColorTag",
	"nodeColor1", "nodeColor2", "nodeColor3", "nodeColor4", "nodeColor5", "nodeColor6", "nodeColor7", "nodeColor8", "nodeColor9",
	"linkColor", "backgroundColor",
];

export const nodeColorsDropdown = (nodeCategories: string[], type: string, values: string[]) => {
	const output: any = {};
	for (const value of values) {
		output[value] = { graphConfig: { } };
		for (const category of nodeCategories) {
			output[value]["graphConfig"][category] = { [type]: value };
		}
	}

	return output;
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
