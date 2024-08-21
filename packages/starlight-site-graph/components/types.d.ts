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
	currentNodeColor: string;
	currentNodeColorHover: string;
	visitedNodeColor: string;
	visitedNodeColorHover: string;
	unresolvedNodeColor: string;
	unresolvedNodeColorHover: string;

	linkColor: string;
	linkColorHover: string;

	labelOpacity: number;
	labelOpacityHover: number;
	labelOffset: number;
	labelColorHover: string;
}
