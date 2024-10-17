<p align="center">
	<img src="https://raw.githubusercontent.com/Fevol/starlight-site-graph/refs/heads/main/assets/icon.png" width="400">
</p>

---

<div align="center">
<a href="https://github.com/Fevol/starlight-site-graph/" style="text-decoration: none">
<img alt="Starlight Site Graph downloads - weekly" src="https://img.shields.io/npm/dw/starlight-site-graph?label=Downloads:&logo=npm&color=CB3837&logoColor=CB3837">
</a>
<a href="https://github.com/Fevol/starlight-site-graph/stargazers" style="text-decoration: none">
<img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/fevol/starlight-site-graph?color=yellow&label=Stargazers%3A&logo=OpenTelemetry&logoColor=yellow">
</a>
<a href="https://github.com/Fevol/starlight-site-graph/actions/workflows/release.yml" style="text-decoration: none">
<img alt="GitHub Workflow Status" src="https://img.shields.io/github/actions/workflow/status/fevol/starlight-site-graph/.github/workflows/publish.yml?label=Build%20status%3A&logo=buddy&logoColor=5cff1e">
</a>
<a href="https://github.com/Fevol/starlight-site-graph/releases/latest" style="text-decoration: none">
<img alt="GitHub release (latest by date including pre-releases)" src="https://img.shields.io/github/v/release/fevol/starlight-site-graph?color=%234e96af&display_name=tag&include_prereleases&label=Latest%20release%3A&logo=Dropbox&logoColor=%236abdd9">
</a>
<br>
<a href="https://astro.build/" style="text-decoration: none">
<img alt="Astro" src="https://img.shields.io/badge/-Astro-BC52EE?logo=Astro&logoColor=white&style=flat&">
</a>
<a href="https://starlight.astro.build/" style="text-decoration: none">
<img alt="Starlight" src="https://img.shields.io/badge/-Starlight-E1A037?logo=Starship&logoColor=white&style=flat&">
</a>
</div>

---

<div align="center">
<h4>
 <a href="https://fevol.github.io/starlight-site-graph/getting-started/">GET STARTED</a>
 <span>&nbsp;·&nbsp;</span>
 <a href="https://fevol.github.io/starlight-site-graph/">WEBSITE</a>
 <span>&nbsp;·&nbsp;</span>
 <a href="https://fevol.github.io/starlight-site-graph/configuration/">CONFIGURATION</a>
</h4>
</div>

---

A package/plugin for [Starlight](https://starlight.astro.build/) and [Astro](https://astro.build/)
which allows you to add a graph to your website, visualizing connections between pages.

<br>
<p align="center">
	<img src="https://raw.githubusercontent.com/Fevol/starlight-site-graph/refs/heads/main/assets/website-showcase.png" width="400">
</p>
<br>

---

<a name="table-of-contents"></a>

## 📑 Table of Contents

- [📑 Table of Contents](#table-of-contents)
- [🧰 Set-up](#setup)
- [💬 Discussion and Feedback](#discussion-and-feedback)
- [💎 Acknowledgements](#acknowledgements)
- [🤝 Contributors](#contributors)
- [❤️ Support](#support)

---

## 🧰 Set-up

You can install this package from [npm](https://www.npmjs.com/package/starlight-site-graph) from your favourite package manager:

```bash
npm install starlight-site-graph
```

If you are using Starlight, you can just add the following to your `astro.config.mjs`:

```js
// astro.config.mjs
import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import starlightSiteGraph from 'starlight-site-graph'

export default defineConfig({
    integrations: [
        starlight({ 
            plugins: [starlightSiteGraph({ ... })],
            title: 'My Docs',
        }),
    ],
})
```
If you are just using Astro, you will instead need to register it as follows:
```js
// astro.config.mjs
import sitegraphSitemapIntegration from 'starlight-site-graph/integration';
import { defineConfig } from 'astro/config'
export default defineConfig({
    prefetch: true,
    integrations: [
      // ...
      sitegraphSitemapIntegration({ ... })
    ]
})
```

For more information, check out the [Getting Started](https://fevol.github.io/starlight-site-graph/getting-started/) guide.

<a name="discussion-and-feedback"></a>

## 💬 Discussion and Feedback

Any feedback would _very_ much be appreciated. Please use the [GitHub issue tracker](https://github.com/Fevol/starlight-site-graph/issues/new) to report bugs, request features,
or suggest improvements, or message me over on Discord (`@fevol`).

---

<a name="acknowledgements"></a>

## 💎 Acknowledgements

This plugin makes use of existing projects such as:
- [D3.js](https://d3js.org/) - For the graph visualization
- [PixiJS](https://www.pixijs.com/) - For the canvas rendering
- [Pixi Stats](https://github.com/Prozi/pixi-stats) - For the FPS counter
- [micromatch](https://github.com/micromatch/) - For glob pattern matching

And was originally inspired by [Quartz](https://github.com/jackyzha0/quartz)'s graph component.

This README makes use of [shields.io](https://shields.io) for adding badges to display some cursory information about the project.

---

<a name="contributors"></a>

## 🤝 Contributors

[mProjectsCode](https://github.com/mProjectsCode/) - For making large improvements to the graph's rendering logic and fixing many bugs. <br>
[Hideoo](https://github.com/HiDeoo/) and [Delucis](https://github.com/delucis) - For helping me to figure out how to solve some of the more difficult problems I encountered, and giving many helpful suggestions on how to improve the project.

---

<a name="support"></a>

## ❤️ Support

If you like this project, please consider giving it a star on GitHub,
contributing some code, or sponsoring me via [GitHub Sponsors](https://github.com/sponsors/Fevol)
(but my personal preference goes to the first two options).
