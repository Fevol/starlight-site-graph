<script lang="ts">
    let {showModal = $bindable()}: { showModal: boolean } = $props();

    export function clickOutside(node: HTMLElement) {
        const handleClick = (event: MouseEvent) => {
            if (node && !node.contains(event.target as HTMLElement) && !event.defaultPrevented)
                node.dispatchEvent(new CustomEvent('click_outside'))
        }
        document.addEventListener('click', handleClick, true);
        return {
            destroy() {
                document.removeEventListener('click', handleClick, true);
            }
        }
    }
</script>

{#if showModal}
    <div class="popup" use:clickOutside onclick_outside={() => { showModal = false }}>
        <slot/>
    </div>
{/if}
