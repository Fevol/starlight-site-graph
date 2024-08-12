import * as d3 from 'd3';
import {Application, Container, Graphics, Text} from 'pixi.js';
import config from "virtual:starlight-site-graph/config";
import type {GraphConfig} from "../config";

import {Animator} from "./animator";
import {addToVisitedEndpoints, getVisitedEndpoints, onClickOutside, simplifySlug} from "./util";
import {showContextMenu} from "./context-menu";
import {icons} from "./icons";
import type {AnimatedValues, ContentDetails, LinkData, NodeData} from "./types";



const MAX_DEPTH = 6;

export class GraphComponent extends HTMLElement {
    graphContainer: HTMLElement;
    mockGraphContainer: HTMLElement;
    actionContainer: HTMLElement;
    blurContainer: HTMLElement;

    app!: Application;
    simulation!: d3.Simulation<NodeData, undefined>;
    zoom: d3.ZoomTransform;

    links!: Graphics;

    config!: GraphConfig;
    processedData!: ReturnType<typeof this.processSitemapData>;
    animator: Animator<keyof AnimatedValues, any>;

    isFullscreen: boolean = false;
    fullscreenExitHandler?: () => void;

    constructor() {
        super();

        this.config = config.graphConfig;
        this.config.depth = Math.min(this.config.depth, 5);


        this.zoom = d3.zoomIdentity;

        this.classList.add('graph-component');

        this.graphContainer = document.createElement('div');
        this.graphContainer.classList.add('graph-container');
        this.graphContainer.onkeyup = (e) => {
            if (e.key === "f") this.enableFullscreen()
        }
        this.graphContainer.tabIndex = 0;
        this.appendChild(this.graphContainer);

        this.actionContainer = document.createElement('div');
        this.actionContainer.classList.add('graph-action-container');
        this.renderActionContainer();
        this.graphContainer.appendChild(this.actionContainer);

        this.mockGraphContainer = document.createElement('div');
        this.mockGraphContainer.classList.add('graph-container');

        this.blurContainer = document.createElement('div');
        this.blurContainer.classList.add('background-blur');

        this.animator = new Animator<keyof AnimatedValues, any>([
            {key: "zoom", init: 1, interpolator: d3.interpolateNumber, group: "zoom"},
            {key: "zoomX", init: 0, interpolator: d3.interpolateNumber, group: "zoom"},
            {key: "zoomY", init: 0, interpolator: d3.interpolateNumber, group: "zoom"},

            {
                key: "hoveredNodeColor",
                init: config.graphConfig.regularNodeColor,
                interpolator: d3.interpolateRgb,
                group: "hover"
            },
            {
                key: "unhoveredNodeColor",
                init: config.graphConfig.regularNodeColor,
                interpolator: d3.interpolateRgb,
                group: "hover"
            },
            {
                key: "hoveredNodeOpacity",
                init: config.graphConfig.regularNodeOpacity,
                interpolator: d3.interpolateNumber,
                group: "hover"
            },
            {
                key: "unhoveredNodeOpacity",
                init: config.graphConfig.regularNodeOpacity,
                interpolator: d3.interpolateNumber,
                group: "hover"
            },

            {
                key: "hoveredLinkColor",
                init: config.graphConfig.regularLinkColor,
                interpolator: d3.interpolateRgb,
                group: "hover"
            },
            {
                key: "unhoveredLinkColor",
                init: config.graphConfig.regularLinkColor,
                interpolator: d3.interpolateRgb,
                group: "hover"
            },
            {
                key: "hoveredLinkOpacity",
                init: config.graphConfig.regularLinkOpacity,
                interpolator: d3.interpolateNumber,
                group: "hover"
            },
            {
                key: "unhoveredLinkOpacity",
                init: config.graphConfig.regularLinkOpacity,
                interpolator: d3.interpolateNumber,
                group: "hover"
            },

            {key: "hoveredLabelOpacity", init: 1, interpolator: d3.interpolateNumber, group: "hover"},
            {
                key: "unhoveredLabelOpacity",
                init: Math.max((config.graphConfig.opacityScale - 1) / 3.75, 0),
                interpolator: d3.interpolateNumber,
                group: "hover"
            },

            {id: "zoom", duration: 0.075, easing: d3.easeQuadOut},
            {id: "hover", duration: 0.2, easing: d3.easeQuadOut},
        ]);

        this.mountGraph().then(() => {
            this.processGraph()
        });
    }

    override remove() {
        this.app.destroy();
        this.graphContainer.remove();
        this.mockGraphContainer.remove();
        this.blurContainer.remove();

        super.remove();
    }

