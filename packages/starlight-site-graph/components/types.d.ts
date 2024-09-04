import * as PIXI from './pixi/pixi';
import * as d3 from 'd3';
import type { NodeStyle } from '../config';

type NodeData = {
	id: string;
	exists: boolean;
	node?: PIXI.Graphics;
	stroke?: PIXI.Graphics;
	text?: string;
	tags?: string[];
	label?: PIXI.Text;
	arrowHead?: PIXI.Graphics;
	neighborCount?: number;
	type?: "node" | "tag";
	computedSize?: number;
	colliderSize?: number;
	fullRadius?: number;
} & d3.SimulationNodeDatum & Partial<NodeStyle>;

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
	nodeColorTag: string;
	nodeColorTagHover: string;

	nodeColor1: string;
	nodeColor1Hover: string;
	nodeColor2: string;
	nodeColor2Hover: string;
	nodeColor3: string;
	nodeColor3Hover: string;
	nodeColor4: string;
	nodeColor4Hover: string;
	nodeColor5: string;
	nodeColor5Hover: string;
	nodeColor6: string;
	nodeColor6Hover: string;
	nodeColor7: string;
	nodeColor7Hover: string;
	nodeColor8: string;
	nodeColor8Hover: string;
	nodeColor9: string;
	nodeColor9Hover: string;

	linkColor: string;
	linkColorHover: string;

	labelOpacity: number;
	labelOpacityHover: number;
	labelOffset: number;

	labelColor: string;
	labelColorHover: string;
}
