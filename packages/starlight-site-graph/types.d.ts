export interface SitemapEntry {
    exists: boolean;
    title: string;
    content: string;
    links: string[];
    backlinks: string[];
    tags: string[];
}

export type Sitemap = Record<string, SitemapEntry>;
