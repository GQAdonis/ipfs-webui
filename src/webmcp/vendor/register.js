/**
 * The page-level object, or undefined when the browser has no WebMCP. Only
 * `document.modelContext` is read: Codex has no `navigator.modelContext` and Kimi marks
 * it deprecated.
 */
export function getModelContext(doc = typeof document === 'undefined' ? undefined : document) {
    const mc = doc?.modelContext;
    return mc && typeof mc.registerTool === 'function' ? mc : undefined;
}
/**
 * Register tools through `registerTool(tool, { signal })`. One failing tool does not stop
 * the rest. Returns what was registered so the page can show the real state.
 */
export async function registerWebMcpTools(modelContext, tools) {
    const controller = new AbortController();
    const registered = [];
    const failed = [];
    for (const tool of tools) {
        try {
            await modelContext.registerTool(tool, { signal: controller.signal });
            registered.push(tool.name);
        }
        catch (e) {
            failed.push({ name: tool.name, message: e instanceof Error ? e.message : 'registration failed' });
        }
    }
    return { registered, failed, unregister: () => controller.abort() };
}
