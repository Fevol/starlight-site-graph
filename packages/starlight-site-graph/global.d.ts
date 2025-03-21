declare module 'astro:prefetch' {
	export function prefetch(url: string): void;
}

interface Navigator {
	msMaxTouchPoints?: number;
}

interface Window {
	opera?: any;
}
