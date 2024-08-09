<script>
    import {getAllContexts, mount, unmount} from "svelte";
    import PortalConsumer from "./PortalConsumer.svelte";

    const { target: target = document.body, children } = $props();

    const context = getAllContexts();

    let instance;

    $effect(() => {
        instance = mount(PortalConsumer, { target, props: { children }, context })

        return () =>  {
            unmount(instance);
        }
    });
</script>
