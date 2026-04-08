import { z } from 'astro/zod';

const KWD_COLOR = [
	'inherit',
	'backgroundColor', 'nodeColor', 'nodeColorVisited', 'nodeColorCurrent', 'nodeColorUnresolved', 'nodeColorExternal', 'nodeColorTag',
	'nodeColor1', 'nodeColor2', 'nodeColor3', 'nodeColor4', 'nodeColor5', 'nodeColor6', 'nodeColor7', 'nodeColor8', 'nodeColor9',
	'linkColor',
] as const;
const KWD_NODE_SHAPE = ['circle', 'square', 'triangle', 'polygon', 'star'] as const;
const KWD_NODE_CORNER_TYPE = ['normal', 'round', 'bevel'] as const;

const validColors = z.union([
	z.enum(KWD_COLOR),
	z.string().refine(val => val.match(/^#([0-9A-Fa-f]{3}){1,2}$|^--?[_a-zA-Z]+[_a-zA-Z0-9-]*$/), {
		message: 'Invalid color format, expected a hex color (e.g. #RRGGBB) or a CSS variable (e.g. --my-color)',
	})
]);

const percentageSchema = z.union([z.number().min(0, "Shape corner radius may not be negative"), z.string()
	.refine(val => val.match(/^\d+\.?\d?\d?%?$/), {
		message: 'Invalid percentage format, expected a string in the format "XX%"',
	})
	.refine((s) => parseFloat(s) >= 0 && parseFloat(s) <= 100, {
		message: 'Invalid percentage value, expected a number between 0 and 100',
	})]
)

const nodeShapeTypes = z.enum(KWD_NODE_SHAPE);
export type NodeShapeType = z.infer<typeof nodeShapeTypes>;
type NodeColorType = z.infer<typeof validColors>;

export const nodeStyleSchema = z.object({
	/**
	 * Shape of the node in the graph
	 * - `circle`: Circular shape
	 * - `square`: Square shape (`polygon` with `shapePoints` set to 4)
	 * - `triangle`: Triangle shape (`polygon` with `shapePoints` set to 3)
	 * - `polygon`: Regular polygon shape (with `shapePoints` vertices)
	 * - `star`: Regular star 2n-polygon shape (with `shapePoints` spikes)
	 *
	 * @default "circle"
	 */
	shape: nodeShapeTypes.optional(),
	/**
	 * Size of the node in the graph, further scaled by `linkScale`
	 *
	 * @default 10
	 */
	shapeSize: z.number().gt(0, "Shape size may not be zero or negative").optional(),
	/**
	 * Color of the node shape in the graph, overridden if the node is visited, current, or unresolved
	 * If set to `'stroke'`, the color will be taken from the stroke color, if it exists, otherwise defaults to `nodeColor`
	 *
	 * @default "nodeColor"
	 */
	shapeColor: validColors.or(z.literal('stroke')).optional(),
	/**
	 * Number of points for `polygon` or `star` shapes
	 *
	 * @optional
	 */
	shapePoints: z.number().min(2, "The number of points for the shape may not be smaller than 2").optional(),
	/**
	 * Rotation of the polygon or star shape in degrees. \
	 * If set to `'random'`, the shape will be rotated randomly.
	 *
	 * @optional
	 */
	shapeRotation: z.union([z.number(), z.literal('random')]).optional(),
	/**
	 * Radius of the shape (and, if not specified, stroke corners); does not affect circle shapes \
	 * A number will be parsed as the radius of the corner in pts (clamped to `shapeWidth`). \
	 * A string (e.g. `'17.648%'`) will be parsed as the radius of the corner relative to the shape size.
	 *
	 * @remarks High values of `shapeCornerRadius` will result in link connections not being rendered correctly
	 * @optional
	 */
	shapeCornerRadius: percentageSchema.optional(),

	/**
	 * Type of corner for the shape and stroke
	 * - `normal`: Normal corners
	 * - `round`: Rounded corners
	 * - `bevel`: Beveled corners
	 *
	 * @optional
	 */
	cornerType: z.enum(KWD_NODE_CORNER_TYPE).optional(),

	/**
	 * Stroke width of the node in the graph
	 *
	 * @default 0
	 */
	strokeWidth: z.number().min(0).optional(),
	/**
	 * Stroke color of the node in the graph
	 * If none is specified, the stroke color will be the same as the shape color
	 *
	 * @optional
	 */
	strokeColor: validColors.or(z.literal('inherit')).optional(),
	/**
	 * Radius of the stroke corners; does not affect circle shapes \
	 * A number will be parsed as the radius of the corner in pts (clamped to `shapeWidth`). \
	 * A string (e.g. `'17.648%'`) will be parsed as the radius of the corner relative to the shape size.
	 *
	 * @remarks High values of `shapeCornerRadius` will result in link connections not being rendered correctly
	 * @optional
	 */
	strokeCornerRadius: percentageSchema.optional(),

	/**
	 * Scale of the shape collider user for collision forces
	 * A value higher than 1 will make the collider larger than the shape
	 *
	 * @default 1
	 */
	colliderScale: z.number().min(0).optional(),
	/**
	 * Scale factor for the node size.
	 *
	 * @default 1
	 */
	nodeScale: z.number().min(0).optional(),
	/**
	 * Scale strength of the node based on the number of neighbors (incoming and outgoing links). \
	 * When set to 0, the node size will not be affected by the number of neighbors.
	 *
	 * @default 0.5
	 */
	neighborScale: z.number().min(0).optional(),
});

export type NodeStyle = z.infer<typeof nodeStyleSchema>;

export const nodeDefaultStyle = {
	shape: "circle" as NodeShapeType,
	shapeColor: "nodeColor" as NodeColorType,
	shapeSize: 6,
	strokeWidth: 0,
	colliderScale: 1,
	nodeScale: 1,
	neighborScale: 0.5
}

export const nodeVisitedStyle = { shapeColor: "nodeColorVisited" as NodeColorType };

export const nodeCurrentStyle = { shapeColor: "nodeColorCurrent" as NodeColorType };

export const nodeUnresolvedStyle = { shapeColor: "nodeColorUnresolved" as NodeColorType };

export const nodeExternalStyle = {
	shape: "square" as NodeShapeType,
	shapeColor: "nodeColorExternal" as NodeColorType,
	strokeColor: "inherit" as NodeColorType,
	nodeScale: 0.8
};

export const tagDefaultStyle = {
	shape: 'circle' as NodeShapeType,
	shapeSize: 6,
	shapeColor: 'backgroundColor' as NodeColorType,
	strokeColor: "nodeColorTag"	as NodeColorType,
	strokeWidth: 1,
	colliderScale: 1,
	nodeScale: 1,
	neighborScale: 0.7
}
