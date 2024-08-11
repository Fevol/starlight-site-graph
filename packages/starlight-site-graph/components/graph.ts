import * as d3 from 'd3';
import {Application, Container, Graphics, Text} from 'pixi.js';
import config from "virtual:starlight-site-graph/config";
import type {GraphConfig} from "../config";

import {Animator} from "./animator";
import {addToVisitedEndpoints, getVisitedEndpoints, simplifySlug} from "./util";

export type ContentDetails = {
    title: string
    links: string[]
    backlinks: string[]
    tags: string[]
    content: string
    richContent?: string
    date?: Date
    description?: string
}

export type NodeData = {
    id: string
    tags: string[]
    graphics?: Container;
    text?: Text;
} & d3.SimulationNodeDatum

export type LinkData = {
    source: NodeData
    target: NodeData
}

interface AnimatedValues {
    zoom: number;
    zoomX: number;
    zoomY: number;

    hoveredColor: number | string;
    unhoveredColor: number;

    hoveredLabelOpacity: number;
    unhoveredLabelOpacity: number;

    hoveredLinkOpacity: number;
    unhoveredLinkOpacity: number;

    hoveredNodeOpacity: number;
    unhoveredNodeOpacity: number;
}


const animator = new Animator<keyof AnimatedValues>([
    { key: "zoom", init: 1, group: "zoom" },
    { key: "zoomX", init: 0, group: "zoom" },
    { key: "zoomY", init: 0, group: "zoom" },
    { key: "hoveredColor", init: config.graphConfig.regularNodeColor, group: "hover" },
    { key: "unhoveredColor", init: config.graphConfig.regularNodeColor, group: "hover" },
    { key: "hoveredLabelOpacity", init: 1, group: "hover" },
    { key: "unhoveredLabelOpacity", init: Math.max((config.graphConfig.opacityScale - 1) / 3.75, 0), group: "hover" },
    { key: "hoveredLinkOpacity", init: config.graphConfig.regularLinkOpacity, group: "hover" },
    { key: "unhoveredLinkOpacity", init: config.graphConfig.regularLinkOpacity, group: "hover" },
    { key: "hoveredNodeOpacity", init: config.graphConfig.regularNodeOpacity, group: "hover" },
    { key: "unhoveredNodeOpacity", init: config.graphConfig.regularNodeOpacity, group: "hover" },
    { id: "zoom", duration: 0.125, easing: d3.easeQuadOut },
    { id: "hover", duration: 0.2, easing: d3.easeQuadOut },
]);


