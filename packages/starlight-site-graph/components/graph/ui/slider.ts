import { el } from './dom';

export function createValueSlider(
	label: string,
	value: number,
	min: number,
	max: number,
	step: number,
	onChange: (value: number) => void,
) {
	const container = el('div', 'slsg-value-slider');

	const textContainer = el('div', 'slsg-value-slider-text', { parent: container });
	el('span', 'slsg-value-slider-label', { parent: textContainer, text: label });
	const valueElement = el('span', 'slsg-value-slider-value', { parent: textContainer, text: value.toString() });

	const slider = el('input', '', { parent: container });
	slider.type = 'range';
	slider.min = min.toString();
	slider.max = max.toString();
	slider.step = step.toString();
	slider.value = value.toString();
	slider.oninput = () => {
		valueElement.innerText = slider.value;
		onChange(parseFloat(slider.value));
	};

	return container;
}
