import chroma from 'chroma-js';

export type GraphColorConfig = {
	backgroundColor: string;

	nodeColor: string;
	nodeColorHover: string;
	nodeColorAdjacent: string;
	nodeColorMuted: string;

	nodeColorCurrent: string;
	nodeColorVisited: string;
	nodeColorUnresolved: string;
	nodeColorExternal: string;
	nodeColorTag: string;

	nodeColor1: string;
	nodeColor2: string;
	nodeColor3: string;
	nodeColor4: string;
	nodeColor5: string;
	nodeColor6: string;
	nodeColor7: string;
	nodeColor8: string;
	nodeColor9: string;

	linkColor: string;
	linkColorHover: string;
	linkColorMuted: string;

	labelColor: string;
	labelColorHover: string;
	labelColorMuted: string;
};

function getStyleColorProperty(style: CSSStyleDeclaration, property: string): string {
	return chroma(style.getPropertyValue(property)).hex();
}

export function getGraphColors(node: HTMLElement): GraphColorConfig {
	const style = getComputedStyle(node);
	return {
		backgroundColor: getStyleColorProperty(style, '--slsg-graph-bg-color'),

		nodeColor: getStyleColorProperty(style, '--slsg-node-color'),
		nodeColorHover: getStyleColorProperty(style, '--slsg-node-color-hover'),
		nodeColorAdjacent: getStyleColorProperty(style, '--slsg-node-color-adjacent'),
		nodeColorMuted: getStyleColorProperty(style, '--slsg-node-color-muted'),

		nodeColorCurrent: getStyleColorProperty(style, '--slsg-node-color-current'),
		nodeColorVisited: getStyleColorProperty(style, '--slsg-node-color-visited'),
		nodeColorUnresolved: getStyleColorProperty(style, '--slsg-node-color-unresolved'),
		nodeColorExternal: getStyleColorProperty(style, '--slsg-node-color-external'),
		nodeColorTag: getStyleColorProperty(style, '--slsg-node-color-tag'),
		nodeColor1: getStyleColorProperty(style, '--slsg-node-color-1'),
		nodeColor2: getStyleColorProperty(style, '--slsg-node-color-2'),
		nodeColor3: getStyleColorProperty(style, '--slsg-node-color-3'),
		nodeColor4: getStyleColorProperty(style, '--slsg-node-color-4'),
		nodeColor5: getStyleColorProperty(style, '--slsg-node-color-5'),
		nodeColor6: getStyleColorProperty(style, '--slsg-node-color-6'),
		nodeColor7: getStyleColorProperty(style, '--slsg-node-color-7'),
		nodeColor8: getStyleColorProperty(style, '--slsg-node-color-8'),
		nodeColor9: getStyleColorProperty(style, '--slsg-node-color-9'),

		linkColor: getStyleColorProperty(style, '--slsg-link-color'),
		linkColorHover: getStyleColorProperty(style, '--slsg-link-color-hover'),
		linkColorMuted: getStyleColorProperty(style, '--slsg-link-color-muted'),

		labelColor: getStyleColorProperty(style, '--slsg-label-color'),
		labelColorHover: getStyleColorProperty(style, '--slsg-label-color-hover'),
		labelColorMuted: getStyleColorProperty(style, '--slsg-label-color-muted'),
	};
}