function processGraphData(siteData: Record<string, ContentDetails>, config: GraphConfig): { nodes: NodeData[], links: LinkData[] } {
    let slug = location.pathname;
    const visited = getVisitedEndpoints()
    const links: LinkData[] = []
    const tags: string[] = []
    const data: Map<string, ContentDetails> = new Map(
        Object.entries<ContentDetails>(siteData).map(([k, v]) => [
            simplifySlug(k),
            v,
        ]),
    )

    let depth = config.depth;
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

        if (config.showTags) {
            const localTags = details.tags
                .filter((tag) => !config.removeTags.includes(tag))
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
        if (config.showTags) tags.forEach((tag) => neighbourhood.add(tag))
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

function getCurrentLabelOpacity(k: number = zoom.k): number {
    return Math.max(((k * config.graphConfig.opacityScale) - 1) / 3.75, 0);
}


const width = 400;
const height = 400;
const element = document.getElementsByClassName('graph-container')[0] as HTMLElement;

const app = new Application();
await app.init({
    antialias: true,
    backgroundAlpha: 0,
    resolution: 1,
    resizeTo: element,
});

element.appendChild(app.canvas);


const processedData = processGraphData(config.sitemap as Record<string, ContentDetails>, config.graphConfig);
const simulation = d3
    .forceSimulation<NodeData>(processedData.nodes)
    .force(
        'link',
        d3.forceLink(processedData.links)
            .id((d: any) => d.id)
            .distance(config.graphConfig.linkDistance)
    )
    .force("charge", d3.forceManyBody().strength(-100 * config.graphConfig.repelForce))
    .force('center', d3.forceCenter(config.graphConfig.centerForce));


const links = new Graphics();
app.stage.addChild(links);

for (const node of simulation.nodes()) {
    const nodeGraphics = new Container();
    const nodeDot = new Graphics();
    nodeDot.circle(0, 0, 5)
           .fill(0xffffff);

    const nodeText = new Text({
        text: node.text || node.id,
        style: {
            fill: 0xffffff,
            fontSize: 12,
        },
    });
    nodeText.anchor.set(0.5, 0.5);
    nodeText.alpha = animator.get('unhoveredLabelOpacity');

    nodeGraphics.addChild(nodeDot);
    nodeGraphics.addChild(nodeText);

    node.graphics = nodeGraphics;
    node.text = nodeText;
    app.stage.addChild(nodeGraphics);
}

d3.select(app.canvas).call(
    // @ts-ignore
    d3
        .drag()
        .container(app.canvas)
        .subject(event => {
            const invZoom = zoom.invert([event.x, event.y]);
            return simulation.find(invZoom[0], invZoom[1], 10);
        })
        .on('start', drag_started)
        .on('drag', dragged)
        .on('end', drag_ended),
);

let currentlyHovered: string = "";
d3.select(app.canvas).on('mousemove', (e: MouseEvent) => {
    const invZoom = zoom.invert([e.offsetX, e.offsetY]);
    const closestNode = simulation.find(invZoom[0], invZoom[1], 5);
    if (closestNode) {
        currentlyHovered = closestNode.id;
        animator.setTargets({
            hoveredColor: config.graphConfig.hoveredColor,
            unhoveredColor: config.graphConfig.unhoveredColor,
            hoveredNodeOpacity: config.graphConfig.hoveredNodeOpacity,
            unhoveredNodeOpacity: config.graphConfig.unhoveredNodeOpacity,
            hoveredLinkOpacity: config.graphConfig.hoveredLinkOpacity,
            unhoveredLinkOpacity: config.graphConfig.unhoveredLinkOpacity,
            hoveredLabelOpacity: 1,
            unhoveredLabelOpacity: 0,
        });
    } else if (currentlyHovered) {
        const labelOpacity = getCurrentLabelOpacity();
        animator.setTargets({
            hoveredColor: config.graphConfig.regularNodeColor,
            unhoveredColor: config.graphConfig.regularNodeColor,
            hoveredNodeOpacity: config.graphConfig.regularNodeOpacity,
            unhoveredNodeOpacity: config.graphConfig.regularNodeOpacity,
            hoveredLinkOpacity: config.graphConfig.regularLinkOpacity,
            unhoveredLinkOpacity: config.graphConfig.regularLinkOpacity,
            hoveredLabelOpacity: labelOpacity,
            unhoveredLabelOpacity: labelOpacity,
        });
        animator.setOnFinished("hoveredColor", () => {
            currentlyHovered = "";
        });
    }

})

d3.select(app.canvas).on('click', (e: MouseEvent) => {
    const invZoom = zoom.invert([e.offsetX, e.offsetY]);
    const closestNode = simulation.find(invZoom[0], invZoom[1], 5);
    if (closestNode) {
        addToVisitedEndpoints(closestNode.id);
        location.href = closestNode.id;
    }
})


let zoom: d3.ZoomTransform = d3.zoomIdentity;

d3.select(app.canvas).call(
    // @ts-ignore
    d3.zoom().on('zoom', ({transform}: { transform: d3.ZoomTransform }) => {
        zoom = transform;
        animator.setTargets({
            zoom: transform.k,
            zoomX: transform.x,
            zoomY: transform.y,
            unhoveredLabelOpacity: getCurrentLabelOpacity(transform.k),
        });
    }),
);

app.ticker.add((ticker) => {
    animator.update(ticker.deltaMS);

    if (animator.hasFinishedAnimating()) {
        app.stage.updateTransform({
            scaleX: animator.get('zoom'),
            scaleY: animator.get('zoom'),
            x: animator.get('zoomX'),
            y: animator.get('zoomY'),
        });
    }

    for (const node of simulation.nodes()) {
        node.text!.scale.set(1 / animator.get('zoom'));
        node.text!.position.set(0, 10);
        node.text!.alpha = animator.get('unhoveredLabelOpacity');

        if (currentlyHovered.length > 0) {
            if (node.id === currentlyHovered) {
                node.text!.alpha = animator.get('hoveredLabelOpacity');

                (node.graphics!.children[0] as Graphics)
                    .clear()
                    .circle(0, 0, 5)
                    .fill(animator.get('hoveredColor'));
            } else {
                node.text!.alpha = animator.get('unhoveredLabelOpacity');
                node.graphics!.alpha = animator.get('unhoveredNodeOpacity');
            }
        } else {
            node.graphics!.alpha = 1;
            (node.graphics!.children[0] as Graphics)
                .clear()
                .circle(0, 0, 5)
                .fill(animator.get('unhoveredColor'));
        }
    }

    for (const node of simulation.nodes()) {
        node.graphics!.position.set(node.x!, node.y!);
    }

    links.clear();

    for (const link of processedData.links) {
        let isAdjacent = link.source.id === currentlyHovered || link.target.id === currentlyHovered;
        links
            // @ts-ignore
            .moveTo(link.source.x!, link.source.y!)
            // @ts-ignore
            .lineTo(link.target.x!, link.target.y!)
            .fill()
            .stroke({
                color: isAdjacent ? animator.get('hoveredColor') : animator.get('unhoveredColor'),
                width: 1 / animator.get('zoom'),
                alpha: (currentlyHovered ? (isAdjacent ? animator.get('hoveredLinkOpacity') : animator.get('unhoveredLinkOpacity')) : 0.5)
            })
    }
});

let dragX = 0;
let dragY = 0;

function drag_started(event: any) {
    if (!event.subject) return;

    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
    dragX = event.x;
    dragY = event.y;
}

function dragged(event: any) {
    if (!event.subject) return;

    dragX += event.dx / animator.get('zoom');
    dragY += event.dy / animator.get('zoom');

    event.subject.fx = dragX;
    event.subject.fy = dragY;
}

function drag_ended(event: any) {
    if (!event.subject) return;

    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
}
