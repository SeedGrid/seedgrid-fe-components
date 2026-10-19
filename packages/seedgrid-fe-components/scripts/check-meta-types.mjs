// Guardrail: o tipo declarado nos `.meta.ts` (curadoria) precisa ser EQUIVALENTE ao tipo TypeScript
// real da prop (fonte da verdade). Compara com o compilador (assignabilidade nos dois sentidos),
// entao `Severity` e a uniao expandida `"primary" | "secondary" | ...` contam como iguais, mas
// `(value: number | null) => void` contra `(value: string) => void` acusa divergencia.
//
// Uso: node scripts/check-meta-types.mjs [--list]   (precisa de `dist/` e de `generated-props.json`)
// Saida: 0 sem divergencia; 1 com divergencia. Tipos que o compilador nao resolve no arquivo de
// verificacao (nomes de tipo nao importados) sao listados como "nao verificaveis", sem falhar.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const root = process.cwd();
const srcRoot = path.join(root, "src");
const tmpFile = path.join(srcRoot, "__metacheck__.ts");
const gen = JSON.parse(fs.readFileSync(path.join(srcRoot, "ai-meta", "generated-props.json"), "utf8"));

function walk(d) {
  return fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith(".meta.js") ? [path.join(d, e.name)] : []);
}

const checks = [];
for (const f of walk(path.join(root, "dist"))) {
  let m;
  try { m = await import(pathToFileURL(f).href); } catch { continue; }
  const s = m.sgMeta;
  if (!s || !gen[s.exportName]) continue;
  const tsProps = new Map(gen[s.exportName].map((p) => [p.name, p]));
  for (const p of s.props ?? []) {
    if (p.type === undefined || !tsProps.has(p.name)) continue;
    checks.push({ comp: s.exportName, prop: p.name, metaType: String(p.type), tsType: tsProps.get(p.name).type });
  }
}

const lines = [
  'import type * as I from "./index";',
  'import type * as React from "react";',
  'import type { ReactNode, ReactElement, CSSProperties, ComponentType } from "react";',
  'type Eq<A, B> = [A] extends [B] ? ([B] extends [A] ? 1 : 0) : 0;',
];
// Tipos exportados pelo pacote ficam visiveis pelo nome simples, como nos `.meta.ts`.
const indexSrc = fs.readFileSync(path.join(srcRoot, "index.ts"), "utf8");
const exported = new Set();
for (const m of indexSrc.matchAll(/export\s+(?:type\s+)?\{([^}]*)\}\s+from/g)) {
  for (const part of m[1].split(",")) {
    const name = part.trim().replace(/^type\s+/, "").split(/\s+as\s+/).pop();
    if (/^[A-Za-z_$][\w$]*$/.test(name || "")) exported.add(name);
  }
}
for (const reserved of ["I", "React", "ReactNode", "ReactElement", "CSSProperties", "ComponentType", "Eq"]) exported.delete(reserved);
if (exported.size) lines.push(`import type { ${[...exported].join(", ")} } from "./index";`);
const where = new Map();
checks.forEach((c, i) => {
  const base = `Pr${i}`;
  lines.push(`type ${base} = React.ComponentProps<(typeof I)["${c.comp}" & keyof typeof I]>;`);
  lines.push(`type T${i} = NonNullable<${base}["${c.prop}" & keyof ${base}]>;`);
  lines.push(`type M${i} = NonNullable<${c.metaType.replace(/\n/g, " ")}>;`);
  lines.push(`const c${i}: Eq<T${i}, M${i}> = 1;`);
  where.set(`c${i}`, i);
});
fs.writeFileSync(tmpFile, lines.join("\n") + "\n");

let diags = [];
try {
  const cfgPath = path.join(root, "tsconfig.json");
  const cfg = ts.getParsedCommandLineOfConfigFile(cfgPath, { noEmit: true, declaration: false, declarationMap: false },
    { ...ts.sys, onUnRecoverableConfigFileDiagnostic: () => {} });
  const program = ts.createProgram([tmpFile], { ...cfg.options, noEmit: true, declaration: false, declarationMap: false, skipLibCheck: true });
  diags = ts.getPreEmitDiagnostics(program, program.getSourceFile(tmpFile));
} finally {
  fs.rmSync(tmpFile, { force: true });
}

const lineOf = (d) => d.file.getLineAndCharacterOfPosition(d.start).line;
const bad = new Map(), unverifiable = new Map();
for (const d of diags) {
  if (!d.file) continue;
  const ln = lineOf(d);
  const src = d.file.text.split("\n")[ln] ?? "";
  const mm = /^(?:const c|type M|type T)(\d+)\b/.exec(src);
  if (!mm) continue;
  const idx = Number(mm[1]);
  const msg = ts.flattenDiagnosticMessageText(d.messageText, " ");
  if (src.startsWith("const c")) bad.set(idx, msg); else unverifiable.set(idx, msg);
}
// Tipos nao resolvidos tambem geram erro em c{i}; so e divergencia real quando M{i} resolveu.
const real = [...bad.keys()].filter((i) => !unverifiable.has(i));
const list = process.argv.includes("--list");
console.log(`[check-meta-types] ${checks.length} props comparadas; ${real.length} divergentes; ${unverifiable.size} nao verificaveis.`);
for (const i of real) console.log(`  DIVERGE ${checks[i].comp}.${checks[i].prop}: meta=${checks[i].metaType} | TS=${checks[i].tsType}`);
if (list) for (const i of unverifiable.keys()) console.log(`  ?       ${checks[i].comp}.${checks[i].prop}: ${checks[i].metaType}`);
process.exit(real.length > 0 ? 1 : 0);
