import * as d3 from 'd3';
import {Application, Container, Graphics, Text} from 'pixi.js';
import config from "virtual:starlight-site-graph/config";
import type {GraphConfig} from "../config";


const storageKey = "graph-visited";

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

interface ZoomAnimatedValues {
    zoom: number;
    zoomX: number;
    zoomY: number;
}

interface HoverAnimatedValues {
    hoveredColor: number;
    unhoveredColor: number;

    hoveredLabelOpacity: number;
    unhoveredLabelOpacity: number;

    hoveredLinkOpacity: number;
    unhoveredLinkOpacity: number;

    hoveredNodeOpacity: number;
    unhoveredNodeOpacity: number;
}


class Animator<Key extends string> {
    private readonly values: Record<Key, number>;
    private readonly targetValues: Record<Key, number>;
    private readonly durations: Partial<Record<Key, number>> | { default: number };

    constructor(initialValues: Record<Key, number>, durations: Partial<Record<Key, number>> | { default: number } = { default: 0.5 }) {
        this.values = initialValues;
        this.targetValues = {...initialValues};
        this.durations = durations;
    }

    public setTarget(key: Key, value: number) {
        this.targetValues[key] = value;
    }

    public setTargets(values: Partial<Record<Key, number>>) {
        for (const key in values) {
            this.targetValues[key] = values[key] as any;
        }
    }

    public update(delta: number) {
        for (const key in this.values) {
            this.values[key] += (this.targetValues[key] - this.values[key]) * (1.0 - Math.exp(-(this.durations[key] || this.durations["default"]) * delta));
        }
    }

    public get(key: Key) {
        return this.values[key];
    }

    public isAnimating(key: Key) {
        return Math.pow(this.values[key] - this.targetValues[key], 2) > 0.0000001;
    }
}

const zoomAnimator = new Animator<keyof ZoomAnimatedValues>(
    {zoom: 1, zoomX: 0, zoomY: 0},
    {zoom: 0.3, zoomX: 0.3, zoomY: 0.3}
);

const hoverAnimator = new Animator<keyof HoverAnimatedValues>(
    { unhoveredColor: 0xFFFFFF, hoveredColor: 0x815CEC, hoveredLabelOpacity: 1, unhoveredLabelOpacity: 0, hoveredLinkOpacity: 1, unhoveredLinkOpacity: 0.05, hoveredNodeOpacity: 1, unhoveredNodeOpacity: 0.15 },
    { default: 0.5 }
);


function getVisitedEndpoints(): Set<string> {
    return new Set(JSON.parse(sessionStorage.getItem(storageKey) ?? "[]"))
}

function addToVisitedEndpoints(slug: string) {
    const visited = getVisitedEndpoints()
    visited.add(slug)
    sessionStorage.setItem(storageKey, JSON.stringify([...visited]))
}

function simplifySlug(fp: string): string {
    const res = stripSlashes(trimSuffix(fp, "index"), true)
    return (res.length === 0 ? "/" : res)
}

function endsWith(s: string, suffix: string): boolean {
    return s === suffix || s.endsWith("/" + suffix)
}

function trimSuffix(s: string, suffix: string): string {
    if (endsWith(s, suffix))
        s = s.slice(0, -suffix.length)
    return s
}

function stripSlashes(s: string, onlyStripPrefix?: boolean): string {
    if (s.startsWith("/"))
        s = s.substring(1)
    if (!onlyStripPrefix && s.endsWith("/"))
        s = s.slice(0, -1)
    return s
}


function processGraphData(siteData: Record<string, ContentDetails>, config: GraphConfig): {
    nodes: NodeData[],
    links: LinkData[]
} {
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
        d3.forceLink(processedData.links).id((d: any) => d.id),
    )
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(width / 2, height / 2));


const links = new Graphics();
app.stage.addChild(links);

for (const node of simulation.nodes()) {
    const nodeGraphics = new Container();
    const nodeDot = new Graphics();
    // nodeDot.setStrokeStyle({
    //     color: 0xffffff,
    //     width: 1.5,
    // });
    nodeDot.circle(0, 0, 5);
    nodeDot.fill(0xffffff);

    const nodeText = new Text({
        text: node.text || node.id,
        style: {
            fill: 0xffffff,
            fontSize: 12,
        },
    });
    nodeText.anchor.set(0.5, 0.5);
    nodeText.alpha = (config.graphConfig.opacityScale - 1) / 3.75;

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
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended),
);


