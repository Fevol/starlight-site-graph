import type { NodeStyle } from './config';

export interface SitemapEntry {
	external: boolean;
	exists: boolean;
	title: string;
	links: string[];
	backlinks: string[];
	tags: string[];
	nodeStyle?: Partial<NodeStyle>;
}

export type Sitemap = Record<string, SitemapEntry>;
