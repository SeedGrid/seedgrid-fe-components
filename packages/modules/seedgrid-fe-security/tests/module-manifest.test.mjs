import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

// Testa a saída buildada (convenção da casa). Trava o contrato lido pelo CLI Rust
// (dist/module.json) — ver seedgrid-cli/docs/adr/0004-module-manifest-contract.md.
const manifestPath = fileURLToPath(new URL("../dist/module.json", import.meta.url));

test("module.json expõe o manifesto do módulo security", async () => {
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

  assert.equal(manifest.id, "security");
  assert.equal(manifest.configKey, "security");
  assert.deepEqual(manifest.env, ["SEEDGRID_REPORT_API_TOKEN"]);
  assert.deepEqual(manifest.provider, [
    { import: "AuthProvider", from: "@/modules/security" },
  ]);
  assert.deepEqual(manifest.messages, {
    import: "securityMessages",
    from: "@seedgrid/fe-security",
  });
});
