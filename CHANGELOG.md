## [0.3.2](https://github.com/Fevol/starlight-site-graph/releases/tag/0.3.2) (2025/05/09)
### Upgrades
-    Switch all CSS provided by this package to a CSS cascade layer.
     - The theme now exists on the `sitegraph` layer, added after the base `starlight` layer.
     - Styles added by this package can now be more easily overridden with custom CSS.

### Fixes
-   Made the package version constraint less stringent, making `npm` less likely to throw a peer dependency error 
    when installing the package.
-   Catch cases where an unloaded CSS variable gets passed to `chroma`, causing a minor error in the console.


## [0.3.1](https://github.com/Fevol/starlight-site-graph/releases/tag/0.3.1) (2025/05/02)
### Upgrades
-   The minimum supported version of Starlight is now `0.33.0` due to a change in the social link syntax.

## [0.3.0](https://github.com/Fevol/starlight-site-graph/releases/tag/0.3.0) (2025/03/21)
### Upgrades
-   ⚠️ **Minor change:** The minimum supported version of Starlight is now `0.32.0`, and Astro `5.5.0`.<br>
    No breaking changes are introduced in this upgrade, but it is recommended to update component overrides
    snippets that were provided by this plugin: please remove the following lines:
    ```diff
    ---
    -import type { Props } from '@astrojs/starlight/props';
    import Default from "@astrojs/starlight/components/PageSidebar.astro";
    ---
    
    -<Default {...Astro.props}><slot /></Default>
    +<Default><slot /></Default>
    ```

### Fixes
-   Allow for the plugin configuration to be defined partially, instead of throwing an error
-   Respect Astro's `trailingSlash` configuration for sitemap generation and link following
-   Resolve mismatching Astro dependency versions due to old `astro` peer-dependency of `astro-integration-kit`
-   Bug flag not being parsed correctly, resulting in a spurious `pixi-stats` missing error

## [0.2.2](https://github.com/Fevol/starlight-site-graph/releases/tag/0.2.2) (2025/01/23)
### Upgrades
-   The minimum supported version of Starlight is now `0.31.0`, and Astro `5.1.5`.

## [0.2.1](https://github.com/Fevol/starlight-site-graph/releases/tag/0.2.1) (2025/01/23)
### Fixes
-   CSS color variables for graph nodes not supporting color spaces other than `rgb` and `rgba`
-   Re-add missing `gray-matter` dependency


## [0.2.0](https://github.com/Fevol/starlight-site-graph/releases/tag/0.2.0) (2025/01/22)
### Upgrades 
-   ⚠️ **BREAKING CHANGE:** The minimum supported version of Starlight is now `0.30.0`.<br>
    Please follow the [upgrade guide](https://github.com/withastro/starlight/releases/tag/%40astrojs/starlight%400.30.0) to update your project.<br>
    Note that the [`legacy.collections` flag](https://docs.astro.build/en/reference/legacy-flags/#collections) is not supported by this plugin and you should update your collections to use Astro's new Content Layer API.

## [0.1.11](https://github.com/Fevol/starlight-site-graph/releases/tag/0.1.11) (2024/12/12)
### Fixes
-   Backlinks not being visible when graph component is hidden in sidebar

## [0.1.10](https://github.com/Fevol/starlight-site-graph/releases/tag/0.1.10) (2024/12/9)
### Fixes
-   Page backlinks not being generated in production websites

## [0.1.9](https://github.com/Fevol/starlight-site-graph/releases/tag/0.1.9) (2024/11/13)
**First official release of the package** <br/>
Older versions can be found in the [releases](https://github.com/Fevol/starlight-site-graph/releases) but are not recommended for use.
