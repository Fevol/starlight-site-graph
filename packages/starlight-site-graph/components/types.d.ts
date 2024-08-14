import { Container, Graphics, Text } from 'pixi.js';
import * as d3 from 'd3';

type ContentDetails = {
	title: string;
	links: string[];
	backlinks: string[];
	tags: string[];
	content: string;
	richContent?: string;
	date?: Date;
	description?: string;
};

type NodeData = {
	id: string;
	tags: string[];
	node?: Graphics;
	text?: string;
	label?: Text;
	arrowHead?: Graphics;
	neighborCount?: number;
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

	nodeOpacity: number;
	nodeOpacityHover: number;

	linkColor: string;
	linkColorHover: string;
	linkOpacity: number;
	linkOpacityHover: number;

	labelOpacity: number;
	labelOpacityHover: number;
	labelOffset: number;
}
