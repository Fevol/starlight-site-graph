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
 * Detect if Dark Reader or similar color-modifying extension is active
 */
function isDarkReaderActive(): boolean {
	// Dark Reader adds data attributes or meta tags
	return !!(
		document.querySelector('meta[name="darkreader"]') ||
		document.documentElement.hasAttribute('data-darkreader-mode') ||
		document.documentElement.hasAttribute('data-darkreader-scheme')
	);
}

/**
 * Validate and sanitize color value before parsing
 * @param color Raw color value from CSS
 * @returns Sanitized color string or null if invalid
 */
function sanitizeColorValue(color: string): string | null {
	if (!color || typeof color !== 'string') {
		return null;
	}

	const trimmed = color.trim();

	// Empty or whitespace-only
	if (trimmed.length === 0) {
		return null;
	}

	// Dark Reader may inject values like "rgba(0, 0, 0, 0) !important" or nested var()
	// Remove !important flags
	const cleaned = trimmed.replace(/\s*!important\s*$/i, '');

	// Check for nested CSS variables (Dark Reader issue)
	// If it contains var(), try to resolve or reject
	if (cleaned.includes('var(')) {
		// Cannot safely resolve nested vars, reject
		return null;
	}

	// Reject obviously invalid values
	if (cleaned === 'none' || cleaned === 'transparent' || cleaned === 'inherit' || cleaned === 'initial' || cleaned === 'unset') {
		// These are valid CSS but might not parse well in context
		if (cleaned === 'transparent') {
			return 'rgba(0, 0, 0, 0)'; // chroma can handle this
		}
		return null;
	}

	return cleaned;
}

/**
 * Retrieve a HEX color value from a CSS variable
 * @param color The CSS variable value
 * @param fallback Optional fallback color (defaults to #000000)
 * @returns HEX color string
 */
function getHexColor(color: string, fallback: string = '#000000'): string {
	const sanitized = sanitizeColorValue(color);

	if (!sanitized) {
		return fallback;
	}

	let hex_color: string;
	try {
		hex_color = chroma(sanitized).hex();
	} catch (e) {
		// Log detailed error for debugging
		if (isDarkReaderActive()) {
			console.warn(
				`[STARLIGHT-SITE-GRAPH] Color parsing failed (Dark Reader detected). ` +
				`Original value: "${color}", Sanitized: "${sanitized}". ` +
				`Using fallback: ${fallback}`
			);
		} else {
			console.warn(
				`[STARLIGHT-SITE-GRAPH] Invalid color value: "${color}". ` +
				`Using fallback: ${fallback}. Error: ${e instanceof Error ? e.message : e}`
			);
		}
		hex_color = fallback;
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



/**
 * Default color fallbacks for different color types
 */
const COLOR_FALLBACKS: Record<string, string> = {
	'backgroundColor': '#ffffff',
	'nodeColor': '#4a9eff',
	'nodeColorHover': '#2d7dd2',
	'nodeColorAdjacent': '#80c0ff',
	'nodeColorMuted': '#cccccc',
	'nodeColorCurrent': '#ff6b6b',
	'nodeColorVisited': '#a66eff',
	'nodeColorUnresolved': '#ff9f43',
	'nodeColorExternal': '#4ecdc4',
	'nodeColorTag': '#95e1d3',
	'linkColor': '#888888',
	'linkColorHover': '#555555',
	'linkColorMuted': '#dddddd',
	'labelColor': '#333333',
	'labelColorHover': '#000000',
	'labelColorMuted': '#999999',
};

export function getGraphColors(node: HTMLElement, included_colors: string[], custom_color_map: Record<string, string>): GraphColorConfig {
	const style = getComputedStyle(node);
	const colors: GraphColorConfig = {};

	// Detect Dark Reader once at the start
	const darkReaderDetected = isDarkReaderActive();
	if (darkReaderDetected) {
		console.info(
			'[STARLIGHT-SITE-GRAPH] Dark Reader extension detected. ' +
			'Using enhanced color parsing with fallbacks to ensure graph renders correctly.'
		);
	}

	const all_colors = [
		'nodeColorHover', 'nodeColorAdjacent', 'nodeColorMuted',
		'linkColorHover', 'linkColorMuted',
		'linkColorHover', 'linkColorMuted',
		...included_colors
	];

	for (const identifier of all_colors) {
		// Get appropriate fallback color
		const fallback = COLOR_FALLBACKS[identifier] || '#000000';

		let color = cssVariablesMap[identifier as keyof typeof cssVariablesMap];
		if (color) {
			colors[identifier] = getHexColor(style.getPropertyValue(color), fallback);
		} else {
			color = custom_color_map[identifier]!;
			if (color.startsWith("--")) {
				const cssPropertyValue = style.getPropertyValue(color);
				if (cssPropertyValue) {
					colors[identifier] = getHexColor(cssPropertyValue, fallback);
				} else {
					console.warn(`[STARLIGHT-SITE-GRAPH] CSS variable "${color}" was not found on the graph element. Falling back to ${fallback}.`);
					colors[identifier] = fallback;
				}
			} else {
				colors[identifier] = getHexColor(color, fallback);
			}
		}
	}

	return colors;
}
