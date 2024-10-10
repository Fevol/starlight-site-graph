import minimize from '../../assets/svgs/minimize.svg?raw';
import maximize from '../../assets/svgs/maximize.svg?raw';
import graph0 from '../../assets/svgs/graph-0.svg?raw';
import graph1 from '../../assets/svgs/graph-1.svg?raw';
import graph2 from '../../assets/svgs/graph-2.svg?raw';
import graph3 from '../../assets/svgs/graph-3.svg?raw';
import graph4 from '../../assets/svgs/graph-4.svg?raw';
import graph5 from '../../assets/svgs/graph-5.svg?raw';
import focus from '../../assets/svgs/focus.svg?raw';
import arrow from '../../assets/svgs/arrow.svg?raw';
import line from '../../assets/svgs/line.svg?raw';
import settings from '../../assets/svgs/settings.svg?raw';
import link from '../../assets/svgs/link.svg?raw';
import unlink from '../../assets/svgs/unlink.svg?raw';
import resolved from '../../assets/svgs/resolved.svg?raw';
import unresolved from '../../assets/svgs/unresolved.svg?raw';

export const icons = {
	minimize: minimize,
	maximize: maximize,

	graph0: graph0,
	graph1: graph1,
	graph2: graph2,
	graph3: graph3,
	graph4: graph4,
	graph5: graph5,

	focus: focus,

	arrow: arrow,
	line: line,

	link: link,
	unlink: unlink,

	resolved: resolved,
	unresolved: unresolved,

	settings: settings,
} as const satisfies Record<string, string>;
