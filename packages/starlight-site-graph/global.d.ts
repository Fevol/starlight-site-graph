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

declare namespace App {
	interface Locals {
		t: (key: string) => string;
		starlightRoute?: {
			entry?: {
				id?: string;
				data?: {
					backlinks?: any;
					graph?: any;
					[key: string]: any;
				};
			};
		};
	}
}
