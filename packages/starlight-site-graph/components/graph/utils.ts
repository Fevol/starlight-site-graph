import type { LinkData, NodeData } from './types';

export function getNodeId(node: string | Pick<NodeData, 'id'>) {
	return typeof node === 'string' ? node : node.id;
}

export function computeLinkKey(link: Pick<LinkData, 'source' | 'target'> & { key?: string | undefined }) {
	return (link.key ??= `${getNodeId(link.source)}->${getNodeId(link.target)}`);
}

export function indexBy<T, K>(items: Iterable<T>, getKey: (item: T) => K) {
	const map = new Map<K, T>();
	for (const item of items) {
		map.set(getKey(item), item);
	}
	return map;
}

export function getNodeIds(nodes: Iterable<NodeData>) {
	return indexBy(nodes, node => node.id);
}

export function keySet<T>(items: Iterable<T>, getKey: (item: T) => string) {
	const keys = new Set<string>();
	for (const item of items) {
		keys.add(getKey(item));
	}
	return keys;
}

export function syncOptionalProperties<T extends object, K extends keyof T>(target: T, source: T, keys: K[]) {
	for (const key of keys) {
		if (source[key] === undefined) {
			delete target[key];
		} else {
			target[key] = source[key];
		}
	}
}
