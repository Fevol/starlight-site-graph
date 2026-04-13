declare module 'astro:prefetch' {
	export function prefetch(url: string): void;
}

declare module '*.astro' {
	const Component: any;
	export default Component;
}

interface Navigator {
	msMaxTouchPoints?: number;
}

interface Window {
	opera?: any;
}
