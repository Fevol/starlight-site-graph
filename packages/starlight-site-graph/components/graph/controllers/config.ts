import type { ConfigKey, GraphConfigChangeEventDetail } from '../types';
import type { GraphConfig } from '../config/types';
import type { GraphComponent } from '../graph-component';

import { defaultGraphConfig } from '../config/defaults';
import { normalizeLegacyLabelConfig, normalizeRandomRotation } from '../config/normalize';
import { mergeDefaults, isObject } from '../shared/object';

import {
	ACTION_UI_KEYS,
	CONFIG_CHANGE_EVENT,
	CONFIG_CHANGE_EVENT_DELAY_MS,
	MAX_DEPTH,
	SIMULATION_CONFIG_RESTART_ALPHA,
	INTERACTION_KEYS, KNOWN_CONFIG_KEYS, LABEL_OPACITY_KEYS,
	SIMULATION_UPDATE_KEYS, STYLE_REFRESH_KEYS, TOPOLOGY_REFRESH_KEYS,
	TRANSITION_SYNC_KEYS, VISUAL_RENDER_KEYS, ZOOM_CONSTRAINT_KEYS,
} from '../constants';


function includesAny(keys: ConfigKey[], candidates: Set<ConfigKey>) {
	return keys.some(key => candidates.has(key));
}

export class ConfigController {
	private configChangeTimeout: number | undefined;

	constructor(private context: GraphComponent) {}

	initialize(serializedConfig?: string) {
		const rawConfig = this.parse(serializedConfig);
		normalizeLegacyLabelConfig(rawConfig);
		normalizeRandomRotation(rawConfig);

		const config = this.validate(mergeDefaults(defaultGraphConfig, rawConfig));
		const context = this.context;

		this.context.config = new Proxy(config, {
			set(target, prop, value) {
				const previousConfig = structuredClone({ ...target }) as GraphConfig;
				(target as unknown as Record<PropertyKey, unknown>)[prop] = value;
				context.configController.onChange(previousConfig);
				return true;
			},
		});
	}

	onAttributeChange() {
		this.cancelConfigChange();
		const previousConfig = structuredClone({ ...this.context.config }) as GraphConfig;
		this.initialize(this.context.dataset['config']);
		this.onChange(previousConfig);
	}

	onChange(previousConfig: GraphConfig) {
		const changedKeys = this.getChangedKeys(previousConfig);
		if (changedKeys.length === 0) {
			return;
		} else if (changedKeys.some(key => !KNOWN_CONFIG_KEYS.has(key))) {
			return this.context.lifecycleController.rebuildGraph();
		}

		const immediate = !this.context.config.smoothTransitions;

		if (includesAny(changedKeys, TOPOLOGY_REFRESH_KEYS) && !this.context.topologyController.refreshTopology()) {
			return this.context.lifecycleController.rebuildGraph();
		}

		if (includesAny(changedKeys, STYLE_REFRESH_KEYS) && !this.context.topologyController.refreshStyles()) {
			return this.context.lifecycleController.rebuildGraph();
		}

		if (changedKeys.includes('colliderPadding')) {
			this.context.simulator.updateColliders({ alpha: SIMULATION_CONFIG_RESTART_ALPHA });
		} else if (includesAny(changedKeys, SIMULATION_UPDATE_KEYS)) {
			this.context.simulator.update({ alpha: SIMULATION_CONFIG_RESTART_ALPHA });
		}

		if (includesAny(changedKeys, LABEL_OPACITY_KEYS)) {
			this.context.viewportController.syncLabelOpacity(immediate);
		}

		if (changedKeys.includes('scale')) {
			this.context.viewportController.syncScale(immediate);
		}

		if (includesAny(changedKeys, ZOOM_CONSTRAINT_KEYS)) {
			this.context.viewportController.syncZoomConstraints(immediate);
		}

		if (includesAny(changedKeys, INTERACTION_KEYS)) {
			this.context.enableClick = this.context.config.enableClick !== 'disable';
			this.context.simulator.refreshInteractions();
		}

		if (changedKeys.includes('renderLabels')) {
			this.context.viewportController.syncLabelVisibility(immediate);
		}

		if (includesAny(changedKeys, VISUAL_RENDER_KEYS)) {
			normalizeLegacyLabelConfig(this.context.config);
			if (!this.context.topologyController.refreshStyles()) {
				return this.context.lifecycleController.rebuildGraph();
			}
		}

		if (includesAny(changedKeys, TRANSITION_SYNC_KEYS)) {
			this.context.viewportController.syncTransitions({
				syncArrowGeometry: changedKeys.includes('arrowAngle'),
				immediate,
			});
		}

		if (includesAny(changedKeys, ACTION_UI_KEYS)) {
			this.context.lifecycleController.renderActions();
		}

		this.emitConfigChange(includesAny(changedKeys, SIMULATION_UPDATE_KEYS));
	}

	getChangedKeys(previousConfig: GraphConfig): ConfigKey[] {
		const nextConfig = this.context.config;
		const keys = new Set<ConfigKey>([
			...(Object.keys(previousConfig) as ConfigKey[]),
			...(Object.keys(nextConfig) as ConfigKey[]),
		]);
		return [...keys].filter(key => !this.configValueEquals(previousConfig[key], nextConfig[key]));
	}

	private emitConfigChange(debounce: boolean) {
		this.cancelConfigChange();
		if (debounce) {
			this.configChangeTimeout = window.setTimeout(() => this.dispatchConfigChange(), CONFIG_CHANGE_EVENT_DELAY_MS);
			return;
		}

		this.dispatchConfigChange();
	}

	private dispatchConfigChange() {
		this.configChangeTimeout = undefined;
		this.context.dispatchEvent(new CustomEvent<GraphConfigChangeEventDetail>(CONFIG_CHANGE_EVENT, {
			detail: { config: structuredClone({ ...this.context.config }) },
		}));
	}

	private cancelConfigChange() {
		if (this.configChangeTimeout !== undefined) {
			window.clearTimeout(this.configChangeTimeout);
			this.configChangeTimeout = undefined;
		}
	}

	private validate(config: GraphConfig) {
		config.depth = config.depth < 0 || config.depth >= MAX_DEPTH ? MAX_DEPTH - 1 : config.depth;
		return config;
	}

	private parse(serializedConfig?: string): Partial<GraphConfig> {
		try {
			const parsed = JSON.parse(serializedConfig || '{}');
			return isObject(parsed) ? (parsed as Partial<GraphConfig>) : {};
		} catch (e) {
			console.error('[STARLIGHT-SITE-GRAPH] ' + (e instanceof Error ? e.message : e));
			return {};
		}
	}

	private configValueEquals(left: unknown, right: unknown): boolean {
		if (Array.isArray(left) && Array.isArray(right)) {
			return left.length === right.length && left.every((value, index) => this.configValueEquals(value, right[index]));
		}

		else if (isObject(left) && isObject(right)) {
			const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
			for (const key of keys) {
				if (!this.configValueEquals(left[key], right[key])) {
					return false;
				}
			}
			return true;
		}

		else {
			return Object.is(left, right);
		}
	}
}
