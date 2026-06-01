import { el } from './dom';

export function showPopupMenu(container: HTMLElement, contents: HTMLElement[], onRemove?: () => void) {
	const popupMenu = el('div', 'sg-popup-menu');
	let removed = false;
	let listenerTimeout: number | undefined;

	function onClickOutside(event: MouseEvent) {
		if (!popupMenu.contains(event.target as HTMLElement)) {
			removePopupMenu();
		}
	}

	function removePopupMenu() {
		if (!removed) {
			removed = true;
			if (listenerTimeout !== undefined) {
				window.clearTimeout(listenerTimeout);
			}
			document.removeEventListener('click', onClickOutside);
			popupMenu.remove();
			onRemove?.();
		}
	}

	const popupMenuContent = el('div', 'sg-popup-menu-content', { parent: popupMenu });
	for (const content of contents) {
		popupMenuContent.appendChild(content);
	}

	container.appendChild(popupMenu);

	listenerTimeout = window.setTimeout(() => {
		document.addEventListener('click', onClickOutside);
	});

	return removePopupMenu;
}
