export type GraphColorConfig = {
	nodeColor: string;
	nodeColorHover: string;
	nodeColorMuted: string;

	nodeColorCurrent: string;
	nodeColorVisited: string;

	linkColor: string;
	linkColorHover: string;
	linkColorMuted: string;
};

export function getGraphColors(): GraphColorConfig {
	const style = getComputedStyle(document.body);
	return {
		nodeColor: style.getPropertyValue('--slsg-node-color'),
		nodeColorHover: style.getPropertyValue('--slsg-node-color-hover'),
		nodeColorMuted: style.getPropertyValue('--slsg-node-color-muted'),

		nodeColorCurrent: style.getPropertyValue('--slsg-node-color-current'),
		nodeColorVisited: style.getPropertyValue('--slsg-node-color-visited'),

		linkColor: style.getPropertyValue('--slsg-link-color'),
		linkColorHover: style.getPropertyValue('--slsg-link-color-hover'),
		linkColorMuted: style.getPropertyValue('--slsg-link-color-muted'),
	};
}
