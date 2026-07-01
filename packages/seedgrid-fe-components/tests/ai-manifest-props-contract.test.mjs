// Guardrail: o manifesto de IA (consumido pelo MCP e pela tabela de props do showcase) deve
// COBRIR todos os props extraidos dos tipos `<Export>Props` (fonte da verdade). Como o manifesto
// e GERADO do tipo (scripts/extract-props.mjs -> build-ai-manifest.mjs), nenhuma prop publica pode
// silenciosamente sumir. Este teste falha se a geracao/merge regredir.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const packageRoot = process.cwd();
const generated = JSON.parse(
  readFileSync(join(packageRoot, "src", "ai-meta", "generated-props.json"), "utf8")
);
const manifest = JSON.parse(
  readFileSync(join(packageRoot, "dist", "ai", "seedgrid-components.manifest.json"), "utf8")
);
const manifestByExport = new Map(manifest.components.map((c) => [c.exportName, c]));

test("manifesto cobre todos os props extraidos dos tipos", () => {
  const failures = [];
  for (const [exportName, props] of Object.entries(generated)) {
    const component = manifestByExport.get(exportName);
    if (!component) {
      failures.push(`${exportName}: ausente no manifesto`);
      continue;
    }
    const documented = new Set((component.sgMeta.props ?? []).map((p) => p.name));
    const missing = props.map((p) => p.name).filter((name) => !documented.has(name));
    if (missing.length > 0) failures.push(`${exportName}: faltam [${missing.join(", ")}]`);
  }
  assert.equal(failures.length, 0, `Props faltando no manifesto:\n${failures.join("\n")}`);
});

test("regressao concreta: SgInputPassword expoe createNewPasswordButton", () => {
  const component = manifestByExport.get("SgInputPassword");
  assert.ok(component, "SgInputPassword ausente no manifesto");
  const names = new Set(component.sgMeta.props.map((p) => p.name));
  assert.ok(names.has("createNewPasswordButton"), "createNewPasswordButton faltando no manifesto");
});
