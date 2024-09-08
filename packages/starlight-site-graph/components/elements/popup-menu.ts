import { onClickOutside } from '../util';

export function showPopupMenu(container: HTMLElement, contents: HTMLElement[]) {
	const popupMenu = document.createElement('div');
	popupMenu.className = 'popup-menu';

	const popupMenuContent = document.createElement('div');
	popupMenuContent.className = 'popup-menu-content';
	for (const content of contents) {
		popupMenuContent.appendChild(content);
	}

	popupMenu.appendChild(popupMenuContent);
	container.appendChild(popupMenu);

	setTimeout(() => {
		onClickOutside(popupMenu, () => {
			if (container.contains(popupMenu)) container.removeChild(popupMenu);
		});
	});
}
