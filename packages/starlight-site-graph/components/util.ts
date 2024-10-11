import config from 'virtual:starlight-site-graph/config';

export function getVisitedEndpoints(): Set<string> {
	if (!config.trackVisitedPages) return new Set();

	return new Set(
		JSON.parse(
			(config.storageLocation === 'session' ? sessionStorage : localStorage).getItem(
				config.storageKey + 'visited',
			) ?? '[]',
		),
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

export function ensureTrailingSlash(path: string): string {
	return path.endsWith('/') ? path : `${path}/`;
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

export function isMobileDevice() {
	let check = false;
	(function (a) {
		if (
			/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
				a,
			) ||
			/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
				a.substr(0, 4),
			)
		)
			check = true;
	})(navigator.userAgent || navigator.vendor || window.opera);
	return check;
}

export function hasTouch() {
	return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}

export function deepDiff(obj1: any, obj2: any): any {
	const changes: any = {};

	function compareValues(key: string, value1: any, value2: any) {
		if (typeof value1 === 'object' && typeof value2 === 'object') {
			const nestedDiff = deepDiff(value1, value2);
			if (Object.keys(nestedDiff).length > 0) {
				changes[key] = nestedDiff;
			}
		} else if (value1 !== value2) {
			changes[key] = { oldValue: value1, newValue: value2 };
		}
	}

	const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

	for (const key of allKeys) {
		const value1 = obj1[key];
		const value2 = obj2[key];

		// Check if key exists in both objects
		if (key in obj1 && !(key in obj2)) {
			changes[key] = { oldValue: value1, newValue: undefined };
		} else if (!(key in obj1) && key in obj2) {
			changes[key] = { oldValue: undefined, newValue: value2 };
		} else {
			compareValues(key, value1, value2);
		}
	}

	return changes;
}
