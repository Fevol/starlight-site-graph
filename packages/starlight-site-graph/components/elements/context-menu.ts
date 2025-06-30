interface MenuItem {
	group?: string;
	text: string;
	icon?: string;
	onClick: () => void;
}

let active_menu: HTMLElement | null = null;

function removeMenu() {
	if (active_menu) {
		document.body.removeChild(active_menu);
		active_menu = null;
	}
}

window.addEventListener('click', removeMenu);

export function showContextMenu(e: MouseEvent, items: MenuItem[]) {
	e.preventDefault();
	removeMenu();

	const menu_container = document.createElement('nav');
	menu_container.className = 'slsg-menu-container';

	const menu = document.createElement('div');
	menu.className = 'slsg-menu';
	menu_container.appendChild(menu);

	const groupedItems = Object.groupBy(items, ({ group }) => group || '');
	for (const [key, group] of Object.entries(groupedItems)) {
		if (key !== '') {
			const menuSeparator = document.createElement('div');
			menuSeparator.className = 'slsg-menu-separator';
			menu.appendChild(menuSeparator);
		}

		for (const item of group!) {
			const menuItem = document.createElement('div');
			menuItem.className = 'slsg-menu-item';
			menuItem.onclick = e => {
				item.onClick();
				e.stopPropagation();
				window.removeEventListener('click', removeMenu);
				removeMenu();
			};

			if (item.icon) {
				const menuIcon = document.createElement('div');
				menuIcon.className = 'slsg-menu-item-icon';
				menuIcon.innerHTML = item.icon;
				menuItem.appendChild(menuIcon);
			}

			const menuTitle = document.createElement('div');
			menuTitle.className = 'slsg-menu-item-title';
			menuTitle.innerText = item.text;
			menuItem.appendChild(menuTitle);

			menu.appendChild(menuItem);
		}
	}

	document.body.appendChild(menu_container);

	let x = e.clientX,
		y = e.clientY;
	let browser_w = window.innerWidth,
		browser_h = window.innerHeight;
	let menu_w = menu.offsetWidth,
		menu_h = menu.offsetHeight;
	if (browser_h - y < menu_h) y = y - menu_h;
	if (browser_w - x < menu_w) x = x - menu_w;

	menu_container.style.left = x + 'px';
	menu_container.style.top = y + 'px';

	active_menu = menu_container;
}
