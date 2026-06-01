import type { Graph } from '../graph';

export class FullscreenController {
	fullscreenExitHandler?: (options?: boolean | EventListenerOptions) => void;
	private mockGraphContainer!: HTMLElement;
	private dialog!: HTMLDialogElement;
	private fullscreen = false;

	constructor(private context: Graph) {}

	initialize() {
		this.mockGraphContainer = document.createElement('div');
		this.mockGraphContainer.classList.add('sg-graph-container');

		this.dialog = document.createElement('dialog');
		this.dialog.classList.add('sg-fullscreen-dialog', 'sg-graph-component');
		this.context.element.appendChild(this.dialog);

		this.context.graphContainer.onkeyup = event => {
			if (event.key === 'f') {
				this.enable();
			}
		};
	}

	destroy() {
		this.fullscreen = false;

		this.context.element.classList.toggle('sg-fullscreen-active', false);
		this.context.graphContainer.classList.toggle('sg-is-fullscreen', false);
		this.fullscreenExitHandler?.();
		this.context.graphContainer.onkeyup = null;

		if (this.context.graphContainer.parentElement === this.dialog) {
			this.context.element.appendChild(this.context.graphContainer);
		}
		if (this.dialog?.open) {
			this.dialog.close();
		}
		this.mockGraphContainer?.remove();
		this.dialog?.remove();
	}

	get isFullscreen() {
		return this.fullscreen;
	}

	enable() {
		if (this.fullscreen) {
			return;
		}

		this.fullscreen = true;
		this.context.element.classList.toggle('sg-fullscreen-active', true);
		this.context.graphContainer.classList.toggle('sg-is-fullscreen', true);
		this.context.element.append(this.mockGraphContainer);
		this.dialog.appendChild(this.context.graphContainer);

		const onClickOutside = (event: MouseEvent) => {
			if (event.target === this.dialog) {
				this.disable();
			}
		};

		const onDialogClose = () => {
			this.disable();
		}

		this.dialog.addEventListener('click', onClickOutside);
		this.dialog.addEventListener('close', onDialogClose);
		this.dialog.addEventListener('cancel', onDialogClose);
		this.dialog.showModal();

		this.fullscreenExitHandler = () => {
			this.dialog.removeEventListener('click', onClickOutside);
			this.dialog.removeEventListener('close', onDialogClose);
			this.dialog.removeEventListener('cancel', onDialogClose);
			delete this.fullscreenExitHandler;
		};

		this.context.graphContainer.onkeyup = event => {
			if (event.key === 'Escape' || event.key === 'f') {
				this.disable();
			}
		};

		this.syncFullscreenState();
	}

	disable() {
		if (!this.fullscreen) {
			return;
		}

		this.fullscreen = false;
		this.context.element.classList.toggle('sg-fullscreen-active', false);
		this.context.graphContainer.classList.toggle('sg-is-fullscreen', false);
		this.context.element.appendChild(this.context.graphContainer);
		this.mockGraphContainer.remove();
		if (this.dialog.open) {
			this.dialog.close();
		}

		this.fullscreenExitHandler?.();

		this.context.graphContainer.onkeyup = event => {
			if (event.key === 'f') {
				this.enable();
			}
		};

		this.syncFullscreenState();
	}

	syncFullscreenState() {
		this.context.lifecycleController.syncLayout({
			resetZoom: true
		});
	}

}
