import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import React from "react";
import { act } from "react";
import { setupDomHarness, flushDom } from "./dom-harness.mjs";

// P133, refeito no P141 como composicao do SgFileUpload: comportamento no DOM (uma imagem, varias, recusas por
// arquivo, tipo pelo conteudo, accept que restringe, imagem salva). Os vetores de paridade ficam em image-upload.test.mjs.
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

const PNG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

function imageFile(window, name = "foto.png", size = 10) {
  const bytes = new Uint8Array(size);
  bytes.set(PNG);
  return new window.File([bytes], name, { type: "image/png" });
}

async function choose(harness, input, files) {
  Object.defineProperty(input, "files", { configurable: true, value: files });
  await act(async () => {
    input.dispatchEvent(new harness.window.Event("change", { bubbles: true }));
  });
  await flushDom();
  await flushDom();
}

function prepare(harness) {
  globalThis.File = harness.window.File;
  globalThis.FileReader = harness.window.FileReader;
  globalThis.URL.createObjectURL = () => "blob:fake";
  globalThis.URL.revokeObjectURL = () => {};
}

const sel = (id, part, index) => `[data-sg="sg-image-${part}-${id}${index === undefined ? "" : `-${index}`}"]`;

test("uma imagem: miniatura, lista no onChange e remover", async () => {
  const harness = setupDomHarness();
  try {
    prepare(harness);
    const calls = [];
    await harness.render(React.createElement(SgImageUpload, { id: "up", label: "Foto", onChange: (f) => calls.push(f.map((x) => x.name)) }));
    await flushDom();
    const input = harness.document.querySelector("input#up");
    assert.equal(input.type, "file");
    assert.equal(input.getAttribute("accept"), "image/*");
    assert.equal(input.multiple, false);
    await choose(harness, input, [imageFile(harness.window)]);
    assert.deepEqual(calls, [["foto.png"]]);
    assert.ok(harness.document.querySelector("img"));
    assert.match(harness.document.body.textContent, /foto\.png/);
    await act(async () => {
      harness.document.querySelector(sel("up", "remove", 0)).dispatchEvent(new harness.window.MouseEvent("click", { bubbles: true }));
    });
    await flushDom();
    assert.deepEqual(calls.at(-1), []);
    assert.equal(harness.document.querySelector("img"), null);
  } finally {
    harness.restore();
  }
});

test("varias imagens: grade, maxFiles e erro por arquivo", async () => {
  const harness = setupDomHarness();
  try {
    prepare(harness);
    const errors = [];
    let last = [];
    await harness.render(
      React.createElement(SgImageUpload, {
        id: "up",
        maxFiles: 2,
        onChange: (f) => (last = f),
        onError: (code, message, name) => errors.push(`${name}:${code}`)
      })
    );
    await flushDom();
    const input = harness.document.querySelector("input#up");
    assert.equal(input.multiple, true);
    await choose(harness, input, [imageFile(harness.window, "a.png"), imageFile(harness.window, "b.png"), imageFile(harness.window, "c.png")]);
    assert.deepEqual(last.map((f) => f.name), ["a.png", "b.png"]);
    assert.deepEqual(errors, ["c.png:count"]);
    assert.equal(harness.document.querySelectorAll("img").length, 2);
    assert.match(harness.document.querySelector("[role=alert]").textContent, /c\.png/);
    // cheio: a area de escolha some
    assert.equal(harness.document.querySelector(sel("up", "open")), null);
  } finally {
    harness.restore();
  }
});

test("recusa tipo e tamanho por arquivo; os outros seguem", async () => {
  const harness = setupDomHarness();
  try {
    prepare(harness);
    const errors = [];
    let last = [];
    await harness.render(
      React.createElement(SgImageUpload, {
        id: "up",
        maxFiles: 5,
        maxSizePerFile: "1KB",
        onChange: (f) => (last = f),
        onError: (code, message, name) => errors.push(`${name}:${code}`)
      })
    );
    await flushDom();
    const input = harness.document.querySelector("input#up");
    const pdf = new harness.window.File([new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d])], "doc.pdf", { type: "application/pdf" });
    await choose(harness, input, [imageFile(harness.window, "ok.png"), pdf, imageFile(harness.window, "grande.png", 2000)]);
    assert.deepEqual(last.map((f) => f.name), ["ok.png"]);
    assert.deepEqual(errors, ["doc.pdf:type", "grande.png:size"]);
    assert.match(harness.document.querySelector("[role=alert]").textContent, /1[.,]0 KB/);
  } finally {
    harness.restore();
  }
});

test(".jfif sem tipo informado vale pelo conteudo", async () => {
  const harness = setupDomHarness();
  try {
    prepare(harness);
    const errors = [];
    let last = [];
    await harness.render(React.createElement(SgImageUpload, { id: "up", onChange: (f) => (last = f), onError: (c, m, n) => errors.push(n) }));
    await flushDom();
    const jpeg = new harness.window.File([new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0x10])], "71cd3918.jfif", { type: "" });
    await choose(harness, harness.document.querySelector("input#up"), [jpeg]);
    assert.deepEqual(errors, []);
    assert.equal(last[0].name, "71cd3918.jfif");
  } finally {
    harness.restore();
  }
});

test("accept restringe os formatos de imagem", async () => {
  const harness = setupDomHarness();
  try {
    prepare(harness);
    const errors = [];
    await harness.render(React.createElement(SgImageUpload, { id: "up", accept: ".jpg", onError: (c, m, n) => errors.push(`${n}:${c}`) }));
    await flushDom();
    assert.equal(harness.document.querySelector("input#up").getAttribute("accept"), ".jpg");
    await choose(harness, harness.document.querySelector("input#up"), [imageFile(harness.window, "a.png")]);
    assert.deepEqual(errors, ["a.png:type"]);
  } finally {
    harness.restore();
  }
});

test("mostra imagem salva ({ name, url }); desabilitado nao deixa remover nem trocar", async () => {
  const harness = setupDomHarness();
  try {
    await harness.render(
      React.createElement(SgImageUpload, { id: "up", defaultValue: [{ name: "a.png", url: "https://x.test/a.png" }], disabled: true })
    );
    await flushDom();
    assert.equal(harness.document.querySelector("img").getAttribute("src"), "https://x.test/a.png");
    assert.equal(harness.document.querySelector("input#up").disabled, true);
    assert.equal(harness.document.querySelector(sel("up", "remove", 0)), null);
    assert.equal(harness.document.querySelector(sel("up", "change")), null);
  } finally {
    harness.restore();
  }
});
