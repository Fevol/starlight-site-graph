import {defineConfig} from "astro/config";
import starlight from "@astrojs/starlight";
import starlightSiteGraph from "starlight-site-graph";
import svelte from '@astrojs/svelte'

export default defineConfig({
    redirects: {
        "/": "/intro",
    },
    integrations: [
        svelte(),
        starlight({
            title: "Starlight Site Graph",
            credits: true,
            sidebar: [
                {
                    label: "Start Here",
                    autogenerate: {directory: "intro"}
                },
                {
                    label: "Configuration",
                    autogenerate: {directory: "configuration"}
                },
            ],
            social: {
                github: "https://github.com/fevol/starlight-site-graph",
            },
            editLink: {
                baseUrl: 'https://github.com/fevol/starlight-site-graph/edit/main/docs/',
            },
            plugins: [
                starlightSiteGraph({
                    graphConfig: {
                      depth: 8
                    },
                    sitemap: {
                        "api/namespaces/augmentations/interfaces/EditableFileView": {
                            "title": "EditableFileView",
                            "content": "",
                            "links": [
                                "api/namespaces/augmentations/interfaces/fileview/",
                                "api/namespaces/augmentations/interfaces/textfileview/",
                                "api/namespaces/augmentations/interfaces/fileview"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/augmentations/interfaces/fileview/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/augmentations/interfaces/EditableFileView",
                                "api/namespaces/augmentations/interfaces/ItemView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/augmentations/interfaces/textfileview/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/augmentations/interfaces/EditableFileView",
                                "api/namespaces/augmentations/interfaces/MarkdownView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/augmentations/interfaces/fileview": {
                            "title": "fileview",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/augmentations/interfaces/EditableFileView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/augmentations/interfaces/FileView": {
                            "title": "FileView",
                            "content": "",
                            "links": [
                                "api/namespaces/augmentations/interfaces/itemview/",
                                "api/namespaces/augmentations/interfaces/editablefileview/",
                                "api/namespaces/augmentations/interfaces/itemview"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/augmentations/interfaces/itemview/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/augmentations/interfaces/FileView",
                                "api/namespaces/augmentations/interfaces/View"
                            ],
                            "tags": []
                        },
                        "api/namespaces/augmentations/interfaces/editablefileview/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/augmentations/interfaces/FileView",
                                "api/namespaces/augmentations/interfaces/TextFileView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/augmentations/interfaces/itemview": {
                            "title": "itemview",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/augmentations/interfaces/FileView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/augmentations/interfaces/ItemView": {
                            "title": "ItemView",
                            "content": "",
                            "links": [
                                "api/namespaces/augmentations/interfaces/view/",
                                "api/namespaces/augmentations/interfaces/fileview/",
                                "api/namespaces/augmentations/interfaces/view"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/augmentations/interfaces/view/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/augmentations/interfaces/ItemView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/augmentations/interfaces/view": {
                            "title": "view",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/augmentations/interfaces/ItemView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/augmentations/interfaces/MarkdownView": {
                            "title": "MarkdownView",
                            "content": "",
                            "links": [
                                "api/namespaces/augmentations/interfaces/textfileview/",
                                "api/namespaces/augmentations/interfaces/textfileview",
                                "api/namespaces/internals/interfaces/metadataeditor/",
                                "api/namespaces/internals/interfaces/token/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/augmentations/interfaces/textfileview": {
                            "title": "textfileview",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/augmentations/interfaces/MarkdownView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/metadataeditor/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/augmentations/interfaces/MarkdownView",
                                "api/namespaces/internals/interfaces/MetadataEditorProperty",
                                "api/namespaces/internals/interfaces/PropertyRenderContext",
                                "api/namespaces/obsidian/classes/Component",
                                "api/namespaces/obsidian/classes/MarkdownView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/token/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/augmentations/interfaces/MarkdownView",
                                "api/namespaces/internals/interfaces/IFramedMarkdownEditor",
                                "api/namespaces/internals/interfaces/MarkdownBaseView",
                                "api/namespaces/internals/interfaces/MarkdownScrollableEditView",
                                "api/namespaces/internals/interfaces/TableCellEditor",
                                "api/namespaces/obsidian/classes/MarkdownEditView",
                                "api/namespaces/obsidian/classes/MarkdownView",
                                "api/namespaces/obsidian/interfaces/EditorRange"
                            ],
                            "tags": []
                        },
                        "api/namespaces/augmentations/interfaces/TextFileView": {
                            "title": "TextFileView",
                            "content": "",
                            "links": [
                                "api/namespaces/augmentations/interfaces/editablefileview/",
                                "api/namespaces/augmentations/interfaces/markdownview/",
                                "api/namespaces/augmentations/interfaces/editablefileview"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/augmentations/interfaces/markdownview/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/augmentations/interfaces/TextFileView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/augmentations/interfaces/editablefileview": {
                            "title": "editablefileview",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/augmentations/interfaces/TextFileView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/augmentations/interfaces/View": {
                            "title": "View",
                            "content": "",
                            "links": [
                                "api/namespaces/augmentations/interfaces/itemview/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/canvas/interfaces/CanvasData": {
                            "title": "CanvasData",
                            "content": "",
                            "links": [
                                "api/namespaces/canvas/interfaces/canvasedgedata/",
                                "api/namespaces/canvas/type-aliases/allcanvasnodedata/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/canvas/interfaces/canvasedgedata/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/canvas/interfaces/CanvasData"
                            ],
                            "tags": []
                        },
                        "api/namespaces/canvas/type-aliases/allcanvasnodedata/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/canvas/interfaces/CanvasData"
                            ],
                            "tags": []
                        },
                        "api/namespaces/canvas/interfaces/CanvasEdgeData": {
                            "title": "CanvasEdgeData",
                            "content": "",
                            "links": [
                                "api/namespaces/canvas/type-aliases/edgeend/",
                                "api/namespaces/canvas/type-aliases/nodeside/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/canvas/type-aliases/edgeend/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/canvas/interfaces/CanvasEdgeData"
                            ],
                            "tags": []
                        },
                        "api/namespaces/canvas/type-aliases/nodeside/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/canvas/interfaces/CanvasEdgeData"
                            ],
                            "tags": []
                        },
                        "api/namespaces/canvas/interfaces/CanvasFileData": {
                            "title": "CanvasFileData",
                            "content": "",
                            "links": [
                                "api/namespaces/canvas/interfaces/canvasnodedata/",
                                "api/namespaces/canvas/interfaces/canvasnodedata"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/canvas/interfaces/canvasnodedata/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/canvas/interfaces/CanvasFileData",
                                "api/namespaces/canvas/interfaces/CanvasGroupData",
                                "api/namespaces/canvas/interfaces/CanvasLinkData",
                                "api/namespaces/canvas/interfaces/CanvasTextData"
                            ],
                            "tags": []
                        },
                        "api/namespaces/canvas/interfaces/canvasnodedata": {
                            "title": "canvasnodedata",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/canvas/interfaces/CanvasFileData",
                                "api/namespaces/canvas/interfaces/CanvasGroupData",
                                "api/namespaces/canvas/interfaces/CanvasLinkData",
                                "api/namespaces/canvas/interfaces/CanvasTextData"
                            ],
                            "tags": []
                        },
                        "api/namespaces/canvas/interfaces/CanvasGroupData": {
                            "title": "CanvasGroupData",
                            "content": "",
                            "links": [
                                "api/namespaces/canvas/interfaces/canvasnodedata/",
                                "api/namespaces/canvas/type-aliases/backgroundstyle/",
                                "api/namespaces/canvas/interfaces/canvasnodedata"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/canvas/type-aliases/backgroundstyle/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/canvas/interfaces/CanvasGroupData"
                            ],
                            "tags": []
                        },
                        "api/namespaces/canvas/interfaces/CanvasLinkData": {
                            "title": "CanvasLinkData",
                            "content": "",
                            "links": [
                                "api/namespaces/canvas/interfaces/canvasnodedata/",
                                "api/namespaces/canvas/interfaces/canvasnodedata"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/canvas/interfaces/CanvasNodeData": {
                            "title": "CanvasNodeData",
                            "content": "",
                            "links": [
                                "api/namespaces/canvas/interfaces/canvasfiledata/",
                                "api/namespaces/canvas/interfaces/canvastextdata/",
                                "api/namespaces/canvas/interfaces/canvaslinkdata/",
                                "api/namespaces/canvas/interfaces/canvasgroupdata/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/canvas/interfaces/canvasfiledata/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/canvas/interfaces/CanvasNodeData",
                                "api/namespaces/canvas/type-aliases/AllCanvasNodeData"
                            ],
                            "tags": []
                        },
                        "api/namespaces/canvas/interfaces/canvastextdata/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/canvas/interfaces/CanvasNodeData",
                                "api/namespaces/canvas/type-aliases/AllCanvasNodeData"
                            ],
                            "tags": []
                        },
                        "api/namespaces/canvas/interfaces/canvaslinkdata/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/canvas/interfaces/CanvasNodeData",
                                "api/namespaces/canvas/type-aliases/AllCanvasNodeData"
                            ],
                            "tags": []
                        },
                        "api/namespaces/canvas/interfaces/canvasgroupdata/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/canvas/interfaces/CanvasNodeData",
                                "api/namespaces/canvas/type-aliases/AllCanvasNodeData"
                            ],
                            "tags": []
                        },
                        "api/namespaces/canvas/interfaces/CanvasTextData": {
                            "title": "CanvasTextData",
                            "content": "",
                            "links": [
                                "api/namespaces/canvas/interfaces/canvasnodedata/",
                                "api/namespaces/canvas/interfaces/canvasnodedata"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/canvas/type-aliases/AllCanvasNodeData": {
                            "title": "AllCanvasNodeData",
                            "content": "",
                            "links": [
                                "api/namespaces/canvas/interfaces/canvasfiledata/",
                                "api/namespaces/canvas/interfaces/canvastextdata/",
                                "api/namespaces/canvas/interfaces/canvaslinkdata/",
                                "api/namespaces/canvas/interfaces/canvasgroupdata/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/canvas/type-aliases/BackgroundStyle": {
                            "title": "BackgroundStyle",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/canvas/type-aliases/CanvasColor": {
                            "title": "CanvasColor",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/canvas/type-aliases/EdgeEnd": {
                            "title": "EdgeEnd",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/canvas/type-aliases/NodeSide": {
                            "title": "NodeSide",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/codemirror__view/interfaces/EditorView": {
                            "title": "EditorView",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/global/interfaces/DomElementInfo": {
                            "title": "DomElementInfo",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/AbstractSearchComponent": {
                            "title": "AbstractSearchComponent",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/editorsearchcomponent/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/classes/scope/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/editorsearchcomponent/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/AbstractSearchComponent",
                                "api/namespaces/internals/interfaces/IFramedMarkdownEditor",
                                "api/namespaces/internals/interfaces/MarkdownScrollableEditView",
                                "api/namespaces/obsidian/classes/MarkdownEditView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/app/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/AbstractSearchComponent",
                                "api/namespaces/internals/interfaces/AllPropertiesView",
                                "api/namespaces/internals/interfaces/AudioView",
                                "api/namespaces/internals/interfaces/BacklinkView",
                                "api/namespaces/internals/interfaces/BookmarksView",
                                "api/namespaces/internals/interfaces/BrowserHistoryView",
                                "api/namespaces/internals/interfaces/BrowserView",
                                "api/namespaces/internals/interfaces/CanvasLinkUpdater",
                                "api/namespaces/internals/interfaces/CanvasView",
                                "api/namespaces/internals/interfaces/ClipBoardManager",
                                "api/namespaces/internals/interfaces/Commands",
                                "api/namespaces/internals/interfaces/CustomCSS",
                                "api/namespaces/internals/interfaces/DragManager",
                                "api/namespaces/internals/interfaces/EditorSearchComponent",
                                "api/namespaces/internals/interfaces/EmbedContext",
                                "api/namespaces/internals/interfaces/EmbeddedEditorView",
                                "api/namespaces/internals/interfaces/EmptyView",
                                "api/namespaces/internals/interfaces/FileExplorerView",
                                "api/namespaces/internals/interfaces/FilePropertiesView",
                                "api/namespaces/internals/interfaces/FileSuggest",
                                "api/namespaces/internals/interfaces/FileSuggestManager",
                                "api/namespaces/internals/interfaces/GraphView",
                                "api/namespaces/internals/interfaces/HotkeyManager",
                                "api/namespaces/internals/interfaces/HotkeysSettingTab",
                                "api/namespaces/internals/interfaces/IFramedMarkdownEditor",
                                "api/namespaces/internals/interfaces/ImageView",
                                "api/namespaces/internals/interfaces/InfoFileView",
                                "api/namespaces/internals/interfaces/InternalPlugins",
                                "api/namespaces/internals/interfaces/LinkUpdate",
                                "api/namespaces/internals/interfaces/LocalGraphView",
                                "api/namespaces/internals/interfaces/MarkdownBaseView",
                                "api/namespaces/internals/interfaces/MarkdownScrollableEditView",
                                "api/namespaces/internals/interfaces/MetadataEditor",
                                "api/namespaces/internals/interfaces/MetadataEditorProperty",
                                "api/namespaces/internals/interfaces/MetadataTypeManager",
                                "api/namespaces/internals/interfaces/OutgoingLinkView",
                                "api/namespaces/internals/interfaces/OutlineView",
                                "api/namespaces/internals/interfaces/PdfView",
                                "api/namespaces/internals/interfaces/Plugins",
                                "api/namespaces/internals/interfaces/PropertyRenderContext",
                                "api/namespaces/internals/interfaces/ReleaseNotesView",
                                "api/namespaces/internals/interfaces/SearchView",
                                "api/namespaces/internals/interfaces/TableCellEditor",
                                "api/namespaces/internals/interfaces/TagView",
                                "api/namespaces/internals/interfaces/Tree",
                                "api/namespaces/internals/interfaces/UnknownView",
                                "api/namespaces/internals/interfaces/VideoView",
                                "api/namespaces/internals/interfaces/WidgetEditorView",
                                "api/namespaces/obsidian/classes/AbstractInputSuggest",
                                "api/namespaces/obsidian/classes/App",
                                "api/namespaces/obsidian/classes/EditableFileView",
                                "api/namespaces/obsidian/classes/EditorSuggest",
                                "api/namespaces/obsidian/classes/FileManager",
                                "api/namespaces/obsidian/classes/FileView",
                                "api/namespaces/obsidian/classes/FuzzySuggestModal",
                                "api/namespaces/obsidian/classes/ItemView",
                                "api/namespaces/obsidian/classes/MarkdownEditView",
                                "api/namespaces/obsidian/classes/MarkdownPreviewView",
                                "api/namespaces/obsidian/classes/MarkdownRenderer",
                                "api/namespaces/obsidian/classes/MarkdownView",
                                "api/namespaces/obsidian/classes/MetadataCache",
                                "api/namespaces/obsidian/classes/Modal",
                                "api/namespaces/obsidian/classes/Plugin",
                                "api/namespaces/obsidian/classes/PluginSettingTab",
                                "api/namespaces/obsidian/classes/PopoverSuggest",
                                "api/namespaces/obsidian/classes/Setting",
                                "api/namespaces/obsidian/classes/SettingTab",
                                "api/namespaces/obsidian/classes/SuggestModal",
                                "api/namespaces/obsidian/classes/TextFileView",
                                "api/namespaces/obsidian/classes/View",
                                "api/namespaces/obsidian/classes/Workspace",
                                "api/namespaces/obsidian/interfaces/BlockCache",
                                "api/namespaces/obsidian/interfaces/MarkdownFileInfo"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/scope/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/AbstractSearchComponent",
                                "api/namespaces/internals/interfaces/AllPropertiesView",
                                "api/namespaces/internals/interfaces/AudioView",
                                "api/namespaces/internals/interfaces/BacklinkView",
                                "api/namespaces/internals/interfaces/BookmarksView",
                                "api/namespaces/internals/interfaces/BrowserHistoryView",
                                "api/namespaces/internals/interfaces/BrowserView",
                                "api/namespaces/internals/interfaces/CanvasView",
                                "api/namespaces/internals/interfaces/EditorSearchComponent",
                                "api/namespaces/internals/interfaces/EmptyView",
                                "api/namespaces/internals/interfaces/FileExplorerView",
                                "api/namespaces/internals/interfaces/FilePropertiesView",
                                "api/namespaces/internals/interfaces/FileSuggest",
                                "api/namespaces/internals/interfaces/GraphView",
                                "api/namespaces/internals/interfaces/IFramedMarkdownEditor",
                                "api/namespaces/internals/interfaces/ImageView",
                                "api/namespaces/internals/interfaces/InfoFileView",
                                "api/namespaces/internals/interfaces/KeyScope",
                                "api/namespaces/internals/interfaces/LocalGraphView",
                                "api/namespaces/internals/interfaces/MarkdownScrollableEditView",
                                "api/namespaces/internals/interfaces/OutgoingLinkView",
                                "api/namespaces/internals/interfaces/OutlineView",
                                "api/namespaces/internals/interfaces/PdfView",
                                "api/namespaces/internals/interfaces/ReleaseNotesView",
                                "api/namespaces/internals/interfaces/SearchView",
                                "api/namespaces/internals/interfaces/TagView",
                                "api/namespaces/internals/interfaces/Tree",
                                "api/namespaces/internals/interfaces/UnknownView",
                                "api/namespaces/internals/interfaces/VideoView",
                                "api/namespaces/internals/interfaces/WidgetEditorView",
                                "api/namespaces/obsidian/classes/AbstractInputSuggest",
                                "api/namespaces/obsidian/classes/App",
                                "api/namespaces/obsidian/classes/EditableFileView",
                                "api/namespaces/obsidian/classes/EditorSuggest",
                                "api/namespaces/obsidian/classes/FileView",
                                "api/namespaces/obsidian/classes/FuzzySuggestModal",
                                "api/namespaces/obsidian/classes/ItemView",
                                "api/namespaces/obsidian/classes/Keymap",
                                "api/namespaces/obsidian/classes/MarkdownEditView",
                                "api/namespaces/obsidian/classes/MarkdownView",
                                "api/namespaces/obsidian/classes/Menu",
                                "api/namespaces/obsidian/classes/Modal",
                                "api/namespaces/obsidian/classes/PopoverSuggest",
                                "api/namespaces/obsidian/classes/Scope",
                                "api/namespaces/obsidian/classes/Setting",
                                "api/namespaces/obsidian/classes/SuggestModal",
                                "api/namespaces/obsidian/classes/TextFileView",
                                "api/namespaces/obsidian/classes/View",
                                "api/namespaces/obsidian/interfaces/KeymapEventHandler"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/Account": {
                            "title": "Account",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/AllPropertiesView": {
                            "title": "AllPropertiesView",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/itemview/",
                                "api/namespaces/obsidian/classes/component/",
                                "api/namespaces/obsidian/classes/itemview",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/classes/workspaceleaf/",
                                "api/namespaces/obsidian/classes/scope/",
                                "api/namespaces/obsidian/classes/menu/",
                                "api/namespaces/obsidian/interfaces/keymapeventhandler/",
                                "api/namespaces/obsidian/interfaces/viewstateresult/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/itemview/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/AllPropertiesView",
                                "api/namespaces/internals/interfaces/BookmarksView",
                                "api/namespaces/internals/interfaces/BrowserHistoryView",
                                "api/namespaces/internals/interfaces/BrowserView",
                                "api/namespaces/internals/interfaces/EmptyView",
                                "api/namespaces/internals/interfaces/GraphView",
                                "api/namespaces/internals/interfaces/ReleaseNotesView",
                                "api/namespaces/obsidian/classes/FileView",
                                "api/namespaces/obsidian/classes/ItemView",
                                "api/namespaces/obsidian/classes/View"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/component/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/AllPropertiesView",
                                "api/namespaces/internals/interfaces/AudioView",
                                "api/namespaces/internals/interfaces/BacklinkView",
                                "api/namespaces/internals/interfaces/BookmarksView",
                                "api/namespaces/internals/interfaces/BrowserHistoryView",
                                "api/namespaces/internals/interfaces/BrowserView",
                                "api/namespaces/internals/interfaces/CanvasView",
                                "api/namespaces/internals/interfaces/CustomCSS",
                                "api/namespaces/internals/interfaces/EmbeddedEditorView",
                                "api/namespaces/internals/interfaces/EmptyView",
                                "api/namespaces/internals/interfaces/FileExplorerView",
                                "api/namespaces/internals/interfaces/FilePropertiesView",
                                "api/namespaces/internals/interfaces/GraphView",
                                "api/namespaces/internals/interfaces/IFramedMarkdownEditor",
                                "api/namespaces/internals/interfaces/ImageView",
                                "api/namespaces/internals/interfaces/InfoFileView",
                                "api/namespaces/internals/interfaces/LocalGraphView",
                                "api/namespaces/internals/interfaces/MarkdownBaseView",
                                "api/namespaces/internals/interfaces/MarkdownScrollableEditView",
                                "api/namespaces/internals/interfaces/MetadataEditor",
                                "api/namespaces/internals/interfaces/MetadataEditorProperty",
                                "api/namespaces/internals/interfaces/OutgoingLinkView",
                                "api/namespaces/internals/interfaces/OutlineView",
                                "api/namespaces/internals/interfaces/PdfView",
                                "api/namespaces/internals/interfaces/PropertyWidget",
                                "api/namespaces/internals/interfaces/ReleaseNotesView",
                                "api/namespaces/internals/interfaces/SearchView",
                                "api/namespaces/internals/interfaces/TableCellEditor",
                                "api/namespaces/internals/interfaces/TagView",
                                "api/namespaces/internals/interfaces/UnknownView",
                                "api/namespaces/internals/interfaces/VideoView",
                                "api/namespaces/internals/interfaces/WidgetEditorView",
                                "api/namespaces/internals/type-aliases/EmbeddableConstructor",
                                "api/namespaces/obsidian/classes/Component",
                                "api/namespaces/obsidian/classes/EditableFileView",
                                "api/namespaces/obsidian/classes/FileView",
                                "api/namespaces/obsidian/classes/HoverPopover",
                                "api/namespaces/obsidian/classes/ItemView",
                                "api/namespaces/obsidian/classes/MarkdownEditView",
                                "api/namespaces/obsidian/classes/MarkdownPreviewView",
                                "api/namespaces/obsidian/classes/MarkdownRenderChild",
                                "api/namespaces/obsidian/classes/MarkdownRenderer",
                                "api/namespaces/obsidian/classes/MarkdownView",
                                "api/namespaces/obsidian/classes/Menu",
                                "api/namespaces/obsidian/classes/Plugin",
                                "api/namespaces/obsidian/classes/TextFileView",
                                "api/namespaces/obsidian/classes/View",
                                "api/namespaces/obsidian/interfaces/MarkdownPreviewEvents"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/itemview": {
                            "title": "itemview",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/AllPropertiesView",
                                "api/namespaces/internals/interfaces/BookmarksView",
                                "api/namespaces/internals/interfaces/BrowserHistoryView",
                                "api/namespaces/internals/interfaces/BrowserView",
                                "api/namespaces/internals/interfaces/EmptyView",
                                "api/namespaces/internals/interfaces/GraphView",
                                "api/namespaces/internals/interfaces/ReleaseNotesView",
                                "api/namespaces/obsidian/classes/FileView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/eventref/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/AllPropertiesView",
                                "api/namespaces/internals/interfaces/AudioView",
                                "api/namespaces/internals/interfaces/BacklinkView",
                                "api/namespaces/internals/interfaces/BookmarksView",
                                "api/namespaces/internals/interfaces/BrowserHistoryView",
                                "api/namespaces/internals/interfaces/BrowserView",
                                "api/namespaces/internals/interfaces/CanvasLeaf",
                                "api/namespaces/internals/interfaces/CanvasView",
                                "api/namespaces/internals/interfaces/CustomCSS",
                                "api/namespaces/internals/interfaces/EmbeddedEditorView",
                                "api/namespaces/internals/interfaces/EmbedRegistry",
                                "api/namespaces/internals/interfaces/EmptyView",
                                "api/namespaces/internals/interfaces/FileExplorerLeaf",
                                "api/namespaces/internals/interfaces/FileExplorerView",
                                "api/namespaces/internals/interfaces/FilePropertiesView",
                                "api/namespaces/internals/interfaces/GlobalSearchLeaf",
                                "api/namespaces/internals/interfaces/GraphView",
                                "api/namespaces/internals/interfaces/IFramedMarkdownEditor",
                                "api/namespaces/internals/interfaces/ImageView",
                                "api/namespaces/internals/interfaces/InfoFileView",
                                "api/namespaces/internals/interfaces/InternalPlugins",
                                "api/namespaces/internals/interfaces/LocalGraphView",
                                "api/namespaces/internals/interfaces/MarkdownBaseView",
                                "api/namespaces/internals/interfaces/MarkdownScrollableEditView",
                                "api/namespaces/internals/interfaces/MetadataEditor",
                                "api/namespaces/internals/interfaces/MetadataEditorProperty",
                                "api/namespaces/internals/interfaces/MetadataTypeManager",
                                "api/namespaces/internals/interfaces/OutgoingLinkView",
                                "api/namespaces/internals/interfaces/OutlineView",
                                "api/namespaces/internals/interfaces/PdfView",
                                "api/namespaces/internals/interfaces/ReleaseNotesView",
                                "api/namespaces/internals/interfaces/SearchView",
                                "api/namespaces/internals/interfaces/TableCellEditor",
                                "api/namespaces/internals/interfaces/TagView",
                                "api/namespaces/internals/interfaces/UnknownView",
                                "api/namespaces/internals/interfaces/VideoView",
                                "api/namespaces/internals/interfaces/ViewRegistry",
                                "api/namespaces/internals/interfaces/WidgetEditorView",
                                "api/namespaces/obsidian/classes/Component",
                                "api/namespaces/obsidian/classes/EditableFileView",
                                "api/namespaces/obsidian/classes/Events",
                                "api/namespaces/obsidian/classes/FileView",
                                "api/namespaces/obsidian/classes/HoverPopover",
                                "api/namespaces/obsidian/classes/ItemView",
                                "api/namespaces/obsidian/classes/MarkdownEditView",
                                "api/namespaces/obsidian/classes/MarkdownPreviewView",
                                "api/namespaces/obsidian/classes/MarkdownRenderChild",
                                "api/namespaces/obsidian/classes/MarkdownRenderer",
                                "api/namespaces/obsidian/classes/MarkdownView",
                                "api/namespaces/obsidian/classes/Menu",
                                "api/namespaces/obsidian/classes/MetadataCache",
                                "api/namespaces/obsidian/classes/Plugin",
                                "api/namespaces/obsidian/classes/TextFileView",
                                "api/namespaces/obsidian/classes/Vault",
                                "api/namespaces/obsidian/classes/View",
                                "api/namespaces/obsidian/classes/Workspace",
                                "api/namespaces/obsidian/classes/WorkspaceContainer",
                                "api/namespaces/obsidian/classes/WorkspaceFloating",
                                "api/namespaces/obsidian/classes/WorkspaceItem",
                                "api/namespaces/obsidian/classes/WorkspaceLeaf",
                                "api/namespaces/obsidian/classes/WorkspaceMobileDrawer",
                                "api/namespaces/obsidian/classes/WorkspaceParent",
                                "api/namespaces/obsidian/classes/WorkspaceRoot",
                                "api/namespaces/obsidian/classes/WorkspaceSidedock",
                                "api/namespaces/obsidian/classes/WorkspaceSplit",
                                "api/namespaces/obsidian/classes/WorkspaceTabs",
                                "api/namespaces/obsidian/classes/WorkspaceWindow",
                                "api/namespaces/obsidian/interfaces/MarkdownPreviewEvents"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/workspaceleaf/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/AllPropertiesView",
                                "api/namespaces/internals/interfaces/AudioView",
                                "api/namespaces/internals/interfaces/BacklinkView",
                                "api/namespaces/internals/interfaces/BookmarksView",
                                "api/namespaces/internals/interfaces/BrowserHistoryView",
                                "api/namespaces/internals/interfaces/BrowserView",
                                "api/namespaces/internals/interfaces/CanvasLeaf",
                                "api/namespaces/internals/interfaces/CanvasView",
                                "api/namespaces/internals/interfaces/EmptyView",
                                "api/namespaces/internals/interfaces/FileExplorerLeaf",
                                "api/namespaces/internals/interfaces/FileExplorerView",
                                "api/namespaces/internals/interfaces/FilePropertiesView",
                                "api/namespaces/internals/interfaces/GlobalSearchLeaf",
                                "api/namespaces/internals/interfaces/GraphView",
                                "api/namespaces/internals/interfaces/HoverLinkEvent",
                                "api/namespaces/internals/interfaces/ImageView",
                                "api/namespaces/internals/interfaces/InfoFileView",
                                "api/namespaces/internals/interfaces/LocalGraphView",
                                "api/namespaces/internals/interfaces/OutgoingLinkView",
                                "api/namespaces/internals/interfaces/OutlineView",
                                "api/namespaces/internals/interfaces/PdfView",
                                "api/namespaces/internals/interfaces/ReleaseNotesView",
                                "api/namespaces/internals/interfaces/SearchView",
                                "api/namespaces/internals/interfaces/TagView",
                                "api/namespaces/internals/interfaces/UnknownView",
                                "api/namespaces/internals/interfaces/VideoView",
                                "api/namespaces/internals/interfaces/ViewRegistry",
                                "api/namespaces/obsidian/classes/EditableFileView",
                                "api/namespaces/obsidian/classes/FileView",
                                "api/namespaces/obsidian/classes/ItemView",
                                "api/namespaces/obsidian/classes/MarkdownView",
                                "api/namespaces/obsidian/classes/TextFileView",
                                "api/namespaces/obsidian/classes/View",
                                "api/namespaces/obsidian/classes/Workspace",
                                "api/namespaces/obsidian/classes/WorkspaceItem",
                                "api/namespaces/obsidian/classes/WorkspaceLeaf",
                                "api/namespaces/obsidian/interfaces/OpenViewState",
                                "api/namespaces/obsidian/interfaces/ViewState",
                                "api/namespaces/obsidian/type-aliases/ViewCreator"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/menu/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/AllPropertiesView",
                                "api/namespaces/internals/interfaces/AudioView",
                                "api/namespaces/internals/interfaces/BacklinkView",
                                "api/namespaces/internals/interfaces/BookmarksView",
                                "api/namespaces/internals/interfaces/BrowserHistoryView",
                                "api/namespaces/internals/interfaces/BrowserView",
                                "api/namespaces/internals/interfaces/CanvasView",
                                "api/namespaces/internals/interfaces/EmptyView",
                                "api/namespaces/internals/interfaces/FileExplorerView",
                                "api/namespaces/internals/interfaces/FilePropertiesView",
                                "api/namespaces/internals/interfaces/GraphView",
                                "api/namespaces/internals/interfaces/ImageView",
                                "api/namespaces/internals/interfaces/InfoFileView",
                                "api/namespaces/internals/interfaces/LocalGraphView",
                                "api/namespaces/internals/interfaces/OutgoingLinkView",
                                "api/namespaces/internals/interfaces/OutlineView",
                                "api/namespaces/internals/interfaces/PdfView",
                                "api/namespaces/internals/interfaces/ReleaseNotesView",
                                "api/namespaces/internals/interfaces/SearchView",
                                "api/namespaces/internals/interfaces/TagView",
                                "api/namespaces/internals/interfaces/UnknownView",
                                "api/namespaces/internals/interfaces/VideoView",
                                "api/namespaces/obsidian/classes/Component",
                                "api/namespaces/obsidian/classes/EditableFileView",
                                "api/namespaces/obsidian/classes/FileView",
                                "api/namespaces/obsidian/classes/ItemView",
                                "api/namespaces/obsidian/classes/MarkdownView",
                                "api/namespaces/obsidian/classes/Menu",
                                "api/namespaces/obsidian/classes/MenuItem",
                                "api/namespaces/obsidian/classes/TextFileView",
                                "api/namespaces/obsidian/classes/View",
                                "api/namespaces/obsidian/interfaces/CloseableComponent"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/keymapeventhandler/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/AllPropertiesView",
                                "api/namespaces/internals/interfaces/AudioView",
                                "api/namespaces/internals/interfaces/BacklinkView",
                                "api/namespaces/internals/interfaces/BookmarksView",
                                "api/namespaces/internals/interfaces/BrowserHistoryView",
                                "api/namespaces/internals/interfaces/BrowserView",
                                "api/namespaces/internals/interfaces/CanvasView",
                                "api/namespaces/internals/interfaces/CustomCSS",
                                "api/namespaces/internals/interfaces/EmbeddedEditorView",
                                "api/namespaces/internals/interfaces/EmptyView",
                                "api/namespaces/internals/interfaces/FileExplorerView",
                                "api/namespaces/internals/interfaces/FilePropertiesView",
                                "api/namespaces/internals/interfaces/GraphView",
                                "api/namespaces/internals/interfaces/IFramedMarkdownEditor",
                                "api/namespaces/internals/interfaces/ImageView",
                                "api/namespaces/internals/interfaces/InfoFileView",
                                "api/namespaces/internals/interfaces/LocalGraphView",
                                "api/namespaces/internals/interfaces/MarkdownBaseView",
                                "api/namespaces/internals/interfaces/MarkdownScrollableEditView",
                                "api/namespaces/internals/interfaces/MetadataEditor",
                                "api/namespaces/internals/interfaces/MetadataEditorProperty",
                                "api/namespaces/internals/interfaces/OutgoingLinkView",
                                "api/namespaces/internals/interfaces/OutlineView",
                                "api/namespaces/internals/interfaces/PdfView",
                                "api/namespaces/internals/interfaces/ReleaseNotesView",
                                "api/namespaces/internals/interfaces/SearchView",
                                "api/namespaces/internals/interfaces/TableCellEditor",
                                "api/namespaces/internals/interfaces/TagView",
                                "api/namespaces/internals/interfaces/UnknownView",
                                "api/namespaces/internals/interfaces/VideoView",
                                "api/namespaces/internals/interfaces/WidgetEditorView",
                                "api/namespaces/obsidian/classes/Component",
                                "api/namespaces/obsidian/classes/EditableFileView",
                                "api/namespaces/obsidian/classes/FileView",
                                "api/namespaces/obsidian/classes/HoverPopover",
                                "api/namespaces/obsidian/classes/ItemView",
                                "api/namespaces/obsidian/classes/MarkdownEditView",
                                "api/namespaces/obsidian/classes/MarkdownPreviewView",
                                "api/namespaces/obsidian/classes/MarkdownRenderChild",
                                "api/namespaces/obsidian/classes/MarkdownRenderer",
                                "api/namespaces/obsidian/classes/MarkdownView",
                                "api/namespaces/obsidian/classes/Menu",
                                "api/namespaces/obsidian/classes/Plugin",
                                "api/namespaces/obsidian/classes/Scope",
                                "api/namespaces/obsidian/classes/TextFileView",
                                "api/namespaces/obsidian/classes/View",
                                "api/namespaces/obsidian/interfaces/KeymapInfo",
                                "api/namespaces/obsidian/interfaces/MarkdownPreviewEvents"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/viewstateresult/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/AllPropertiesView",
                                "api/namespaces/internals/interfaces/AudioView",
                                "api/namespaces/internals/interfaces/BacklinkView",
                                "api/namespaces/internals/interfaces/BookmarksView",
                                "api/namespaces/internals/interfaces/BrowserHistoryView",
                                "api/namespaces/internals/interfaces/BrowserView",
                                "api/namespaces/internals/interfaces/CanvasView",
                                "api/namespaces/internals/interfaces/EmptyView",
                                "api/namespaces/internals/interfaces/FileExplorerView",
                                "api/namespaces/internals/interfaces/FilePropertiesView",
                                "api/namespaces/internals/interfaces/GraphView",
                                "api/namespaces/internals/interfaces/ImageView",
                                "api/namespaces/internals/interfaces/InfoFileView",
                                "api/namespaces/internals/interfaces/LocalGraphView",
                                "api/namespaces/internals/interfaces/OutgoingLinkView",
                                "api/namespaces/internals/interfaces/OutlineView",
                                "api/namespaces/internals/interfaces/PdfView",
                                "api/namespaces/internals/interfaces/ReleaseNotesView",
                                "api/namespaces/internals/interfaces/SearchView",
                                "api/namespaces/internals/interfaces/TagView",
                                "api/namespaces/internals/interfaces/UnknownView",
                                "api/namespaces/internals/interfaces/VideoView",
                                "api/namespaces/obsidian/classes/EditableFileView",
                                "api/namespaces/obsidian/classes/FileView",
                                "api/namespaces/obsidian/classes/ItemView",
                                "api/namespaces/obsidian/classes/MarkdownView",
                                "api/namespaces/obsidian/classes/TextFileView",
                                "api/namespaces/obsidian/classes/View"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/AppMenuBarManager": {
                            "title": "AppMenuBarManager",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/AppVaultConfig": {
                            "title": "AppVaultConfig",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/appvaultconfighotkeysrecord/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/appvaultconfighotkeysrecord/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/AppVaultConfig"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/AppVaultConfigHotkeysRecord": {
                            "title": "AppVaultConfigHotkeysRecord",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/AudioRecorderPluginInstance": {
                            "title": "AudioRecorderPluginInstance",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/internalplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugin/",
                                "api/namespaces/internals/interfaces/audiorecorderplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugininstance"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/internalplugininstance/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/AudioRecorderPluginInstance",
                                "api/namespaces/internals/interfaces/BacklinkPluginInstance",
                                "api/namespaces/internals/interfaces/BookmarksPluginInstance",
                                "api/namespaces/internals/interfaces/CanvasPluginInstance",
                                "api/namespaces/internals/interfaces/CommandPalettePluginInstance",
                                "api/namespaces/internals/interfaces/DailyNotesPluginInstance",
                                "api/namespaces/internals/interfaces/EditorStatusPluginInstance",
                                "api/namespaces/internals/interfaces/FileExplorerPluginInstance",
                                "api/namespaces/internals/interfaces/FileRecoveryPluginInstance",
                                "api/namespaces/internals/interfaces/GlobalSearchPluginInstance",
                                "api/namespaces/internals/interfaces/GraphPluginInstance",
                                "api/namespaces/internals/interfaces/InternalPlugin",
                                "api/namespaces/internals/interfaces/InternalPluginInstance",
                                "api/namespaces/internals/interfaces/InternalPlugins",
                                "api/namespaces/internals/interfaces/MarkdownImporterPluginInstance",
                                "api/namespaces/internals/interfaces/NoteComposerPluginInstance",
                                "api/namespaces/internals/interfaces/OutgoingLinkPluginInstance",
                                "api/namespaces/internals/interfaces/OutlinePluginInstance",
                                "api/namespaces/internals/interfaces/PagePreviewPluginInstance",
                                "api/namespaces/internals/interfaces/PropertiesPluginInstance",
                                "api/namespaces/internals/interfaces/PublishPluginInstance",
                                "api/namespaces/internals/interfaces/RandomNotePluginInstance",
                                "api/namespaces/internals/interfaces/SlashCommandPluginInstance",
                                "api/namespaces/internals/interfaces/SlidesPluginInstance",
                                "api/namespaces/internals/interfaces/StarredPluginInstance",
                                "api/namespaces/internals/interfaces/SwitcherPluginInstance",
                                "api/namespaces/internals/interfaces/SyncPluginInstance",
                                "api/namespaces/internals/interfaces/TagPanePluginInstance",
                                "api/namespaces/internals/interfaces/TemplatesPluginInstance",
                                "api/namespaces/internals/interfaces/WordCountPluginInstance",
                                "api/namespaces/internals/interfaces/WorkspacesPluginInstance",
                                "api/namespaces/internals/interfaces/ZkPrefixerPluginInstance"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/internalplugin/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/AudioRecorderPluginInstance",
                                "api/namespaces/internals/interfaces/BacklinkPluginInstance",
                                "api/namespaces/internals/interfaces/BookmarksPluginInstance",
                                "api/namespaces/internals/interfaces/CanvasPluginInstance",
                                "api/namespaces/internals/interfaces/CommandPalettePluginInstance",
                                "api/namespaces/internals/interfaces/DailyNotesPluginInstance",
                                "api/namespaces/internals/interfaces/EditorStatusPluginInstance",
                                "api/namespaces/internals/interfaces/FileExplorerPluginInstance",
                                "api/namespaces/internals/interfaces/FileRecoveryPluginInstance",
                                "api/namespaces/internals/interfaces/GlobalSearchPluginInstance",
                                "api/namespaces/internals/interfaces/GraphPluginInstance",
                                "api/namespaces/internals/interfaces/InternalPluginInstance",
                                "api/namespaces/internals/interfaces/InternalPlugins",
                                "api/namespaces/internals/interfaces/MarkdownImporterPluginInstance",
                                "api/namespaces/internals/interfaces/NoteComposerPluginInstance",
                                "api/namespaces/internals/interfaces/OutgoingLinkPluginInstance",
                                "api/namespaces/internals/interfaces/OutlinePluginInstance",
                                "api/namespaces/internals/interfaces/PagePreviewPluginInstance",
                                "api/namespaces/internals/interfaces/PropertiesPluginInstance",
                                "api/namespaces/internals/interfaces/PublishPluginInstance",
                                "api/namespaces/internals/interfaces/RandomNotePluginInstance",
                                "api/namespaces/internals/interfaces/SlashCommandPluginInstance",
                                "api/namespaces/internals/interfaces/SlidesPluginInstance",
                                "api/namespaces/internals/interfaces/StarredPluginInstance",
                                "api/namespaces/internals/interfaces/SwitcherPluginInstance",
                                "api/namespaces/internals/interfaces/SyncPluginInstance",
                                "api/namespaces/internals/interfaces/TagPanePluginInstance",
                                "api/namespaces/internals/interfaces/TemplatesPluginInstance",
                                "api/namespaces/internals/interfaces/WordCountPluginInstance",
                                "api/namespaces/internals/interfaces/WorkspacesPluginInstance",
                                "api/namespaces/internals/interfaces/ZkPrefixerPluginInstance"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/audiorecorderplugininstance/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/AudioRecorderPluginInstance",
                                "api/namespaces/internals/interfaces/InternalPluginInstance",
                                "api/namespaces/internals/interfaces/InternalPlugins",
                                "api/namespaces/internals/type-aliases/InternalPluginNameInstancesMapping"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/internalplugininstance": {
                            "title": "internalplugininstance",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/AudioRecorderPluginInstance",
                                "api/namespaces/internals/interfaces/BacklinkPluginInstance",
                                "api/namespaces/internals/interfaces/BookmarksPluginInstance",
                                "api/namespaces/internals/interfaces/CanvasPluginInstance",
                                "api/namespaces/internals/interfaces/CommandPalettePluginInstance",
                                "api/namespaces/internals/interfaces/DailyNotesPluginInstance",
                                "api/namespaces/internals/interfaces/EditorStatusPluginInstance",
                                "api/namespaces/internals/interfaces/FileExplorerPluginInstance",
                                "api/namespaces/internals/interfaces/FileRecoveryPluginInstance",
                                "api/namespaces/internals/interfaces/GlobalSearchPluginInstance",
                                "api/namespaces/internals/interfaces/GraphPluginInstance",
                                "api/namespaces/internals/interfaces/MarkdownImporterPluginInstance",
                                "api/namespaces/internals/interfaces/NoteComposerPluginInstance",
                                "api/namespaces/internals/interfaces/OutgoingLinkPluginInstance",
                                "api/namespaces/internals/interfaces/OutlinePluginInstance",
                                "api/namespaces/internals/interfaces/PagePreviewPluginInstance",
                                "api/namespaces/internals/interfaces/PropertiesPluginInstance",
                                "api/namespaces/internals/interfaces/PublishPluginInstance",
                                "api/namespaces/internals/interfaces/RandomNotePluginInstance",
                                "api/namespaces/internals/interfaces/SlashCommandPluginInstance",
                                "api/namespaces/internals/interfaces/SlidesPluginInstance",
                                "api/namespaces/internals/interfaces/StarredPluginInstance",
                                "api/namespaces/internals/interfaces/SwitcherPluginInstance",
                                "api/namespaces/internals/interfaces/SyncPluginInstance",
                                "api/namespaces/internals/interfaces/TagPanePluginInstance",
                                "api/namespaces/internals/interfaces/TemplatesPluginInstance",
                                "api/namespaces/internals/interfaces/WordCountPluginInstance",
                                "api/namespaces/internals/interfaces/WorkspacesPluginInstance",
                                "api/namespaces/internals/interfaces/ZkPrefixerPluginInstance"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/AudioView": {
                            "title": "AudioView",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/editablefileview/",
                                "api/namespaces/obsidian/classes/component/",
                                "api/namespaces/obsidian/classes/editablefileview",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/classes/tfile/",
                                "api/namespaces/obsidian/classes/workspaceleaf/",
                                "api/namespaces/obsidian/classes/scope/",
                                "api/namespaces/obsidian/classes/menu/",
                                "api/namespaces/obsidian/interfaces/keymapeventhandler/",
                                "api/namespaces/obsidian/interfaces/viewstateresult/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/editablefileview/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/AudioView",
                                "api/namespaces/internals/interfaces/ImageView",
                                "api/namespaces/internals/interfaces/PdfView",
                                "api/namespaces/internals/interfaces/VideoView",
                                "api/namespaces/obsidian/classes/EditableFileView",
                                "api/namespaces/obsidian/classes/FileView",
                                "api/namespaces/obsidian/classes/TextFileView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/editablefileview": {
                            "title": "editablefileview",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/AudioView",
                                "api/namespaces/internals/interfaces/ImageView",
                                "api/namespaces/internals/interfaces/PdfView",
                                "api/namespaces/internals/interfaces/VideoView",
                                "api/namespaces/obsidian/classes/TextFileView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/tfile/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/AudioView",
                                "api/namespaces/internals/interfaces/BacklinkView",
                                "api/namespaces/internals/interfaces/BookmarksView",
                                "api/namespaces/internals/interfaces/CanvasLeaf",
                                "api/namespaces/internals/interfaces/CanvasLinkUpdater",
                                "api/namespaces/internals/interfaces/CanvasView",
                                "api/namespaces/internals/interfaces/DragManager",
                                "api/namespaces/internals/interfaces/EditorSuggests",
                                "api/namespaces/internals/interfaces/EmbeddedEditorView",
                                "api/namespaces/internals/interfaces/EmbedRegistry",
                                "api/namespaces/internals/interfaces/FileExplorerLeaf",
                                "api/namespaces/internals/interfaces/FileExplorerPluginInstance",
                                "api/namespaces/internals/interfaces/FileExplorerView",
                                "api/namespaces/internals/interfaces/FilePropertiesView",
                                "api/namespaces/internals/interfaces/FileSuggest",
                                "api/namespaces/internals/interfaces/FileSuggestManager",
                                "api/namespaces/internals/interfaces/GlobalSearchLeaf",
                                "api/namespaces/internals/interfaces/IFramedMarkdownEditor",
                                "api/namespaces/internals/interfaces/ImageView",
                                "api/namespaces/internals/interfaces/InfoFileView",
                                "api/namespaces/internals/interfaces/LinkUpdate",
                                "api/namespaces/internals/interfaces/LinkUpdater",
                                "api/namespaces/internals/interfaces/LocalGraphView",
                                "api/namespaces/internals/interfaces/MarkdownBaseView",
                                "api/namespaces/internals/interfaces/MarkdownScrollableEditView",
                                "api/namespaces/internals/interfaces/OutgoingLinkView",
                                "api/namespaces/internals/interfaces/OutlineView",
                                "api/namespaces/internals/interfaces/PdfView",
                                "api/namespaces/internals/interfaces/TableCellEditor",
                                "api/namespaces/internals/interfaces/VideoView",
                                "api/namespaces/internals/interfaces/WidgetEditorView",
                                "api/namespaces/internals/type-aliases/EmbeddableConstructor",
                                "api/namespaces/obsidian/classes/App",
                                "api/namespaces/obsidian/classes/EditableFileView",
                                "api/namespaces/obsidian/classes/EditorSuggest",
                                "api/namespaces/obsidian/classes/FileManager",
                                "api/namespaces/obsidian/classes/FileView",
                                "api/namespaces/obsidian/classes/MarkdownEditView",
                                "api/namespaces/obsidian/classes/MarkdownPreviewView",
                                "api/namespaces/obsidian/classes/MarkdownRenderer",
                                "api/namespaces/obsidian/classes/MarkdownView",
                                "api/namespaces/obsidian/classes/MetadataCache",
                                "api/namespaces/obsidian/classes/TAbstractFile",
                                "api/namespaces/obsidian/classes/TextFileView",
                                "api/namespaces/obsidian/classes/TFile",
                                "api/namespaces/obsidian/classes/Vault",
                                "api/namespaces/obsidian/classes/Workspace",
                                "api/namespaces/obsidian/classes/WorkspaceLeaf",
                                "api/namespaces/obsidian/interfaces/EditorSuggestContext",
                                "api/namespaces/obsidian/interfaces/MarkdownFileInfo"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/BacklinkPluginInstance": {
                            "title": "BacklinkPluginInstance",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/internalplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugin/",
                                "api/namespaces/internals/interfaces/backlinkplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugininstance"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/backlinkplugininstance/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/BacklinkPluginInstance",
                                "api/namespaces/internals/interfaces/InternalPluginInstance",
                                "api/namespaces/internals/interfaces/InternalPlugins",
                                "api/namespaces/internals/type-aliases/InternalPluginNameInstancesMapping"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/BacklinkView": {
                            "title": "BacklinkView",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/infofileview/",
                                "api/namespaces/obsidian/classes/component/",
                                "api/namespaces/internals/interfaces/infofileview",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/classes/tfile/",
                                "api/namespaces/obsidian/classes/workspaceleaf/",
                                "api/namespaces/obsidian/classes/scope/",
                                "api/namespaces/obsidian/classes/menu/",
                                "api/namespaces/obsidian/interfaces/keymapeventhandler/",
                                "api/namespaces/obsidian/interfaces/viewstateresult/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/infofileview/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/BacklinkView",
                                "api/namespaces/internals/interfaces/FilePropertiesView",
                                "api/namespaces/internals/interfaces/LocalGraphView",
                                "api/namespaces/internals/interfaces/OutgoingLinkView",
                                "api/namespaces/internals/interfaces/OutlineView",
                                "api/namespaces/obsidian/classes/FileView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/infofileview": {
                            "title": "infofileview",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/BacklinkView",
                                "api/namespaces/internals/interfaces/FilePropertiesView",
                                "api/namespaces/internals/interfaces/LocalGraphView",
                                "api/namespaces/internals/interfaces/OutgoingLinkView",
                                "api/namespaces/internals/interfaces/OutlineView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/BaseEditor": {
                            "title": "BaseEditor",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/editor/",
                                "api/namespaces/obsidian/interfaces/editorposition/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/editor/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/BaseEditor",
                                "api/namespaces/internals/interfaces/EditorSearchComponent",
                                "api/namespaces/internals/interfaces/FileSuggest",
                                "api/namespaces/internals/interfaces/IFramedMarkdownEditor",
                                "api/namespaces/internals/interfaces/MarkdownBaseView",
                                "api/namespaces/internals/interfaces/MarkdownScrollableEditView",
                                "api/namespaces/internals/interfaces/TableCellEditor",
                                "api/namespaces/obsidian/classes/Editor",
                                "api/namespaces/obsidian/classes/EditorSuggest",
                                "api/namespaces/obsidian/classes/MarkdownEditView",
                                "api/namespaces/obsidian/classes/MarkdownView",
                                "api/namespaces/obsidian/interfaces/Command",
                                "api/namespaces/obsidian/interfaces/EditorSuggestContext",
                                "api/namespaces/obsidian/interfaces/MarkdownFileInfo"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/editorposition/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/BaseEditor",
                                "api/namespaces/internals/interfaces/FileSuggest",
                                "api/namespaces/internals/interfaces/SearchCursor",
                                "api/namespaces/internals/interfaces/Token",
                                "api/namespaces/obsidian/classes/Editor",
                                "api/namespaces/obsidian/classes/EditorSuggest",
                                "api/namespaces/obsidian/interfaces/EditorChange",
                                "api/namespaces/obsidian/interfaces/EditorRange",
                                "api/namespaces/obsidian/interfaces/EditorRangeOrCaret",
                                "api/namespaces/obsidian/interfaces/EditorSelection",
                                "api/namespaces/obsidian/interfaces/EditorSelectionOrCaret",
                                "api/namespaces/obsidian/interfaces/EditorSuggestContext",
                                "api/namespaces/obsidian/interfaces/EditorSuggestTriggerInfo"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/BookmarksPluginInstance": {
                            "title": "BookmarksPluginInstance",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/internalplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugin/",
                                "api/namespaces/internals/interfaces/bookmarksplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugininstance"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/bookmarksplugininstance/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/BookmarksPluginInstance",
                                "api/namespaces/internals/interfaces/InternalPluginInstance",
                                "api/namespaces/internals/interfaces/InternalPlugins",
                                "api/namespaces/internals/type-aliases/InternalPluginNameInstancesMapping"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/BookmarksView": {
                            "title": "BookmarksView",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/itemview/",
                                "api/namespaces/obsidian/classes/component/",
                                "api/namespaces/obsidian/classes/itemview",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/classes/workspaceleaf/",
                                "api/namespaces/obsidian/classes/scope/",
                                "api/namespaces/obsidian/classes/tfile/",
                                "api/namespaces/obsidian/classes/menu/",
                                "api/namespaces/obsidian/interfaces/keymapeventhandler/",
                                "api/namespaces/obsidian/interfaces/viewstateresult/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/BrowserHistoryView": {
                            "title": "BrowserHistoryView",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/itemview/",
                                "api/namespaces/obsidian/classes/component/",
                                "api/namespaces/obsidian/classes/itemview",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/classes/workspaceleaf/",
                                "api/namespaces/obsidian/classes/scope/",
                                "api/namespaces/obsidian/classes/menu/",
                                "api/namespaces/obsidian/interfaces/keymapeventhandler/",
                                "api/namespaces/obsidian/interfaces/viewstateresult/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/BrowserView": {
                            "title": "BrowserView",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/itemview/",
                                "api/namespaces/obsidian/classes/component/",
                                "api/namespaces/obsidian/classes/itemview",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/classes/workspaceleaf/",
                                "api/namespaces/obsidian/classes/scope/",
                                "api/namespaces/obsidian/classes/menu/",
                                "api/namespaces/obsidian/interfaces/keymapeventhandler/",
                                "api/namespaces/obsidian/interfaces/viewstateresult/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/CanvasConnection": {
                            "title": "CanvasConnection",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/CanvasLeaf": {
                            "title": "CanvasLeaf",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/workspaceleaf/",
                                "api/namespaces/obsidian/classes/workspaceleaf",
                                "api/namespaces/obsidian/classes/workspacemobiledrawer/",
                                "api/namespaces/obsidian/classes/workspacetabs/",
                                "api/namespaces/obsidian/classes/view/",
                                "api/namespaces/obsidian/classes/workspacecontainer/",
                                "api/namespaces/obsidian/classes/workspaceroot",
                                "api/namespaces/obsidian/classes/workspacewindow",
                                "api/namespaces/obsidian/classes/workspaceitem/",
                                "api/namespaces/obsidian/interfaces/viewstate/",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/classes/tfile/",
                                "api/namespaces/obsidian/interfaces/openviewstate/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/workspaceleaf": {
                            "title": "workspaceleaf",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/CanvasLeaf",
                                "api/namespaces/internals/interfaces/FileExplorerLeaf",
                                "api/namespaces/internals/interfaces/GlobalSearchLeaf"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/workspacemobiledrawer/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/CanvasLeaf",
                                "api/namespaces/internals/interfaces/FileExplorerLeaf",
                                "api/namespaces/internals/interfaces/GlobalSearchLeaf",
                                "api/namespaces/obsidian/classes/Workspace",
                                "api/namespaces/obsidian/classes/WorkspaceLeaf",
                                "api/namespaces/obsidian/classes/WorkspaceMobileDrawer",
                                "api/namespaces/obsidian/classes/WorkspaceParent"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/workspacetabs/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/CanvasLeaf",
                                "api/namespaces/internals/interfaces/FileExplorerLeaf",
                                "api/namespaces/internals/interfaces/GlobalSearchLeaf",
                                "api/namespaces/obsidian/classes/Workspace",
                                "api/namespaces/obsidian/classes/WorkspaceLeaf",
                                "api/namespaces/obsidian/classes/WorkspaceParent",
                                "api/namespaces/obsidian/classes/WorkspaceTabs"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/view/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/CanvasLeaf",
                                "api/namespaces/internals/interfaces/FileExplorerLeaf",
                                "api/namespaces/internals/interfaces/FileExplorerView",
                                "api/namespaces/internals/interfaces/GlobalSearchLeaf",
                                "api/namespaces/internals/interfaces/OutlineView",
                                "api/namespaces/internals/interfaces/SearchView",
                                "api/namespaces/internals/interfaces/TagView",
                                "api/namespaces/internals/interfaces/Tree",
                                "api/namespaces/internals/interfaces/ViewRegistry",
                                "api/namespaces/internals/interfaces/ViewRegistryViewByTypeRecord",
                                "api/namespaces/internals/type-aliases/TreeItem",
                                "api/namespaces/obsidian/classes/Component",
                                "api/namespaces/obsidian/classes/ItemView",
                                "api/namespaces/obsidian/classes/View",
                                "api/namespaces/obsidian/classes/Workspace",
                                "api/namespaces/obsidian/classes/WorkspaceLeaf",
                                "api/namespaces/obsidian/type-aliases/ViewCreator"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/workspacecontainer/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/CanvasLeaf",
                                "api/namespaces/internals/interfaces/FileExplorerLeaf",
                                "api/namespaces/internals/interfaces/GlobalSearchLeaf",
                                "api/namespaces/obsidian/classes/WorkspaceContainer",
                                "api/namespaces/obsidian/classes/WorkspaceFloating",
                                "api/namespaces/obsidian/classes/WorkspaceItem",
                                "api/namespaces/obsidian/classes/WorkspaceLeaf",
                                "api/namespaces/obsidian/classes/WorkspaceMobileDrawer",
                                "api/namespaces/obsidian/classes/WorkspaceParent",
                                "api/namespaces/obsidian/classes/WorkspaceRoot",
                                "api/namespaces/obsidian/classes/WorkspaceSidedock",
                                "api/namespaces/obsidian/classes/WorkspaceSplit",
                                "api/namespaces/obsidian/classes/WorkspaceTabs",
                                "api/namespaces/obsidian/classes/WorkspaceWindow"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/workspaceroot": {
                            "title": "workspaceroot",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/CanvasLeaf",
                                "api/namespaces/internals/interfaces/FileExplorerLeaf",
                                "api/namespaces/internals/interfaces/GlobalSearchLeaf",
                                "api/namespaces/obsidian/classes/WorkspaceContainer",
                                "api/namespaces/obsidian/classes/WorkspaceFloating",
                                "api/namespaces/obsidian/classes/WorkspaceItem",
                                "api/namespaces/obsidian/classes/WorkspaceLeaf",
                                "api/namespaces/obsidian/classes/WorkspaceMobileDrawer",
                                "api/namespaces/obsidian/classes/WorkspaceParent",
                                "api/namespaces/obsidian/classes/WorkspaceRoot",
                                "api/namespaces/obsidian/classes/WorkspaceSidedock",
                                "api/namespaces/obsidian/classes/WorkspaceSplit",
                                "api/namespaces/obsidian/classes/WorkspaceTabs",
                                "api/namespaces/obsidian/classes/WorkspaceWindow"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/workspacewindow": {
                            "title": "workspacewindow",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/CanvasLeaf",
                                "api/namespaces/internals/interfaces/FileExplorerLeaf",
                                "api/namespaces/internals/interfaces/GlobalSearchLeaf",
                                "api/namespaces/obsidian/classes/WorkspaceContainer",
                                "api/namespaces/obsidian/classes/WorkspaceFloating",
                                "api/namespaces/obsidian/classes/WorkspaceItem",
                                "api/namespaces/obsidian/classes/WorkspaceLeaf",
                                "api/namespaces/obsidian/classes/WorkspaceMobileDrawer",
                                "api/namespaces/obsidian/classes/WorkspaceParent",
                                "api/namespaces/obsidian/classes/WorkspaceRoot",
                                "api/namespaces/obsidian/classes/WorkspaceSidedock",
                                "api/namespaces/obsidian/classes/WorkspaceSplit",
                                "api/namespaces/obsidian/classes/WorkspaceTabs",
                                "api/namespaces/obsidian/classes/WorkspaceWindow"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/workspaceitem/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/CanvasLeaf",
                                "api/namespaces/internals/interfaces/FileExplorerLeaf",
                                "api/namespaces/internals/interfaces/GlobalSearchLeaf",
                                "api/namespaces/obsidian/classes/Events",
                                "api/namespaces/obsidian/classes/WorkspaceContainer",
                                "api/namespaces/obsidian/classes/WorkspaceFloating",
                                "api/namespaces/obsidian/classes/WorkspaceItem",
                                "api/namespaces/obsidian/classes/WorkspaceLeaf",
                                "api/namespaces/obsidian/classes/WorkspaceMobileDrawer",
                                "api/namespaces/obsidian/classes/WorkspaceParent",
                                "api/namespaces/obsidian/classes/WorkspaceRoot",
                                "api/namespaces/obsidian/classes/WorkspaceSidedock",
                                "api/namespaces/obsidian/classes/WorkspaceSplit",
                                "api/namespaces/obsidian/classes/WorkspaceTabs",
                                "api/namespaces/obsidian/classes/WorkspaceWindow"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/viewstate/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/CanvasLeaf",
                                "api/namespaces/internals/interfaces/FileExplorerLeaf",
                                "api/namespaces/internals/interfaces/GlobalSearchLeaf",
                                "api/namespaces/internals/interfaces/LeafEntry",
                                "api/namespaces/internals/interfaces/StateHistory",
                                "api/namespaces/obsidian/classes/WorkspaceLeaf"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/openviewstate/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/CanvasLeaf",
                                "api/namespaces/internals/interfaces/FileExplorerLeaf",
                                "api/namespaces/internals/interfaces/GlobalSearchLeaf",
                                "api/namespaces/obsidian/classes/Workspace",
                                "api/namespaces/obsidian/classes/WorkspaceLeaf"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/CanvasLinkUpdater": {
                            "title": "CanvasLinkUpdater",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/linkupdater/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/internals/interfaces/canvasplugininstance/",
                                "api/namespaces/obsidian/classes/tfile/",
                                "api/namespaces/internals/interfaces/linkchangeupdate/",
                                "api/namespaces/internals/interfaces/linkupdater"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/linkupdater/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/CanvasLinkUpdater",
                                "api/namespaces/internals/interfaces/LinkUpdaters"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/canvasplugininstance/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/CanvasLinkUpdater",
                                "api/namespaces/internals/interfaces/CanvasPluginInstance",
                                "api/namespaces/internals/interfaces/InternalPluginInstance",
                                "api/namespaces/internals/interfaces/InternalPlugins",
                                "api/namespaces/internals/type-aliases/InternalPluginNameInstancesMapping"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/linkchangeupdate/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/CanvasLinkUpdater",
                                "api/namespaces/internals/interfaces/LinkUpdater"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/linkupdater": {
                            "title": "linkupdater",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/CanvasLinkUpdater"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/CanvasNode": {
                            "title": "CanvasNode",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/CanvasPluginInstance": {
                            "title": "CanvasPluginInstance",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/internalplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugin/",
                                "api/namespaces/internals/interfaces/canvasplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugininstance"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/CanvasView": {
                            "title": "CanvasView",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/textfileview/",
                                "api/namespaces/obsidian/classes/component/",
                                "api/namespaces/obsidian/classes/textfileview",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/classes/tfile/",
                                "api/namespaces/obsidian/classes/workspaceleaf/",
                                "api/namespaces/obsidian/classes/scope/",
                                "api/namespaces/obsidian/classes/menu/",
                                "api/namespaces/obsidian/interfaces/keymapeventhandler/",
                                "api/namespaces/obsidian/interfaces/viewstateresult/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/textfileview/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/CanvasView",
                                "api/namespaces/obsidian/classes/EditableFileView",
                                "api/namespaces/obsidian/classes/MarkdownView",
                                "api/namespaces/obsidian/classes/TextFileView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/textfileview": {
                            "title": "textfileview",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/CanvasView",
                                "api/namespaces/obsidian/classes/MarkdownView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/ClipBoardManager": {
                            "title": "ClipBoardManager",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/classes/markdownview/",
                                "api/namespaces/obsidian/classes/tabstractfile/",
                                "api/namespaces/internals/interfaces/importedattachments/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/markdownview/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/ClipBoardManager",
                                "api/namespaces/internals/interfaces/MetadataEditor",
                                "api/namespaces/obsidian/classes/MarkdownEditView",
                                "api/namespaces/obsidian/classes/MarkdownPreviewView",
                                "api/namespaces/obsidian/classes/MarkdownView",
                                "api/namespaces/obsidian/classes/TextFileView",
                                "api/namespaces/obsidian/interfaces/Command"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/tabstractfile/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/ClipBoardManager",
                                "api/namespaces/internals/interfaces/Draggable",
                                "api/namespaces/internals/interfaces/DragManager",
                                "api/namespaces/internals/interfaces/FileExplorerView",
                                "api/namespaces/internals/interfaces/FileTreeItem",
                                "api/namespaces/internals/interfaces/VaultFileMapRecord",
                                "api/namespaces/internals/interfaces/WidgetEditorView",
                                "api/namespaces/obsidian/classes/FileManager",
                                "api/namespaces/obsidian/classes/TAbstractFile",
                                "api/namespaces/obsidian/classes/TFile",
                                "api/namespaces/obsidian/classes/TFolder",
                                "api/namespaces/obsidian/classes/Vault"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/importedattachments/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/ClipBoardManager",
                                "api/namespaces/obsidian/classes/App"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/CommandPalettePluginInstance": {
                            "title": "CommandPalettePluginInstance",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/internalplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugin/",
                                "api/namespaces/internals/interfaces/commandpaletteplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugininstance"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/commandpaletteplugininstance/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/CommandPalettePluginInstance",
                                "api/namespaces/internals/interfaces/InternalPluginInstance",
                                "api/namespaces/internals/interfaces/InternalPlugins",
                                "api/namespaces/internals/type-aliases/InternalPluginNameInstancesMapping"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/Commands": {
                            "title": "Commands",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/internals/interfaces/commandscommandsrecord/",
                                "api/namespaces/internals/interfaces/commandseditorcommandsrecord/",
                                "api/namespaces/obsidian/interfaces/command/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/commandscommandsrecord/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/Commands"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/commandseditorcommandsrecord/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/Commands"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/command/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/Commands",
                                "api/namespaces/internals/interfaces/CommandsCommandsRecord",
                                "api/namespaces/internals/interfaces/CommandsEditorCommandsRecord",
                                "api/namespaces/obsidian/classes/Plugin"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/CommandsCommandsRecord": {
                            "title": "CommandsCommandsRecord",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/command/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/CommandsEditorCommandsRecord": {
                            "title": "CommandsEditorCommandsRecord",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/command/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/CustomArrayDict": {
                            "title": "CustomArrayDict",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/customarraydictdatarecord/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/customarraydictdatarecord/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/CustomArrayDict"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/CustomArrayDictDataRecord": {
                            "title": "CustomArrayDictDataRecord",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/CustomCSS": {
                            "title": "CustomCSS",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/component/",
                                "api/namespaces/obsidian/classes/component",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/internals/interfaces/customcssthemesrecord/",
                                "api/namespaces/internals/interfaces/thememanifest/",
                                "api/namespaces/obsidian/interfaces/keymapeventhandler/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/component": {
                            "title": "component",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/CustomCSS",
                                "api/namespaces/internals/interfaces/EmbeddedEditorView",
                                "api/namespaces/internals/interfaces/MarkdownBaseView",
                                "api/namespaces/internals/interfaces/MetadataEditor",
                                "api/namespaces/internals/interfaces/MetadataEditorProperty",
                                "api/namespaces/obsidian/classes/HoverPopover",
                                "api/namespaces/obsidian/classes/MarkdownRenderChild",
                                "api/namespaces/obsidian/classes/Menu",
                                "api/namespaces/obsidian/classes/Plugin",
                                "api/namespaces/obsidian/classes/View",
                                "api/namespaces/obsidian/interfaces/MarkdownPreviewEvents"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/customcssthemesrecord/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/CustomCSS"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/thememanifest/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/CustomCSS",
                                "api/namespaces/internals/interfaces/CustomCSSThemesRecord"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/CustomCSSThemesRecord": {
                            "title": "CustomCSSThemesRecord",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/thememanifest/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/CustomCSSUpdatesRecord": {
                            "title": "CustomCSSUpdatesRecord",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/DailyNotesPluginInstance": {
                            "title": "DailyNotesPluginInstance",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/internalplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugin/",
                                "api/namespaces/internals/interfaces/dailynotesplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugininstance"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/dailynotesplugininstance/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/DailyNotesPluginInstance",
                                "api/namespaces/internals/interfaces/InternalPluginInstance",
                                "api/namespaces/internals/interfaces/InternalPlugins",
                                "api/namespaces/internals/type-aliases/InternalPluginNameInstancesMapping"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/DataAdapterFilesRecord": {
                            "title": "DataAdapterFilesRecord",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/fileentry/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/fileentry/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/DataAdapterFilesRecord"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/DataAdapterWatchersRecord": {
                            "title": "DataAdapterWatchersRecord",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/Draggable": {
                            "title": "Draggable",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/tabstractfile/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/DragManager": {
                            "title": "DragManager",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/internals/interfaces/dragstartevent/",
                                "api/namespaces/internals/interfaces/draggable/",
                                "api/namespaces/obsidian/classes/tfile/",
                                "api/namespaces/obsidian/classes/tabstractfile/",
                                "api/namespaces/obsidian/classes/tfolder/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/dragstartevent/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/DragManager"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/draggable/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/DragManager"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/tfolder/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/DragManager",
                                "api/namespaces/internals/interfaces/FileExplorerPluginInstance",
                                "api/namespaces/internals/interfaces/FileExplorerView",
                                "api/namespaces/obsidian/classes/App",
                                "api/namespaces/obsidian/classes/FileManager",
                                "api/namespaces/obsidian/classes/TAbstractFile",
                                "api/namespaces/obsidian/classes/TFile",
                                "api/namespaces/obsidian/classes/TFolder",
                                "api/namespaces/obsidian/classes/Vault"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/DragStartEvent": {
                            "title": "DragStartEvent",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/DropResult": {
                            "title": "DropResult",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/EditorSearchComponent": {
                            "title": "EditorSearchComponent",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/abstractsearchcomponent/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/internals/interfaces/abstractsearchcomponent",
                                "api/namespaces/internals/interfaces/searchcursor/",
                                "api/namespaces/obsidian/classes/editor/",
                                "api/namespaces/obsidian/classes/scope/",
                                "api/namespaces/obsidian/interfaces/editorrange/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/abstractsearchcomponent/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/EditorSearchComponent"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/abstractsearchcomponent": {
                            "title": "abstractsearchcomponent",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/EditorSearchComponent"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/searchcursor/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/EditorSearchComponent",
                                "api/namespaces/obsidian/classes/Editor"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/editorrange/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/EditorSearchComponent",
                                "api/namespaces/internals/interfaces/StateHistory",
                                "api/namespaces/internals/interfaces/Token",
                                "api/namespaces/obsidian/classes/Editor",
                                "api/namespaces/obsidian/classes/MarkdownEditView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/EditorStatusPluginInstance": {
                            "title": "EditorStatusPluginInstance",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/internalplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugin/",
                                "api/namespaces/internals/interfaces/editorstatusplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugininstance"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/editorstatusplugininstance/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/EditorStatusPluginInstance",
                                "api/namespaces/internals/interfaces/InternalPluginInstance",
                                "api/namespaces/internals/interfaces/InternalPlugins",
                                "api/namespaces/internals/type-aliases/InternalPluginNameInstancesMapping"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/EditorSuggests": {
                            "title": "EditorSuggests",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/editorsuggest/",
                                "api/namespaces/internals/interfaces/markdownbaseview/",
                                "api/namespaces/obsidian/classes/tfile/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/editorsuggest/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/EditorSuggests",
                                "api/namespaces/internals/interfaces/FileSuggest",
                                "api/namespaces/internals/interfaces/SuggestionContainer",
                                "api/namespaces/obsidian/classes/EditorSuggest",
                                "api/namespaces/obsidian/classes/Plugin",
                                "api/namespaces/obsidian/classes/PopoverSuggest"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/markdownbaseview/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/EditorSuggests",
                                "api/namespaces/internals/interfaces/MarkdownScrollableEditView",
                                "api/namespaces/internals/interfaces/TableCellEditor",
                                "api/namespaces/obsidian/classes/Component"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/EmbedContext": {
                            "title": "EmbedContext",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/app/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/EmbeddedEditorView": {
                            "title": "EmbeddedEditorView",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/component/",
                                "api/namespaces/internals/interfaces/widgeteditorview/",
                                "api/namespaces/obsidian/classes/component",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/internals/interfaces/iframedmarkdowneditor/",
                                "api/namespaces/obsidian/classes/tfile/",
                                "api/namespaces/obsidian/classes/hoverpopover/",
                                "api/namespaces/obsidian/classes/markdownpreviewview/",
                                "api/namespaces/obsidian/interfaces/keymapeventhandler/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/widgeteditorview/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/EmbeddedEditorView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/iframedmarkdowneditor/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/EmbeddedEditorView",
                                "api/namespaces/internals/interfaces/MarkdownScrollableEditView",
                                "api/namespaces/internals/interfaces/WidgetEditorView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/hoverpopover/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/EmbeddedEditorView",
                                "api/namespaces/internals/interfaces/MetadataEditor",
                                "api/namespaces/internals/interfaces/WidgetEditorView",
                                "api/namespaces/obsidian/classes/Component",
                                "api/namespaces/obsidian/classes/HoverPopover",
                                "api/namespaces/obsidian/classes/MarkdownEditView",
                                "api/namespaces/obsidian/classes/MarkdownPreviewView",
                                "api/namespaces/obsidian/classes/MarkdownRenderer",
                                "api/namespaces/obsidian/classes/MarkdownView",
                                "api/namespaces/obsidian/interfaces/HoverParent",
                                "api/namespaces/obsidian/interfaces/MarkdownFileInfo"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/markdownpreviewview/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/EmbeddedEditorView",
                                "api/namespaces/internals/interfaces/WidgetEditorView",
                                "api/namespaces/obsidian/classes/MarkdownPreviewView",
                                "api/namespaces/obsidian/classes/MarkdownRenderer",
                                "api/namespaces/obsidian/classes/MarkdownView",
                                "api/namespaces/obsidian/interfaces/MarkdownPreviewEvents",
                                "api/namespaces/obsidian/interfaces/MarkdownSubView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/EmbedRegistry": {
                            "title": "EmbedRegistry",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/events/",
                                "api/namespaces/internals/interfaces/embedregistryembedbyextensionrecord/",
                                "api/namespaces/internals/type-aliases/embeddableconstructor/",
                                "api/namespaces/obsidian/classes/tfile/",
                                "api/namespaces/obsidian/classes/events",
                                "api/namespaces/obsidian/interfaces/eventref/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/events/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/EmbedRegistry",
                                "api/namespaces/internals/interfaces/InternalPlugins",
                                "api/namespaces/internals/interfaces/MetadataTypeManager",
                                "api/namespaces/internals/interfaces/ViewRegistry",
                                "api/namespaces/obsidian/classes/Events",
                                "api/namespaces/obsidian/classes/MetadataCache",
                                "api/namespaces/obsidian/classes/Vault",
                                "api/namespaces/obsidian/classes/Workspace",
                                "api/namespaces/obsidian/classes/WorkspaceItem",
                                "api/namespaces/obsidian/interfaces/EventRef"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/embedregistryembedbyextensionrecord/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/EmbedRegistry"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/type-aliases/embeddableconstructor/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/EmbedRegistry",
                                "api/namespaces/internals/interfaces/EmbedRegistryEmbedByExtensionRecord"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/events": {
                            "title": "events",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/EmbedRegistry",
                                "api/namespaces/internals/interfaces/InternalPlugins",
                                "api/namespaces/internals/interfaces/MetadataTypeManager",
                                "api/namespaces/internals/interfaces/ViewRegistry",
                                "api/namespaces/obsidian/classes/MetadataCache",
                                "api/namespaces/obsidian/classes/Vault",
                                "api/namespaces/obsidian/classes/Workspace",
                                "api/namespaces/obsidian/classes/WorkspaceItem"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/EmbedRegistryEmbedByExtensionRecord": {
                            "title": "EmbedRegistryEmbedByExtensionRecord",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/type-aliases/embeddableconstructor/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/EmptyView": {
                            "title": "EmptyView",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/itemview/",
                                "api/namespaces/internals/interfaces/unknownview/",
                                "api/namespaces/obsidian/classes/component/",
                                "api/namespaces/obsidian/classes/itemview",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/classes/workspaceleaf/",
                                "api/namespaces/obsidian/classes/scope/",
                                "api/namespaces/obsidian/classes/menu/",
                                "api/namespaces/obsidian/interfaces/keymapeventhandler/",
                                "api/namespaces/obsidian/interfaces/viewstateresult/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/unknownview/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/EmptyView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/FileCacheEntry": {
                            "title": "FileCacheEntry",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/FileEntry": {
                            "title": "FileEntry",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/FileExplorerLeaf": {
                            "title": "FileExplorerLeaf",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/workspaceleaf/",
                                "api/namespaces/obsidian/classes/workspaceleaf",
                                "api/namespaces/obsidian/classes/workspacemobiledrawer/",
                                "api/namespaces/obsidian/classes/workspacetabs/",
                                "api/namespaces/internals/interfaces/fileexplorerview/",
                                "api/namespaces/obsidian/classes/workspacecontainer/",
                                "api/namespaces/obsidian/classes/workspaceroot",
                                "api/namespaces/obsidian/classes/workspacewindow",
                                "api/namespaces/obsidian/classes/workspaceitem/",
                                "api/namespaces/obsidian/interfaces/viewstate/",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/classes/view/",
                                "api/namespaces/obsidian/classes/tfile/",
                                "api/namespaces/obsidian/interfaces/openviewstate/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/fileexplorerview/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/FileExplorerLeaf",
                                "api/namespaces/obsidian/classes/View"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/FileExplorerPluginInstance": {
                            "title": "FileExplorerPluginInstance",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/internalplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugin/",
                                "api/namespaces/internals/interfaces/fileexplorerplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugininstance",
                                "api/namespaces/obsidian/classes/tfolder/",
                                "api/namespaces/obsidian/classes/tfile/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/fileexplorerplugininstance/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/FileExplorerPluginInstance",
                                "api/namespaces/internals/interfaces/InternalPluginInstance",
                                "api/namespaces/internals/interfaces/InternalPlugins",
                                "api/namespaces/internals/type-aliases/InternalPluginNameInstancesMapping"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/FileExplorerView": {
                            "title": "FileExplorerView",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/view/",
                                "api/namespaces/obsidian/classes/component/",
                                "api/namespaces/obsidian/classes/view",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/internals/interfaces/fileexplorerviewfileitemsrecord/",
                                "api/namespaces/internals/interfaces/weakmapwrapper/",
                                "api/namespaces/obsidian/classes/tabstractfile/",
                                "api/namespaces/obsidian/classes/workspaceleaf/",
                                "api/namespaces/obsidian/classes/scope/",
                                "api/namespaces/internals/interfaces/tree/",
                                "api/namespaces/internals/interfaces/filetreeitem/",
                                "api/namespaces/obsidian/classes/tfile/",
                                "api/namespaces/obsidian/type-aliases/panetype/",
                                "api/namespaces/obsidian/classes/tfolder/",
                                "api/namespaces/obsidian/classes/menu/",
                                "api/namespaces/obsidian/interfaces/keymapeventhandler/",
                                "api/namespaces/obsidian/interfaces/viewstateresult/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/view": {
                            "title": "view",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/FileExplorerView",
                                "api/namespaces/internals/interfaces/SearchView",
                                "api/namespaces/internals/interfaces/TagView",
                                "api/namespaces/obsidian/classes/ItemView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/fileexplorerviewfileitemsrecord/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/FileExplorerView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/weakmapwrapper/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/FileExplorerView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/tree/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/FileExplorerView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/filetreeitem/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/FileExplorerView",
                                "api/namespaces/internals/interfaces/FileExplorerViewFileItemsRecord"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/type-aliases/panetype/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/FileExplorerView",
                                "api/namespaces/obsidian/classes/FileManager",
                                "api/namespaces/obsidian/classes/Keymap",
                                "api/namespaces/obsidian/classes/Workspace"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/FileExplorerViewFileItemsRecord": {
                            "title": "FileExplorerViewFileItemsRecord",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/type-aliases/treeitem/",
                                "api/namespaces/internals/interfaces/filetreeitem/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/type-aliases/treeitem/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/FileExplorerViewFileItemsRecord"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/FilePropertiesView": {
                            "title": "FilePropertiesView",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/infofileview/",
                                "api/namespaces/obsidian/classes/component/",
                                "api/namespaces/internals/interfaces/infofileview",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/classes/tfile/",
                                "api/namespaces/obsidian/classes/workspaceleaf/",
                                "api/namespaces/obsidian/classes/scope/",
                                "api/namespaces/obsidian/classes/menu/",
                                "api/namespaces/obsidian/interfaces/keymapeventhandler/",
                                "api/namespaces/obsidian/interfaces/viewstateresult/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/FileRecoveryPluginInstance": {
                            "title": "FileRecoveryPluginInstance",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/internalplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugin/",
                                "api/namespaces/internals/interfaces/filerecoveryplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugininstance"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/filerecoveryplugininstance/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/FileRecoveryPluginInstance",
                                "api/namespaces/internals/interfaces/InternalPluginInstance",
                                "api/namespaces/internals/interfaces/InternalPlugins",
                                "api/namespaces/internals/type-aliases/InternalPluginNameInstancesMapping"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/FileSuggest": {
                            "title": "FileSuggest",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/editorsuggest/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/classes/editorsuggest",
                                "api/namespaces/obsidian/interfaces/editorsuggestcontext/",
                                "api/namespaces/obsidian/classes/scope/",
                                "api/namespaces/internals/interfaces/filesuggestmanager/",
                                "api/namespaces/internals/interfaces/suggestioncontainer/",
                                "api/namespaces/obsidian/interfaces/editorsuggesttriggerinfo/",
                                "api/namespaces/obsidian/interfaces/editorposition/",
                                "api/namespaces/obsidian/classes/editor/",
                                "api/namespaces/obsidian/classes/tfile/",
                                "api/namespaces/obsidian/interfaces/instruction/",
                                "api/namespaces/obsidian/interfaces/searchresult/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/editorsuggest": {
                            "title": "editorsuggest",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/FileSuggest"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/editorsuggestcontext/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/FileSuggest",
                                "api/namespaces/obsidian/classes/EditorSuggest",
                                "api/namespaces/obsidian/interfaces/EditorSuggestTriggerInfo"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/filesuggestmanager/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/FileSuggest"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/suggestioncontainer/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/FileSuggest",
                                "api/namespaces/obsidian/classes/AbstractInputSuggest",
                                "api/namespaces/obsidian/classes/EditorSuggest",
                                "api/namespaces/obsidian/classes/PopoverSuggest"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/editorsuggesttriggerinfo/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/FileSuggest",
                                "api/namespaces/obsidian/classes/EditorSuggest",
                                "api/namespaces/obsidian/interfaces/EditorSuggestContext"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/instruction/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/FileSuggest",
                                "api/namespaces/obsidian/classes/EditorSuggest",
                                "api/namespaces/obsidian/classes/FuzzySuggestModal",
                                "api/namespaces/obsidian/classes/SuggestModal"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/searchresult/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/FileSuggest",
                                "api/namespaces/internals/interfaces/FileSuggestManager",
                                "api/namespaces/internals/interfaces/SuggestionContainer",
                                "api/namespaces/obsidian/classes/EditorSuggest",
                                "api/namespaces/obsidian/functions/fuzzySearch",
                                "api/namespaces/obsidian/functions/prepareFuzzySearch",
                                "api/namespaces/obsidian/functions/prepareSimpleSearch",
                                "api/namespaces/obsidian/functions/renderResults",
                                "api/namespaces/obsidian/interfaces/FuzzyMatch",
                                "api/namespaces/obsidian/interfaces/SearchResultContainer"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/FileSuggestManager": {
                            "title": "FileSuggestManager",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/internals/interfaces/runnable/",
                                "api/namespaces/obsidian/interfaces/searchresult/",
                                "api/namespaces/obsidian/classes/tfile/",
                                "api/namespaces/obsidian/interfaces/blockcache/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/runnable/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/FileSuggestManager"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/blockcache/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/FileSuggestManager",
                                "api/namespaces/obsidian/interfaces/BlockSubpathResult",
                                "api/namespaces/obsidian/interfaces/CachedMetadata",
                                "api/namespaces/obsidian/interfaces/CacheItem"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/FileTreeItem": {
                            "title": "FileTreeItem",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/tabstractfile/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/FoldInfo": {
                            "title": "FoldInfo",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/FoldManager": {
                            "title": "FoldManager",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/GlobalSearchLeaf": {
                            "title": "GlobalSearchLeaf",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/workspaceleaf/",
                                "api/namespaces/obsidian/classes/workspaceleaf",
                                "api/namespaces/obsidian/classes/workspacemobiledrawer/",
                                "api/namespaces/obsidian/classes/workspacetabs/",
                                "api/namespaces/obsidian/classes/view/",
                                "api/namespaces/obsidian/classes/workspacecontainer/",
                                "api/namespaces/obsidian/classes/workspaceroot",
                                "api/namespaces/obsidian/classes/workspacewindow",
                                "api/namespaces/obsidian/classes/workspaceitem/",
                                "api/namespaces/obsidian/interfaces/viewstate/",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/classes/tfile/",
                                "api/namespaces/obsidian/interfaces/openviewstate/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/GlobalSearchPluginInstance": {
                            "title": "GlobalSearchPluginInstance",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/internalplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugin/",
                                "api/namespaces/internals/interfaces/globalsearchplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugininstance"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/globalsearchplugininstance/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/GlobalSearchPluginInstance",
                                "api/namespaces/internals/interfaces/InternalPluginInstance",
                                "api/namespaces/internals/interfaces/InternalPlugins",
                                "api/namespaces/internals/type-aliases/InternalPluginNameInstancesMapping"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/GraphPluginInstance": {
                            "title": "GraphPluginInstance",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/internalplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugin/",
                                "api/namespaces/internals/interfaces/graphplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugininstance"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/graphplugininstance/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/GraphPluginInstance",
                                "api/namespaces/internals/interfaces/InternalPluginInstance",
                                "api/namespaces/internals/interfaces/InternalPlugins",
                                "api/namespaces/internals/type-aliases/InternalPluginNameInstancesMapping"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/GraphView": {
                            "title": "GraphView",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/itemview/",
                                "api/namespaces/obsidian/classes/component/",
                                "api/namespaces/obsidian/classes/itemview",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/classes/workspaceleaf/",
                                "api/namespaces/obsidian/classes/scope/",
                                "api/namespaces/obsidian/classes/menu/",
                                "api/namespaces/obsidian/interfaces/keymapeventhandler/",
                                "api/namespaces/obsidian/interfaces/viewstateresult/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/HotkeyManager": {
                            "title": "HotkeyManager",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/interfaces/keymapinfo/",
                                "api/namespaces/internals/interfaces/hotkeymanagercustomkeysrecord/",
                                "api/namespaces/internals/interfaces/hotkeymanagerdefaultkeysrecord/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/keymapinfo/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/HotkeyManager",
                                "api/namespaces/internals/interfaces/HotkeyManagerCustomKeysRecord",
                                "api/namespaces/internals/interfaces/HotkeyManagerDefaultKeysRecord",
                                "api/namespaces/obsidian/interfaces/KeymapContext",
                                "api/namespaces/obsidian/interfaces/KeymapEventHandler"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/hotkeymanagercustomkeysrecord/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/HotkeyManager"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/hotkeymanagerdefaultkeysrecord/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/HotkeyManager"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/HotkeyManagerCustomKeysRecord": {
                            "title": "HotkeyManagerCustomKeysRecord",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/keymapinfo/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/HotkeyManagerDefaultKeysRecord": {
                            "title": "HotkeyManagerDefaultKeysRecord",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/keymapinfo/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/HotkeysSettingTab": {
                            "title": "HotkeysSettingTab",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/settingtab/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/classes/settingtab",
                                "api/namespaces/obsidian/classes/plugin/",
                                "api/namespaces/obsidian/classes/searchcomponent/",
                                "api/namespaces/obsidian/classes/setting/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/settingtab/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/HotkeysSettingTab",
                                "api/namespaces/obsidian/classes/PluginSettingTab",
                                "api/namespaces/obsidian/classes/Setting",
                                "api/namespaces/obsidian/classes/SettingTab"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/settingtab": {
                            "title": "settingtab",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/HotkeysSettingTab",
                                "api/namespaces/obsidian/classes/PluginSettingTab"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/plugin/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/HotkeysSettingTab",
                                "api/namespaces/internals/interfaces/Plugins",
                                "api/namespaces/internals/interfaces/PluginsPluginsRecord",
                                "api/namespaces/obsidian/classes/Component",
                                "api/namespaces/obsidian/classes/Plugin",
                                "api/namespaces/obsidian/classes/PluginSettingTab",
                                "api/namespaces/obsidian/classes/SettingTab"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/searchcomponent/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/HotkeysSettingTab",
                                "api/namespaces/obsidian/classes/AbstractTextComponent",
                                "api/namespaces/obsidian/classes/SearchComponent"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/setting/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/HotkeysSettingTab",
                                "api/namespaces/obsidian/classes/App",
                                "api/namespaces/obsidian/classes/Modal",
                                "api/namespaces/obsidian/classes/PluginSettingTab",
                                "api/namespaces/obsidian/classes/Setting",
                                "api/namespaces/obsidian/classes/SettingTab"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/HoverLinkEvent": {
                            "title": "HoverLinkEvent",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/workspaceleaf/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/IFramedMarkdownEditor": {
                            "title": "IFramedMarkdownEditor",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/markdownscrollableeditview/",
                                "api/namespaces/obsidian/classes/component/",
                                "api/namespaces/internals/interfaces/markdownscrollableeditview",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/internals/interfaces/clipboardmanager/",
                                "api/namespaces/obsidian/classes/editor/",
                                "api/namespaces/internals/interfaces/editorsuggests/",
                                "api/namespaces/obsidian/interfaces/markdownfileinfo/",
                                "api/namespaces/obsidian/classes/scope/",
                                "api/namespaces/internals/interfaces/editorsearchcomponent/",
                                "api/namespaces/internals/interfaces/tablecelleditor/",
                                "api/namespaces/obsidian/classes/tfile/",
                                "api/namespaces/internals/interfaces/foldinfo/",
                                "api/namespaces/internals/interfaces/tableeditor/",
                                "api/namespaces/internals/interfaces/tablecell/",
                                "api/namespaces/obsidian/interfaces/keymapeventhandler/",
                                "api/namespaces/internals/interfaces/token/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/markdownscrollableeditview/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/IFramedMarkdownEditor",
                                "api/namespaces/internals/interfaces/MarkdownBaseView",
                                "api/namespaces/obsidian/classes/Editor",
                                "api/namespaces/obsidian/classes/MarkdownEditView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/markdownscrollableeditview": {
                            "title": "markdownscrollableeditview",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/IFramedMarkdownEditor",
                                "api/namespaces/obsidian/classes/MarkdownEditView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/clipboardmanager/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/IFramedMarkdownEditor",
                                "api/namespaces/internals/interfaces/MarkdownBaseView",
                                "api/namespaces/internals/interfaces/MarkdownScrollableEditView",
                                "api/namespaces/internals/interfaces/TableCellEditor",
                                "api/namespaces/obsidian/classes/MarkdownEditView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/editorsuggests/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/IFramedMarkdownEditor",
                                "api/namespaces/internals/interfaces/MarkdownBaseView",
                                "api/namespaces/internals/interfaces/MarkdownScrollableEditView",
                                "api/namespaces/internals/interfaces/TableCellEditor",
                                "api/namespaces/obsidian/classes/MarkdownEditView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/markdownfileinfo/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/IFramedMarkdownEditor",
                                "api/namespaces/internals/interfaces/MarkdownBaseView",
                                "api/namespaces/internals/interfaces/MarkdownScrollableEditView",
                                "api/namespaces/internals/interfaces/TableCellEditor",
                                "api/namespaces/obsidian/classes/MarkdownEditView",
                                "api/namespaces/obsidian/classes/MarkdownView",
                                "api/namespaces/obsidian/classes/Workspace",
                                "api/namespaces/obsidian/interfaces/Command",
                                "api/namespaces/obsidian/interfaces/HoverParent",
                                "api/namespaces/obsidian/variables/editorInfoField",
                                "api/namespaces/obsidian/variables/editorViewField"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/tablecelleditor/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/IFramedMarkdownEditor",
                                "api/namespaces/internals/interfaces/MarkdownBaseView",
                                "api/namespaces/internals/interfaces/MarkdownScrollableEditView",
                                "api/namespaces/internals/interfaces/TableCell",
                                "api/namespaces/internals/interfaces/TableCellEditor",
                                "api/namespaces/obsidian/classes/MarkdownEditView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/foldinfo/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/IFramedMarkdownEditor",
                                "api/namespaces/internals/interfaces/MarkdownBaseView",
                                "api/namespaces/internals/interfaces/MarkdownScrollableEditView",
                                "api/namespaces/internals/interfaces/TableCellEditor",
                                "api/namespaces/internals/interfaces/WidgetEditorView",
                                "api/namespaces/obsidian/classes/MarkdownEditView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/tableeditor/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/IFramedMarkdownEditor",
                                "api/namespaces/internals/interfaces/MarkdownBaseView",
                                "api/namespaces/internals/interfaces/MarkdownScrollableEditView",
                                "api/namespaces/internals/interfaces/TableCellEditor",
                                "api/namespaces/obsidian/classes/MarkdownEditView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/tablecell/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/IFramedMarkdownEditor",
                                "api/namespaces/internals/interfaces/MarkdownBaseView",
                                "api/namespaces/internals/interfaces/MarkdownScrollableEditView",
                                "api/namespaces/internals/interfaces/TableCellEditor",
                                "api/namespaces/obsidian/classes/MarkdownEditView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/ImageView": {
                            "title": "ImageView",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/editablefileview/",
                                "api/namespaces/obsidian/classes/component/",
                                "api/namespaces/obsidian/classes/editablefileview",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/classes/tfile/",
                                "api/namespaces/obsidian/classes/workspaceleaf/",
                                "api/namespaces/obsidian/classes/scope/",
                                "api/namespaces/obsidian/classes/menu/",
                                "api/namespaces/obsidian/interfaces/keymapeventhandler/",
                                "api/namespaces/obsidian/interfaces/viewstateresult/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/ImportedAttachments": {
                            "title": "ImportedAttachments",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/InfinityScroll": {
                            "title": "InfinityScroll",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/InfoFileView": {
                            "title": "InfoFileView",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/fileview/",
                                "api/namespaces/internals/interfaces/backlinkview/",
                                "api/namespaces/internals/interfaces/filepropertiesview/",
                                "api/namespaces/internals/interfaces/localgraphview/",
                                "api/namespaces/internals/interfaces/outgoinglinkview/",
                                "api/namespaces/internals/interfaces/outlineview/",
                                "api/namespaces/obsidian/classes/component/",
                                "api/namespaces/obsidian/classes/fileview",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/classes/tfile/",
                                "api/namespaces/obsidian/classes/workspaceleaf/",
                                "api/namespaces/obsidian/classes/scope/",
                                "api/namespaces/obsidian/classes/menu/",
                                "api/namespaces/obsidian/interfaces/keymapeventhandler/",
                                "api/namespaces/obsidian/interfaces/viewstateresult/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/fileview/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/InfoFileView",
                                "api/namespaces/obsidian/classes/EditableFileView",
                                "api/namespaces/obsidian/classes/FileView",
                                "api/namespaces/obsidian/classes/ItemView",
                                "api/namespaces/obsidian/classes/Workspace"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/backlinkview/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/InfoFileView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/filepropertiesview/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/InfoFileView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/localgraphview/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/InfoFileView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/outgoinglinkview/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/InfoFileView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/outlineview/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/InfoFileView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/fileview": {
                            "title": "fileview",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/InfoFileView",
                                "api/namespaces/obsidian/classes/EditableFileView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/InternalPlugin": {
                            "title": "InternalPlugin",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/internalplugininstance/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/InternalPluginInstance": {
                            "title": "InternalPluginInstance",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/audiorecorderplugininstance/",
                                "api/namespaces/internals/interfaces/backlinkplugininstance/",
                                "api/namespaces/internals/interfaces/bookmarksplugininstance/",
                                "api/namespaces/internals/interfaces/canvasplugininstance/",
                                "api/namespaces/internals/interfaces/commandpaletteplugininstance/",
                                "api/namespaces/internals/interfaces/dailynotesplugininstance/",
                                "api/namespaces/internals/interfaces/editorstatusplugininstance/",
                                "api/namespaces/internals/interfaces/fileexplorerplugininstance/",
                                "api/namespaces/internals/interfaces/filerecoveryplugininstance/",
                                "api/namespaces/internals/interfaces/globalsearchplugininstance/",
                                "api/namespaces/internals/interfaces/graphplugininstance/",
                                "api/namespaces/internals/interfaces/markdownimporterplugininstance/",
                                "api/namespaces/internals/interfaces/notecomposerplugininstance/",
                                "api/namespaces/internals/interfaces/outgoinglinkplugininstance/",
                                "api/namespaces/internals/interfaces/outlineplugininstance/",
                                "api/namespaces/internals/interfaces/pagepreviewplugininstance/",
                                "api/namespaces/internals/interfaces/propertiesplugininstance/",
                                "api/namespaces/internals/interfaces/publishplugininstance/",
                                "api/namespaces/internals/interfaces/randomnoteplugininstance/",
                                "api/namespaces/internals/interfaces/slashcommandplugininstance/",
                                "api/namespaces/internals/interfaces/slidesplugininstance/",
                                "api/namespaces/internals/interfaces/starredplugininstance/",
                                "api/namespaces/internals/interfaces/switcherplugininstance/",
                                "api/namespaces/internals/interfaces/syncplugininstance/",
                                "api/namespaces/internals/interfaces/tagpaneplugininstance/",
                                "api/namespaces/internals/interfaces/templatesplugininstance/",
                                "api/namespaces/internals/interfaces/wordcountplugininstance/",
                                "api/namespaces/internals/interfaces/workspacesplugininstance/",
                                "api/namespaces/internals/interfaces/zkprefixerplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugin/",
                                "api/namespaces/internals/interfaces/internalplugininstance/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/markdownimporterplugininstance/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/InternalPluginInstance",
                                "api/namespaces/internals/interfaces/InternalPlugins",
                                "api/namespaces/internals/interfaces/MarkdownImporterPluginInstance",
                                "api/namespaces/internals/type-aliases/InternalPluginNameInstancesMapping"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/notecomposerplugininstance/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/InternalPluginInstance",
                                "api/namespaces/internals/interfaces/InternalPlugins",
                                "api/namespaces/internals/interfaces/NoteComposerPluginInstance",
                                "api/namespaces/internals/type-aliases/InternalPluginNameInstancesMapping"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/outgoinglinkplugininstance/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/InternalPluginInstance",
                                "api/namespaces/internals/interfaces/InternalPlugins",
                                "api/namespaces/internals/interfaces/OutgoingLinkPluginInstance",
                                "api/namespaces/internals/type-aliases/InternalPluginNameInstancesMapping"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/outlineplugininstance/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/InternalPluginInstance",
                                "api/namespaces/internals/interfaces/InternalPlugins",
                                "api/namespaces/internals/interfaces/OutlinePluginInstance",
                                "api/namespaces/internals/type-aliases/InternalPluginNameInstancesMapping"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/pagepreviewplugininstance/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/InternalPluginInstance",
                                "api/namespaces/internals/interfaces/InternalPlugins",
                                "api/namespaces/internals/interfaces/PagePreviewPluginInstance",
                                "api/namespaces/internals/type-aliases/InternalPluginNameInstancesMapping"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/propertiesplugininstance/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/InternalPluginInstance",
                                "api/namespaces/internals/interfaces/InternalPlugins",
                                "api/namespaces/internals/interfaces/PropertiesPluginInstance",
                                "api/namespaces/internals/type-aliases/InternalPluginNameInstancesMapping"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/publishplugininstance/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/InternalPluginInstance",
                                "api/namespaces/internals/interfaces/InternalPlugins",
                                "api/namespaces/internals/interfaces/PublishPluginInstance",
                                "api/namespaces/internals/type-aliases/InternalPluginNameInstancesMapping"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/randomnoteplugininstance/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/InternalPluginInstance",
                                "api/namespaces/internals/interfaces/InternalPlugins",
                                "api/namespaces/internals/interfaces/RandomNotePluginInstance",
                                "api/namespaces/internals/type-aliases/InternalPluginNameInstancesMapping"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/slashcommandplugininstance/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/InternalPluginInstance",
                                "api/namespaces/internals/interfaces/InternalPlugins",
                                "api/namespaces/internals/interfaces/SlashCommandPluginInstance",
                                "api/namespaces/internals/type-aliases/InternalPluginNameInstancesMapping"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/slidesplugininstance/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/InternalPluginInstance",
                                "api/namespaces/internals/interfaces/InternalPlugins",
                                "api/namespaces/internals/interfaces/SlidesPluginInstance",
                                "api/namespaces/internals/type-aliases/InternalPluginNameInstancesMapping"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/starredplugininstance/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/InternalPluginInstance",
                                "api/namespaces/internals/interfaces/InternalPlugins",
                                "api/namespaces/internals/interfaces/StarredPluginInstance",
                                "api/namespaces/internals/type-aliases/InternalPluginNameInstancesMapping"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/switcherplugininstance/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/InternalPluginInstance",
                                "api/namespaces/internals/interfaces/InternalPlugins",
                                "api/namespaces/internals/interfaces/SwitcherPluginInstance",
                                "api/namespaces/internals/type-aliases/InternalPluginNameInstancesMapping"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/syncplugininstance/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/InternalPluginInstance",
                                "api/namespaces/internals/interfaces/InternalPlugins",
                                "api/namespaces/internals/interfaces/SyncPluginInstance",
                                "api/namespaces/internals/type-aliases/InternalPluginNameInstancesMapping"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/tagpaneplugininstance/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/InternalPluginInstance",
                                "api/namespaces/internals/interfaces/InternalPlugins",
                                "api/namespaces/internals/interfaces/TagPanePluginInstance",
                                "api/namespaces/internals/type-aliases/InternalPluginNameInstancesMapping"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/templatesplugininstance/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/InternalPluginInstance",
                                "api/namespaces/internals/interfaces/InternalPlugins",
                                "api/namespaces/internals/interfaces/TemplatesPluginInstance",
                                "api/namespaces/internals/type-aliases/InternalPluginNameInstancesMapping"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/wordcountplugininstance/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/InternalPluginInstance",
                                "api/namespaces/internals/interfaces/InternalPlugins",
                                "api/namespaces/internals/interfaces/WordCountPluginInstance",
                                "api/namespaces/internals/type-aliases/InternalPluginNameInstancesMapping"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/workspacesplugininstance/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/InternalPluginInstance",
                                "api/namespaces/internals/interfaces/InternalPlugins",
                                "api/namespaces/internals/interfaces/WorkspacesPluginInstance",
                                "api/namespaces/internals/type-aliases/InternalPluginNameInstancesMapping"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/zkprefixerplugininstance/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/InternalPluginInstance",
                                "api/namespaces/internals/interfaces/InternalPlugins",
                                "api/namespaces/internals/interfaces/ZkPrefixerPluginInstance",
                                "api/namespaces/internals/type-aliases/InternalPluginNameInstancesMapping"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/InternalPlugins": {
                            "title": "InternalPlugins",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/events/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/internals/interfaces/internalpluginsconfigrecord/",
                                "api/namespaces/internals/interfaces/internalplugin/",
                                "api/namespaces/internals/interfaces/audiorecorderplugininstance/",
                                "api/namespaces/internals/interfaces/backlinkplugininstance/",
                                "api/namespaces/internals/interfaces/bookmarksplugininstance/",
                                "api/namespaces/internals/interfaces/canvasplugininstance/",
                                "api/namespaces/internals/interfaces/commandpaletteplugininstance/",
                                "api/namespaces/internals/interfaces/dailynotesplugininstance/",
                                "api/namespaces/internals/interfaces/editorstatusplugininstance/",
                                "api/namespaces/internals/interfaces/fileexplorerplugininstance/",
                                "api/namespaces/internals/interfaces/filerecoveryplugininstance/",
                                "api/namespaces/internals/interfaces/globalsearchplugininstance/",
                                "api/namespaces/internals/interfaces/graphplugininstance/",
                                "api/namespaces/internals/interfaces/markdownimporterplugininstance/",
                                "api/namespaces/internals/interfaces/notecomposerplugininstance/",
                                "api/namespaces/internals/interfaces/outgoinglinkplugininstance/",
                                "api/namespaces/internals/interfaces/outlineplugininstance/",
                                "api/namespaces/internals/interfaces/pagepreviewplugininstance/",
                                "api/namespaces/internals/interfaces/propertiesplugininstance/",
                                "api/namespaces/internals/interfaces/publishplugininstance/",
                                "api/namespaces/internals/interfaces/randomnoteplugininstance/",
                                "api/namespaces/internals/interfaces/slashcommandplugininstance/",
                                "api/namespaces/internals/interfaces/slidesplugininstance/",
                                "api/namespaces/internals/interfaces/starredplugininstance/",
                                "api/namespaces/internals/interfaces/switcherplugininstance/",
                                "api/namespaces/internals/interfaces/syncplugininstance/",
                                "api/namespaces/internals/interfaces/tagpaneplugininstance/",
                                "api/namespaces/internals/interfaces/templatesplugininstance/",
                                "api/namespaces/internals/interfaces/wordcountplugininstance/",
                                "api/namespaces/internals/interfaces/workspacesplugininstance/",
                                "api/namespaces/internals/interfaces/zkprefixerplugininstance/",
                                "api/namespaces/internals/type-aliases/internalpluginnameinstancesmapping/",
                                "api/namespaces/internals/type-aliases/internalpluginnametype/",
                                "api/namespaces/internals/interfaces/internalplugininstance/",
                                "api/namespaces/obsidian/classes/events",
                                "api/namespaces/obsidian/interfaces/eventref/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/internalpluginsconfigrecord/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/InternalPlugins"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/type-aliases/internalpluginnameinstancesmapping/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/InternalPlugins"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/type-aliases/internalpluginnametype/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/InternalPlugins",
                                "api/namespaces/internals/interfaces/InternalPluginsConfigRecord"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/InternalPluginsConfigRecord": {
                            "title": "InternalPluginsConfigRecord",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/type-aliases/internalpluginnametype/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/KeyScope": {
                            "title": "KeyScope",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/scope/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/LeafEntry": {
                            "title": "LeafEntry",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/leafentry/",
                                "api/namespaces/obsidian/type-aliases/splitdirection/",
                                "api/namespaces/obsidian/interfaces/viewstate/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/leafentry/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/LeafEntry",
                                "api/namespaces/internals/interfaces/SerializedWorkspace"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/type-aliases/splitdirection/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/LeafEntry",
                                "api/namespaces/obsidian/classes/Workspace"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/LinkChangeUpdate": {
                            "title": "LinkChangeUpdate",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/referencecache/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/referencecache/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/LinkChangeUpdate",
                                "api/namespaces/obsidian/interfaces/CacheItem",
                                "api/namespaces/obsidian/interfaces/EmbedCache",
                                "api/namespaces/obsidian/interfaces/LinkCache",
                                "api/namespaces/obsidian/interfaces/Reference"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/LinkUpdate": {
                            "title": "LinkUpdate",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/internals/interfaces/positionedreference/",
                                "api/namespaces/obsidian/classes/tfile/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/positionedreference/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/LinkUpdate",
                                "api/namespaces/obsidian/interfaces/Reference"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/LinkUpdater": {
                            "title": "LinkUpdater",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/canvaslinkupdater/",
                                "api/namespaces/obsidian/classes/tfile/",
                                "api/namespaces/internals/interfaces/linkchangeupdate/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/canvaslinkupdater/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/LinkUpdater",
                                "api/namespaces/internals/interfaces/LinkUpdaters"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/LinkUpdaters": {
                            "title": "LinkUpdaters",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/linkupdater/",
                                "api/namespaces/internals/interfaces/canvaslinkupdater/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/LoadProgress": {
                            "title": "LoadProgress",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/LocalGraphView": {
                            "title": "LocalGraphView",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/infofileview/",
                                "api/namespaces/obsidian/classes/component/",
                                "api/namespaces/internals/interfaces/infofileview",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/classes/tfile/",
                                "api/namespaces/obsidian/classes/workspaceleaf/",
                                "api/namespaces/obsidian/classes/scope/",
                                "api/namespaces/obsidian/classes/menu/",
                                "api/namespaces/obsidian/interfaces/keymapeventhandler/",
                                "api/namespaces/obsidian/interfaces/viewstateresult/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/MarkdownBaseView": {
                            "title": "MarkdownBaseView",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/component/",
                                "api/namespaces/internals/interfaces/markdownscrollableeditview/",
                                "api/namespaces/internals/interfaces/tablecelleditor/",
                                "api/namespaces/obsidian/classes/component",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/internals/interfaces/clipboardmanager/",
                                "api/namespaces/obsidian/classes/editor/",
                                "api/namespaces/internals/interfaces/editorsuggests/",
                                "api/namespaces/obsidian/interfaces/markdownfileinfo/",
                                "api/namespaces/obsidian/classes/tfile/",
                                "api/namespaces/internals/interfaces/foldinfo/",
                                "api/namespaces/internals/interfaces/tableeditor/",
                                "api/namespaces/internals/interfaces/tablecell/",
                                "api/namespaces/obsidian/interfaces/keymapeventhandler/",
                                "api/namespaces/internals/interfaces/token/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/MarkdownImporterPluginInstance": {
                            "title": "MarkdownImporterPluginInstance",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/internalplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugin/",
                                "api/namespaces/internals/interfaces/markdownimporterplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugininstance"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/MarkdownScrollableEditView": {
                            "title": "MarkdownScrollableEditView",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/markdownbaseview/",
                                "api/namespaces/obsidian/classes/markdowneditview/",
                                "api/namespaces/internals/interfaces/iframedmarkdowneditor/",
                                "api/namespaces/obsidian/classes/component/",
                                "api/namespaces/internals/interfaces/markdownbaseview",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/internals/interfaces/clipboardmanager/",
                                "api/namespaces/obsidian/classes/editor/",
                                "api/namespaces/internals/interfaces/editorsuggests/",
                                "api/namespaces/obsidian/interfaces/markdownfileinfo/",
                                "api/namespaces/obsidian/classes/scope/",
                                "api/namespaces/internals/interfaces/editorsearchcomponent/",
                                "api/namespaces/internals/interfaces/tablecelleditor/",
                                "api/namespaces/obsidian/classes/tfile/",
                                "api/namespaces/internals/interfaces/foldinfo/",
                                "api/namespaces/internals/interfaces/tableeditor/",
                                "api/namespaces/internals/interfaces/tablecell/",
                                "api/namespaces/obsidian/interfaces/keymapeventhandler/",
                                "api/namespaces/internals/interfaces/token/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/markdowneditview/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/MarkdownScrollableEditView",
                                "api/namespaces/obsidian/classes/MarkdownEditView",
                                "api/namespaces/obsidian/classes/MarkdownView",
                                "api/namespaces/obsidian/interfaces/HoverParent",
                                "api/namespaces/obsidian/interfaces/MarkdownFileInfo",
                                "api/namespaces/obsidian/interfaces/MarkdownSubView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/markdownbaseview": {
                            "title": "markdownbaseview",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/MarkdownScrollableEditView",
                                "api/namespaces/internals/interfaces/TableCellEditor"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/MenuSubmenuConfigRecord": {
                            "title": "MenuSubmenuConfigRecord",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/MetadataCacheFileCacheRecord": {
                            "title": "MetadataCacheFileCacheRecord",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/filecacheentry/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/filecacheentry/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/MetadataCacheFileCacheRecord",
                                "api/namespaces/obsidian/classes/MetadataCache"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/MetadataCacheMetadataCacheRecord": {
                            "title": "MetadataCacheMetadataCacheRecord",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/cachedmetadata/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/cachedmetadata/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/MetadataCacheMetadataCacheRecord",
                                "api/namespaces/internals/interfaces/WidgetEditorView",
                                "api/namespaces/obsidian/classes/MetadataCache",
                                "api/namespaces/obsidian/functions/getAllTags",
                                "api/namespaces/obsidian/functions/iterateCacheRefs",
                                "api/namespaces/obsidian/functions/resolveSubpath"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/MetadataEditor": {
                            "title": "MetadataEditor",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/component/",
                                "api/namespaces/obsidian/classes/component",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/internals/interfaces/metadataeditorproperty/",
                                "api/namespaces/obsidian/classes/hoverpopover/",
                                "api/namespaces/obsidian/classes/markdownview/",
                                "api/namespaces/internals/interfaces/propertyentrydata/",
                                "api/namespaces/obsidian/interfaces/keymapeventhandler/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/metadataeditorproperty/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/MetadataEditor",
                                "api/namespaces/obsidian/classes/Component"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/propertyentrydata/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/MetadataEditor",
                                "api/namespaces/internals/interfaces/MetadataEditorProperty",
                                "api/namespaces/internals/interfaces/PropertyWidget"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/MetadataEditorProperty": {
                            "title": "MetadataEditorProperty",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/component/",
                                "api/namespaces/obsidian/classes/component",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/internals/interfaces/propertyentrydata/",
                                "api/namespaces/internals/interfaces/metadataeditor/",
                                "api/namespaces/internals/interfaces/metadatawidget/",
                                "api/namespaces/internals/interfaces/propertywidget/",
                                "api/namespaces/obsidian/interfaces/keymapeventhandler/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/metadatawidget/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/MetadataEditorProperty"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/propertywidget/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/MetadataEditorProperty",
                                "api/namespaces/internals/interfaces/MetadataTypeManagerRegisteredTypeWidgetsRecord"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/MetadataTypeManager": {
                            "title": "MetadataTypeManager",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/events/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/internals/interfaces/metadatatypemanagerpropertiesrecord/",
                                "api/namespaces/internals/interfaces/metadatatypemanagertypesrecord/",
                                "api/namespaces/internals/interfaces/propertyinfo/",
                                "api/namespaces/obsidian/classes/events",
                                "api/namespaces/obsidian/interfaces/eventref/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/metadatatypemanagerpropertiesrecord/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/MetadataTypeManager"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/metadatatypemanagertypesrecord/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/MetadataTypeManager"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/propertyinfo/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/MetadataTypeManager",
                                "api/namespaces/internals/interfaces/MetadataTypeManagerPropertiesRecord",
                                "api/namespaces/obsidian/classes/MetadataCache"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/MetadataTypeManagerPropertiesRecord": {
                            "title": "MetadataTypeManagerPropertiesRecord",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/propertyinfo/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/MetadataTypeManagerRegisteredTypeWidgetsRecord": {
                            "title": "MetadataTypeManagerRegisteredTypeWidgetsRecord",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/type-aliases/propertywidgettype/",
                                "api/namespaces/internals/interfaces/propertywidget/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/type-aliases/propertywidgettype/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/MetadataTypeManagerRegisteredTypeWidgetsRecord",
                                "api/namespaces/internals/interfaces/MetadataTypeManagerTypesRecord"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/MetadataTypeManagerTypesRecord": {
                            "title": "MetadataTypeManagerTypesRecord",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/type-aliases/propertywidgettype/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/MetadataWidget": {
                            "title": "MetadataWidget",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/MobileNavbar": {
                            "title": "MobileNavbar",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/MobileToolbar": {
                            "title": "MobileToolbar",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/NoteComposerPluginInstance": {
                            "title": "NoteComposerPluginInstance",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/internalplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugin/",
                                "api/namespaces/internals/interfaces/notecomposerplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugininstance"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/ObsidianDOM": {
                            "title": "ObsidianDOM",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/ObsidianTouchEvent": {
                            "title": "ObsidianTouchEvent",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/OutgoingLinkPluginInstance": {
                            "title": "OutgoingLinkPluginInstance",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/internalplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugin/",
                                "api/namespaces/internals/interfaces/outgoinglinkplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugininstance"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/OutgoingLinkView": {
                            "title": "OutgoingLinkView",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/infofileview/",
                                "api/namespaces/obsidian/classes/component/",
                                "api/namespaces/internals/interfaces/infofileview",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/classes/tfile/",
                                "api/namespaces/obsidian/classes/workspaceleaf/",
                                "api/namespaces/obsidian/classes/scope/",
                                "api/namespaces/obsidian/classes/menu/",
                                "api/namespaces/obsidian/interfaces/keymapeventhandler/",
                                "api/namespaces/obsidian/interfaces/viewstateresult/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/OutlinePluginInstance": {
                            "title": "OutlinePluginInstance",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/internalplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugin/",
                                "api/namespaces/internals/interfaces/outlineplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugininstance"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/OutlineView": {
                            "title": "OutlineView",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/infofileview/",
                                "api/namespaces/obsidian/classes/component/",
                                "api/namespaces/internals/interfaces/infofileview",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/classes/tfile/",
                                "api/namespaces/obsidian/classes/workspaceleaf/",
                                "api/namespaces/obsidian/classes/scope/",
                                "api/namespaces/obsidian/classes/view/",
                                "api/namespaces/obsidian/classes/menu/",
                                "api/namespaces/obsidian/interfaces/keymapeventhandler/",
                                "api/namespaces/obsidian/interfaces/viewstateresult/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/PagePreviewPluginInstance": {
                            "title": "PagePreviewPluginInstance",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/internalplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugin/",
                                "api/namespaces/internals/interfaces/pagepreviewplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugininstance"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/PdfView": {
                            "title": "PdfView",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/editablefileview/",
                                "api/namespaces/obsidian/classes/component/",
                                "api/namespaces/obsidian/classes/editablefileview",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/classes/tfile/",
                                "api/namespaces/obsidian/classes/workspaceleaf/",
                                "api/namespaces/obsidian/classes/scope/",
                                "api/namespaces/obsidian/classes/menu/",
                                "api/namespaces/obsidian/interfaces/keymapeventhandler/",
                                "api/namespaces/obsidian/interfaces/viewstateresult/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/Plugins": {
                            "title": "Plugins",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/internals/interfaces/pluginsmanifestsrecord/",
                                "api/namespaces/internals/interfaces/pluginspluginsrecord/",
                                "api/namespaces/internals/interfaces/pluginupdatemanifest/",
                                "api/namespaces/obsidian/classes/plugin/",
                                "api/namespaces/obsidian/interfaces/pluginmanifest/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/pluginsmanifestsrecord/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/Plugins"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/pluginspluginsrecord/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/Plugins"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/pluginupdatemanifest/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/Plugins"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/pluginmanifest/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/Plugins",
                                "api/namespaces/internals/interfaces/PluginsManifestsRecord",
                                "api/namespaces/internals/interfaces/PluginUpdateManifest",
                                "api/namespaces/obsidian/classes/Plugin"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/PluginsManifestsRecord": {
                            "title": "PluginsManifestsRecord",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/pluginmanifest/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/PluginsPluginsRecord": {
                            "title": "PluginsPluginsRecord",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/plugin/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/PluginUpdateManifest": {
                            "title": "PluginUpdateManifest",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/pluginmanifest/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/PositionedReference": {
                            "title": "PositionedReference",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/reference/",
                                "api/namespaces/obsidian/interfaces/reference",
                                "api/namespaces/obsidian/interfaces/loc/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/reference/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/PositionedReference",
                                "api/namespaces/obsidian/classes/MetadataCache",
                                "api/namespaces/obsidian/functions/iterateRefs",
                                "api/namespaces/obsidian/interfaces/FrontmatterLinkCache",
                                "api/namespaces/obsidian/interfaces/ReferenceCache"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/reference": {
                            "title": "reference",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/PositionedReference",
                                "api/namespaces/obsidian/interfaces/FrontmatterLinkCache",
                                "api/namespaces/obsidian/interfaces/ReferenceCache"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/loc/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/PositionedReference",
                                "api/namespaces/obsidian/interfaces/BlockSubpathResult",
                                "api/namespaces/obsidian/interfaces/HeadingSubpathResult",
                                "api/namespaces/obsidian/interfaces/Pos",
                                "api/namespaces/obsidian/interfaces/SubpathResult"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/PropertiesPluginInstance": {
                            "title": "PropertiesPluginInstance",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/internalplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugin/",
                                "api/namespaces/internals/interfaces/propertiesplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugininstance"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/PropertyEntryData": {
                            "title": "PropertyEntryData",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/PropertyInfo": {
                            "title": "PropertyInfo",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/PropertyRenderContext": {
                            "title": "PropertyRenderContext",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/internals/interfaces/metadataeditor/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/PropertyWidget": {
                            "title": "PropertyWidget",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/component/",
                                "api/namespaces/internals/interfaces/propertyentrydata/",
                                "api/namespaces/internals/interfaces/propertyrendercontext/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/propertyrendercontext/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/PropertyWidget"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/PublishPluginInstance": {
                            "title": "PublishPluginInstance",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/internalplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugin/",
                                "api/namespaces/internals/interfaces/publishplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugininstance"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/RandomNotePluginInstance": {
                            "title": "RandomNotePluginInstance",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/internalplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugin/",
                                "api/namespaces/internals/interfaces/randomnoteplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugininstance"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/ReadViewRenderer": {
                            "title": "ReadViewRenderer",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/renderersection/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/renderersection/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/ReadViewRenderer"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/RecentFileTracker": {
                            "title": "RecentFileTracker",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/vault/",
                                "api/namespaces/obsidian/classes/workspace/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/vault/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/RecentFileTracker",
                                "api/namespaces/obsidian/classes/App",
                                "api/namespaces/obsidian/classes/Events",
                                "api/namespaces/obsidian/classes/FileManager",
                                "api/namespaces/obsidian/classes/MetadataCache",
                                "api/namespaces/obsidian/classes/TAbstractFile",
                                "api/namespaces/obsidian/classes/TFile",
                                "api/namespaces/obsidian/classes/TFolder",
                                "api/namespaces/obsidian/classes/Vault"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/workspace/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/RecentFileTracker",
                                "api/namespaces/obsidian/classes/App",
                                "api/namespaces/obsidian/classes/Events",
                                "api/namespaces/obsidian/classes/Workspace"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/ReleaseNotesView": {
                            "title": "ReleaseNotesView",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/itemview/",
                                "api/namespaces/obsidian/classes/component/",
                                "api/namespaces/obsidian/classes/itemview",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/classes/workspaceleaf/",
                                "api/namespaces/obsidian/classes/scope/",
                                "api/namespaces/obsidian/classes/menu/",
                                "api/namespaces/obsidian/interfaces/keymapeventhandler/",
                                "api/namespaces/obsidian/interfaces/viewstateresult/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/RendererSection": {
                            "title": "RendererSection",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/Runnable": {
                            "title": "Runnable",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/SearchCursor": {
                            "title": "SearchCursor",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/editorposition/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/SearchView": {
                            "title": "SearchView",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/view/",
                                "api/namespaces/obsidian/classes/component/",
                                "api/namespaces/obsidian/classes/view",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/classes/workspaceleaf/",
                                "api/namespaces/obsidian/classes/scope/",
                                "api/namespaces/obsidian/classes/menu/",
                                "api/namespaces/obsidian/interfaces/keymapeventhandler/",
                                "api/namespaces/obsidian/interfaces/viewstateresult/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/SerializedWorkspace": {
                            "title": "SerializedWorkspace",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/leafentry/",
                                "api/namespaces/internals/interfaces/serializedworkspaceleftribbonhiddenitemsrecord/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/serializedworkspaceleftribbonhiddenitemsrecord/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/SerializedWorkspace"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/SerializedWorkspaceLeftRibbonHiddenItemsRecord": {
                            "title": "SerializedWorkspaceLeftRibbonHiddenItemsRecord",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/SlashCommandPluginInstance": {
                            "title": "SlashCommandPluginInstance",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/internalplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugin/",
                                "api/namespaces/internals/interfaces/slashcommandplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugininstance"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/SlidesPluginInstance": {
                            "title": "SlidesPluginInstance",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/internalplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugin/",
                                "api/namespaces/internals/interfaces/slidesplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugininstance"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/StarredPluginInstance": {
                            "title": "StarredPluginInstance",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/internalplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugin/",
                                "api/namespaces/internals/interfaces/starredplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugininstance"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/StateHistory": {
                            "title": "StateHistory",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/editorrange/",
                                "api/namespaces/internals/interfaces/statehistory/",
                                "api/namespaces/obsidian/interfaces/viewstate/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/statehistory/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/StateHistory",
                                "api/namespaces/obsidian/classes/Workspace"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/SuggestionContainer": {
                            "title": "SuggestionContainer",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/editorsuggest/",
                                "api/namespaces/obsidian/interfaces/searchresult/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/SwitcherPluginInstance": {
                            "title": "SwitcherPluginInstance",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/internalplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugin/",
                                "api/namespaces/internals/interfaces/switcherplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugininstance"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/SyncPluginInstance": {
                            "title": "SyncPluginInstance",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/internalplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugin/",
                                "api/namespaces/internals/interfaces/syncplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugininstance"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/TableCell": {
                            "title": "TableCell",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/tablecelleditor/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/TableCellEditor": {
                            "title": "TableCellEditor",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/markdownbaseview/",
                                "api/namespaces/internals/interfaces/tablecell/",
                                "api/namespaces/obsidian/classes/component/",
                                "api/namespaces/internals/interfaces/markdownbaseview",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/internals/interfaces/clipboardmanager/",
                                "api/namespaces/internals/interfaces/tablecell",
                                "api/namespaces/obsidian/classes/editor/",
                                "api/namespaces/internals/interfaces/editorsuggests/",
                                "api/namespaces/obsidian/interfaces/markdownfileinfo/",
                                "api/namespaces/internals/interfaces/tablecelleditor/",
                                "api/namespaces/obsidian/classes/tfile/",
                                "api/namespaces/internals/interfaces/foldinfo/",
                                "api/namespaces/internals/interfaces/tableeditor/",
                                "api/namespaces/obsidian/interfaces/keymapeventhandler/",
                                "api/namespaces/internals/interfaces/token/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/tablecell": {
                            "title": "tablecell",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/TableCellEditor"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/TableEditor": {
                            "title": "TableEditor",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/TagPanePluginInstance": {
                            "title": "TagPanePluginInstance",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/internalplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugin/",
                                "api/namespaces/internals/interfaces/tagpaneplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugininstance"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/TagView": {
                            "title": "TagView",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/view/",
                                "api/namespaces/obsidian/classes/component/",
                                "api/namespaces/obsidian/classes/view",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/classes/workspaceleaf/",
                                "api/namespaces/obsidian/classes/scope/",
                                "api/namespaces/obsidian/classes/menu/",
                                "api/namespaces/obsidian/interfaces/keymapeventhandler/",
                                "api/namespaces/obsidian/interfaces/viewstateresult/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/TemplatesPluginInstance": {
                            "title": "TemplatesPluginInstance",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/internalplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugin/",
                                "api/namespaces/internals/interfaces/templatesplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugininstance"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/ThemeManifest": {
                            "title": "ThemeManifest",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/Token": {
                            "title": "Token",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/editorrange/",
                                "api/namespaces/obsidian/interfaces/editorposition/",
                                "api/namespaces/obsidian/interfaces/editorrange"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/editorrange": {
                            "title": "editorrange",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/Token"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/Tree": {
                            "title": "Tree",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/type-aliases/treenode/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/classes/scope/",
                                "api/namespaces/obsidian/classes/view/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/type-aliases/treenode/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/Tree",
                                "api/namespaces/internals/type-aliases/TreeItem",
                                "api/namespaces/internals/type-aliases/TreeNode"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/UnknownView": {
                            "title": "UnknownView",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/emptyview/",
                                "api/namespaces/obsidian/classes/component/",
                                "api/namespaces/internals/interfaces/emptyview",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/classes/workspaceleaf/",
                                "api/namespaces/obsidian/classes/scope/",
                                "api/namespaces/obsidian/classes/menu/",
                                "api/namespaces/obsidian/interfaces/keymapeventhandler/",
                                "api/namespaces/obsidian/interfaces/viewstateresult/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/emptyview/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/UnknownView",
                                "api/namespaces/obsidian/classes/ItemView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/emptyview": {
                            "title": "emptyview",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/UnknownView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/VaultFileMapRecord": {
                            "title": "VaultFileMapRecord",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/tabstractfile/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/VideoView": {
                            "title": "VideoView",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/editablefileview/",
                                "api/namespaces/obsidian/classes/component/",
                                "api/namespaces/obsidian/classes/editablefileview",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/classes/tfile/",
                                "api/namespaces/obsidian/classes/workspaceleaf/",
                                "api/namespaces/obsidian/classes/scope/",
                                "api/namespaces/obsidian/classes/menu/",
                                "api/namespaces/obsidian/interfaces/keymapeventhandler/",
                                "api/namespaces/obsidian/interfaces/viewstateresult/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/ViewRegistry": {
                            "title": "ViewRegistry",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/events/",
                                "api/namespaces/internals/interfaces/viewregistrytypebyextensionrecord/",
                                "api/namespaces/internals/interfaces/viewregistryviewbytyperecord/",
                                "api/namespaces/obsidian/classes/view/",
                                "api/namespaces/obsidian/classes/workspaceleaf/",
                                "api/namespaces/obsidian/classes/events",
                                "api/namespaces/obsidian/interfaces/eventref/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/viewregistrytypebyextensionrecord/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/ViewRegistry"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/viewregistryviewbytyperecord/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/ViewRegistry"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/ViewRegistryTypeByExtensionRecord": {
                            "title": "ViewRegistryTypeByExtensionRecord",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/ViewRegistryViewByTypeRecord": {
                            "title": "ViewRegistryViewByTypeRecord",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/view/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/WeakMapWrapper": {
                            "title": "WeakMapWrapper",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/WidgetEditorView": {
                            "title": "WidgetEditorView",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/embeddededitorview/",
                                "api/namespaces/obsidian/classes/component/",
                                "api/namespaces/internals/interfaces/embeddededitorview",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/internals/interfaces/iframedmarkdowneditor/",
                                "api/namespaces/obsidian/classes/tfile/",
                                "api/namespaces/obsidian/classes/hoverpopover/",
                                "api/namespaces/obsidian/classes/markdownpreviewview/",
                                "api/namespaces/obsidian/classes/scope/",
                                "api/namespaces/internals/interfaces/foldinfo/",
                                "api/namespaces/obsidian/interfaces/cachedmetadata/",
                                "api/namespaces/obsidian/classes/tabstractfile/",
                                "api/namespaces/obsidian/interfaces/keymapeventhandler/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/embeddededitorview/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/WidgetEditorView",
                                "api/namespaces/obsidian/classes/Component"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/embeddededitorview": {
                            "title": "embeddededitorview",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/WidgetEditorView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/WindowSelection": {
                            "title": "WindowSelection",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/WordCountPluginInstance": {
                            "title": "WordCountPluginInstance",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/internalplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugin/",
                                "api/namespaces/internals/interfaces/wordcountplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugininstance"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/WorkspaceHoverLinkSourcesRecord": {
                            "title": "WorkspaceHoverLinkSourcesRecord",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/hoverlinksource/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/hoverlinksource/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/interfaces/WorkspaceHoverLinkSourcesRecord",
                                "api/namespaces/obsidian/classes/Plugin"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/WorkspacesPluginInstance": {
                            "title": "WorkspacesPluginInstance",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/internalplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugin/",
                                "api/namespaces/internals/interfaces/workspacesplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugininstance"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/ZkPrefixerPluginInstance": {
                            "title": "ZkPrefixerPluginInstance",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/internalplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugin/",
                                "api/namespaces/internals/interfaces/zkprefixerplugininstance/",
                                "api/namespaces/internals/interfaces/internalplugininstance"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/type-aliases/ConfigItem": {
                            "title": "ConfigItem",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/type-aliases/EmbeddableConstructor": {
                            "title": "EmbeddableConstructor",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/component/",
                                "api/namespaces/internals/interfaces/embedcontext/",
                                "api/namespaces/obsidian/classes/tfile/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/embedcontext/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/type-aliases/EmbeddableConstructor"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/type-aliases/InternalPluginNameInstancesMapping": {
                            "title": "InternalPluginNameInstancesMapping",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/audiorecorderplugininstance/",
                                "api/namespaces/internals/interfaces/backlinkplugininstance/",
                                "api/namespaces/internals/interfaces/bookmarksplugininstance/",
                                "api/namespaces/internals/interfaces/canvasplugininstance/",
                                "api/namespaces/internals/interfaces/commandpaletteplugininstance/",
                                "api/namespaces/internals/interfaces/dailynotesplugininstance/",
                                "api/namespaces/internals/interfaces/editorstatusplugininstance/",
                                "api/namespaces/internals/interfaces/fileexplorerplugininstance/",
                                "api/namespaces/internals/interfaces/filerecoveryplugininstance/",
                                "api/namespaces/internals/interfaces/globalsearchplugininstance/",
                                "api/namespaces/internals/interfaces/graphplugininstance/",
                                "api/namespaces/internals/interfaces/markdownimporterplugininstance/",
                                "api/namespaces/internals/interfaces/notecomposerplugininstance/",
                                "api/namespaces/internals/interfaces/outgoinglinkplugininstance/",
                                "api/namespaces/internals/interfaces/outlineplugininstance/",
                                "api/namespaces/internals/interfaces/pagepreviewplugininstance/",
                                "api/namespaces/internals/interfaces/propertiesplugininstance/",
                                "api/namespaces/internals/interfaces/publishplugininstance/",
                                "api/namespaces/internals/interfaces/randomnoteplugininstance/",
                                "api/namespaces/internals/interfaces/slashcommandplugininstance/",
                                "api/namespaces/internals/interfaces/slidesplugininstance/",
                                "api/namespaces/internals/interfaces/starredplugininstance/",
                                "api/namespaces/internals/interfaces/switcherplugininstance/",
                                "api/namespaces/internals/interfaces/syncplugininstance/",
                                "api/namespaces/internals/interfaces/tagpaneplugininstance/",
                                "api/namespaces/internals/interfaces/templatesplugininstance/",
                                "api/namespaces/internals/interfaces/wordcountplugininstance/",
                                "api/namespaces/internals/interfaces/workspacesplugininstance/",
                                "api/namespaces/internals/interfaces/zkprefixerplugininstance/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/type-aliases/InternalPluginNameType": {
                            "title": "InternalPluginNameType",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/variables/internalpluginname/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/variables/internalpluginname/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/type-aliases/InternalPluginNameType"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/type-aliases/LinkUpdateHandler": {
                            "title": "LinkUpdateHandler",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/linkupdate/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/linkupdate/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/internals/type-aliases/LinkUpdateHandler"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/type-aliases/PropertyWidgetType": {
                            "title": "PropertyWidgetType",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/type-aliases/TreeItem": {
                            "title": "TreeItem",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/type-aliases/treenode/",
                                "api/namespaces/obsidian/classes/view/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/type-aliases/TreeNode": {
                            "title": "TreeNode",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/type-aliases/treenode/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/variables/InternalPluginName": {
                            "title": "InternalPluginName",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/AbstractInputSuggest": {
                            "title": "AbstractInputSuggest",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/popoversuggest/",
                                "api/namespaces/obsidian/classes/abstractinputsuggest/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/classes/popoversuggest",
                                "api/namespaces/obsidian/classes/scope/",
                                "api/namespaces/internals/interfaces/suggestioncontainer/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/popoversuggest/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/AbstractInputSuggest",
                                "api/namespaces/obsidian/classes/EditorSuggest",
                                "api/namespaces/obsidian/classes/PopoverSuggest",
                                "api/namespaces/obsidian/interfaces/CloseableComponent",
                                "api/namespaces/obsidian/interfaces/ISuggestOwner"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/abstractinputsuggest/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/AbstractInputSuggest",
                                "api/namespaces/obsidian/classes/PopoverSuggest"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/popoversuggest": {
                            "title": "popoversuggest",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/AbstractInputSuggest",
                                "api/namespaces/obsidian/classes/EditorSuggest"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/AbstractTextComponent": {
                            "title": "AbstractTextComponent",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/valuecomponent/",
                                "api/namespaces/obsidian/classes/searchcomponent/",
                                "api/namespaces/obsidian/classes/textareacomponent/",
                                "api/namespaces/obsidian/classes/textcomponent/",
                                "api/namespaces/obsidian/classes/abstracttextcomponent/",
                                "api/namespaces/obsidian/classes/valuecomponent"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/valuecomponent/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/AbstractTextComponent",
                                "api/namespaces/obsidian/classes/BaseComponent",
                                "api/namespaces/obsidian/classes/ColorComponent",
                                "api/namespaces/obsidian/classes/DropdownComponent",
                                "api/namespaces/obsidian/classes/ProgressBarComponent",
                                "api/namespaces/obsidian/classes/SliderComponent",
                                "api/namespaces/obsidian/classes/ToggleComponent",
                                "api/namespaces/obsidian/classes/ValueComponent"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/textareacomponent/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/AbstractTextComponent",
                                "api/namespaces/obsidian/classes/TextAreaComponent"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/textcomponent/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/AbstractTextComponent",
                                "api/namespaces/obsidian/classes/MomentFormatComponent",
                                "api/namespaces/obsidian/classes/TextComponent"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/abstracttextcomponent/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/AbstractTextComponent",
                                "api/namespaces/obsidian/classes/SearchComponent",
                                "api/namespaces/obsidian/classes/TextAreaComponent",
                                "api/namespaces/obsidian/classes/TextComponent",
                                "api/namespaces/obsidian/classes/ValueComponent"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/valuecomponent": {
                            "title": "valuecomponent",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/AbstractTextComponent",
                                "api/namespaces/obsidian/classes/ColorComponent",
                                "api/namespaces/obsidian/classes/DropdownComponent",
                                "api/namespaces/obsidian/classes/ProgressBarComponent",
                                "api/namespaces/obsidian/classes/SliderComponent",
                                "api/namespaces/obsidian/classes/ToggleComponent"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/App": {
                            "title": "App",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/internals/interfaces/account/",
                                "api/namespaces/internals/interfaces/commands/",
                                "api/namespaces/internals/interfaces/customcss/",
                                "api/namespaces/internals/interfaces/obsidiandom/",
                                "api/namespaces/internals/interfaces/embedregistry/",
                                "api/namespaces/obsidian/classes/filemanager/",
                                "api/namespaces/internals/interfaces/hotkeymanager/",
                                "api/namespaces/internals/interfaces/internalplugins/",
                                "api/namespaces/obsidian/classes/keymap/",
                                "api/namespaces/obsidian/type-aliases/userevent/",
                                "api/namespaces/internals/interfaces/loadprogress/",
                                "api/namespaces/obsidian/classes/metadatacache/",
                                "api/namespaces/internals/interfaces/metadatatypemanager/",
                                "api/namespaces/internals/interfaces/plugins/",
                                "api/namespaces/obsidian/classes/scope/",
                                "api/namespaces/obsidian/classes/setting/",
                                "api/namespaces/obsidian/classes/vault/",
                                "api/namespaces/internals/interfaces/viewregistry/",
                                "api/namespaces/obsidian/classes/workspace/",
                                "api/namespaces/obsidian/classes/tfile/",
                                "api/namespaces/internals/interfaces/importedattachments/",
                                "api/namespaces/obsidian/classes/tfolder/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/account/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/App"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/commands/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/App"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/customcss/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/App",
                                "api/namespaces/obsidian/classes/Component"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/obsidiandom/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/App"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/embedregistry/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/App",
                                "api/namespaces/obsidian/classes/Events"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/filemanager/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/App",
                                "api/namespaces/obsidian/classes/FileManager"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/hotkeymanager/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/App"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/internalplugins/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/App",
                                "api/namespaces/obsidian/classes/Events"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/keymap/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/App",
                                "api/namespaces/obsidian/classes/Keymap"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/type-aliases/userevent/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/App",
                                "api/namespaces/obsidian/classes/Keymap"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/loadprogress/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/App"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/metadatacache/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/App",
                                "api/namespaces/obsidian/classes/Events",
                                "api/namespaces/obsidian/classes/MetadataCache"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/metadatatypemanager/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/App",
                                "api/namespaces/obsidian/classes/Events"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/plugins/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/App"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/viewregistry/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/App",
                                "api/namespaces/obsidian/classes/Events"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/BaseComponent": {
                            "title": "BaseComponent",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/buttoncomponent/",
                                "api/namespaces/obsidian/classes/extrabuttoncomponent/",
                                "api/namespaces/obsidian/classes/valuecomponent/",
                                "api/namespaces/obsidian/classes/basecomponent/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/buttoncomponent/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/BaseComponent",
                                "api/namespaces/obsidian/classes/ButtonComponent"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/extrabuttoncomponent/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/BaseComponent",
                                "api/namespaces/obsidian/classes/ExtraButtonComponent"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/basecomponent/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/BaseComponent",
                                "api/namespaces/obsidian/classes/ButtonComponent",
                                "api/namespaces/obsidian/classes/ExtraButtonComponent",
                                "api/namespaces/obsidian/classes/Setting",
                                "api/namespaces/obsidian/classes/ValueComponent"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/ButtonComponent": {
                            "title": "ButtonComponent",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/basecomponent/",
                                "api/namespaces/obsidian/classes/buttoncomponent/",
                                "api/namespaces/obsidian/classes/basecomponent",
                                "api/namespaces/obsidian/interfaces/tooltipoptions/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/basecomponent": {
                            "title": "basecomponent",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/ButtonComponent",
                                "api/namespaces/obsidian/classes/ExtraButtonComponent",
                                "api/namespaces/obsidian/classes/ValueComponent"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/tooltipoptions/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/ButtonComponent",
                                "api/namespaces/obsidian/classes/ExtraButtonComponent",
                                "api/namespaces/obsidian/classes/Setting",
                                "api/namespaces/obsidian/classes/ToggleComponent",
                                "api/namespaces/obsidian/functions/setTooltip"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/ColorComponent": {
                            "title": "ColorComponent",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/valuecomponent/",
                                "api/namespaces/obsidian/classes/colorcomponent/",
                                "api/namespaces/obsidian/classes/valuecomponent",
                                "api/namespaces/obsidian/interfaces/hsl/",
                                "api/namespaces/obsidian/interfaces/rgb/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/colorcomponent/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/ColorComponent",
                                "api/namespaces/obsidian/classes/ValueComponent"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/hsl/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/ColorComponent"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/rgb/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/ColorComponent"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/Component": {
                            "title": "Component",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/hoverpopover/",
                                "api/namespaces/obsidian/interfaces/markdownpreviewevents/",
                                "api/namespaces/obsidian/classes/markdownrenderchild/",
                                "api/namespaces/obsidian/classes/menu/",
                                "api/namespaces/obsidian/classes/plugin/",
                                "api/namespaces/obsidian/classes/view/",
                                "api/namespaces/internals/interfaces/embeddededitorview/",
                                "api/namespaces/internals/interfaces/markdownbaseview/",
                                "api/namespaces/internals/interfaces/metadataeditor/",
                                "api/namespaces/internals/interfaces/metadataeditorproperty/",
                                "api/namespaces/internals/interfaces/customcss/",
                                "api/namespaces/obsidian/classes/component/",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/interfaces/keymapeventhandler/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/markdownpreviewevents/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/Component",
                                "api/namespaces/obsidian/classes/MarkdownPreviewView",
                                "api/namespaces/obsidian/classes/MarkdownRenderer"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/markdownrenderchild/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/Component",
                                "api/namespaces/obsidian/classes/MarkdownRenderChild",
                                "api/namespaces/obsidian/classes/MarkdownRenderer",
                                "api/namespaces/obsidian/interfaces/MarkdownPostProcessorContext"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/DropdownComponent": {
                            "title": "DropdownComponent",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/valuecomponent/",
                                "api/namespaces/obsidian/classes/dropdowncomponent/",
                                "api/namespaces/obsidian/classes/valuecomponent"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/dropdowncomponent/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/DropdownComponent",
                                "api/namespaces/obsidian/classes/ValueComponent"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/EditableFileView": {
                            "title": "EditableFileView",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/fileview/",
                                "api/namespaces/obsidian/classes/textfileview/",
                                "api/namespaces/internals/interfaces/audioview/",
                                "api/namespaces/internals/interfaces/imageview/",
                                "api/namespaces/internals/interfaces/pdfview/",
                                "api/namespaces/internals/interfaces/videoview/",
                                "api/namespaces/obsidian/classes/editablefileview/",
                                "api/namespaces/obsidian/classes/workspaceleaf/",
                                "api/namespaces/obsidian/classes/fileview",
                                "api/namespaces/obsidian/classes/component/",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/classes/tfile/",
                                "api/namespaces/obsidian/classes/scope/",
                                "api/namespaces/obsidian/classes/menu/",
                                "api/namespaces/obsidian/interfaces/keymapeventhandler/",
                                "api/namespaces/obsidian/interfaces/viewstateresult/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/audioview/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/EditableFileView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/imageview/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/EditableFileView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/pdfview/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/EditableFileView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/videoview/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/EditableFileView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/Editor": {
                            "title": "Editor",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/baseeditor/",
                                "api/namespaces/obsidian/classes/editor/",
                                "api/namespaces/internals/interfaces/baseeditor",
                                "api/namespaces/internals/interfaces/markdownscrollableeditview/",
                                "api/namespaces/obsidian/interfaces/editorrange/",
                                "api/namespaces/obsidian/interfaces/editorselection/",
                                "api/namespaces/obsidian/interfaces/editorposition/",
                                "api/namespaces/obsidian/type-aliases/editorcommandname/",
                                "api/namespaces/internals/interfaces/searchcursor/",
                                "api/namespaces/obsidian/interfaces/editorselectionorcaret/",
                                "api/namespaces/obsidian/interfaces/editortransaction/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/baseeditor/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/Editor"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/baseeditor": {
                            "title": "baseeditor",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/Editor"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/editorselection/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/Editor",
                                "api/namespaces/obsidian/classes/MarkdownEditView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/type-aliases/editorcommandname/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/Editor"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/editorselectionorcaret/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/Editor"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/editortransaction/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/Editor"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/EditorSuggest": {
                            "title": "EditorSuggest",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/popoversuggest/",
                                "api/namespaces/internals/interfaces/filesuggest/",
                                "api/namespaces/obsidian/classes/editorsuggest/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/classes/popoversuggest",
                                "api/namespaces/obsidian/interfaces/editorsuggestcontext/",
                                "api/namespaces/obsidian/classes/scope/",
                                "api/namespaces/internals/interfaces/suggestioncontainer/",
                                "api/namespaces/obsidian/interfaces/editorsuggesttriggerinfo/",
                                "api/namespaces/obsidian/interfaces/editorposition/",
                                "api/namespaces/obsidian/classes/editor/",
                                "api/namespaces/obsidian/classes/tfile/",
                                "api/namespaces/obsidian/interfaces/instruction/",
                                "api/namespaces/obsidian/interfaces/searchresult/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/filesuggest/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/EditorSuggest"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/Events": {
                            "title": "Events",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/metadatacache/",
                                "api/namespaces/obsidian/classes/vault/",
                                "api/namespaces/obsidian/classes/workspace/",
                                "api/namespaces/obsidian/classes/workspaceitem/",
                                "api/namespaces/internals/interfaces/embedregistry/",
                                "api/namespaces/internals/interfaces/metadatatypemanager/",
                                "api/namespaces/internals/interfaces/viewregistry/",
                                "api/namespaces/internals/interfaces/internalplugins/",
                                "api/namespaces/obsidian/classes/events/",
                                "api/namespaces/obsidian/interfaces/eventref/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/ExtraButtonComponent": {
                            "title": "ExtraButtonComponent",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/basecomponent/",
                                "api/namespaces/obsidian/classes/extrabuttoncomponent/",
                                "api/namespaces/obsidian/classes/basecomponent",
                                "api/namespaces/obsidian/functions/addicon",
                                "api/namespaces/obsidian/interfaces/tooltipoptions/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/functions/addicon": {
                            "title": "addicon",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/ExtraButtonComponent",
                                "api/namespaces/obsidian/classes/MenuItem",
                                "api/namespaces/obsidian/classes/Plugin"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/FileManager": {
                            "title": "FileManager",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/filemanager/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/classes/vault/",
                                "api/namespaces/obsidian/type-aliases/panetype/",
                                "api/namespaces/obsidian/classes/tfile/",
                                "api/namespaces/obsidian/classes/tfolder/",
                                "api/namespaces/obsidian/interfaces/datawriteoptions/",
                                "api/namespaces/obsidian/classes/tabstractfile/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/datawriteoptions/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/FileManager",
                                "api/namespaces/obsidian/classes/FileSystemAdapter",
                                "api/namespaces/obsidian/classes/Vault",
                                "api/namespaces/obsidian/interfaces/DataAdapter"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/FileSystemAdapter": {
                            "title": "FileSystemAdapter",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/dataadapter/",
                                "api/namespaces/obsidian/classes/filesystemadapter/",
                                "api/namespaces/obsidian/interfaces/dataadapter",
                                "api/namespaces/internals/interfaces/dataadapterfilesrecord/",
                                "api/namespaces/obsidian/interfaces/datawriteoptions/",
                                "api/namespaces/obsidian/interfaces/listedfiles/",
                                "api/namespaces/obsidian/interfaces/stat/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/dataadapter/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/FileSystemAdapter",
                                "api/namespaces/obsidian/classes/Vault"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/filesystemadapter/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/FileSystemAdapter",
                                "api/namespaces/obsidian/interfaces/DataAdapter"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/dataadapter": {
                            "title": "dataadapter",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/FileSystemAdapter"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/dataadapterfilesrecord/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/FileSystemAdapter",
                                "api/namespaces/obsidian/interfaces/DataAdapter"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/listedfiles/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/FileSystemAdapter",
                                "api/namespaces/obsidian/interfaces/DataAdapter"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/stat/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/FileSystemAdapter",
                                "api/namespaces/obsidian/interfaces/DataAdapter"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/FileView": {
                            "title": "FileView",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/itemview/",
                                "api/namespaces/obsidian/classes/editablefileview/",
                                "api/namespaces/internals/interfaces/infofileview/",
                                "api/namespaces/obsidian/classes/fileview/",
                                "api/namespaces/obsidian/classes/workspaceleaf/",
                                "api/namespaces/obsidian/classes/itemview",
                                "api/namespaces/obsidian/classes/component/",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/classes/tfile/",
                                "api/namespaces/obsidian/classes/scope/",
                                "api/namespaces/obsidian/classes/menu/",
                                "api/namespaces/obsidian/interfaces/keymapeventhandler/",
                                "api/namespaces/obsidian/interfaces/viewstateresult/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/FuzzySuggestModal": {
                            "title": "FuzzySuggestModal",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/suggestmodal/",
                                "api/namespaces/obsidian/interfaces/fuzzymatch/",
                                "api/namespaces/obsidian/classes/fuzzysuggestmodal/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/classes/suggestmodal",
                                "api/namespaces/obsidian/classes/scope/",
                                "api/namespaces/obsidian/interfaces/instruction/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/suggestmodal/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/FuzzySuggestModal",
                                "api/namespaces/obsidian/classes/Modal",
                                "api/namespaces/obsidian/classes/SuggestModal",
                                "api/namespaces/obsidian/interfaces/ISuggestOwner"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/fuzzymatch/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/FuzzySuggestModal"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/fuzzysuggestmodal/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/FuzzySuggestModal",
                                "api/namespaces/obsidian/classes/SuggestModal"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/suggestmodal": {
                            "title": "suggestmodal",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/FuzzySuggestModal"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/HoverPopover": {
                            "title": "HoverPopover",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/component/",
                                "api/namespaces/obsidian/classes/hoverpopover/",
                                "api/namespaces/obsidian/interfaces/hoverparent/",
                                "api/namespaces/obsidian/classes/component",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/enumerations/popoverstate/",
                                "api/namespaces/obsidian/interfaces/keymapeventhandler/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/hoverparent/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/HoverPopover",
                                "api/namespaces/obsidian/classes/MarkdownEditView",
                                "api/namespaces/obsidian/classes/MarkdownRenderer",
                                "api/namespaces/obsidian/interfaces/MarkdownFileInfo"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/enumerations/popoverstate/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/HoverPopover"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/ItemView": {
                            "title": "ItemView",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/view/",
                                "api/namespaces/obsidian/classes/fileview/",
                                "api/namespaces/internals/interfaces/allpropertiesview/",
                                "api/namespaces/internals/interfaces/bookmarksview/",
                                "api/namespaces/internals/interfaces/browserhistoryview/",
                                "api/namespaces/internals/interfaces/browserview/",
                                "api/namespaces/internals/interfaces/emptyview/",
                                "api/namespaces/internals/interfaces/graphview/",
                                "api/namespaces/internals/interfaces/releasenotesview/",
                                "api/namespaces/obsidian/classes/itemview/",
                                "api/namespaces/obsidian/classes/workspaceleaf/",
                                "api/namespaces/obsidian/classes/view",
                                "api/namespaces/obsidian/classes/component/",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/classes/scope/",
                                "api/namespaces/obsidian/classes/menu/",
                                "api/namespaces/obsidian/interfaces/keymapeventhandler/",
                                "api/namespaces/obsidian/interfaces/viewstateresult/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/allpropertiesview/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/ItemView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/bookmarksview/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/ItemView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/browserhistoryview/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/ItemView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/browserview/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/ItemView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/graphview/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/ItemView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/releasenotesview/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/ItemView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/Keymap": {
                            "title": "Keymap",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/scope",
                                "api/namespaces/obsidian/classes/keymap/",
                                "api/namespaces/obsidian/classes/scope/",
                                "api/namespaces/obsidian/type-aliases/panetype/",
                                "api/namespaces/obsidian/type-aliases/userevent/",
                                "api/namespaces/obsidian/type-aliases/modifier/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/scope": {
                            "title": "scope",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/Keymap"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/type-aliases/modifier/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/Keymap",
                                "api/namespaces/obsidian/classes/Scope",
                                "api/namespaces/obsidian/interfaces/Hotkey"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/MarkdownEditView": {
                            "title": "MarkdownEditView",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/markdownsubview/",
                                "api/namespaces/obsidian/interfaces/hoverparent/",
                                "api/namespaces/obsidian/interfaces/markdownfileinfo/",
                                "api/namespaces/internals/interfaces/markdownscrollableeditview/",
                                "api/namespaces/obsidian/classes/markdowneditview/",
                                "api/namespaces/obsidian/classes/markdownview/",
                                "api/namespaces/obsidian/classes/component/",
                                "api/namespaces/internals/interfaces/markdownscrollableeditview",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/interfaces/markdownfileinfo",
                                "api/namespaces/internals/interfaces/clipboardmanager/",
                                "api/namespaces/obsidian/classes/editor/",
                                "api/namespaces/internals/interfaces/editorsuggests/",
                                "api/namespaces/obsidian/classes/hoverpopover/",
                                "api/namespaces/obsidian/classes/scope/",
                                "api/namespaces/internals/interfaces/editorsearchcomponent/",
                                "api/namespaces/internals/interfaces/tablecelleditor/",
                                "api/namespaces/obsidian/classes/tfile/",
                                "api/namespaces/internals/interfaces/foldinfo/",
                                "api/namespaces/obsidian/interfaces/markdownsubview",
                                "api/namespaces/internals/interfaces/tableeditor/",
                                "api/namespaces/internals/interfaces/tablecell/",
                                "api/namespaces/obsidian/interfaces/editorrange/",
                                "api/namespaces/obsidian/interfaces/editorselection/",
                                "api/namespaces/obsidian/interfaces/keymapeventhandler/",
                                "api/namespaces/internals/interfaces/token/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/markdownsubview/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/MarkdownEditView",
                                "api/namespaces/obsidian/classes/MarkdownPreviewView",
                                "api/namespaces/obsidian/classes/MarkdownView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/markdownfileinfo": {
                            "title": "markdownfileinfo",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/MarkdownEditView",
                                "api/namespaces/obsidian/classes/MarkdownView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/markdownsubview": {
                            "title": "markdownsubview",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/MarkdownEditView",
                                "api/namespaces/obsidian/classes/MarkdownPreviewView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/MarkdownPreviewRenderer": {
                            "title": "MarkdownPreviewRenderer",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/markdownpreviewrenderer/",
                                "api/namespaces/obsidian/interfaces/markdownpostprocessorcontext/",
                                "api/namespaces/obsidian/interfaces/markdownpostprocessor/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/markdownpreviewrenderer/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/MarkdownPreviewRenderer"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/markdownpostprocessorcontext/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/MarkdownPreviewRenderer",
                                "api/namespaces/obsidian/interfaces/MarkdownPostProcessor"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/markdownpostprocessor/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/MarkdownPreviewRenderer",
                                "api/namespaces/obsidian/classes/Plugin"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/MarkdownPreviewView": {
                            "title": "MarkdownPreviewView",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/markdownrenderer/",
                                "api/namespaces/obsidian/interfaces/markdownsubview/",
                                "api/namespaces/obsidian/interfaces/markdownpreviewevents/",
                                "api/namespaces/obsidian/classes/markdownpreviewview/",
                                "api/namespaces/obsidian/classes/markdownrenderer",
                                "api/namespaces/obsidian/classes/component/",
                                "api/namespaces/obsidian/interfaces/markdownpreviewevents",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/classes/hoverpopover/",
                                "api/namespaces/internals/interfaces/readviewrenderer/",
                                "api/namespaces/obsidian/classes/markdownview/",
                                "api/namespaces/obsidian/classes/tfile/",
                                "api/namespaces/obsidian/interfaces/markdownsubview",
                                "api/namespaces/obsidian/interfaces/keymapeventhandler/",
                                "api/namespaces/obsidian/classes/markdownpreviewview"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/markdownrenderer/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/MarkdownPreviewView",
                                "api/namespaces/obsidian/classes/MarkdownRenderChild",
                                "api/namespaces/obsidian/classes/MarkdownRenderer",
                                "api/namespaces/obsidian/interfaces/HoverParent",
                                "api/namespaces/obsidian/interfaces/MarkdownPreviewEvents"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/markdownrenderer": {
                            "title": "markdownrenderer",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/MarkdownPreviewView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/markdownpreviewevents": {
                            "title": "markdownpreviewevents",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/MarkdownPreviewView",
                                "api/namespaces/obsidian/classes/MarkdownRenderer"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/readviewrenderer/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/MarkdownPreviewView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/markdownpreviewview": {
                            "title": "markdownpreviewview",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/MarkdownPreviewView",
                                "api/namespaces/obsidian/classes/MarkdownRenderer"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/MarkdownRenderChild": {
                            "title": "MarkdownRenderChild",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/component/",
                                "api/namespaces/obsidian/classes/markdownrenderer/",
                                "api/namespaces/obsidian/classes/markdownrenderchild/",
                                "api/namespaces/obsidian/classes/component",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/interfaces/keymapeventhandler/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/MarkdownRenderer": {
                            "title": "MarkdownRenderer",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/markdownrenderchild/",
                                "api/namespaces/obsidian/interfaces/markdownpreviewevents/",
                                "api/namespaces/obsidian/interfaces/hoverparent/",
                                "api/namespaces/obsidian/classes/markdownpreviewview/",
                                "api/namespaces/obsidian/classes/markdownrenderer/",
                                "api/namespaces/obsidian/classes/markdownrenderchild",
                                "api/namespaces/obsidian/classes/component/",
                                "api/namespaces/obsidian/interfaces/markdownpreviewevents",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/classes/hoverpopover/",
                                "api/namespaces/obsidian/interfaces/hoverparent",
                                "api/namespaces/obsidian/classes/tfile/",
                                "api/namespaces/obsidian/interfaces/keymapeventhandler/",
                                "api/namespaces/obsidian/classes/markdownpreviewview"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/markdownrenderchild": {
                            "title": "markdownrenderchild",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/MarkdownRenderer"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/hoverparent": {
                            "title": "hoverparent",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/MarkdownRenderer",
                                "api/namespaces/obsidian/interfaces/MarkdownFileInfo"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/MarkdownView": {
                            "title": "MarkdownView",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/textfileview/",
                                "api/namespaces/obsidian/interfaces/markdownfileinfo/",
                                "api/namespaces/obsidian/classes/markdownview/",
                                "api/namespaces/obsidian/classes/workspaceleaf/",
                                "api/namespaces/obsidian/classes/textfileview",
                                "api/namespaces/obsidian/classes/component/",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/interfaces/markdownfileinfo",
                                "api/namespaces/obsidian/interfaces/markdownsubview/",
                                "api/namespaces/obsidian/classes/markdowneditview/",
                                "api/namespaces/obsidian/classes/editor/",
                                "api/namespaces/obsidian/classes/tfile/",
                                "api/namespaces/obsidian/classes/hoverpopover/",
                                "api/namespaces/internals/interfaces/metadataeditor/",
                                "api/namespaces/obsidian/classes/markdownpreviewview/",
                                "api/namespaces/obsidian/classes/scope/",
                                "api/namespaces/obsidian/type-aliases/markdownviewmodetype/",
                                "api/namespaces/obsidian/classes/menu/",
                                "api/namespaces/obsidian/interfaces/keymapeventhandler/",
                                "api/namespaces/obsidian/interfaces/viewstateresult/",
                                "api/namespaces/internals/interfaces/token/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/type-aliases/markdownviewmodetype/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/MarkdownView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/Menu": {
                            "title": "Menu",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/component/",
                                "api/namespaces/obsidian/interfaces/closeablecomponent/",
                                "api/namespaces/obsidian/classes/menu/",
                                "api/namespaces/obsidian/classes/component",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/classes/menuitem/",
                                "api/namespaces/obsidian/classes/scope/",
                                "api/namespaces/obsidian/interfaces/closeablecomponent",
                                "api/namespaces/obsidian/interfaces/keymapeventhandler/",
                                "api/namespaces/obsidian/interfaces/menupositiondef/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/closeablecomponent/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/Menu",
                                "api/namespaces/obsidian/classes/Modal",
                                "api/namespaces/obsidian/classes/PopoverSuggest"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/menuitem/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/Menu"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/closeablecomponent": {
                            "title": "closeablecomponent",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/Menu",
                                "api/namespaces/obsidian/classes/Modal",
                                "api/namespaces/obsidian/classes/PopoverSuggest"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/menupositiondef/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/Menu"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/MenuItem": {
                            "title": "MenuItem",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/menu/",
                                "api/namespaces/obsidian/functions/addicon"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/MenuSeparator": {
                            "title": "MenuSeparator",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/menuseparator/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/menuseparator/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/MenuSeparator"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/MetadataCache": {
                            "title": "MetadataCache",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/events/",
                                "api/namespaces/obsidian/classes/metadatacache/",
                                "api/namespaces/obsidian/classes/events",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/classes/vault/",
                                "api/namespaces/obsidian/classes/tfile/",
                                "api/namespaces/internals/interfaces/propertyinfo/",
                                "api/namespaces/internals/interfaces/customarraydict/",
                                "api/namespaces/obsidian/interfaces/linkcache/",
                                "api/namespaces/obsidian/interfaces/cachedmetadata/",
                                "api/namespaces/internals/interfaces/filecacheentry/",
                                "api/namespaces/obsidian/interfaces/reference/",
                                "api/namespaces/obsidian/interfaces/eventref/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/customarraydict/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/MetadataCache"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/linkcache/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/MetadataCache",
                                "api/namespaces/obsidian/interfaces/CachedMetadata",
                                "api/namespaces/obsidian/interfaces/ReferenceCache"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/Modal": {
                            "title": "Modal",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/closeablecomponent/",
                                "api/namespaces/obsidian/classes/setting/",
                                "api/namespaces/obsidian/classes/suggestmodal/",
                                "api/namespaces/obsidian/classes/modal/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/classes/scope/",
                                "api/namespaces/obsidian/interfaces/closeablecomponent"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/modal/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/Modal",
                                "api/namespaces/obsidian/classes/Setting",
                                "api/namespaces/obsidian/classes/SuggestModal",
                                "api/namespaces/obsidian/interfaces/CloseableComponent"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/MomentFormatComponent": {
                            "title": "MomentFormatComponent",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/textcomponent/",
                                "api/namespaces/obsidian/classes/momentformatcomponent/",
                                "api/namespaces/obsidian/classes/textcomponent"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/momentformatcomponent/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/MomentFormatComponent",
                                "api/namespaces/obsidian/classes/TextComponent"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/textcomponent": {
                            "title": "textcomponent",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/MomentFormatComponent"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/Notice": {
                            "title": "Notice",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/notice/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/notice/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/Notice"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/Plugin": {
                            "title": "Plugin",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/component/",
                                "api/namespaces/obsidian/classes/plugin/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/interfaces/pluginmanifest/",
                                "api/namespaces/obsidian/classes/component",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/interfaces/command/",
                                "api/namespaces/obsidian/functions/addicon",
                                "api/namespaces/obsidian/classes/pluginsettingtab/",
                                "api/namespaces/obsidian/classes/workspace",
                                "api/namespaces/obsidian/classes/editorsuggest/",
                                "api/namespaces/obsidian/interfaces/hoverlinksource/",
                                "api/namespaces/obsidian/interfaces/markdownpostprocessor/",
                                "api/namespaces/obsidian/type-aliases/obsidianprotocolhandler/",
                                "api/namespaces/obsidian/interfaces/keymapeventhandler/",
                                "api/namespaces/obsidian/type-aliases/viewcreator/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/pluginsettingtab/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/Plugin",
                                "api/namespaces/obsidian/classes/PluginSettingTab",
                                "api/namespaces/obsidian/classes/SettingTab"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/workspace": {
                            "title": "workspace",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/Plugin",
                                "api/namespaces/obsidian/classes/Vault",
                                "api/namespaces/obsidian/classes/Workspace"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/type-aliases/obsidianprotocolhandler/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/Plugin",
                                "api/namespaces/obsidian/classes/Workspace"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/type-aliases/viewcreator/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/Plugin"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/PluginSettingTab": {
                            "title": "PluginSettingTab",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/settingtab/",
                                "api/namespaces/obsidian/classes/pluginsettingtab/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/classes/plugin/",
                                "api/namespaces/obsidian/classes/settingtab",
                                "api/namespaces/obsidian/classes/setting/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/PopoverSuggest": {
                            "title": "PopoverSuggest",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/isuggestowner/",
                                "api/namespaces/obsidian/interfaces/closeablecomponent/",
                                "api/namespaces/obsidian/classes/abstractinputsuggest/",
                                "api/namespaces/obsidian/classes/editorsuggest/",
                                "api/namespaces/obsidian/classes/popoversuggest/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/classes/scope/",
                                "api/namespaces/internals/interfaces/suggestioncontainer/",
                                "api/namespaces/obsidian/interfaces/closeablecomponent",
                                "api/namespaces/obsidian/interfaces/isuggestowner"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/isuggestowner/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/PopoverSuggest",
                                "api/namespaces/obsidian/classes/SuggestModal"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/isuggestowner": {
                            "title": "isuggestowner",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/PopoverSuggest",
                                "api/namespaces/obsidian/classes/SuggestModal"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/ProgressBarComponent": {
                            "title": "ProgressBarComponent",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/valuecomponent/",
                                "api/namespaces/obsidian/classes/progressbarcomponent/",
                                "api/namespaces/obsidian/classes/valuecomponent"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/progressbarcomponent/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/ProgressBarComponent",
                                "api/namespaces/obsidian/classes/ValueComponent"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/Scope": {
                            "title": "Scope",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/scope/",
                                "api/namespaces/internals/interfaces/keyscope/",
                                "api/namespaces/obsidian/interfaces/keymapeventhandler/",
                                "api/namespaces/obsidian/type-aliases/modifier/",
                                "api/namespaces/obsidian/type-aliases/keymapeventlistener/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/keyscope/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/Scope"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/type-aliases/keymapeventlistener/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/Scope"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/SearchComponent": {
                            "title": "SearchComponent",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/abstracttextcomponent/",
                                "api/namespaces/obsidian/classes/searchcomponent/",
                                "api/namespaces/obsidian/classes/abstracttextcomponent"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/abstracttextcomponent": {
                            "title": "abstracttextcomponent",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/SearchComponent",
                                "api/namespaces/obsidian/classes/TextAreaComponent",
                                "api/namespaces/obsidian/classes/TextComponent"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/Setting": {
                            "title": "Setting",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/modal/",
                                "api/namespaces/obsidian/classes/setting/",
                                "api/namespaces/obsidian/classes/modal",
                                "api/namespaces/obsidian/classes/settingtab/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/classes/basecomponent/",
                                "api/namespaces/obsidian/classes/scope/",
                                "api/namespaces/internals/interfaces/hotkeyssettingtab/",
                                "api/namespaces/obsidian/interfaces/tooltipoptions/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/modal": {
                            "title": "modal",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/Setting",
                                "api/namespaces/obsidian/classes/SuggestModal"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/hotkeyssettingtab/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/Setting",
                                "api/namespaces/obsidian/classes/SettingTab"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/SettingTab": {
                            "title": "SettingTab",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/pluginsettingtab/",
                                "api/namespaces/internals/interfaces/hotkeyssettingtab/",
                                "api/namespaces/obsidian/classes/settingtab/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/classes/plugin/",
                                "api/namespaces/obsidian/classes/setting/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/SliderComponent": {
                            "title": "SliderComponent",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/valuecomponent/",
                                "api/namespaces/obsidian/classes/slidercomponent/",
                                "api/namespaces/obsidian/classes/valuecomponent"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/slidercomponent/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/SliderComponent",
                                "api/namespaces/obsidian/classes/ValueComponent"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/SuggestModal": {
                            "title": "SuggestModal",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/modal/",
                                "api/namespaces/obsidian/interfaces/isuggestowner/",
                                "api/namespaces/obsidian/classes/fuzzysuggestmodal/",
                                "api/namespaces/obsidian/classes/suggestmodal/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/classes/modal",
                                "api/namespaces/obsidian/classes/scope/",
                                "api/namespaces/obsidian/interfaces/isuggestowner",
                                "api/namespaces/obsidian/interfaces/instruction/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/TAbstractFile": {
                            "title": "TAbstractFile",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/tfile/",
                                "api/namespaces/obsidian/classes/tfolder/",
                                "api/namespaces/obsidian/classes/tabstractfile/",
                                "api/namespaces/obsidian/classes/vault/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/Tasks": {
                            "title": "Tasks",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/tasks/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/tasks/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/Tasks"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/TextAreaComponent": {
                            "title": "TextAreaComponent",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/abstracttextcomponent/",
                                "api/namespaces/obsidian/classes/textareacomponent/",
                                "api/namespaces/obsidian/classes/abstracttextcomponent"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/TextComponent": {
                            "title": "TextComponent",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/abstracttextcomponent/",
                                "api/namespaces/obsidian/classes/momentformatcomponent/",
                                "api/namespaces/obsidian/classes/textcomponent/",
                                "api/namespaces/obsidian/classes/abstracttextcomponent"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/TextFileView": {
                            "title": "TextFileView",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/editablefileview/",
                                "api/namespaces/obsidian/classes/markdownview/",
                                "api/namespaces/internals/interfaces/canvasview/",
                                "api/namespaces/obsidian/classes/textfileview/",
                                "api/namespaces/obsidian/classes/workspaceleaf/",
                                "api/namespaces/obsidian/classes/editablefileview",
                                "api/namespaces/obsidian/classes/component/",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/classes/tfile/",
                                "api/namespaces/obsidian/classes/scope/",
                                "api/namespaces/obsidian/classes/menu/",
                                "api/namespaces/obsidian/interfaces/keymapeventhandler/",
                                "api/namespaces/obsidian/interfaces/viewstateresult/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/canvasview/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/TextFileView"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/TFile": {
                            "title": "TFile",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/tabstractfile/",
                                "api/namespaces/obsidian/classes/tfile/",
                                "api/namespaces/obsidian/classes/tabstractfile",
                                "api/namespaces/obsidian/classes/tfolder/",
                                "api/namespaces/obsidian/interfaces/filestats/",
                                "api/namespaces/obsidian/classes/vault/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/tabstractfile": {
                            "title": "tabstractfile",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/TFile",
                                "api/namespaces/obsidian/classes/TFolder"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/filestats/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/TFile"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/TFolder": {
                            "title": "TFolder",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/tabstractfile/",
                                "api/namespaces/obsidian/classes/tfolder/",
                                "api/namespaces/obsidian/classes/tabstractfile",
                                "api/namespaces/obsidian/classes/vault/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/ToggleComponent": {
                            "title": "ToggleComponent",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/valuecomponent/",
                                "api/namespaces/obsidian/classes/togglecomponent/",
                                "api/namespaces/obsidian/classes/valuecomponent",
                                "api/namespaces/obsidian/interfaces/tooltipoptions/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/togglecomponent/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/ToggleComponent",
                                "api/namespaces/obsidian/classes/ValueComponent"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/ValueComponent": {
                            "title": "ValueComponent",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/basecomponent/",
                                "api/namespaces/obsidian/classes/abstracttextcomponent/",
                                "api/namespaces/obsidian/classes/colorcomponent/",
                                "api/namespaces/obsidian/classes/dropdowncomponent/",
                                "api/namespaces/obsidian/classes/progressbarcomponent/",
                                "api/namespaces/obsidian/classes/slidercomponent/",
                                "api/namespaces/obsidian/classes/togglecomponent/",
                                "api/namespaces/obsidian/classes/valuecomponent/",
                                "api/namespaces/obsidian/classes/basecomponent"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/Vault": {
                            "title": "Vault",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/events/",
                                "api/namespaces/obsidian/classes/vault/",
                                "api/namespaces/obsidian/classes/events",
                                "api/namespaces/obsidian/interfaces/dataadapter/",
                                "api/namespaces/internals/interfaces/appvaultconfig/",
                                "api/namespaces/obsidian/classes/tfile/",
                                "api/namespaces/obsidian/interfaces/datawriteoptions/",
                                "api/namespaces/obsidian/classes/vault",
                                "api/namespaces/obsidian/classes/tfolder/",
                                "api/namespaces/obsidian/classes/tabstractfile/",
                                "api/namespaces/internals/type-aliases/configitem/",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/classes/workspace"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/appvaultconfig/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/Vault"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/vault": {
                            "title": "vault",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/Vault",
                                "api/namespaces/obsidian/interfaces/DataAdapter"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/type-aliases/configitem/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/Vault"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/View": {
                            "title": "View",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/component/",
                                "api/namespaces/obsidian/classes/itemview/",
                                "api/namespaces/internals/interfaces/fileexplorerview/",
                                "api/namespaces/internals/interfaces/searchview/",
                                "api/namespaces/internals/interfaces/tagview/",
                                "api/namespaces/obsidian/classes/view/",
                                "api/namespaces/obsidian/classes/workspaceleaf/",
                                "api/namespaces/obsidian/classes/component",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/classes/scope/",
                                "api/namespaces/obsidian/classes/menu/",
                                "api/namespaces/obsidian/interfaces/keymapeventhandler/",
                                "api/namespaces/obsidian/interfaces/viewstateresult/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/searchview/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/View"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/tagview/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/View"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/Workspace": {
                            "title": "Workspace",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/events/",
                                "api/namespaces/obsidian/classes/workspace/",
                                "api/namespaces/obsidian/classes/events",
                                "api/namespaces/obsidian/interfaces/markdownfileinfo/",
                                "api/namespaces/obsidian/classes/workspaceleaf/",
                                "api/namespaces/obsidian/classes/workspace",
                                "api/namespaces/obsidian/classes/workspacetabs/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/classes/tfile/",
                                "api/namespaces/obsidian/classes/workspaceribbon/",
                                "api/namespaces/obsidian/classes/workspacesidedock/",
                                "api/namespaces/obsidian/classes/workspacemobiledrawer/",
                                "api/namespaces/obsidian/type-aliases/obsidianprotocolhandler/",
                                "api/namespaces/internals/interfaces/recentfiletracker/",
                                "api/namespaces/obsidian/interfaces/debouncer/",
                                "api/namespaces/obsidian/classes/workspaceroot/",
                                "api/namespaces/internals/interfaces/statehistory/",
                                "api/namespaces/obsidian/type-aliases/splitdirection/",
                                "api/namespaces/obsidian/classes/workspacesplit/",
                                "api/namespaces/obsidian/type-aliases/panetype/",
                                "api/namespaces/obsidian/classes/fileview/",
                                "api/namespaces/obsidian/classes/view/",
                                "api/namespaces/obsidian/type-aliases/constructor/",
                                "api/namespaces/internals/interfaces/fileexplorerleaf/",
                                "api/namespaces/obsidian/classes/workspaceparent/",
                                "alse",
                                "api/namespaces/obsidian/classes/workspacewindow/",
                                "api/namespaces/obsidian/interfaces/workspacewindowinitdata/",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/interfaces/openviewstate/",
                                "rue"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/workspaceribbon/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/Workspace",
                                "api/namespaces/obsidian/classes/WorkspaceRibbon"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/workspacesidedock/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/Workspace",
                                "api/namespaces/obsidian/classes/WorkspaceSidedock",
                                "api/namespaces/obsidian/classes/WorkspaceSplit"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/recentfiletracker/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/Workspace"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/debouncer/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/Workspace",
                                "api/namespaces/obsidian/functions/debounce"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/workspaceroot/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/Workspace",
                                "api/namespaces/obsidian/classes/WorkspaceContainer",
                                "api/namespaces/obsidian/classes/WorkspaceRoot"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/workspacesplit/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/Workspace",
                                "api/namespaces/obsidian/classes/WorkspaceContainer",
                                "api/namespaces/obsidian/classes/WorkspaceParent",
                                "api/namespaces/obsidian/classes/WorkspaceSidedock",
                                "api/namespaces/obsidian/classes/WorkspaceSplit",
                                "api/namespaces/obsidian/classes/WorkspaceTabs"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/type-aliases/constructor/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/Workspace"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/fileexplorerleaf/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/Workspace",
                                "api/namespaces/obsidian/classes/WorkspaceLeaf"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/workspaceparent/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/Workspace",
                                "api/namespaces/obsidian/classes/WorkspaceContainer",
                                "api/namespaces/obsidian/classes/WorkspaceFloating",
                                "api/namespaces/obsidian/classes/WorkspaceItem",
                                "api/namespaces/obsidian/classes/WorkspaceMobileDrawer",
                                "api/namespaces/obsidian/classes/WorkspaceParent",
                                "api/namespaces/obsidian/classes/WorkspaceRoot",
                                "api/namespaces/obsidian/classes/WorkspaceSidedock",
                                "api/namespaces/obsidian/classes/WorkspaceSplit",
                                "api/namespaces/obsidian/classes/WorkspaceTabs",
                                "api/namespaces/obsidian/classes/WorkspaceWindow"
                            ],
                            "tags": []
                        },
                        "alse": {
                            "title": "alse",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/Workspace"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/workspacewindow/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/Workspace",
                                "api/namespaces/obsidian/classes/WorkspaceContainer",
                                "api/namespaces/obsidian/classes/WorkspaceWindow"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/workspacewindowinitdata/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/Workspace"
                            ],
                            "tags": []
                        },
                        "rue": {
                            "title": "rue",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/Workspace"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/WorkspaceContainer": {
                            "title": "WorkspaceContainer",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/workspacesplit/",
                                "api/namespaces/obsidian/classes/workspaceroot/",
                                "api/namespaces/obsidian/classes/workspacewindow/",
                                "api/namespaces/obsidian/classes/workspacecontainer/",
                                "api/namespaces/obsidian/classes/workspacesplit",
                                "api/namespaces/obsidian/classes/workspaceparent/",
                                "api/namespaces/obsidian/classes/workspaceroot",
                                "api/namespaces/obsidian/classes/workspacewindow",
                                "api/namespaces/obsidian/classes/workspaceitem/",
                                "api/namespaces/obsidian/interfaces/eventref/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/workspacesplit": {
                            "title": "workspacesplit",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/WorkspaceContainer",
                                "api/namespaces/obsidian/classes/WorkspaceSidedock"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/WorkspaceFloating": {
                            "title": "WorkspaceFloating",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/workspaceparent/",
                                "api/namespaces/obsidian/classes/workspacefloating/",
                                "api/namespaces/obsidian/classes/workspaceparent",
                                "api/namespaces/obsidian/classes/workspacecontainer/",
                                "api/namespaces/obsidian/classes/workspaceroot",
                                "api/namespaces/obsidian/classes/workspacewindow",
                                "api/namespaces/obsidian/classes/workspaceitem/",
                                "api/namespaces/obsidian/interfaces/eventref/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/workspacefloating/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/WorkspaceFloating",
                                "api/namespaces/obsidian/classes/WorkspaceParent"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/workspaceparent": {
                            "title": "workspaceparent",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/WorkspaceFloating",
                                "api/namespaces/obsidian/classes/WorkspaceMobileDrawer",
                                "api/namespaces/obsidian/classes/WorkspaceSplit",
                                "api/namespaces/obsidian/classes/WorkspaceTabs"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/WorkspaceItem": {
                            "title": "WorkspaceItem",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/events/",
                                "api/namespaces/obsidian/classes/workspaceleaf/",
                                "api/namespaces/obsidian/classes/workspaceparent/",
                                "api/namespaces/obsidian/classes/workspaceitem/",
                                "api/namespaces/obsidian/classes/events",
                                "api/namespaces/obsidian/classes/workspacecontainer/",
                                "api/namespaces/obsidian/classes/workspaceroot",
                                "api/namespaces/obsidian/classes/workspacewindow",
                                "api/namespaces/obsidian/interfaces/eventref/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/WorkspaceLeaf": {
                            "title": "WorkspaceLeaf",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/workspaceitem/",
                                "api/namespaces/internals/interfaces/canvasleaf/",
                                "api/namespaces/internals/interfaces/fileexplorerleaf/",
                                "api/namespaces/internals/interfaces/globalsearchleaf/",
                                "api/namespaces/obsidian/classes/workspaceleaf/",
                                "api/namespaces/obsidian/classes/workspaceitem",
                                "api/namespaces/obsidian/classes/workspacemobiledrawer/",
                                "api/namespaces/obsidian/classes/workspacetabs/",
                                "api/namespaces/obsidian/classes/view/",
                                "api/namespaces/obsidian/classes/workspacecontainer/",
                                "api/namespaces/obsidian/classes/workspaceroot",
                                "api/namespaces/obsidian/classes/workspacewindow",
                                "api/namespaces/obsidian/interfaces/viewstate/",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/classes/tfile/",
                                "api/namespaces/obsidian/interfaces/openviewstate/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/canvasleaf/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/WorkspaceLeaf"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/interfaces/globalsearchleaf/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/WorkspaceLeaf"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/workspaceitem": {
                            "title": "workspaceitem",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/WorkspaceLeaf",
                                "api/namespaces/obsidian/classes/WorkspaceParent"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/WorkspaceMobileDrawer": {
                            "title": "WorkspaceMobileDrawer",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/workspaceparent/",
                                "api/namespaces/obsidian/classes/workspacemobiledrawer/",
                                "api/namespaces/obsidian/classes/workspaceparent",
                                "api/namespaces/obsidian/classes/workspacecontainer/",
                                "api/namespaces/obsidian/classes/workspaceroot",
                                "api/namespaces/obsidian/classes/workspacewindow",
                                "api/namespaces/obsidian/classes/workspaceitem/",
                                "api/namespaces/obsidian/interfaces/eventref/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/WorkspaceParent": {
                            "title": "WorkspaceParent",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/workspaceitem/",
                                "api/namespaces/obsidian/classes/workspacefloating/",
                                "api/namespaces/obsidian/classes/workspacemobiledrawer/",
                                "api/namespaces/obsidian/classes/workspacesplit/",
                                "api/namespaces/obsidian/classes/workspacetabs/",
                                "api/namespaces/obsidian/classes/workspaceparent/",
                                "api/namespaces/obsidian/classes/workspaceitem",
                                "api/namespaces/obsidian/classes/workspacecontainer/",
                                "api/namespaces/obsidian/classes/workspaceroot",
                                "api/namespaces/obsidian/classes/workspacewindow",
                                "api/namespaces/obsidian/interfaces/eventref/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/WorkspaceRibbon": {
                            "title": "WorkspaceRibbon",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/workspaceribbon/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/WorkspaceRoot": {
                            "title": "WorkspaceRoot",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/workspacecontainer/",
                                "api/namespaces/obsidian/classes/workspaceroot/",
                                "api/namespaces/obsidian/classes/workspacecontainer",
                                "api/namespaces/obsidian/classes/workspaceparent/",
                                "api/namespaces/obsidian/classes/workspaceroot",
                                "api/namespaces/obsidian/classes/workspacewindow",
                                "api/namespaces/obsidian/classes/workspaceitem/",
                                "api/namespaces/obsidian/interfaces/eventref/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/workspacecontainer": {
                            "title": "workspacecontainer",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/classes/WorkspaceRoot",
                                "api/namespaces/obsidian/classes/WorkspaceWindow"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/WorkspaceSidedock": {
                            "title": "WorkspaceSidedock",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/workspacesplit/",
                                "api/namespaces/obsidian/classes/workspacesidedock/",
                                "api/namespaces/obsidian/classes/workspacesplit",
                                "api/namespaces/obsidian/classes/workspaceparent/",
                                "api/namespaces/obsidian/classes/workspacecontainer/",
                                "api/namespaces/obsidian/classes/workspaceroot",
                                "api/namespaces/obsidian/classes/workspacewindow",
                                "api/namespaces/obsidian/classes/workspaceitem/",
                                "api/namespaces/obsidian/interfaces/eventref/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/WorkspaceSplit": {
                            "title": "WorkspaceSplit",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/workspaceparent/",
                                "api/namespaces/obsidian/classes/workspacecontainer/",
                                "api/namespaces/obsidian/classes/workspacesidedock/",
                                "api/namespaces/obsidian/classes/workspacesplit/",
                                "api/namespaces/obsidian/classes/workspaceparent",
                                "api/namespaces/obsidian/classes/workspaceroot",
                                "api/namespaces/obsidian/classes/workspacewindow",
                                "api/namespaces/obsidian/classes/workspaceitem/",
                                "api/namespaces/obsidian/interfaces/eventref/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/WorkspaceTabs": {
                            "title": "WorkspaceTabs",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/workspaceparent/",
                                "api/namespaces/obsidian/classes/workspacetabs/",
                                "api/namespaces/obsidian/classes/workspaceparent",
                                "api/namespaces/obsidian/classes/workspacesplit/",
                                "api/namespaces/obsidian/classes/workspacecontainer/",
                                "api/namespaces/obsidian/classes/workspaceroot",
                                "api/namespaces/obsidian/classes/workspacewindow",
                                "api/namespaces/obsidian/classes/workspaceitem/",
                                "api/namespaces/obsidian/interfaces/eventref/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/classes/WorkspaceWindow": {
                            "title": "WorkspaceWindow",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/workspacecontainer/",
                                "api/namespaces/obsidian/classes/workspacewindow/",
                                "api/namespaces/obsidian/classes/workspacecontainer",
                                "api/namespaces/obsidian/classes/workspaceparent/",
                                "api/namespaces/obsidian/classes/workspaceroot",
                                "api/namespaces/obsidian/classes/workspacewindow",
                                "api/namespaces/obsidian/classes/workspaceitem/",
                                "api/namespaces/obsidian/interfaces/eventref/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/enumerations/PopoverState": {
                            "title": "PopoverState",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/functions/addIcon": {
                            "title": "addIcon",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/functions/arrayBufferToBase64": {
                            "title": "arrayBufferToBase64",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/functions/arrayBufferToHex": {
                            "title": "arrayBufferToHex",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/functions/base64ToArrayBuffer": {
                            "title": "base64ToArrayBuffer",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/functions/debounce": {
                            "title": "debounce",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/debouncer/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/functions/finishRenderMath": {
                            "title": "finishRenderMath",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/functions/fuzzySearch": {
                            "title": "fuzzySearch",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/searchresult/",
                                "api/namespaces/obsidian/interfaces/preparedquery/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/preparedquery/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/functions/fuzzySearch",
                                "api/namespaces/obsidian/functions/prepareQuery"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/functions/getAllTags": {
                            "title": "getAllTags",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/cachedmetadata/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/functions/getBlobArrayBuffer": {
                            "title": "getBlobArrayBuffer",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/functions/getFrontMatterInfo": {
                            "title": "getFrontMatterInfo",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/frontmatterinfo/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/frontmatterinfo/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/functions/getFrontMatterInfo"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/functions/getIcon": {
                            "title": "getIcon",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/functions/getIconIds": {
                            "title": "getIconIds",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/type-aliases/iconname/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/type-aliases/iconname/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/functions/getIconIds"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/functions/getLinkpath": {
                            "title": "getLinkpath",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/functions/hexToArrayBuffer": {
                            "title": "hexToArrayBuffer",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/functions/htmlToMarkdown": {
                            "title": "htmlToMarkdown",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/functions/iterateCacheRefs": {
                            "title": "iterateCacheRefs",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/cachedmetadata/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/functions/iterateRefs": {
                            "title": "iterateRefs",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/reference/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/functions/loadMathJax": {
                            "title": "loadMathJax",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/functions/loadMermaid": {
                            "title": "loadMermaid",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/functions/loadPdfJs": {
                            "title": "loadPdfJs",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/functions/loadPrism": {
                            "title": "loadPrism",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/functions/normalizePath": {
                            "title": "normalizePath",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/functions/parseFrontMatterAliases": {
                            "title": "parseFrontMatterAliases",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/functions/parseFrontMatterEntry": {
                            "title": "parseFrontMatterEntry",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/functions/parseFrontMatterStringArray": {
                            "title": "parseFrontMatterStringArray",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/functions/parseFrontMatterTags": {
                            "title": "parseFrontMatterTags",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/functions/parseLinktext": {
                            "title": "parseLinktext",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/functions/parseYaml": {
                            "title": "parseYaml",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/functions/prepareFuzzySearch": {
                            "title": "prepareFuzzySearch",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/searchresult/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/functions/prepareQuery": {
                            "title": "prepareQuery",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/preparedquery/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/functions/prepareSimpleSearch": {
                            "title": "prepareSimpleSearch",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/searchresult/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/functions/removeIcon": {
                            "title": "removeIcon",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/functions/renderMatches": {
                            "title": "renderMatches",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/type-aliases/searchmatches/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/type-aliases/searchmatches/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/functions/renderMatches",
                                "api/namespaces/obsidian/interfaces/SearchResult"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/functions/renderMath": {
                            "title": "renderMath",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/functions/renderResults": {
                            "title": "renderResults",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/searchresult/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/functions/request": {
                            "title": "request",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/requesturlparam/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/requesturlparam/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/functions/request",
                                "api/namespaces/obsidian/functions/requestUrl"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/functions/requestUrl": {
                            "title": "requestUrl",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/requesturlresponsepromise/",
                                "api/namespaces/obsidian/interfaces/requesturlparam/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/requesturlresponsepromise/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/functions/requestUrl"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/functions/requireApiVersion": {
                            "title": "requireApiVersion",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/functions/resolveSubpath": {
                            "title": "resolveSubpath",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/headingsubpathresult/",
                                "api/namespaces/obsidian/interfaces/blocksubpathresult/",
                                "api/namespaces/obsidian/interfaces/cachedmetadata/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/headingsubpathresult/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/functions/resolveSubpath",
                                "api/namespaces/obsidian/interfaces/SubpathResult"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/blocksubpathresult/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/functions/resolveSubpath",
                                "api/namespaces/obsidian/interfaces/SubpathResult"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/functions/sanitizeHTMLToDom": {
                            "title": "sanitizeHTMLToDom",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/functions/setIcon": {
                            "title": "setIcon",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/functions/setTooltip": {
                            "title": "setTooltip",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/tooltipoptions/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/functions/sortSearchResults": {
                            "title": "sortSearchResults",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/searchresultcontainer/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/searchresultcontainer/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/functions/sortSearchResults"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/functions/stringifyYaml": {
                            "title": "stringifyYaml",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/functions/stripHeading": {
                            "title": "stripHeading",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/functions/stripHeadingForLink": {
                            "title": "stripHeadingForLink",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/BlockCache": {
                            "title": "BlockCache",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/cacheitem/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/interfaces/pos/",
                                "api/namespaces/obsidian/interfaces/cacheitem"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/cacheitem/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/interfaces/BlockCache",
                                "api/namespaces/obsidian/interfaces/FootnoteCache",
                                "api/namespaces/obsidian/interfaces/HeadingCache",
                                "api/namespaces/obsidian/interfaces/ListItemCache",
                                "api/namespaces/obsidian/interfaces/ReferenceCache",
                                "api/namespaces/obsidian/interfaces/SectionCache",
                                "api/namespaces/obsidian/interfaces/TagCache"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/pos/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/interfaces/BlockCache",
                                "api/namespaces/obsidian/interfaces/CachedMetadata",
                                "api/namespaces/obsidian/interfaces/CacheItem",
                                "api/namespaces/obsidian/interfaces/EmbedCache",
                                "api/namespaces/obsidian/interfaces/FootnoteCache",
                                "api/namespaces/obsidian/interfaces/HeadingCache",
                                "api/namespaces/obsidian/interfaces/LinkCache",
                                "api/namespaces/obsidian/interfaces/ListItemCache",
                                "api/namespaces/obsidian/interfaces/ReferenceCache",
                                "api/namespaces/obsidian/interfaces/SectionCache",
                                "api/namespaces/obsidian/interfaces/TagCache"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/cacheitem": {
                            "title": "cacheitem",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/interfaces/BlockCache",
                                "api/namespaces/obsidian/interfaces/FootnoteCache",
                                "api/namespaces/obsidian/interfaces/HeadingCache",
                                "api/namespaces/obsidian/interfaces/ListItemCache",
                                "api/namespaces/obsidian/interfaces/ReferenceCache",
                                "api/namespaces/obsidian/interfaces/SectionCache",
                                "api/namespaces/obsidian/interfaces/TagCache"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/BlockSubpathResult": {
                            "title": "BlockSubpathResult",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/subpathresult/",
                                "api/namespaces/obsidian/interfaces/blockcache/",
                                "api/namespaces/obsidian/interfaces/loc/",
                                "api/namespaces/obsidian/interfaces/subpathresult",
                                "api/namespaces/obsidian/interfaces/listitemcache/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/subpathresult/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/interfaces/BlockSubpathResult",
                                "api/namespaces/obsidian/interfaces/HeadingSubpathResult"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/subpathresult": {
                            "title": "subpathresult",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/interfaces/BlockSubpathResult",
                                "api/namespaces/obsidian/interfaces/HeadingSubpathResult"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/listitemcache/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/interfaces/BlockSubpathResult",
                                "api/namespaces/obsidian/interfaces/CachedMetadata",
                                "api/namespaces/obsidian/interfaces/CacheItem"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/CachedMetadata": {
                            "title": "CachedMetadata",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/blockcache/",
                                "api/namespaces/obsidian/interfaces/embedcache/",
                                "api/namespaces/obsidian/interfaces/footnotecache/",
                                "api/namespaces/obsidian/interfaces/frontmattercache/",
                                "api/namespaces/obsidian/interfaces/frontmatterlinkcache/",
                                "api/namespaces/obsidian/interfaces/pos/",
                                "api/namespaces/obsidian/interfaces/headingcache/",
                                "api/namespaces/obsidian/interfaces/linkcache/",
                                "api/namespaces/obsidian/interfaces/listitemcache/",
                                "api/namespaces/obsidian/interfaces/sectioncache/",
                                "api/namespaces/obsidian/interfaces/tagcache/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/embedcache/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/interfaces/CachedMetadata",
                                "api/namespaces/obsidian/interfaces/ReferenceCache"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/footnotecache/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/interfaces/CachedMetadata",
                                "api/namespaces/obsidian/interfaces/CacheItem"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/frontmattercache/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/interfaces/CachedMetadata"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/frontmatterlinkcache/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/interfaces/CachedMetadata",
                                "api/namespaces/obsidian/interfaces/Reference"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/headingcache/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/interfaces/CachedMetadata",
                                "api/namespaces/obsidian/interfaces/CacheItem",
                                "api/namespaces/obsidian/interfaces/HeadingSubpathResult"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/sectioncache/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/interfaces/CachedMetadata",
                                "api/namespaces/obsidian/interfaces/CacheItem"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/tagcache/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/interfaces/CachedMetadata",
                                "api/namespaces/obsidian/interfaces/CacheItem"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/CacheItem": {
                            "title": "CacheItem",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/blockcache/",
                                "api/namespaces/obsidian/interfaces/footnotecache/",
                                "api/namespaces/obsidian/interfaces/headingcache/",
                                "api/namespaces/obsidian/interfaces/listitemcache/",
                                "api/namespaces/obsidian/interfaces/referencecache/",
                                "api/namespaces/obsidian/interfaces/sectioncache/",
                                "api/namespaces/obsidian/interfaces/tagcache/",
                                "api/namespaces/obsidian/interfaces/pos/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/CloseableComponent": {
                            "title": "CloseableComponent",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/menu/",
                                "api/namespaces/obsidian/classes/modal/",
                                "api/namespaces/obsidian/classes/popoversuggest/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/Command": {
                            "title": "Command",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/editor/",
                                "api/namespaces/obsidian/classes/markdownview/",
                                "api/namespaces/obsidian/interfaces/markdownfileinfo/",
                                "api/namespaces/obsidian/interfaces/hotkey/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/hotkey/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/interfaces/Command"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/DataAdapter": {
                            "title": "DataAdapter",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/vault",
                                "api/namespaces/obsidian/classes/filesystemadapter/",
                                "api/namespaces/internals/interfaces/dataadapterfilesrecord/",
                                "api/namespaces/obsidian/functions/normalizepath",
                                "api/namespaces/obsidian/interfaces/datawriteoptions/",
                                "api/namespaces/obsidian/interfaces/listedfiles/",
                                "api/namespaces/obsidian/interfaces/stat/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/functions/normalizepath": {
                            "title": "normalizepath",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/interfaces/DataAdapter"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/DataWriteOptions": {
                            "title": "DataWriteOptions",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/Debouncer": {
                            "title": "Debouncer",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/EditorChange": {
                            "title": "EditorChange",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/editorrangeorcaret/",
                                "api/namespaces/obsidian/interfaces/editorposition/",
                                "api/namespaces/obsidian/interfaces/editorrangeorcaret"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/editorrangeorcaret/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/interfaces/EditorChange",
                                "api/namespaces/obsidian/interfaces/EditorTransaction"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/editorrangeorcaret": {
                            "title": "editorrangeorcaret",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/interfaces/EditorChange"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/EditorPosition": {
                            "title": "EditorPosition",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/EditorRange": {
                            "title": "EditorRange",
                            "content": "",
                            "links": [
                                "api/namespaces/internals/interfaces/token/",
                                "api/namespaces/obsidian/interfaces/editorposition/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/EditorRangeOrCaret": {
                            "title": "EditorRangeOrCaret",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/editorchange/",
                                "api/namespaces/obsidian/interfaces/editorposition/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/editorchange/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/interfaces/EditorRangeOrCaret",
                                "api/namespaces/obsidian/interfaces/EditorTransaction"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/EditorScrollInfo": {
                            "title": "EditorScrollInfo",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/EditorSelection": {
                            "title": "EditorSelection",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/editorposition/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/EditorSelectionOrCaret": {
                            "title": "EditorSelectionOrCaret",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/editorposition/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/EditorSuggestContext": {
                            "title": "EditorSuggestContext",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/editorsuggesttriggerinfo/",
                                "api/namespaces/obsidian/classes/editor/",
                                "api/namespaces/obsidian/interfaces/editorposition/",
                                "api/namespaces/obsidian/interfaces/editorsuggesttriggerinfo",
                                "api/namespaces/obsidian/classes/tfile/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/editorsuggesttriggerinfo": {
                            "title": "editorsuggesttriggerinfo",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/interfaces/EditorSuggestContext"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/EditorSuggestTriggerInfo": {
                            "title": "EditorSuggestTriggerInfo",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/editorsuggestcontext/",
                                "api/namespaces/obsidian/interfaces/editorposition/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/EditorTransaction": {
                            "title": "EditorTransaction",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/editorchange/",
                                "api/namespaces/obsidian/interfaces/editorrangeorcaret/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/EmbedCache": {
                            "title": "EmbedCache",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/referencecache/",
                                "api/namespaces/obsidian/interfaces/referencecache",
                                "api/namespaces/obsidian/interfaces/pos/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/referencecache": {
                            "title": "referencecache",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/interfaces/EmbedCache",
                                "api/namespaces/obsidian/interfaces/LinkCache"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/EventRef": {
                            "title": "EventRef",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/events/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/FileStats": {
                            "title": "FileStats",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/FootnoteCache": {
                            "title": "FootnoteCache",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/cacheitem/",
                                "api/namespaces/obsidian/interfaces/pos/",
                                "api/namespaces/obsidian/interfaces/cacheitem"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/FrontMatterCache": {
                            "title": "FrontMatterCache",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/FrontMatterInfo": {
                            "title": "FrontMatterInfo",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/FrontmatterLinkCache": {
                            "title": "FrontmatterLinkCache",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/reference/",
                                "api/namespaces/obsidian/interfaces/reference"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/FuzzyMatch": {
                            "title": "FuzzyMatch",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/searchresult/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/HeadingCache": {
                            "title": "HeadingCache",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/cacheitem/",
                                "api/namespaces/obsidian/interfaces/pos/",
                                "api/namespaces/obsidian/interfaces/cacheitem"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/HeadingSubpathResult": {
                            "title": "HeadingSubpathResult",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/subpathresult/",
                                "api/namespaces/obsidian/interfaces/headingcache/",
                                "api/namespaces/obsidian/interfaces/loc/",
                                "api/namespaces/obsidian/interfaces/subpathresult"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/Hotkey": {
                            "title": "Hotkey",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/type-aliases/modifier/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/HoverLinkSource": {
                            "title": "HoverLinkSource",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/HoverParent": {
                            "title": "HoverParent",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/markdowneditview/",
                                "api/namespaces/obsidian/interfaces/markdownfileinfo/",
                                "api/namespaces/obsidian/classes/markdownrenderer/",
                                "api/namespaces/obsidian/classes/hoverpopover/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/HSL": {
                            "title": "HSL",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/Instruction": {
                            "title": "Instruction",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/ISuggestOwner": {
                            "title": "ISuggestOwner",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/popoversuggest/",
                                "api/namespaces/obsidian/classes/suggestmodal/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/KeymapContext": {
                            "title": "KeymapContext",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/keymapinfo/",
                                "api/namespaces/obsidian/interfaces/keymapinfo"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/keymapinfo": {
                            "title": "keymapinfo",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/interfaces/KeymapContext",
                                "api/namespaces/obsidian/interfaces/KeymapEventHandler"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/KeymapEventHandler": {
                            "title": "KeymapEventHandler",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/keymapinfo/",
                                "api/namespaces/obsidian/interfaces/keymapinfo",
                                "api/namespaces/obsidian/classes/scope/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/KeymapInfo": {
                            "title": "KeymapInfo",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/keymapcontext/",
                                "api/namespaces/obsidian/interfaces/keymapeventhandler/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/keymapcontext/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/interfaces/KeymapInfo",
                                "api/namespaces/obsidian/type-aliases/KeymapEventListener"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/LinkCache": {
                            "title": "LinkCache",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/referencecache/",
                                "api/namespaces/obsidian/interfaces/referencecache",
                                "api/namespaces/obsidian/interfaces/pos/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/ListedFiles": {
                            "title": "ListedFiles",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/ListItemCache": {
                            "title": "ListItemCache",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/cacheitem/",
                                "api/namespaces/obsidian/interfaces/pos/",
                                "api/namespaces/obsidian/interfaces/cacheitem"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/livePreviewState-1": {
                            "title": "livePreviewState",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/LivePreviewState": {
                            "title": "LivePreviewState",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/Loc": {
                            "title": "Loc",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/MarkdownFileInfo": {
                            "title": "MarkdownFileInfo",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/hoverparent/",
                                "api/namespaces/obsidian/classes/markdowneditview/",
                                "api/namespaces/obsidian/classes/app/",
                                "api/namespaces/obsidian/classes/editor/",
                                "api/namespaces/obsidian/classes/hoverpopover/",
                                "api/namespaces/obsidian/interfaces/hoverparent",
                                "api/namespaces/obsidian/classes/tfile/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/MarkdownPostProcessor": {
                            "title": "MarkdownPostProcessor",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/markdownpostprocessorcontext",
                                "api/namespaces/obsidian/interfaces/markdownpostprocessorcontext/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/markdownpostprocessorcontext": {
                            "title": "markdownpostprocessorcontext",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/interfaces/MarkdownPostProcessor"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/MarkdownPostProcessorContext": {
                            "title": "MarkdownPostProcessorContext",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/markdownrenderchild/",
                                "api/namespaces/obsidian/interfaces/markdownsectioninformation/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/markdownsectioninformation/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/interfaces/MarkdownPostProcessorContext"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/MarkdownPreviewEvents": {
                            "title": "MarkdownPreviewEvents",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/component/",
                                "api/namespaces/obsidian/classes/markdownpreviewview/",
                                "api/namespaces/obsidian/classes/markdownrenderer/",
                                "api/namespaces/obsidian/classes/component",
                                "api/namespaces/obsidian/interfaces/eventref/",
                                "api/namespaces/obsidian/interfaces/keymapeventhandler/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/MarkdownSectionInformation": {
                            "title": "MarkdownSectionInformation",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/MarkdownSubView": {
                            "title": "MarkdownSubView",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/markdowneditview/",
                                "api/namespaces/obsidian/classes/markdownpreviewview/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/MenuPositionDef": {
                            "title": "MenuPositionDef",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/ObsidianProtocolData": {
                            "title": "ObsidianProtocolData",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/OpenViewState": {
                            "title": "OpenViewState",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/workspaceleaf/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/Platform": {
                            "title": "Platform",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/PluginManifest": {
                            "title": "PluginManifest",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/Point": {
                            "title": "Point",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/Pos": {
                            "title": "Pos",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/loc/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/PreparedQuery": {
                            "title": "PreparedQuery",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/Reference": {
                            "title": "Reference",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/frontmatterlinkcache/",
                                "api/namespaces/obsidian/interfaces/referencecache/",
                                "api/namespaces/internals/interfaces/positionedreference/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/ReferenceCache": {
                            "title": "ReferenceCache",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/reference/",
                                "api/namespaces/obsidian/interfaces/cacheitem/",
                                "api/namespaces/obsidian/interfaces/embedcache/",
                                "api/namespaces/obsidian/interfaces/linkcache/",
                                "api/namespaces/obsidian/interfaces/reference",
                                "api/namespaces/obsidian/interfaces/pos/",
                                "api/namespaces/obsidian/interfaces/cacheitem"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/RequestUrlParam": {
                            "title": "RequestUrlParam",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/RequestUrlResponse": {
                            "title": "RequestUrlResponse",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/RequestUrlResponsePromise": {
                            "title": "RequestUrlResponsePromise",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/requesturlresponse/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/requesturlresponse/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/interfaces/RequestUrlResponsePromise"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/RGB": {
                            "title": "RGB",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/SearchResult": {
                            "title": "SearchResult",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/type-aliases/searchmatches/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/SearchResultContainer": {
                            "title": "SearchResultContainer",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/searchresult/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/SectionCache": {
                            "title": "SectionCache",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/cacheitem/",
                                "api/namespaces/obsidian/interfaces/pos/",
                                "api/namespaces/obsidian/interfaces/cacheitem"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/Stat": {
                            "title": "Stat",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/SubpathResult": {
                            "title": "SubpathResult",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/blocksubpathresult/",
                                "api/namespaces/obsidian/interfaces/headingsubpathresult/",
                                "api/namespaces/obsidian/interfaces/loc/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/TagCache": {
                            "title": "TagCache",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/cacheitem/",
                                "api/namespaces/obsidian/interfaces/pos/",
                                "api/namespaces/obsidian/interfaces/cacheitem"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/TooltipOptions": {
                            "title": "TooltipOptions",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/type-aliases/tooltipplacement/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/type-aliases/tooltipplacement/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/interfaces/TooltipOptions"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/ViewState": {
                            "title": "ViewState",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/workspaceleaf/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/ViewStateResult": {
                            "title": "ViewStateResult",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/WorkspaceWindowInitData": {
                            "title": "WorkspaceWindowInitData",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/type-aliases/Constructor": {
                            "title": "Constructor",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/type-aliases/EditorCommandName": {
                            "title": "EditorCommandName",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/type-aliases/HexString": {
                            "title": "HexString",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/type-aliases/IconName": {
                            "title": "IconName",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/type-aliases/KeymapEventListener": {
                            "title": "KeymapEventListener",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/keymapcontext/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/type-aliases/MarkdownViewModeType": {
                            "title": "MarkdownViewModeType",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/type-aliases/Modifier": {
                            "title": "Modifier",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/type-aliases/ObsidianProtocolHandler": {
                            "title": "ObsidianProtocolHandler",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/obsidianprotocoldata/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/obsidianprotocoldata/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/type-aliases/ObsidianProtocolHandler"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/type-aliases/PaneType": {
                            "title": "PaneType",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/type-aliases/SearchMatches": {
                            "title": "SearchMatches",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/type-aliases/searchmatchpart/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/type-aliases/searchmatchpart/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/type-aliases/SearchMatches"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/type-aliases/SearchMatchPart": {
                            "title": "SearchMatchPart",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/type-aliases/SplitDirection": {
                            "title": "SplitDirection",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/type-aliases/TooltipPlacement": {
                            "title": "TooltipPlacement",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/type-aliases/UserEvent": {
                            "title": "UserEvent",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/type-aliases/ViewCreator": {
                            "title": "ViewCreator",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/classes/view/",
                                "api/namespaces/obsidian/classes/workspaceleaf/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/variables/apiVersion": {
                            "title": "apiVersion",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/variables/editorEditorField": {
                            "title": "editorEditorField",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/variables/editorInfoField": {
                            "title": "editorInfoField",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/markdownfileinfo/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/variables/editorLivePreviewField": {
                            "title": "editorLivePreviewField",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/variables/editorViewField": {
                            "title": "editorViewField",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/markdownfileinfo/",
                                "api/namespaces/obsidian/variables/editorinfofield/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/variables/editorinfofield/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/variables/editorViewField"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/variables/livePreviewState": {
                            "title": "livePreviewState",
                            "content": "",
                            "links": [
                                "api/namespaces/obsidian/interfaces/livepreviewstate/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/interfaces/livepreviewstate/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/obsidian/variables/livePreviewState"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/variables/moment": {
                            "title": "moment",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/obsidian/variables/Platform": {
                            "title": "Platform",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/publish/classes/Component": {
                            "title": "Component",
                            "content": "",
                            "links": [
                                "api/namespaces/publish/classes/markdownrenderchild/",
                                "api/namespaces/publish/classes/component/",
                                "api/namespaces/publish/interfaces/eventref/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/publish/classes/markdownrenderchild/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/publish/classes/Component",
                                "api/namespaces/publish/classes/MarkdownRenderChild",
                                "api/namespaces/publish/interfaces/MarkdownPostProcessorContext"
                            ],
                            "tags": []
                        },
                        "api/namespaces/publish/classes/component/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/publish/classes/Component",
                                "api/namespaces/publish/classes/MarkdownRenderChild"
                            ],
                            "tags": []
                        },
                        "api/namespaces/publish/interfaces/eventref/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/publish/classes/Component",
                                "api/namespaces/publish/classes/Events",
                                "api/namespaces/publish/classes/MarkdownRenderChild",
                                "api/namespaces/publish/classes/Publish"
                            ],
                            "tags": []
                        },
                        "api/namespaces/publish/classes/Events": {
                            "title": "Events",
                            "content": "",
                            "links": [
                                "api/namespaces/publish/classes/publish/",
                                "api/namespaces/publish/classes/events/",
                                "api/namespaces/publish/interfaces/eventref/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/publish/classes/publish/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/publish/classes/Events",
                                "api/namespaces/publish/classes/Publish"
                            ],
                            "tags": []
                        },
                        "api/namespaces/publish/classes/events/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/publish/classes/Events",
                                "api/namespaces/publish/classes/Publish"
                            ],
                            "tags": []
                        },
                        "api/namespaces/publish/classes/MarkdownPreviewRenderer": {
                            "title": "MarkdownPreviewRenderer",
                            "content": "",
                            "links": [
                                "api/namespaces/publish/classes/markdownpreviewrenderer/",
                                "api/namespaces/publish/interfaces/markdownpostprocessorcontext/",
                                "api/namespaces/publish/interfaces/markdownpostprocessor/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/publish/classes/markdownpreviewrenderer/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/publish/classes/MarkdownPreviewRenderer"
                            ],
                            "tags": []
                        },
                        "api/namespaces/publish/interfaces/markdownpostprocessorcontext/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/publish/classes/MarkdownPreviewRenderer",
                                "api/namespaces/publish/interfaces/MarkdownPostProcessor"
                            ],
                            "tags": []
                        },
                        "api/namespaces/publish/interfaces/markdownpostprocessor/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/publish/classes/MarkdownPreviewRenderer",
                                "api/namespaces/publish/classes/Publish"
                            ],
                            "tags": []
                        },
                        "api/namespaces/publish/classes/MarkdownRenderChild": {
                            "title": "MarkdownRenderChild",
                            "content": "",
                            "links": [
                                "api/namespaces/publish/classes/component/",
                                "api/namespaces/publish/classes/markdownrenderchild/",
                                "api/namespaces/publish/classes/component",
                                "api/namespaces/publish/interfaces/eventref/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/publish/classes/component": {
                            "title": "component",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/publish/classes/MarkdownRenderChild"
                            ],
                            "tags": []
                        },
                        "api/namespaces/publish/classes/Publish": {
                            "title": "Publish",
                            "content": "",
                            "links": [
                                "api/namespaces/publish/classes/events/",
                                "api/namespaces/publish/classes/publish/",
                                "api/namespaces/publish/classes/events",
                                "api/namespaces/publish/interfaces/eventref/",
                                "api/namespaces/publish/interfaces/markdownpostprocessor/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/publish/classes/events": {
                            "title": "events",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/publish/classes/Publish"
                            ],
                            "tags": []
                        },
                        "api/namespaces/publish/interfaces/EventRef": {
                            "title": "EventRef",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/publish/interfaces/MarkdownPostProcessor": {
                            "title": "MarkdownPostProcessor",
                            "content": "",
                            "links": [
                                "api/namespaces/publish/interfaces/markdownpostprocessorcontext",
                                "api/namespaces/publish/interfaces/markdownpostprocessorcontext/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/publish/interfaces/markdownpostprocessorcontext": {
                            "title": "markdownpostprocessorcontext",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/publish/interfaces/MarkdownPostProcessor"
                            ],
                            "tags": []
                        },
                        "api/namespaces/publish/interfaces/MarkdownPostProcessorContext": {
                            "title": "MarkdownPostProcessorContext",
                            "content": "",
                            "links": [
                                "api/namespaces/publish/classes/markdownrenderchild/",
                                "api/namespaces/publish/interfaces/markdownsectioninformation/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/publish/interfaces/markdownsectioninformation/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/namespaces/publish/interfaces/MarkdownPostProcessorContext"
                            ],
                            "tags": []
                        },
                        "api/namespaces/publish/interfaces/MarkdownSectionInformation": {
                            "title": "MarkdownSectionInformation",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/README": {
                            "title": "obsidian-typings",
                            "content": "",
                            "links": [
                                "api/namespaces/codemirror__view/readme/",
                                "api/namespaces/augmentations/readme/",
                                "api/namespaces/canvas/readme/",
                                "api/namespaces/global/readme/",
                                "api/namespaces/internals/readme/",
                                "api/namespaces/obsidian/readme/",
                                "api/namespaces/publish/readme/"
                            ],
                            "backlinks": [],
                            "tags": []
                        },
                        "api/namespaces/codemirror__view/readme/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/README"
                            ],
                            "tags": []
                        },
                        "api/namespaces/augmentations/readme/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/README"
                            ],
                            "tags": []
                        },
                        "api/namespaces/canvas/readme/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/README"
                            ],
                            "tags": []
                        },
                        "api/namespaces/global/readme/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/README"
                            ],
                            "tags": []
                        },
                        "api/namespaces/internals/readme/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/README"
                            ],
                            "tags": []
                        },
                        "api/namespaces/obsidian/readme/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/README"
                            ],
                            "tags": []
                        },
                        "api/namespaces/publish/readme/": {
                            "title": "",
                            "content": "",
                            "links": [],
                            "backlinks": [
                                "api/README"
                            ],
                            "tags": []
                        },
                        "guides/start": {
                            "title": "Quick start",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "index": {
                            "title": "Welcome to Starlight",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        },
                        "reference/intro": {
                            "title": "Intro",
                            "content": "",
                            "links": [],
                            "backlinks": [],
                            "tags": []
                        }
                    }
                })
            ],
        }),
    ],
    vite: {
        server: {
            fs: {
                strict: false
            }
        }
    }
});
