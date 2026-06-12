// Codemod: move o painel <ComponentAiSummary> do header (topo) para o final da pagina,
// logo APOS o <ComponentAiPropsTable> correspondente.
//
// Cada page.tsx do showcase renderiza, dentro do header sticky:
//   {VAR ? <ComponentAiSummary component={VAR} /> : null}
// e, perto do rodape:
//   {VAR ? <ComponentAiPropsTable component={VAR} /> : null}
// onde VAR e a mesma variavel (ex.: aiComponent, aiPageComponent, ...).
//
// Este script, para cada arquivo:
//   1) encontra a linha do ComponentAiSummary e captura VAR + a indentacao;
//   2) remove essa linha do header;
//   3) insere a mesma linha (re-indentada) logo apos a linha do ComponentAiPropsTable
//      que usa a MESMA VAR.
// Idempotente: se o Summary ja estiver imediatamente apos o PropsTable, nao mexe.

import { readFileSync, writeFileSync, globSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const componentsDir = join(here, "..", "src", "app", "components");

const files = globSync("**/page.tsx", { cwd: componentsDir }).map((rel) =>
  join(componentsDir, rel)
);

const summaryRe = /^(\s*)\{(\w+)\s*\?\s*<ComponentAiSummary component=\{\2\}\s*\/>\s*:\s*null\}\s*$/;
const propsTableRe = (varName) =>
  new RegExp(`^(\\s*)\\{${varName}\\s*\\?\\s*<ComponentAiPropsTable component=\\{${varName}\\}\\s*/>\\s*:\\s*null\\}\\s*$`);

let changed = 0;
let skipped = 0;
const problems = [];

for (const file of files) {
  const src = readFileSync(file, "utf8");
  let lines = src.split(/\r?\n/);
  let fileChanged = false;

  // Uma pagina pode ter varios componentes AI (varias variaveis). Processa todos:
  // repete enquanto houver algum Summary que NAO esteja imediatamente apos o seu PropsTable.
  for (;;) {
    const summaryIdx = lines.findIndex((l, i) => {
      const m = l.match(summaryRe);
      if (!m) return false;
      const tableRe = propsTableRe(m[2]);
      const tableIdx = lines.findIndex((x) => tableRe.test(x));
      // Pendente = tem PropsTable correspondente e o Summary ainda nao esta logo apos ele.
      return tableIdx !== -1 && summaryIsOutOfPlace(i, tableIdx);
    });

    if (summaryIdx === -1) break;

    const varName = lines[summaryIdx].match(summaryRe)[2];
    const tableRe = propsTableRe(varName);
    const tableIdx = lines.findIndex((l) => tableRe.test(l));
    const tableIndent = lines[tableIdx].match(tableRe)[1];
    const newSummaryLine = `${tableIndent}{${varName} ? <ComponentAiSummary component={${varName}} /> : null}`;

    lines.splice(summaryIdx, 1);
    const adjustedTableIdx = summaryIdx < tableIdx ? tableIdx - 1 : tableIdx;
    lines.splice(adjustedTableIdx + 1, 0, newSummaryLine);
    fileChanged = true;
  }

  // Reporta Summaries que ficaram sem PropsTable correspondente (nenhum esperado).
  for (let i = 0; i < lines.length; i += 1) {
    const m = lines[i].match(summaryRe);
    if (m && lines.findIndex((x) => propsTableRe(m[2]).test(x)) === -1) {
      problems.push(`${file}: ComponentAiSummary (${m[2]}) sem ComponentAiPropsTable correspondente`);
    }
  }

  if (fileChanged) {
    writeFileSync(file, lines.join("\n"), "utf8");
    changed += 1;
  } else {
    skipped += 1;
  }
}

function summaryIsOutOfPlace(summaryIdx, tableIdx) {
  return summaryIdx !== tableIdx + 1;
}

console.log(`Arquivos alterados: ${changed}`);
console.log(`Arquivos ja corretos (skip): ${skipped}`);
if (problems.length > 0) {
  console.log(`\nProblemas (${problems.length}):`);
  for (const p of problems) console.log(`  - ${p}`);
}
