import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

// Testa a saída buildada (convenção da casa). Trava o contrato lido pelo CLI Rust
// (dist/module.json) — ver seedgrid-cli/docs/adr/0004-module-manifest-contract.md.
const manifestPath = fileURLToPath(new URL("../dist/module.json", import.meta.url));

test("module.json expõe o manifesto do módulo subdomain-tenancy", async () => {
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

  assert.equal(manifest.id, "subdomain-tenancy");
  assert.deepEqual(manifest.requires, ["security"]);
  assert.equal(manifest.variantGroup, "tenancy");
  assert.equal(manifest.configKey, "subdomain-tenancy");
  assert.deepEqual(manifest.provider, [
    { import: "TenantProvider", from: "@seedgrid/fe-subdomain-tenancy/client" },
  ]);
});
