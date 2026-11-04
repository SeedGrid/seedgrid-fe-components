import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import React from "react";
import { act } from "react";
import { setupDomHarness, flushDom } from "./dom-harness.mjs";

// P133 - SgImageUpload. Logica pura (vetores compartilhados com o Flutter) + comportamento no DOM.
const require = createRequire(import.meta.url);
const Module = require("node:module");
const originalLoad = Module._load;
Module._load = function patchedLoad(request, parent, isMain) {
  if (request === "@tiptap/extension-text-style") {
    return { extend() { return { configure() { return this; } }; } };
  }
  return originalLoad.call(this, request, parent, isMain);
};
const { SgImageUpload } = require("../dist/sandbox.cjs");
Module._load = originalLoad;
const L = require("../dist/inputs/imageUploadLogic.js");

const VECTORS = join(process.cwd(), "..", "..", "..", "seedgrid-fe-flutter", "packages", "seedgrid_components", "test", "widgets", "image_upload_vectors", "vectors.json");
const available = existsSync(VECTORS);
const V = available ? JSON.parse(readFileSync(VECTORS, "utf8")) : null;

test("vetores compartilhados: React produz exatamente o que foi gravado", { skip: !available }, () => {
  for (const c of V.accept) assert.equal(L.matchesAccept(c.name, c.type, c.accept ?? undefined), c.out, JSON.stringify(c));
  for (const c of V.validate) assert.equal(L.validateImage(c.file, c.rules), c.out, JSON.stringify(c));
  for (const c of V.bytes) assert.equal(L.formatBytes(c.bytes, c.locale), c.out, JSON.stringify(c));
  for (const c of V.aspect) assert.equal(L.formatAspect(c.aspect), c.out, JSON.stringify(c));
});

function pngFile(name = "foto.png", size = 10, type = "image/png") {
  return new globalThis.File([new Uint8Array(size)], name, { type });
}

async function choose(harness, input, file) {
  Object.defineProperty(input, "files", { configurable: true, value: [file] });
  await act(async () => {
    input.dispatchEvent(new harness.window.Event("change", { bubbles: true }));
  });
  await flushDom();
}

test("SgImageUpload aceita arquivo valido, mostra o nome e remove", async () => {
  const harness = setupDomHarness();
  try {
    globalThis.File = harness.window.File;
    globalThis.URL.createObjectURL = () => "blob:fake";
    globalThis.URL.revokeObjectURL = () => {};
    const calls = [];
    await harness.render(React.createElement(SgImageUpload, { id: "up", label: "Foto", onChange: (f) => calls.push(f?.name ?? null) }));
    await flushDom();
    const input = harness.document.querySelector("input#up");
    assert.ok(input);
    assert.equal(input.type, "file");
    assert.equal(input.getAttribute("accept"), "image/*");
    await choose(harness, input, new harness.window.File([new Uint8Array(10)], "foto.png", { type: "image/png" }));
    assert.deepEqual(calls, ["foto.png"]);
    assert.ok(harness.document.querySelector("img"));
    assert.match(harness.document.body.textContent, /foto\.png/);
    const remove = harness.document.querySelector("button[aria-label]");
    assert.ok(remove);
    await act(async () => {
      remove.dispatchEvent(new harness.window.MouseEvent("click", { bubbles: true }));
    });
    await flushDom();
    assert.deepEqual(calls, ["foto.png", null]);
    assert.equal(harness.document.querySelector("img"), null);
  } finally {
    harness.restore();
  }
});

test("SgImageUpload recusa tipo e tamanho com onError e mensagem", async () => {
  const harness = setupDomHarness();
  try {
    globalThis.File = harness.window.File;
    globalThis.URL.createObjectURL = () => "blob:fake";
    globalThis.URL.revokeObjectURL = () => {};
    const errors = [];
    const changes = [];
    await harness.render(
      React.createElement(SgImageUpload, {
        id: "up",
        accept: "image/png",
        maxSizeBytes: 100,
        onChange: (f) => changes.push(f),
        onError: (code, message) => errors.push([code, message])
      })
    );
    await flushDom();
    const input = harness.document.querySelector("input#up");
    await choose(harness, input, new harness.window.File([new Uint8Array(10)], "doc.pdf", { type: "application/pdf" }));
    assert.equal(errors.at(-1)[0], "type");
    await choose(harness, input, new harness.window.File([new Uint8Array(500)], "grande.png", { type: "image/png" }));
    assert.equal(errors.at(-1)[0], "size");
    assert.match(harness.document.querySelector("[role=alert]").textContent, /100 B/);
    assert.deepEqual(changes, []);
  } finally {
    harness.restore();
  }
});

test("SgImageUpload mostra URL salva e desabilitado nao deixa remover", async () => {
  const harness = setupDomHarness();
  try {
    await harness.render(React.createElement(SgImageUpload, { id: "up", defaultValue: "https://x.test/a.png", disabled: true }));
    await flushDom();
    assert.equal(harness.document.querySelector("img").getAttribute("src"), "https://x.test/a.png");
    assert.equal(harness.document.querySelector("input#up").disabled, true);
    assert.equal(harness.document.querySelector("button[aria-label]"), null);
  } finally {
    harness.restore();
  }
});
