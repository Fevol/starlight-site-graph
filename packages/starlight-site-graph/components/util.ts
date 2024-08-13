import config from "virtual:starlight-site-graph/config";

export function getVisitedEndpoints(): Set<string> {
    return new Set(JSON.parse((config.storageLocation === "session" ? sessionStorage : localStorage).getItem(config.storageKey + "visited") ?? "[]"))
}

export function addToVisitedEndpoints(slug: string) {
    const visited = getVisitedEndpoints();
    visited.add(slug);
    (config.storageLocation === "session" ? sessionStorage : localStorage).setItem(config.storageKey + "visited", JSON.stringify([...visited]))
}

export function simplifySlug(fp: string): string {
    const res = stripSlashes(trimSuffix(fp, "index"), true)
    return (res.length === 0 ? "/" : res)
}

export function endsWith(s: string, suffix: string): boolean {
    return s === suffix || s.endsWith("/" + suffix)
}

export function trimSuffix(s: string, suffix: string): string {
    if (endsWith(s, suffix))
        s = s.slice(0, -suffix.length)
    return s
}

export function stripSlashes(s: string, onlyStripPrefix?: boolean): string {
    if (s.startsWith("/"))
        s = s.substring(1)
    if (!onlyStripPrefix && s.endsWith("/"))
        s = s.slice(0, -1)
    return s
}

export function onClickOutside(target: HTMLElement, callback: () => void) {
    function handleClickOutside(event: MouseEvent) {
        if (!target.contains(event.target as HTMLElement)) {
            callback();
        }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
}

export function getRelativePath(current: string, next: string) {
    const currentSegments = current.split("/")
    const nextSegments = next.split("/")
    const common = currentSegments.reduce((acc, cur, i) => (cur === nextSegments[i] ? i : acc), 0)
    const back = currentSegments.length - common
    let forward = nextSegments.slice(common).join("/")
    if (!forward.endsWith("/"))
        forward += "/"
    return `${"../".repeat(back)}${forward}`
}
