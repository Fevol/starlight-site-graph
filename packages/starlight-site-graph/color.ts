import chroma from 'chroma-js';

export type GraphColorConfig = Partial<{
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
}> & Record<string, string>;

/**
 * Retrieve a HEX color value from a CSS variable
 * @param color The CSS variable value
 */
function getHexColor(color: string): string {
	let hex_color: string;
	try {
		hex_color = chroma(color.trim()).hex();
	} catch (e) {
		hex_color = '#000000';
	}

	return hex_color;
}

export const cssVariablesMap = {
	'backgroundColor': '--slsg-graph-bg-color',

	'nodeColor': '--slsg-node-color',
	'nodeColorHover': '--slsg-node-color-hover',
	'nodeColorAdjacent': '--slsg-node-color-adjacent',
	'nodeColorMuted': '--slsg-node-color-muted',

	'nodeColorCurrent': '--slsg-node-color-current',
	'nodeColorVisited': '--slsg-node-color-visited',
	'nodeColorUnresolved': '--slsg-node-color-unresolved',
	'nodeColorExternal': '--slsg-node-color-external',
	'nodeColorTag': '--slsg-node-color-tag',
	'nodeColor1': '--slsg-node-color-1',
	'nodeColor2': '--slsg-node-color-2',
	'nodeColor3': '--slsg-node-color-3',
	'nodeColor4': '--slsg-node-color-4',
	'nodeColor5': '--slsg-node-color-5',
	'nodeColor6': '--slsg-node-color-6',
	'nodeColor7': '--slsg-node-color-7',
	'nodeColor8': '--slsg-node-color-8',
	'nodeColor9': '--slsg-node-color-9',

	'linkColor': '--slsg-link-color',
	'linkColorHover': '--slsg-link-color-hover',
	'linkColorMuted': '--slsg-link-color-muted',

	'labelColor': '--slsg-label-color',
	'labelColorHover': '--slsg-label-color-hover',
	'labelColorMuted': '--slsg-label-color-muted',
}



export function getGraphColors(node: HTMLElement, included_colors: string[], custom_color_map: Record<string, string>): GraphColorConfig {
	const style = getComputedStyle(node);
	const colors: GraphColorConfig = {};

	const all_colors = [
		'nodeColorHover', 'nodeColorAdjacent', 'nodeColorMuted',
		'linkColorHover', 'linkColorMuted',
		'linkColorHover', 'linkColorMuted',
		...included_colors
	];

	for (const identifier of all_colors) {
		let color = cssVariablesMap[identifier as keyof typeof cssVariablesMap];
		if (color) {
			colors[identifier] = getHexColor(style.getPropertyValue(color));
		} else {
			color = custom_color_map[identifier]!;
			if (color.startsWith("--")) {
				const cssPropertyValue = style.getPropertyValue(color);
				if (cssPropertyValue) {
					colors[identifier] = getHexColor(cssPropertyValue);
				} else {
					console.warn(`[STARLIGHT-SITE-GRAPH] CSS variable "${cssPropertyValue}" was not found on the graph element. Falling back to black (#000000).`);
					colors[identifier] = '#000000';
				}
			} else {
				colors[identifier] = getHexColor(color);
			}
		}
	}

	return colors;
}
