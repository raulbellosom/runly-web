// Plain-text renderings of the developer docs for AI assistants: each page
// as Markdown, /llms.txt (https://llmstxt.org) and /llms-full.txt.
export const SITE_URL = "https://runly.mx";

interface DeveloperEntry {
  id: string;
  body?: string;
  data: { title: string; summary: string; order: number };
}

interface ModuleEntry {
  moduleKey: string;
  title: string;
  summary: string;
}

// Site-relative links (/documentacion/...) become absolute so the text works
// outside the site.
function absolutize(markdown: string): string {
  return markdown.replace(/\]\((\/[^)]+)\)/g, (_match, href) => `](${SITE_URL}${href})`);
}

export function developerDocMarkdown(entry: DeveloperEntry): string {
  return `# ${entry.data.title}\n\n> ${entry.data.summary}\n\n${absolutize(entry.body ?? "").trim()}\n`;
}

export function sortDeveloperDocs<T extends DeveloperEntry>(entries: T[]): T[] {
  return [...entries].sort((a, b) => a.data.order - b.data.order);
}

export function llmsTxt(entries: DeveloperEntry[], modules: ModuleEntry[]): string {
  const docs = sortDeveloperDocs(entries).map((entry) => `- [${entry.data.title}](${SITE_URL}/documentacion/desarrolladores/${entry.id}.md): ${entry.data.summary}`);
  const help = modules.map((mod) => `- [${mod.title}](${SITE_URL}/documentacion/modulos/${mod.moduleKey}): ${mod.summary}`);
  return [
    "# Runly",
    "",
    "> ERP modular en español. Los módulos se crean con el Constructor de módulos (sin código) y se extienden con código: pantallas React, API de los módulos y relaciones con los módulos del sistema.",
    "",
    "Toda la documentación de desarrolladores en un solo archivo: " + `${SITE_URL}/llms-full.txt`,
    "",
    "## Desarrolladores",
    "",
    ...docs,
    "",
    "## Módulos (ayuda para usuarios)",
    "",
    ...help,
    "",
  ].join("\n");
}

export function llmsFullTxt(entries: DeveloperEntry[]): string {
  return sortDeveloperDocs(entries).map((entry) => developerDocMarkdown(entry)).join("\n---\n\n");
}
