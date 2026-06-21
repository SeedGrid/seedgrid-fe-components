// Generates per-component markdown docs from the DS package's AI manifest
// (dist/ai/seedgrid-components.manifest.json — the same data the seedgrid
// components MCP serves). Output goes to .design-sync/docs/<ExportName>.md and
// is bound via cfg.docsDir so the converter uses it as each <Name>.prompt.md.
// Regenerate after buildCmd on any re-sync:
//   node .design-sync/gen-docs.mjs
// NOTE: intentionally emits NO `category` frontmatter, so component grouping is
// left to the converter's existing logic (the manifest's sgMeta.category does
// NOT match the current group names).
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, "..");
const manifestPath = resolve(repo, "packages/seedgrid-fe-components/dist/ai/seedgrid-components.manifest.json");
const outDir = resolve(here, "docs");

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const list = (arr) => (arr && arr.length ? arr.map((x) => `- ${x}`).join("\n") : null);

let n = 0;
for (const c of manifest.components) {
  const name = c.exportName;
  if (!name) continue;
  const meta = c.sgMeta || {};
  const ai = c.aiHints || {};
  const lines = [];
  lines.push(`# ${name}`);
  if (meta.description) lines.push(`\n${meta.description}`);

  const use = list(ai.preferredUseCases);
  if (use) lines.push(`\n## Quando usar\n${use}`);

  const avoid = list(ai.avoidUseCases);
  if (avoid) lines.push(`\n## Quando evitar\n${avoid}`);

  const comp = list(ai.compositionHints);
  if (comp) lines.push(`\n## Composição\n${comp}`);

  if (Array.isArray(meta.props) && meta.props.length) {
    lines.push(`\n## Props principais`);
    lines.push(`| Prop | Tipo | Obrigatório | Descrição |`);
    lines.push(`| --- | --- | --- | --- |`);
    for (const p of meta.props.slice(0, 40)) {
      const t = String(p.type || "").replace(/\|/g, "\\|").replace(/\n/g, " ");
      const d = String(p.description || "").replace(/\|/g, "\\|").replace(/\n/g, " ");
      lines.push(`| \`${p.name}\` | \`${t}\` | ${p.required ? "sim" : "não"} | ${d} |`);
    }
  }

  const tags = [meta.tags, meta.capabilities, ai.synonyms].filter(Boolean).flat();
  if (tags.length) lines.push(`\n## Tags\n${[...new Set(tags)].join(", ")}`);

  writeFileSync(resolve(outDir, `${name}.md`), lines.join("\n") + "\n");
  n++;
}
console.log(`generated ${n} docs → ${outDir}`);
