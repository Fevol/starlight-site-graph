import type { GraphComponent } from '../graph-component';

export class ViewportController {
	constructor(private context: GraphComponent) {}

	onContainerResize() {
		const { renderer, simulator } = this.context;
		if (!renderer.container) {
			return;
		}

		const { clientWidth: width, clientHeight: height } = renderer.container;

		const sizeChanged = width !== renderer.viewportWidth || height !== renderer.viewportHeight;
		renderer.resize();
		if (!simulator || !sizeChanged || width === 0 || height === 0) {
			return;
		}

		simulator.camera.updateCenterTransform();
		simulator.camera.updateTransform(true);

		simulator.requestGraphDraw();
	}

	syncScale(immediate: boolean) {
		this.context.simulator.camera.scale = this.context.config.scale;
		if (!this.context.simulator.camera.userZoomed) {
			this.resetZoom(immediate);
		} else {
			this.context.simulator.camera.updateZoom(this.context.config.scale, undefined, undefined, immediate);
		}
	}

	syncZoomConstraints(immediate: boolean) {
		if (!this.context.simulator.camera.userZoomed) {
			this.resetZoom(immediate);
		} else {
			this.context.simulator.camera.refreshZoomConstraints(immediate);
		}
	}

	syncLabelOpacity(immediate: boolean) {
		this.context.animationState.setLabelOpacityBase(
			this.context.simulator.camera.getCurrentLabelOpacity(),
			this.context.config,
			immediate,
		);
		this.context.simulator.requestGraphDraw();
	}

	syncLabelVisibility(immediate: boolean) {
		this.context.renderer.syncLabelVisibility(this.context.simulator.nodes);
		this.context.animationState.setLabelsEnabled(this.context.config.renderLabels, this.context.config, immediate);
		for (const node of this.context.simulator.nodes) {
			const display = this.context.renderer.getNodeDisplay(node);
			if (display.visual) {
				display.visual.animating = true;
			}
		}
		this.context.simulator.requestGraphDraw();
	}

	syncTransitions(options: { syncArrowGeometry?: boolean; immediate: boolean }) {
		if (options.syncArrowGeometry) {
			this.context.renderer.syncArrowGeometry(this.context.simulator.links);
		}
		this.context.animationState.syncConfig(this.context.config, options.immediate);
		this.context.simulator.requestGraphDraw();
	}

	resetZoom(immediate = false) {
		this.context.simulator.camera.resetZoom(immediate);
	}
}
