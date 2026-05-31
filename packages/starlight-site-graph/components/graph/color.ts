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
 * A mapping of color identifiers to their corresponding CSS variable names.
 * Represents the default set of colors available.
 */
export const cssVariablesMap = {
	'backgroundColor': '--sg-graph-bg-color',

	'nodeColor': '--sg-node-color',
	'nodeColorHover': '--sg-node-color-hover',
	'nodeColorAdjacent': '--sg-node-color-adjacent',
	'nodeColorMuted': '--sg-node-color-muted',

	'nodeColorCurrent': '--sg-node-color-current',
	'nodeColorVisited': '--sg-node-color-visited',
	'nodeColorUnresolved': '--sg-node-color-unresolved',
	'nodeColorExternal': '--sg-node-color-external',
	'nodeColorTag': '--sg-node-color-tag',
	'nodeColor1': '--sg-node-color-1',
	'nodeColor2': '--sg-node-color-2',
	'nodeColor3': '--sg-node-color-3',
	'nodeColor4': '--sg-node-color-4',
	'nodeColor5': '--sg-node-color-5',
	'nodeColor6': '--sg-node-color-6',
	'nodeColor7': '--sg-node-color-7',
	'nodeColor8': '--sg-node-color-8',
	'nodeColor9': '--sg-node-color-9',

	'linkColor': '--sg-link-color',
	'linkColorHover': '--sg-link-color-hover',
	'linkColorMuted': '--sg-link-color-muted',

	'labelColor': '--sg-label-color',
	'labelColorHover': '--sg-label-color-hover',
	'labelColorMuted': '--sg-label-color-muted',
}

export function createGraphColorSources(): GraphColorConfig {
	return Object.fromEntries(
		Object.keys(cssVariablesMap).map(identifier => [identifier, identifier]),
	) as GraphColorConfig;
}

/**
 * Retrieve a HEX color value from a color property string
 * @param color - The CSS color property value
 */
function getHexColor(color: string): string {
	let hexColor: string;
	try {
		hexColor = chroma(color.trim()).hex();
	} catch (e) {
		hexColor = '#000000';
	}

	return hexColor;
}

/**
 * Extract graph-related colors from the computed styles of the provided node
 * Uses predefined CSS variables and direct custom color values from one color source object.
 * @param node - A HTML element from which to extract the computed styles and colors; the closest to the graph container is recommended.
 * @param colorSources - A mapping of color identifiers to a CSS variable identifier, CSS variable name, or direct color value.
 */
export function getGraphColors(node: HTMLElement, colorSources: GraphColorConfig): GraphColorConfig {
	const style = getComputedStyle(node);
	const colors: GraphColorConfig = {};

	for (const [identifier, source] of Object.entries(colorSources)) {
		const cssVariable = cssVariablesMap[source as keyof typeof cssVariablesMap];
		if (cssVariable) {
			colors[identifier] = getHexColor(style.getPropertyValue(cssVariable));
			continue;
		}

		if (source.startsWith("--")) {
			const cssPropertyValue = style.getPropertyValue(source);
			if (cssPropertyValue) {
				colors[identifier] = getHexColor(cssPropertyValue);
			} else {
				console.warn(`[STARLIGHT-SITE-GRAPH] CSS variable "${source}" was not found on the graph element. Falling back to black (#000000).`);
				colors[identifier] = '#000000';
			}
			continue;
		}

		colors[identifier] = getHexColor(source);
	}

	return colors;
}
