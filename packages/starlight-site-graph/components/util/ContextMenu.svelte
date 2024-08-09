<!--
    Adapted from https://svelte.dev/repl/6fb90919e24942b2b47d9ad154386b0c?version=3.49.0
-->
<script lang="ts">
    import {onMount} from "svelte";
    import Portal from "./Portal.svelte";

    let click_location = $state({x: 0, y: 0});
    let menu = $state({w: 0, h: 0});
    let browser = {w: 0, h: 0};
    let showMenu = $state(false);

    interface MenuItem {
        type?: "hr" | "warning" | "info",
        group?: string,
        text: string,
        icon?: string
        onClick: () => void,
    }

    interface MenuProps {
        target: HTMLElement | null,
        menuItems?: MenuItem[]
    }

    let {target = $bindable(), menuItems = []}: MenuProps = $props();
    let groupedItems = $derived(Object.groupBy(menuItems, ({ group }) => group || ""))

    onMount(() => {
        return () => {
            if (target !== null) {
                target.removeEventListener("contextmenu", () => {
                    showMenu = true;
                });
            }
        }
    })

    $effect(() => {
        if (target !== null) {
            target.addEventListener("contextmenu", rightClickContextMenu);
        }
    });

    let pos = $derived.by(() => {
        const location = {
            x: click_location.x,
            y: click_location.y
        };
        if (browser.h - location.y < menu.h)
            location.y = location.y - menu.h;
        if (browser.w - location.x < menu.w)
            location.x = location.x - menu.w;
        return location;
    })

    function rightClickContextMenu(e: MouseEvent) {
        showMenu = true;
        click_location = {
            x: e.clientX,
            y: e.clientY
        };
        browser = {
            w: window.innerWidth,
            h: window.innerHeight
        };
    }

    function getContextMenuDimension(node: HTMLElement) {
        menu = {
            w: node.offsetWidth,
            h: node.offsetHeight
        }
    }
</script>

{#if showMenu}
    <Portal>
        <nav use:getContextMenuDimension class="menu-container" style="top:{pos.y}px; left:{pos.x}px">
            <div class="menu">
                {#each Object.entries(groupedItems) as [key, group] (key)}
                    {#if key !== ""}
                        <div class="menu-separator"/>
                    {/if}

                    {#each group as item}
                        <div class="menu-item" onclickcapture={(e) => {
                            e.preventDefault();
                            item.onClick();
                            showMenu = false;
                        }}>
                            {#if item.icon}
                                <div class="menu-icon">
                                    {@html item.icon}
                                </div>
                            {/if}
                            <div class="menu-item-title">
                                {item.text}
                            </div>
                        </div>
                    {/each}
                {/each}
            </div>
        </nav>
    </Portal>
{/if}

<svelte:window oncontextmenu={(e) => { e.preventDefault() }}
               onclick={() => { showMenu = false }}
               onmouseup={(e) => { if (e.button === 2) showMenu = false }}
/>
