<script lang="ts">
    /**
     * The graph rendering script was originally created by jackyzha0 for Quartz and released under the MIT license
     * All credits for the original script go to the original author
     * In particular, this script combines `Graph.tsx`, `graph.inline.ts` and incorporates some small changes to make
     *   the construct be compatible with Astro.
     * @license MIT
     */

    import Graph from "./Graph.svelte";
    import {type GraphConfig, defaultConfig} from "./Graph.svelte";

    import ContextMenu from './util/ContextMenu.svelte';


    import maximize from "../assets/svgs/maximize.svg?raw"
    import minimize from "../assets/svgs/minimize.svg?raw"
    import arrow from "../assets/svgs/arrow.svg?raw"
    import focus from "../assets/svgs/focus.svg?raw"
    import line from "../assets/svgs/line.svg?raw"
    import graph0 from "../assets/svgs/graph-0.svg?raw"
    import graph1 from "../assets/svgs/graph-1.svg?raw"
    import graph2 from "../assets/svgs/graph-2.svg?raw"
    import graph3 from "../assets/svgs/graph-3.svg?raw"
    import graph4 from "../assets/svgs/graph-4.svg?raw"
    import graph5 from "../assets/svgs/graph-5.svg?raw"
    import settings from "../assets/svgs/settings.svg?raw"
    import Modal from "./util/Modal.svelte";
    import sitemapFile from "./../../public/sitemap.json";

    const config: GraphConfig = $state(Object.assign({}, defaultConfig, JSON.parse(sessionStorage.getItem("graph-config") ?? "{}")));
    let renderArrowAction: HTMLElement | null = null;
    let updateGraphDepthAction: HTMLElement | null = null;

    let graph: Graph;
    let width = $state(250);
    let height = $state(250);

    let showFullscreen = $state(false);
    let showSettings = $state(false);

    const graphIconMap = {
        0: graph0,
        1: graph1,
        2: graph2,
        3: graph3,
        4: graph4,
        5: graph5,
    }

    $effect(() => {
        sessionStorage.setItem("graph-config", JSON.stringify(config));
    });

    function registerEscapeHandler(node: HTMLElement) {
        const handleClick = (e: HTMLElementEventMap["click"]) => {
            if (node && !node.contains(e.target) && !e.defaultPrevented)
                node.dispatchEvent(new CustomEvent('focusaway', node));
        }

        const handleEsc = (e: HTMLElementEventMap["keydown"]) => {
            if (!e.key.startsWith("Esc")) return;
            e.preventDefault();
            node.dispatchEvent(new CustomEvent('focusaway', node));
        }

        $effect(() => {
            if (!showFullscreen) {
                document.removeEventListener('click', handleClick);
                document.removeEventListener('keydown', handleEsc);
            } else {
                document.addEventListener('click', handleClick);
                document.addEventListener('keydown', handleEsc);
            }
        });

        return {
            destroy() {
                document.removeEventListener('click', handleClick);
                document.removeEventListener('keydown', handleEsc);
            }
        }
    }
</script>


{#snippet graphActions()}
    <div class="graph-action-container">
        <div class="graph-action svg-embed" onclick={(e) => { e.preventDefault(); config.renderArrows = !config.renderArrows }}
             bind:this={renderArrowAction}>
            {@html config.renderArrows ? arrow : line}
        </div>

        <ContextMenu
                bind:target={renderArrowAction}
                menuItems={[
                { text: "Show arrows", icon: arrow, onClick: () => { config.renderArrows = true } },
                { text: "Show lines", icon: line, onClick: () => { config.renderArrows = false } },
            ]}
        />

        <div class="graph-action svg-embed" onclick={(e) => { e.preventDefault(); showFullscreen = !showFullscreen }}>
            {@html showFullscreen ? minimize : maximize}
        </div>

        <div class="graph-action svg-embed" onclick={(e) => { e.preventDefault(); config.depth = (config.depth + 1) % 6 }}
             bind:this={updateGraphDepthAction}>
            {@html graphIconMap[config.depth]}
        </div>

        {#if showFullscreen}
            <div class="graph-action svg-embed" onclick={(e) => { e.preventDefault(); graph.zoomToFit() }}>
                {@html focus}
            </div>
        {/if}

        <ContextMenu
                bind:target={updateGraphDepthAction}
                menuItems={
                    Array.from({length: 6}, (_, i) => ({
                        text: i === 5 ?
                         "Show Entire Graph" :
                          i === 0 ?
                           "Show Only Current" :
                            i === 1 ?
                            "Show Adjacent" :
                            `Show Distance ${i}`,
                        icon: eval(`graph${i}`),
                        onClick: () => {
                            config.depth = i
                        }
                    }))
                 }
        />

        <div class="graph-action svg-embed" onclick={() => { showSettings = true }}>
            {@html settings}
        </div>
    </div>
{/snippet}

{#snippet settingsModal()}
    <Modal bind:showModal={showSettings}>
        <div class="graph-settings-modal">
            <div class="graph-settings-item">
                <div class="graph-settings-header">
                    <div class="graph-settings-label">Repel Force</div>
                    <div class="graph-settings-value">{config.repelForce}</div>
                </div>
                <input type="range" min="0" max="2.5" step="0.1" bind:value={config.repelForce}/>
            </div>
            <div class="graph-settings-item">
                <div class="graph-settings-header">
                    <div class="graph-settings-label">Center Force</div>
                    <div class="graph-settings-value">{config.centerForce}</div>
                </div>
                <input type="range" min="0" max="2" step="0.1" bind:value={config.centerForce}/>
            </div>
            <div class="graph-settings-item">
                <div class="graph-settings-header">
                    <div class="graph-settings-label">Link Distance</div>
                    <div class="graph-settings-value">{config.linkDistance}</div>
                </div>
                <input type="range" min="0" max="100" step="5" bind:value={config.linkDistance}/>
            </div>
        </div>
    </Modal>
{/snippet}


<div class="graph">
    <h3>Graph View</h3>

    {#if showFullscreen}
        <div class="graph-outer">
            {@render graphActions()}
            <div class="graph-container">
            </div>
        </div>
    {/if}

    <div class:background-blur={showFullscreen}>
        <div class="graph-outer"
             bind:clientHeight={height} bind:clientWidth={width}
             use:registerEscapeHandler={showFullscreen} onfocusaway={() => { console.log("AAAA"); showFullscreen = false }}
        >
            {@render graphActions()}
            {@render settingsModal()}
            <div class="graph-container">
                <Graph bind:this={graph}
                        siteData={sitemapFile} w={width} h={height} config={config}
                />
            </div>
        </div>
    </div>
</div>
