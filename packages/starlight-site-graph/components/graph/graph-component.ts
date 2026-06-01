import type { GraphHostHooks } from './types';

import { Graph } from './graph';
import { parseConfig } from './controllers/config';
import { parseSitemap } from './topology/topology';

export class GraphComponent extends HTMLElement {
	private graph: Graph | undefined;
	private observer: MutationObserver | undefined;

	connectedCallback() {
		if (this.graph) {
			return;
		}

		this.graph = new Graph(this, {
			config: parseConfig(this.dataset['config']),
			sitemap: parseSitemap(this.dataset['sitemap']),
			currentPage: this.dataset['slug'] || location.pathname,
			debug: this.dataset['debug'] === 'true',
			trailingSlashes: this.dataset['trailingSlashes'] === 'true',
		});

		this.observer = new MutationObserver(mutations => {
			for (const mutation of mutations) {
				if (mutation.attributeName === 'data-config') {
					this.graph?.replaceConfig(parseConfig(this.dataset['config']));
				}
				if (mutation.attributeName === 'data-sitemap') {
					this.graph?.setSitemap(parseSitemap(this.dataset['sitemap']));
				}
			}
		});
		this.observer.observe(this, { attributes: true });
	}

	disconnectedCallback() {
		this.observer?.disconnect();
		this.observer = undefined;
		this.graph?.destroy();
		this.graph = undefined;
	}

	setHooks(hooks: Partial<GraphHostHooks>) {
		this.graph?.setHooks(hooks);
	}
}
