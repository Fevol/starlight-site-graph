/**
 * Create an element, set its class, optionally fill its text/HTML, and append it to a parent.
 * Centralizes the create → className → content → appendChild pattern used across the UI.
 */
export function el<K extends keyof HTMLElementTagNameMap>(
	tag: K,
	className: string,
	options: { parent?: HTMLElement; text?: string; html?: string } = {},
): HTMLElementTagNameMap[K] {
	const element = document.createElement(tag);
	if (className) {
		element.className = className;
	}
	if (options.text !== undefined) {
		element.innerText = options.text;
	}
	if (options.html !== undefined) {
		// NOTE: html is only ever package-defined (icons/menus), so this cannot be used for user-provided content and is not vulnerable to XSS.
		// TODO: Use setHTML when it is baseline
		element.innerHTML = options.html;
	}
	options.parent?.appendChild(element);
	return element;
}
