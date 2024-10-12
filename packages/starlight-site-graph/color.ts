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

export function getGraphColors(node: HTMLElement): GraphColorConfig {
	const style = getComputedStyle(document.body);
	const nodeStyle = getComputedStyle(node);
	return {
		backgroundColor: nodeStyle.getPropertyValue('--slsg-graph-bg-color'),

		nodeColor: style.getPropertyValue('--slsg-node-color'),
		nodeColorHover: style.getPropertyValue('--slsg-node-color-hover'),
		nodeColorAdjacent: style.getPropertyValue('--slsg-node-color-adjacent'),
		nodeColorMuted: style.getPropertyValue('--slsg-node-color-muted'),

		nodeColorCurrent: style.getPropertyValue('--slsg-node-color-current'),
		nodeColorVisited: style.getPropertyValue('--slsg-node-color-visited'),
		nodeColorUnresolved: style.getPropertyValue('--slsg-node-color-unresolved'),
		nodeColorExternal: style.getPropertyValue('--slsg-node-color-external'),
		nodeColorTag: style.getPropertyValue('--slsg-node-color-tag'),
		nodeColor1: style.getPropertyValue('--slsg-node-color-1'),
		nodeColor2: style.getPropertyValue('--slsg-node-color-2'),
		nodeColor3: style.getPropertyValue('--slsg-node-color-3'),
		nodeColor4: style.getPropertyValue('--slsg-node-color-4'),
		nodeColor5: style.getPropertyValue('--slsg-node-color-5'),
		nodeColor6: style.getPropertyValue('--slsg-node-color-6'),
		nodeColor7: style.getPropertyValue('--slsg-node-color-7'),
		nodeColor8: style.getPropertyValue('--slsg-node-color-8'),
		nodeColor9: style.getPropertyValue('--slsg-node-color-9'),

		linkColor: style.getPropertyValue('--slsg-link-color'),
		linkColorHover: style.getPropertyValue('--slsg-link-color-hover'),
		linkColorMuted: style.getPropertyValue('--slsg-link-color-muted'),

		labelColor: style.getPropertyValue('--slsg-label-color'),
		labelColorHover: style.getPropertyValue('--slsg-label-color-hover'),
		labelColorMuted: style.getPropertyValue('--slsg-label-color-muted'),
	};
}
