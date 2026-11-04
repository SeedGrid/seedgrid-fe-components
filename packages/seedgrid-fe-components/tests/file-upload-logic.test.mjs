import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

// P141 - SgFileUpload, logica pura (tipo pelo conteudo, mediaType, tamanho com unidade, quantidade/tamanho).
// Os vetores sao gerados DESTE codigo pelo repo Flutter; o teste confirma que o React ainda produz o gravado.
const require = createRequire(import.meta.url);
const L = require("../dist/inputs/fileUploadLogic.js");

const VECTORS = join(process.cwd(), "..", "..", "..", "seedgrid-fe-flutter", "packages", "seedgrid_components", "test", "widgets", "file_upload_vectors", "vectors.json");
const available = existsSync(VECTORS);
const V = available ? JSON.parse(readFileSync(VECTORS, "utf8")) : null;
const hex = (s) => Uint8Array.from((s.match(/../g) ?? []).map((h) => parseInt(h, 16)));

test("vetores compartilhados: React produz exatamente o que foi gravado", { skip: !available }, () => {
  for (const c of V.sniff) assert.equal(L.sniffMime(hex(c.head)), c.out, JSON.stringify(c));
  for (const c of V.resolve) assert.equal(L.resolveMime(c.name, c.declared, hex(c.head)), c.out, JSON.stringify(c));
  for (const c of V.matches) assert.equal(L.matchesMedia(c.name, c.mime, c.mediaType ?? undefined, c.accept ?? undefined), c.out, JSON.stringify(c));
  for (const c of V.size) {
    const input = c.value === "NaN" ? Number.NaN : c.value === "undefined" ? undefined : c.value;
    assert.equal(L.parseSize(input) ?? null, c.out, JSON.stringify(c));
  }
  for (const c of V.add) {
    const picked = c.picked.map((p) => ({ ...p, head: hex(p.head) }));
    assert.deepEqual(L.planAdd(c.current, picked, c.rules), c.out, JSON.stringify(c));
  }
  for (const c of V.fsize) assert.equal(L.formatFileSize(c.bytes, c.locale), c.out, JSON.stringify(c));
});

test("tipo pelo conteudo: .jfif sem tipo informado e arquivo disfarçado", () => {
  const jpeg = hex("ffd8ffe000104a46");
  assert.equal(L.resolveMime("71cd3918.jfif", "", new Uint8Array(0)), "image/jpeg");
  assert.equal(L.resolveMime("sem-extensao", "", jpeg), "image/jpeg");
  const pdf = hex("255044462d312e34");
  assert.equal(L.resolveMime("foto.png", "image/png", pdf), "application/pdf");
  assert.equal(L.matchesMedia("foto.png", "application/pdf", ["image"]), false);
});

test("tamanho com unidade e limites", () => {
  assert.equal(L.parseSize("1.5KB"), 1536);
  assert.equal(L.parseSize(" 2 mb "), 2097152);
  assert.equal(L.parseSize(1024), 1024);
  assert.equal(L.parseSize("1XB"), undefined);
  const png = { name: "a.png", type: "image/png", size: 100, head: hex("89504e47") };
  const plan = L.planAdd([], [png, { ...png, name: "b.png" }, { ...png, name: "c.png" }], { maxFiles: 2, mediaType: ["image"] });
  assert.deepEqual(plan.accepted, [0, 1]);
  assert.deepEqual(plan.rejected, [{ index: 2, code: "count" }]);
});