let currentlyHovered: string = "";

d3.select(app.canvas).on('mousemove', (e: MouseEvent) => {
    const invZoom = zoom.invert([e.offsetX, e.offsetY]);
    const closestNode = simulation.find(invZoom[0], invZoom[1], 5);
    if (closestNode) {
        currentlyHovered = closestNode.id;
        hoverAnimator.setTargets({
            hoveredColor: 0xFFFFFF,
            unhoveredColor: 0xFFFFFF,
            hoveredNodeOpacity: 1,
            unhoveredNodeOpacity: 0.15,
            hoveredLinkOpacity: 1,
            unhoveredLinkOpacity: 0.05,
            hoveredLabelOpacity: 1,
            unhoveredLabelOpacity: 0,
        });
    } else {
        currentlyHovered = "";
        hoverAnimator.setTargets({
            hoveredColor: 0x815CEC,
            unhoveredColor: 0xFFFFFF,
            hoveredNodeOpacity: 0.15,
            unhoveredNodeOpacity: 1,
            hoveredLinkOpacity: 0.05,
            unhoveredLinkOpacity: 0.5,
            hoveredLabelOpacity: 0,
            unhoveredLabelOpacity: 1,
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
        zoomAnimator.setTargets({
            zoom: transform.k,
            zoomX: transform.x,
            zoomY: transform.y,
        });
    }),
);

app.ticker.add((ticker) => {
    zoomAnimator.update(ticker.deltaTime);
    hoverAnimator.update(ticker.deltaTime);

    if (zoomAnimator.isAnimating('zoom') || zoomAnimator.isAnimating('zoomX') || zoomAnimator.isAnimating('zoomY')) {
        app.stage.updateTransform({
            scaleX: zoomAnimator.get('zoom'),
            scaleY: zoomAnimator.get('zoom'),
            x: zoomAnimator.get('zoomX'),
            y: zoomAnimator.get('zoomY'),
        });
    }

    for (const node of simulation.nodes()) {
        node.text!.scale.set(1 / zoomAnimator.get('zoom'));

        node.text!.position.set(0, 10);

        const currentScale = zoom.k * config.graphConfig.opacityScale;
        const scaledOpacity = Math.max((currentScale - 1) / 3.75, 0);
        node.text!.alpha = scaledOpacity;

        if (currentlyHovered) {
            if (node.id === currentlyHovered) {
                // node.text!.scale.set(1 / zoom.k);
                // node.text!.position.set(0, 10);
                node.text!.alpha = hoverAnimator.get('hoveredNodeOpacity');

                (node.graphics!.children[0] as Graphics)
                    .clear()
                    .circle(0, 0, 5)
                    .fill(hoverAnimator.get('hoveredColor'));
            } else {
                node.text!.alpha = 0;
                node.graphics!.alpha = hoverAnimator.get('unhoveredNodeOpacity');
            }
        } else {
            node.graphics!.alpha = 1;
            (node.graphics!.children[0] as Graphics)
                .clear()
                .circle(0, 0, 5)
                .fill(hoverAnimator.get('unhoveredColor'));
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
                color: currentlyHovered ? hoverAnimator.get('hoveredColor') : hoverAnimator.get('unhoveredColor'),
                width: 1 / zoomAnimator.get('zoom'),
                alpha: (currentlyHovered ? (isAdjacent ? hoverAnimator.get('hoveredLinkOpacity') : hoverAnimator.get('unhoveredLinkOpacity')) : 0.5)
            })
    }
});

let dragX = 0;
let dragY = 0;

function dragstarted(event: any) {
    if (!event.subject) return;

    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
    dragX = event.x;
    dragY = event.y;
}

function dragged(event: any) {
    if (!event.subject) return;

    dragX += event.dx / zoomAnimator.get('zoom');
    dragY += event.dy / zoomAnimator.get('zoom');

    event.subject.fx = dragX;
    event.subject.fy = dragY;
}

function dragended(event: any) {
    if (!event.subject) return;

    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
}
