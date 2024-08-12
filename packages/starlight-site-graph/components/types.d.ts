import {Container, Text} from "pixi.js";
import * as d3 from "d3";

type ContentDetails = {
    title: string
    links: string[]
    backlinks: string[]
    tags: string[]
    content: string
    richContent?: string
    date?: Date
    description?: string
}

type NodeData = {
    id: string
    tags: string[]
    node?: Container;
    text?: string;
    label?: Text;
} & d3.SimulationNodeDatum

type LinkData = {
    source: NodeData
    target: NodeData
}

interface AnimatedValues {
    zoom: number;
    zoomX: number;
    zoomY: number;

    hoveredNodeColor: string;
    unhoveredNodeColor: string;
    hoveredNodeOpacity: number;
    unhoveredNodeOpacity: number;

    hoveredLinkColor: string;
    unhoveredLinkColor: string;
    hoveredLinkOpacity: number;
    unhoveredLinkOpacity: number;

    hoveredLabelOpacity: number;
    unhoveredLabelOpacity: number;
    hoveredLabelOffset: number;
}
