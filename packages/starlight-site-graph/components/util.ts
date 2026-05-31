import config from 'virtual:starlight-site-graph/config';

export { deepDiff, mergeDefaults, type DeepDiffResult, type DeepPartial, type DiffValue } from './graph/shared/object';

export { simplifySlug, endsWith, trimSuffix } from '../shared/path';

// NOTE: Function is positioned here to make components/graph as agnostic as possible of Starlight/Astro
export function getVisitedEndpoints(): Set<string> {
	if (config.trackVisitedPages === 'disable') {
		return new Set();
	}

	return new Set(
		JSON.parse(
			(config.trackVisitedPages === 'session' ? sessionStorage : localStorage).getItem(
				'starlight-site-graph--visited-pages',
			) ?? '[]',
		),
	);
}


