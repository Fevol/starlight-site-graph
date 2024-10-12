---
title: General
sidebar:
  order: 1
---

This plugin mainly makes use of existing Starlight CSS variables to provide an easier out-of-the-box experience for 
Starlight users.

:::caution[Warning]
If you installed the plugin in an Astro environment without Starlight, you will very likely need to provide your own
CSS variables to make the Graph component look nice. 

A default configuration is provided [at the bottom of the page](#default-config).
:::

Since no `!important`'s were used in the making of this plugin, you can override all styling of the graph containers,
etc. However, you will _not_ be able to target the Graph elements themselves (i.e. nodes, links, labels), as these
exist within a `<Canvas>` context.

