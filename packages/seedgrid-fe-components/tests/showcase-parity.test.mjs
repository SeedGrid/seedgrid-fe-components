// P148/P153 F1.T1: o showcase Flutter tem de seguir os exemplos do React (fonte da verdade).
// Roda o verificador do seedgrid-fe-flutter (repositorio ao lado). Sem ele, o teste e pulado.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const reactRoot = path.resolve(here, "..", "..", "..");
const verify = path.resolve(reactRoot, "..", "seedgrid-fe-flutter", "tools", "showcase_parity", "verify.mjs");

test("showcase Flutter em paridade de exemplos com o React (linha de base so encolhe)", { skip: !fs.existsSync(verify) && "seedgrid-fe-flutter nao encontrado ao lado" }, () => {
  const r = spawnSync(process.execPath, [verify, "--react", reactRoot], { encoding: "utf8" });
  assert.equal(r.status, 0, `${r.stdout}\n${r.stderr}`);
});
