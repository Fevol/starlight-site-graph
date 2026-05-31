import type { GraphConfig, NodeStyle } from './config/types';
import type { GraphColorConfig } from './color';

export type NodeVisualRole = 'default' | 'hovered' | 'adjacent' | 'muted';
export type NodeVisualStyles = Record<NodeVisualRole, NodeStyle>;
export type LinkVisualRole = 'default' | 'hovered' | 'muted';

export interface GraphHostHooks {
	onNodeHover?(node: NodeData): void;
	onNodeUnhover?(): void;
	onNodeClick?(node: NodeData, event: MouseEvent): void;
}

type GraphNodeSimulationData = {
	x?: number | undefined;
	y?: number | undefined;
	vx?: number | undefined;
	vy?: number | undefined;
	fx?: number | null | undefined;
	fy?: number | null | undefined;
	index?: number | undefined;
};

export type NodeData = GraphNodeSimulationData &
	Partial<NodeStyle> & {
		id: string;
		exists: boolean;
		external: boolean;
		text?: string | undefined;
		tags?: string[] | undefined;
		type?: 'node' | 'tag' | undefined;
		adjacent: Set<string>;
		sizeMultiplier?: number | undefined;
		depthDistance?: number | undefined;
		visibleInGraph?: boolean | undefined;
		computedSize?: number | undefined;
		colliderSize?: number | undefined;
		fullRadius?: number | undefined;
		visualStates: NodeVisualStyles;
	};

export type LinkData = {
	source: NodeData;
	target: NodeData;
	key?: string | undefined;
	depthDistance?: number | undefined;
	visibleInGraph?: boolean | undefined;
};

export type GraphData = {
	nodes: NodeData[];
	links: LinkData[];
	colors: GraphColorConfig;
};

export type ConfigKey = keyof GraphConfig;

export type GraphAction = GraphConfig['actions'][number];
export type NumericConfigKey = {
	[K in keyof GraphConfig]: GraphConfig[K] extends number ? K : never;
}[keyof GraphConfig];
export type BooleanConfigKey = Exclude<{
	[K in keyof GraphConfig]: boolean extends GraphConfig[K] ? K : never;
}[keyof GraphConfig], undefined>;

export type GraphConfigChangeEventDetail = {
	config: GraphConfig;
};
