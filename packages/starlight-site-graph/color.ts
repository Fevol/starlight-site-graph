export type GraphColorConfig = {
	nodeColor: string;
	nodeColorHover: string;
	nodeColorMuted: string;

	nodeColorCurrent: string;
	nodeColorVisited: string;
	nodeColorUnresolved: string;

	linkColor: string;
	linkColorHover: string;
	linkColorMuted: string;

	labelColor: string;
	labelColorHover: string;
	labelColorMuted: string;
};

export function getGraphColors(): GraphColorConfig {
	const style = getComputedStyle(document.body);
	return {
		nodeColor: style.getPropertyValue('--slsg-node-color'),
		nodeColorHover: style.getPropertyValue('--slsg-node-color-hover'),
		nodeColorMuted: style.getPropertyValue('--slsg-node-color-muted'),

		nodeColorCurrent: style.getPropertyValue('--slsg-node-color-current'),
		nodeColorVisited: style.getPropertyValue('--slsg-node-color-visited'),
		nodeColorUnresolved: style.getPropertyValue('--slsg-node-color-unresolved'),

		linkColor: style.getPropertyValue('--slsg-link-color'),
		linkColorHover: style.getPropertyValue('--slsg-link-color-hover'),
		linkColorMuted: style.getPropertyValue('--slsg-link-color-muted'),

		labelColor: style.getPropertyValue('--slsg-label-color'),
		labelColorHover: style.getPropertyValue('--slsg-label-color-hover'),
		labelColorMuted: style.getPropertyValue('--slsg-label-color-muted'),
	};
}
