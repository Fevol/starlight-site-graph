declare module 'virtual:starlight-site-graph/config' {
	const Config: import('./config').StarlightSiteGraphConfig;
	export default Config;
}

declare module 'virtual:starlight-site-graph/astro-config' {
	const Config: import('./node_modules/astro/dist/@types/astro.js').AstroConfig;
	export default Config;
}
