import * as d3 from 'd3';
import {Application, Container, Graphics, Text, Ticker} from 'pixi.js';
import config from "virtual:starlight-site-graph/config";
import type {GraphConfig} from "../config";

import {Animator} from "./animator";
import {addToVisitedEndpoints, getVisitedEndpoints, onClickOutside, simplifySlug, stripSlashes} from "./util";
import {showContextMenu} from "./context-menu";
import {icons} from "./icons";
import type {AnimatedValues, ContentDetails, LinkData, NodeData} from "./types";



const MAX_DEPTH = 6;
const LABEL_OFFSET = 12;

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

    currentlyHovered: string = "";
    isFullscreen: boolean = false;
    fullscreenExitHandler?: () => void;

    currentPage: string = stripSlashes(location.pathname);

    visitedPages: Set<string> = getVisitedEndpoints();

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

            {key: "hoveredNodeColor", init: config.graphConfig.regularNodeColor, interpolator: d3.interpolateRgb, group: "hover"},
            {key: "unhoveredNodeColor", init: config.graphConfig.regularNodeColor, interpolator: d3.interpolateRgb, group: "hover"},
            {key: "visitedNodeColor", init: config.graphConfig.visitedNodeColor, interpolator: d3.interpolateRgb, group: "hover"},
            {key: "currentNodeColor", init: config.graphConfig.currentNodeColor, interpolator: d3.interpolateRgb, group: "hover"},

            {key: "hoveredNodeOpacity", init: config.graphConfig.regularNodeOpacity, interpolator: d3.interpolateNumber, group: "hover"},
            {key: "unhoveredNodeOpacity", init: config.graphConfig.regularNodeOpacity, interpolator: d3.interpolateNumber, group: "hover"},

            {key: "hoveredLinkColor", init: config.graphConfig.regularLinkColor, interpolator: d3.interpolateRgb, group: "hover"},
            {key: "unhoveredLinkColor", init: config.graphConfig.regularLinkColor, interpolator: d3.interpolateRgb, group: "hover"},
            {key: "hoveredLinkOpacity", init: config.graphConfig.regularLinkOpacity, interpolator: d3.interpolateNumber, group: "hover"},
            {key: "unhoveredLinkOpacity", init: config.graphConfig.regularLinkOpacity, interpolator: d3.interpolateNumber, group: "hover"},

            {key: "hoveredLabelOpacity", init: 1, interpolator: d3.interpolateNumber, group: "hover"},
            {key: "unhoveredLabelOpacity", init: Math.max((config.graphConfig.opacityScale - 1) / 3.75, 0), interpolator: d3.interpolateNumber, group: "hover"},
            {key: "hoveredLabelOffset", init: LABEL_OFFSET, interpolator: d3.interpolateNumber, group: "hover"},

            {id: "zoom", duration: 0.075, easing: d3.easeQuadOut},
            {id: "hover", duration: 0.2, easing: d3.easeQuadOut},
        ]);

        this.mountGraph().then(() => { this.setup() });
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
                    this.setup();
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
                                    this.setup();
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
            resolution: 4,
            resizeTo: this.graphContainer,
        });
        this.graphContainer.appendChild(this.app.canvas);

        this.links = new Graphics();
        this.app.stage.addChild(this.links);
        this.app.ticker.add((ticker) => { this.tick(ticker) });
    }

    processSitemapData(siteData: Record<string, ContentDetails>): { nodes: NodeData[], links: LinkData[] } {
        let slug = location.pathname;
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
                    links.push({source: source as unknown as NodeData, target: dest as unknown as NodeData})
                }
            }

            if (this.config.showTags) {
                const localTags = details.tags
                    .filter((tag) => !this.config.removeTags.includes(tag))
                    .map((tag) => simplifySlug(("tags/" + tag)))

                tags.push(...localTags.filter((tag) => !tags.includes(tag)))

                for (const tag of localTags) {
                    links.push({source: source as unknown as NodeData, target: tag as unknown as NodeData})
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
                    const outgoing = links.filter((l) => l.source as unknown as string === cur)
                    const incoming = links.filter((l) => l.target as unknown as string === cur)
                    wl.push(...outgoing.map((l) => l.target as unknown as string), ...incoming.map((l) => l.source as unknown as string))
                }
            }
        } else {
            validLinks.forEach((id) => neighbourhood.add(id))
            if (this.config.showTags) tags.forEach((tag) => neighbourhood.add(tag))
        }

        return {
            nodes: [...neighbourhood].map((url) => {
                return {
                    id: url,
                    text: url.startsWith("tags/") ? "#" + url.substring(5) : data.get(url)?.title ?? url,
                    tags: data.get(url)?.tags ?? [],
                }
            }),
            links: links.filter((l) => neighbourhood.has(l.source as unknown as string) && neighbourhood.has(l.target as unknown as string)),
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
            currentNodeColor: config.graphConfig.currentNodeColor,
            visitedNodeColor: config.graphConfig.visitedNodeColor,

            hoveredNodeOpacity: config.graphConfig.regularNodeOpacity,
            unhoveredNodeOpacity: config.graphConfig.regularNodeOpacity,

            hoveredLinkColor: config.graphConfig.regularLinkColor,
            unhoveredLinkColor: config.graphConfig.regularLinkColor,
            hoveredLinkOpacity: config.graphConfig.regularLinkOpacity,
            unhoveredLinkOpacity: config.graphConfig.regularLinkOpacity,

            hoveredLabelOpacity: labelOpacity,
            unhoveredLabelOpacity: labelOpacity,
            hoveredLabelOffset: LABEL_OFFSET,
        });
    }

    getCurrentLabelOpacity(k: number = this.zoom.k): number {
        return Math.max(((k * this.config.opacityScale) - 1) / 3.75, 0);
    }

    cleanup() {
        if (this.simulation) {
            this.app.stage.removeChildren();
            this.app.stage.addChild(this.links);
            this.links.clear();
            this.simulation.stop();
            this.simulation.nodes([]);
            this.simulation.force("link", null);
            this.currentlyHovered = "";
            this.zoom = d3.zoomIdentity;
        }
    }

    getColor(node: NodeData): string {
        if (node.id === this.currentPage) {
            return this.animator.get('currentNodeColor');
        } else if (this.visitedPages.has(node.id)) {
            return this.animator.get('visitedNodeColor');
        } else {
            return this.animator.get('unhoveredNodeColor');
        }
    }

    renderNodes() {
        for (const node of this.simulation.nodes()) {
            const nodeGraphics = new Container();
            const nodeDot = new Graphics();
            nodeDot.circle(0, 0, 5)
                .fill(this.getColor(node));

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

            node.node = nodeGraphics;
            node.label = nodeText;
            this.app.stage.addChild(nodeGraphics);
        }
    }


    setup() {
        this.cleanup();

        this.processedData = this.processSitemapData(config.sitemap as Record<string, ContentDetails>);
        this.simulation = d3.forceSimulation<NodeData>(this.processedData.nodes);
        this.simulationUpdate();

        this.renderNodes();

        let dragX = 0;
        let dragY = 0;
        d3.select(this.app.canvas).call(
            (d3
                .drag()
                .container(this.app.canvas) as unknown as d3.DragBehavior<HTMLCanvasElement, unknown, unknown>)
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

        d3.select(this.app.canvas).on('mousemove', (e: MouseEvent) => {
            const closestNode = this.simulation.find(...this.zoom.invert([e.offsetX, e.offsetY]), 5);
            if (closestNode) {
                this.currentlyHovered = closestNode.id;
                this.animator.setTargets({
                    // FIXME: There need to be two separate animators for Visited (Hover) / Visited (Non-hovered) -> HoverColor / UnhoveredColor
                    //      Easier alternative would be to control unhovered styling using opacity, but that would result in links being visible over nodes
                    hoveredNodeColor: config.graphConfig.hoveredNodeColor,
                    unhoveredNodeColor: config.graphConfig.unhoveredNodeColor,
                    currentNodeColor: config.graphConfig.currentNodeColor,
                    visitedNodeColor: config.graphConfig.visitedNodeColor,

                    hoveredNodeOpacity: config.graphConfig.hoveredNodeOpacity,
                    unhoveredNodeOpacity: config.graphConfig.unhoveredNodeOpacity,

                    hoveredLinkColor: config.graphConfig.hoveredLinkColor,
                    unhoveredLinkColor: config.graphConfig.unhoveredLinkColor,
                    hoveredLinkOpacity: config.graphConfig.hoveredLinkOpacity,
                    unhoveredLinkOpacity: config.graphConfig.unhoveredLinkOpacity,

                    hoveredLabelOpacity: 1,
                    unhoveredLabelOpacity: 0,
                    hoveredLabelOffset: LABEL_OFFSET + 4,
                });
            } else if (this.currentlyHovered) {
                this.resetStyle();
                this.animator.setOnFinished("hoveredNodeColor", () => {
                    this.currentlyHovered = "";
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


        d3.select(this.app.canvas as HTMLCanvasElement).call(
            (d3.zoom() as d3.ZoomBehavior<HTMLCanvasElement, unknown>)
                .scaleExtent([0.05, 4])
                .on('zoom', ({transform}: { transform: d3.ZoomTransform }) => {
                this.zoom = transform;
                this.animator.setTargets({
                    zoom: transform.k,
                    zoomX: transform.x,
                    zoomY: transform.y,
                    unhoveredLabelOpacity: this.getCurrentLabelOpacity(transform.k),
                });
            }),
        );
    }

    tick(ticker: Ticker) {
        this.animator.update(ticker.deltaMS);

        if (this.animator.isAnimating("zoom")) {
            this.app.stage.updateTransform({
                scaleX: this.animator.get('zoom'),
                scaleY: this.animator.get('zoom'),
                x: this.animator.get('zoomX'),
                y: this.animator.get('zoomY'),
            });
        }

        // FIXME: Disable redrawing when group "hover" is not animating
        for (const node of this.simulation.nodes()) {
            node.label!.scale.set(1);
            node.label!.alpha = this.animator.get('unhoveredLabelOpacity');

            if (this.currentlyHovered) {
                if (node.id === this.currentlyHovered) {
                    node.label!.position.set(0, this.animator.get('hoveredLabelOffset'));
                    node.label!.alpha = this.animator.get('hoveredLabelOpacity');

                    (node.node!.children[0] as Graphics)
                        .clear()
                        .circle(0, 0, 5)
                        .fill(this.animator.get('hoveredNodeColor'));
                } else {
                    node.label!.position.set(0, LABEL_OFFSET);
                    (node.node!.children[0] as Graphics)
                        .clear()
                        .circle(0, 0, 5)
                        .fill(this.getColor(node));
                    node.label!.alpha = this.animator.get('unhoveredLabelOpacity');
                    node.node!.alpha = this.animator.get('unhoveredNodeOpacity');
                }
            } else {
                node.label!.position.set(0, LABEL_OFFSET);
                node.node!.alpha = 1;
                (node.node!.children[0] as Graphics)
                    .clear()
                    .circle(0, 0, 5)
                    .fill(this.getColor(node));
            }
        }

        for (const node of this.simulation.nodes()) {
            node.node!.position.set(node.x!, node.y!);
        }

        this.links.clear();

        for (const link of this.processedData.links) {
            let isAdjacent = link.source.id === this.currentlyHovered || link.target.id === this.currentlyHovered;
            this.links
                .moveTo(link.source.x!, link.source.y!)
                .lineTo(link.target.x!, link.target.y!)
                .fill()
                .stroke({
                    color: isAdjacent ? this.animator.get('hoveredLinkColor') : this.animator.get('unhoveredLinkColor'),
                    width: 1 / this.animator.get('zoom'),
                    alpha: (this.currentlyHovered ? (isAdjacent ? this.animator.get('hoveredLinkOpacity') : this.animator.get('unhoveredLinkOpacity')) : 0.5)
                })
        }
    }

}

customElements.define('graph-component', GraphComponent);
