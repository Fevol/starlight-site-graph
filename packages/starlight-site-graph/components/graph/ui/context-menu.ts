import type { MenuItem } from './types';

import { el } from './dom';

export function attachContextMenu(element: HTMLElement, items: MenuItem[]) {
	function onContextMenu(event: MouseEvent) {
		openContextMenu(event, element, items);
	}

	element.addEventListener('contextmenu', onContextMenu);
	return () => element.removeEventListener('contextmenu', onContextMenu);
}

function openContextMenu(e: MouseEvent, element: HTMLElement, items: MenuItem[]) {
	e.preventDefault();
	for (const menu of document.querySelectorAll('.sg-menu-container')) {
		menu.dispatchEvent(new Event('slsg-remove-menu'));
	}

	const menuContainer = el('nav', 'sg-menu-container');

	function removeMenu() {
		window.removeEventListener('click', removeMenu);
		menuContainer.removeEventListener('slsg-remove-menu', removeMenu);
		menuContainer.remove();
	}

	menuContainer.addEventListener('slsg-remove-menu', removeMenu);
	window.addEventListener('click', removeMenu);

	const menu = el('div', 'sg-menu', { parent: menuContainer });

	const groupedItems = Object.groupBy(items, ({ group }) => group || '');
	for (const [key, group] of Object.entries(groupedItems)) {
		if (key !== '') {
			el('div', 'sg-menu-separator', { parent: menu });
		}

		for (const item of group!) {
			const menuItem = el('div', 'sg-menu-item', { parent: menu });
			menuItem.onclick = e => {
				item.onClick();
				e.stopPropagation();
				removeMenu();
			};

			if (item.icon) {
				el('div', 'sg-menu-item-icon', { parent: menuItem, html: item.icon });
			}

			el('div', 'sg-menu-item-title', { parent: menuItem, text: item.text });
		}
	}

	const menuRoot = element.closest('dialog[open]') ?? document.body;
	menuRoot.appendChild(menuContainer);

	const browserWidth = window.innerWidth, browserHeight = window.innerHeight;
	const menuWidth = menu.offsetWidth, menuHeight = menu.offsetHeight;

	menuContainer.style.left = e.clientX - (browserWidth - e.clientX < menuWidth ? menuWidth : 0) + 'px';
	menuContainer.style.top = e.clientY - (browserHeight - e.clientY < menuHeight ? menuHeight : 0) + 'px';
}
