import * as PIXI from './pixi/pixi';
import * as d3 from 'd3';

type NodeData = {
	id: string;
	exists: boolean;
	node?: PIXI.Graphics;
	text?: string;
	tags?: string[];
	label?: PIXI.Text;
	arrowHead?: PIXI.Graphics;
	neighborCount?: number;
	size?: number;
} & d3.SimulationNodeDatum;

type LinkData = {
	source: NodeData;
	target: NodeData;
};

interface AnimatedValues {
	zoom: number;
	transformX: number;
	transformY: number;

	nodeColor: string;
	nodeColorHover: string;
	nodeColorCurrent: string;
	nodeColorCurrentHover: string;
	nodeColorVisited: string;
	nodeColorVisitedHover: string;
	nodeColorUnresolved: string;
	nodeColorUnresolvedHover: string;

	linkColor: string;
	linkColorHover: string;

	labelOpacity: number;
	labelOpacityHover: number;
	labelOffset: number;

	labelColor: string;
	labelColorHover: string;
}
