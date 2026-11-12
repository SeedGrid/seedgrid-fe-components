#!/usr/bin/env node
// Cobertura e manutencao das traducoes do bloco "IA-ready" (src/i18n/ai-meta.json).
//   node scripts/ai-meta-i18n.mjs --check [--strict] [--lote N]   cobertura por lote e idioma
//   node scripts/ai-meta-i18n.mjs --faltam N [--out arq.json]     textos PT de um lote ainda sem traducao
//   node scripts/ai-meta-i18n.mjs --merge arq.json                acrescenta traducoes ({ "<pt>": { "en-US","pt-PT","es","fr" } })
// O manifesto (PT) e a fonte da verdade; metas, manifesto e MCP nao mudam.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST = path.resolve(root, "../../packages/seedgrid-fe-components/dist/ai/seedgrid-components.manifest.json");
const DICT = path.join(root, "src/i18n/ai-meta.json");
const LOCALES = ["en-US", "pt-PT", "es", "fr"];

// Lote 1: usados em CRUD (decisao do dono). Os demais seguem em grupos de ~25 por ordem alfabetica do slug.
const LOTE1 = (slug) =>
  slug.startsWith("sg-input-") || ["sg-combobox", "sg-autocomplete", "sg-radio-group", "sg-checkbox-group", "sg-toggle-switch", "sg-datatable", "sg-multi-select", "sg-multi-select-chips"].includes(slug);

const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
const components = (Array.isArray(manifest.components) ? manifest.components : Object.values(manifest.components ?? manifest))
  .map((c) => ({ slug: c.sgMeta.slug, texts: collect(c) }))
  .sort((a, b) => a.slug.localeCompare(b.slug));

function collect(c) {
  const out = new Set();
  const add = (s) => typeof s === "string" && s.trim() && out.add(s);
  add(c.sgMeta.description);
  (c.aiHints?.preferredUseCases ?? []).forEach(add);
  (c.aiHints?.avoidUseCases ?? []).forEach(add);
  (c.sgMeta.props ?? []).forEach((p) => add(p.description));
  return [...out];
}

const first = components.filter((c) => LOTE1(c.slug));
const rest = components.filter((c) => !LOTE1(c.slug));
const lotes = [first];
for (let i = 0; i < rest.length; i += 25) lotes.push(rest.slice(i, i + 25));

const dict = fs.existsSync(DICT) ? JSON.parse(fs.readFileSync(DICT, "utf8")) : {};
const has = (pt, loc) => typeof dict[pt]?.[loc] === "string" && dict[pt][loc].trim() !== "";
const tokens = (s) => (s.match(/`[^`]+`|\{[^}]*\}/g) ?? []).sort().join("|");

const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const val = (n) => (args.includes(n) ? args[args.indexOf(n) + 1] : undefined);

if (flag("--merge")) {
  const file = val("--merge");
  const incoming = JSON.parse(fs.readFileSync(file, "utf8"));
  const known = new Set(components.flatMap((c) => c.texts));
  let added = 0;
  const errors = [];
  for (const [pt, tr] of Object.entries(incoming)) {
    if (!known.has(pt)) { errors.push(`texto fora do manifesto: ${pt.slice(0, 60)}`); continue; }
    for (const loc of LOCALES) {
      if (typeof tr?.[loc] !== "string" || !tr[loc].trim()) errors.push(`${loc} vazio: ${pt.slice(0, 60)}`);
      else if (tokens(tr[loc]) !== tokens(pt)) errors.push(`${loc} muda tokens (\`codigo\`/{}) : ${pt.slice(0, 60)}`);
    }
    if (LOCALES.every((l) => typeof tr?.[l] === "string" && tr[l].trim() && tokens(tr[l]) === tokens(pt))) {
      dict[pt] = Object.fromEntries(LOCALES.map((l) => [l, tr[l]]));
      added++;
    }
  }
  const sorted = Object.fromEntries(Object.entries(dict).sort(([a], [b]) => a.localeCompare(b)));
  fs.writeFileSync(DICT, JSON.stringify(sorted, null, 2) + "\n", "utf8");
  console.log(`merge: ${added} textos acrescentados/atualizados; ${errors.length} problema(s)`);
  errors.slice(0, 30).forEach((e) => console.log("  - " + e));
  process.exit(errors.length ? 1 : 0);
}

if (flag("--faltam")) {
  const n = Number(val("--faltam"));
  const lote = lotes[n - 1];
  if (!lote) { console.error(`lote ${n} nao existe (1..${lotes.length})`); process.exit(2); }
  const missing = [...new Set(lote.flatMap((c) => c.texts).filter((pt) => !LOCALES.every((l) => has(pt, l))))];
  const out = val("--out");
  if (out) fs.writeFileSync(out, JSON.stringify(missing, null, 2) + "\n", "utf8");
  else console.log(JSON.stringify(missing, null, 2));
  console.error(`lote ${n}: ${missing.length} texto(s) sem traducao completa`);
  process.exit(0);
}

// --check
const only = val("--lote") ? Number(val("--lote")) : undefined;
let totalMissing = 0;
lotes.forEach((lote, i) => {
  if (only && only !== i + 1) return;
  const texts = [...new Set(lote.flatMap((c) => c.texts))];
  const cov = LOCALES.map((l) => `${l} ${texts.filter((t) => has(t, l)).length}/${texts.length}`).join("  ");
  totalMissing += texts.filter((t) => !LOCALES.every((l) => has(t, l))).length;
  console.log(`lote ${i + 1} (${lote.length} componentes${i === 0 ? ", CRUD" : ""}): ${cov}`);
});
const stale = Object.keys(dict).filter((pt) => !components.some((c) => c.texts.includes(pt)));
console.log(`sem traducao: ${totalMissing}; entradas obsoletas no dicionario: ${stale.length}`);
if (flag("--strict") && (totalMissing > 0 || stale.length > 0)) process.exit(1);
