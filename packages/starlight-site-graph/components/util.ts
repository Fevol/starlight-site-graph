import config from 'virtual:starlight-site-graph/config';

export function getVisitedEndpoints(): Set<string> {
	return new Set(
		JSON.parse(
			(config.storageLocation === 'session' ? sessionStorage : localStorage).getItem(
				config.storageKey + 'visited',
			) ?? '[]',
		),
	);
}

export function addToVisitedEndpoints(slug: string) {
	const visited = getVisitedEndpoints();
	visited.add(slug);
	(config.storageLocation === 'session' ? sessionStorage : localStorage).setItem(
		config.storageKey + 'visited',
		JSON.stringify([...visited]),
	);
}

export function simplifySlug(fp: string): string {
	const res = stripSlashes(trimSuffix(fp, 'index'), true);
	return res.length === 0 ? '/' : res;
}

export function endsWith(s: string, suffix: string): boolean {
	return s === suffix || s.endsWith('/' + suffix);
}

export function trimSuffix(s: string, suffix: string): string {
	if (endsWith(s, suffix)) s = s.slice(0, -suffix.length);
	return s;
}

export function stripSlashes(s: string, onlyStripPrefix?: boolean): string {
	if (s.startsWith('/')) s = s.substring(1);
	if (!onlyStripPrefix && s.endsWith('/')) s = s.slice(0, -1);
	return s;
}

export function onClickOutside(target: HTMLElement, callback: () => void) {
	function handleClickOutside(event: MouseEvent) {
		if (!target.contains(event.target as HTMLElement)) {
			callback();
			document.removeEventListener('click', handleClickOutside);
		}
	}
	document.addEventListener('click', handleClickOutside);
	return document.removeEventListener.bind(document, 'click', handleClickOutside as EventListener);
}

export function ensureLeadingSlash(path: string): string {
	return path.startsWith('/') ? path : `/${path}`;
}

export function getRelativePath(current: string, next: string) {
	const currentSegments = current.split('/');
	const nextSegments = next.split('/');
	const common = currentSegments.reduce((acc, cur, i) => (cur === nextSegments[i] ? i : acc), 0);
	const back = currentSegments.length - common;
	let forward = nextSegments.slice(common).join('/');
	if (!forward.endsWith('/') && !forward.includes('#')) forward += '/';
	return `${'../'.repeat(back)}${forward}`;
}

export function createValueSlider(
	label: string,
	value: number,
	min: number,
	max: number,
	step: number,
	onChange: (value: number) => void,
) {
	const container = document.createElement('div');
	container.className = 'value-slider';

	const textContainer = document.createElement('div');
	textContainer.className = 'value-slider-text';

	const labelElement = document.createElement('span');
	labelElement.className = 'value-slider-label';
	labelElement.innerText = label;
	textContainer.appendChild(labelElement);

	const valueElement = document.createElement('span');
	valueElement.className = 'value-slider-value';
	valueElement.innerText = value.toString();
	textContainer.appendChild(valueElement);

	const slider = document.createElement('input');
	slider.type = 'range';
	slider.min = min.toString();
	slider.max = max.toString();
	slider.step = step.toString();
	slider.value = value.toString();
	slider.oninput = () => {
		valueElement.innerText = slider.value;
		onChange(parseFloat(slider.value));
	};

	container.appendChild(textContainer);
	container.appendChild(slider);

	return container;
}
