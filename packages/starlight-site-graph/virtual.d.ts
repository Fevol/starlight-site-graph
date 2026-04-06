declare module 'virtual:starlight-site-graph/config' {
	const Config: import('./config').StarlightSiteGraphConfig;
	export default Config;
}

declare module 'virtual:starlight-site-graph/astro-config' {
	const Config: import('astro').AstroConfig;
	export default Config;
}