    enableFullscreen() {
        if (this.isFullscreen) return;

        this.isFullscreen = true;
        this.graphContainer.classList.toggle('is-fullscreen', true);
        this.appendChild(this.mockGraphContainer);
        this.appendChild(this.blurContainer);
        this.fullscreenExitHandler = onClickOutside(this.graphContainer, () => {
            this.disableFullscreen()
        });
        this.graphContainer.onkeyup = (e) => {
            if (e.key === "Escape" || e.key === "f") this.disableFullscreen()
        }
        this.renderActionContainer();

        this.app.renderer.resize(this.graphContainer.clientWidth, this.graphContainer.clientHeight);
    }

    disableFullscreen() {
        if (!this.isFullscreen) return;

        this.isFullscreen = false;
        this.graphContainer.classList.toggle('is-fullscreen', false);
        this.removeChild(this.mockGraphContainer);
        this.removeChild(this.blurContainer);
        this.fullscreenExitHandler!();
        this.graphContainer.onkeyup = (e) => {
            if (e.key === "f") this.enableFullscreen()
        }
        this.renderActionContainer();

        this.app.renderer.resize(this.graphContainer.clientWidth, this.graphContainer.clientHeight);
    }

    renderActionContainer() {
        this.actionContainer.replaceChildren();
        for (const action of ["fullscreen", "depth"]) {
            const actionElement = document.createElement('button');
            actionElement.classList.add('graph-action-button');
            this.actionContainer.appendChild(actionElement);

            if (action === "fullscreen") {
                actionElement.innerHTML = this.isFullscreen ? icons.minimize : icons.maximize;
                actionElement.onclick = (e) => {
                    (this.isFullscreen ? this.disableFullscreen() : this.enableFullscreen());
                    e.stopPropagation()
                }
                actionElement.oncontextmenu = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    showContextMenu(e, [
                        {text: "Minimize", icon: icons.minimize, onClick: () => this.disableFullscreen()},
                        {text: "Maximize", icon: icons.maximize, onClick: () => this.enableFullscreen()},
                    ]);
                }
            } else if (action === "depth") {
                actionElement.innerHTML = icons["graph" + this.config.depth as keyof typeof icons];
                actionElement.onclick = () => {
                    this.config.depth = (this.config.depth + 1) % MAX_DEPTH;
                    this.processGraph();
                    this.renderActionContainer()
                }
                actionElement.oncontextmenu = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    showContextMenu(e,
                        Array.from({length: MAX_DEPTH}, (_, i) => ({
                            text: i === MAX_DEPTH - 1 ?
                                "Show Entire Graph" :
                                i === 0 ?
                                    "Show Only Current" :
                                    i === 1 ?
                                        "Show Adjacent" :
                                        `Show Distance ${i}`,
                            icon: icons["graph" + i as keyof typeof icons],
                            onClick: () => {
                                if (this.config.depth !== i) {
                                    this.config.depth = i;
                                    this.processGraph();
                                    this.renderActionContainer();
                                }
                            }
                        }))
                    );
                }
            }


        }

    }

    async mountGraph() {
        this.app = new Application();
        await this.app.init({
            antialias: true,
            backgroundAlpha: 0,
            resolution: 1,
            resizeTo: this.graphContainer,
        });
        this.graphContainer.appendChild(this.app.canvas);

        this.links = new Graphics();
        this.app.stage.addChild(this.links);
    }

    processSitemapData(siteData: Record<string, ContentDetails>): { nodes: NodeData[], links: LinkData[] } {
        let slug = location.pathname;
        const visited = getVisitedEndpoints();
        const links: LinkData[] = []
        const tags: string[] = []
        const data: Map<string, ContentDetails> = new Map(
            Object.entries<ContentDetails>(siteData).map(([k, v]) => [
                simplifySlug(k),
                v,
            ]),
        )

        let depth = this.config.depth;
        if (depth >= 5)
            depth = -1;

        if (slug.startsWith("/"))
            slug = slug.slice(1)
        if (slug.endsWith("/"))
            slug = slug.slice(0, -1)

        const validLinks = new Set(data.keys())
        for (const [source, details] of data.entries()) {
            const outgoing = details.links ?? [];
            for (const dest of outgoing) {
                if (validLinks.has(dest)) {
                    links.push({source: source, target: dest})
                }
            }

            if (this.config.showTags) {
                const localTags = details.tags
                    .filter((tag) => !this.config.removeTags.includes(tag))
                    .map((tag) => simplifySlug(("tags/" + tag)))

                tags.push(...localTags.filter((tag) => !tags.includes(tag)))

                for (const tag of localTags) {
                    links.push({source: source, target: tag})
                }
            }
        }

        const neighbourhood = new Set<string>()
        const wl: (string | "__SENTINEL")[] = [slug, "__SENTINEL"]
        if (depth >= 0) {
            while (depth >= 0 && wl.length > 0) {
                const cur = wl.shift()!
                if (cur === "__SENTINEL") {
                    depth--
                    wl.push("__SENTINEL")
                } else if (neighbourhood.has(cur)) {
                    continue;
                } else {
                    neighbourhood.add(cur)
                    const outgoing = links.filter((l) => l.source === cur)
                    const incoming = links.filter((l) => l.target === cur)
                    wl.push(...outgoing.map((l) => l.target), ...incoming.map((l) => l.source))
                }
            }
        } else {
            validLinks.forEach((id) => neighbourhood.add(id))
            if (this.config.showTags) tags.forEach((tag) => neighbourhood.add(tag))
        }

        return {
            nodes: [...neighbourhood].map((url) => {
                const text = url.startsWith("tags/") ? "#" + url.substring(5) : data.get(url)?.title ?? url
                return {
                    id: url,
                    text: text,
                    tags: data.get(url)?.tags ?? [],
                }
            }),
            links: links.filter((l) => neighbourhood.has(l.source) && neighbourhood.has(l.target)),
        }
    }


    simulationUpdate() {
        this.simulation
            .force(
                "link",
                d3.forceLink(this.processedData.links)
                    .id((d: any) => d.id)
                    .distance(this.config.linkDistance),
            )
            .force("charge", d3.forceManyBody().strength(-100 * this.config.repelForce))
            .force("center", d3.forceCenter().strength(this.config.centerForce))
            .alpha(1)
            .restart();
    }

    resetStyle() {
        const labelOpacity = this.getCurrentLabelOpacity();
        this.animator.setTargets({
            hoveredNodeColor: config.graphConfig.regularNodeColor,
            unhoveredNodeColor: config.graphConfig.regularNodeColor,
            hoveredNodeOpacity: config.graphConfig.regularNodeOpacity,
            unhoveredNodeOpacity: config.graphConfig.regularNodeOpacity,

            hoveredLinkColor: config.graphConfig.regularLinkColor,
            unhoveredLinkColor: config.graphConfig.regularLinkColor,
            hoveredLinkOpacity: config.graphConfig.regularLinkOpacity,
            unhoveredLinkOpacity: config.graphConfig.regularLinkOpacity,

            hoveredLabelOpacity: labelOpacity,
            unhoveredLabelOpacity: labelOpacity,
        });
    }

    getCurrentLabelOpacity(k: number = this.zoom.k): number {
        return Math.max(((k * this.config.opacityScale) - 1) / 3.75, 0);
    }

    processGraph() {
        this.app.stage.removeChildren();
        this.zoom = d3.zoomIdentity;
        this.processedData = this.processSitemapData(config.sitemap as Record<string, ContentDetails>);
        this.simulation = d3.forceSimulation<NodeData>(this.processedData.nodes);
        this.simulationUpdate();

        for (const node of this.simulation.nodes()) {
            const nodeGraphics = new Container();
            const nodeDot = new Graphics();
            nodeDot.circle(0, 0, 5)
                .fill(this.animator.get('unhoveredNodeColor'));

            const nodeText = new Text({
                text: node.text || node.id,
                style: {
                    fill: 0xffffff,
                    fontSize: 12,
                }
            });
            nodeText.anchor.set(0.5, 0.5);
            nodeText.alpha = this.animator.get('unhoveredLabelOpacity');

            nodeGraphics.addChild(nodeDot);
            nodeGraphics.addChild(nodeText);

            node.graphics = nodeGraphics;
            node.text = nodeText;
            this.app.stage.addChild(nodeGraphics);
        }

        let dragX = 0;
        let dragY = 0;
        d3.select(this.app.canvas).call(
            // @ts-ignore
            d3
                .drag()
                .container(this.app.canvas)
                .subject(event => {
                    return this.simulation.find(...this.zoom.invert([event.x, event.y]), 10)
                })
                .on('start', (e) => {
                    if (!e.subject) return;

                    if (!e.active) this.simulation.alphaTarget(0.3).restart();
                    e.subject.fx = e.subject.x;
                    e.subject.fy = e.subject.y;
                    dragX = e.x;
                    dragY = e.y;
                })
                .on('drag', (e) => {
                    if (!e.subject) return;

                    dragX += e.dx / this.animator.get('zoom');
                    dragY += e.dy / this.animator.get('zoom');

                    e.subject.fx = dragX;
                    e.subject.fy = dragY;
                })
                .on('end', (e) => {
                    if (!e.subject) return;

                    if (!e.active) this.simulation.alphaTarget(0);
                    e.subject.fx = null;
                    e.subject.fy = null;
                }),
        );

        let currentlyHovered: string = "";
        d3.select(this.app.canvas).on('mousemove', (e: MouseEvent) => {
            const closestNode = this.simulation.find(...this.zoom.invert([e.offsetX, e.offsetY]), 5);
            if (closestNode) {
                currentlyHovered = closestNode.id;
                this.animator.setTargets({
                    hoveredNodeColor: config.graphConfig.hoveredNodeColor,
                    unhoveredNodeColor: config.graphConfig.unhoveredNodeColor,
                    hoveredNodeOpacity: config.graphConfig.hoveredNodeOpacity,
                    unhoveredNodeOpacity: config.graphConfig.unhoveredNodeOpacity,

                    hoveredLinkColor: config.graphConfig.hoveredLinkColor,
                    unhoveredLinkColor: config.graphConfig.unhoveredLinkColor,
                    hoveredLinkOpacity: config.graphConfig.hoveredLinkOpacity,
                    unhoveredLinkOpacity: config.graphConfig.unhoveredLinkOpacity,

                    hoveredLabelOpacity: 1,
                    unhoveredLabelOpacity: 0,
                });
            } else if (currentlyHovered) {
                this.resetStyle();
                this.animator.setOnFinished("hoveredNodeColor", () => {
                    currentlyHovered = "";
                });
            }

        })

        d3.select(this.app.canvas).on('click', (e: MouseEvent) => {
            const closestNode = this.simulation.find(...this.zoom.invert([e.offsetX, e.offsetY]), 5);
            if (closestNode) {
                addToVisitedEndpoints(closestNode.id);
                location.href = closestNode.id;
            }
        })


        d3.select(this.app.canvas).call(
            // @ts-ignore
            d3.zoom().on('zoom', ({transform}: { transform: d3.ZoomTransform }) => {
                this.zoom = transform;
                this.animator.setTargets({
                    zoom: transform.k,
                    zoomX: transform.x,
                    zoomY: transform.y,
                    unhoveredLabelOpacity: this.getCurrentLabelOpacity(transform.k),
                });
            }),
        );

        this.app.ticker.add((ticker) => {
            this.animator.update(ticker.deltaMS);

            if (this.animator.isAnimating("zoom")) {
                this.app.stage.updateTransform({
                    scaleX: this.animator.get('zoom'),
                    scaleY: this.animator.get('zoom'),
                    x: this.animator.get('zoomX'),
                    y: this.animator.get('zoomY'),
                });
            }

            for (const node of this.simulation.nodes()) {
                node.text!.scale.set(1 / this.animator.get('zoom'));
                node.text!.position.set(0, 10);
                node.text!.alpha = this.animator.get('unhoveredLabelOpacity');

                if (currentlyHovered.length > 0) {
                    if (node.id === currentlyHovered) {
                        node.text!.alpha = this.animator.get('hoveredLabelOpacity');

                        (node.graphics!.children[0] as Graphics)
                            .clear()
                            .circle(0, 0, 5)
                            .fill(this.animator.get('hoveredNodeColor'));
                    } else {
                        (node.graphics!.children[0] as Graphics)
                            .clear()
                            .circle(0, 0, 5)
                            .fill(this.animator.get('unhoveredNodeColor'));
                        node.text!.alpha = this.animator.get('unhoveredLabelOpacity');
                        node.graphics!.alpha = this.animator.get('unhoveredNodeOpacity');
                    }
                } else {
                    node.graphics!.alpha = 1;
                    (node.graphics!.children[0] as Graphics)
                        .clear()
                        .circle(0, 0, 5)
                        .fill(this.animator.get('unhoveredNodeColor'));
                }
            }

            for (const node of this.simulation.nodes()) {
                node.graphics!.position.set(node.x!, node.y!);
            }

            this.links.clear();

            for (const link of this.processedData.links) {
                let isAdjacent = link.source.id === currentlyHovered || link.target.id === currentlyHovered;
                this.links
                    // @ts-ignore
                    .moveTo(link.source.x!, link.source.y!)
                    // @ts-ignore
                    .lineTo(link.target.x!, link.target.y!)
                    .fill()
                    .stroke({
                        color: isAdjacent ? this.animator.get('hoveredLinkColor') : this.animator.get('unhoveredLinkColor'),
                        width: 1 / this.animator.get('zoom'),
                        alpha: (currentlyHovered ? (isAdjacent ? this.animator.get('hoveredLinkOpacity') : this.animator.get('unhoveredLinkOpacity')) : 0.5)
                    })
            }
        });
    }

}

customElements.define('graph-component', GraphComponent);