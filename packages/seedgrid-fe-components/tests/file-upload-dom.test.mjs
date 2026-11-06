import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import React from "react";
import { act } from "react";
import { setupDomHarness, flushDom } from "./dom-harness.mjs";

// P141 - SgFileUpload no DOM: um arquivo, varios, tipo pelo conteudo, limites por arquivo/total/quantidade,
// erro por arquivo e desabilitado. A logica pura tem os vetores em file-upload-logic.test.mjs.
const require = createRequire(import.meta.url);
const Module = require("node:module");
const originalLoad = Module._load;
Module._load = function patchedLoad(request, parent, isMain) {
  if (request === "@tiptap/extension-text-style") {
    return { extend() { return { configure() { return this; } }; } };
  }
  return originalLoad.call(this, request, parent, isMain);
};
const { SgFileUpload } = require("../dist/sandbox.cjs");
Module._load = originalLoad;

const PDF = [0x25, 0x50, 0x44, 0x46, 0x2d, 0x31];
const PNG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

function file(window, name, size = 6, head = PDF, type = "") {
  const bytes = new Uint8Array(Math.max(size, head.length));
  bytes.set(head);
  return new window.File([bytes.subarray(0, size)], name, { type });
}

function prepare(harness) {
  globalThis.File = harness.window.File;
  globalThis.FileReader = harness.window.FileReader;
}

async function choose(harness, input, files) {
  Object.defineProperty(input, "files", { configurable: true, value: files });
  await act(async () => {
    input.dispatchEvent(new harness.window.Event("change", { bubbles: true }));
  });
  await flushDom();
  await flushDom();
}

const names = (list) => (list ?? []).map((f) => f.name).join(",");
const sel = (part, index) => `[data-sg="sg-file-${part}-f${index === undefined ? "" : `-${index}`}"]`;
const click = async (harness, selector) => {
  await act(async () => {
    harness.document.querySelector(selector).dispatchEvent(new harness.window.MouseEvent("click", { bubbles: true }));
  });
  await flushDom();
};

test("um arquivo: escolhe, mostra nome e tamanho, remove", async () => {
  const harness = setupDomHarness();
  try {
    prepare(harness);
    const calls = [];
    await harness.render(React.createElement(SgFileUpload, { id: "f", label: "Anexo", onChange: (l) => calls.push(names(l)) }));
    await flushDom();
    const input = harness.document.querySelector("input#f");
    assert.equal(input.multiple, false);
    await choose(harness, input, [file(harness.window, "a.pdf", 1536)]);
    assert.deepEqual(calls, ["a.pdf"]);
    assert.match(harness.document.body.textContent, /a\.pdf/);
    assert.match(harness.document.body.textContent, /1[.,]5 KB/);
    assert.ok(harness.document.querySelector(sel("change")));
    await click(harness, sel("remove", 0));
    assert.equal(calls.at(-1), "");
    assert.ok(harness.document.querySelector(sel("open")));
  } finally {
    harness.restore();
  }
});

test("varios arquivos: soma, respeita maxFiles e vira lista", async () => {
  const harness = setupDomHarness();
  try {
    prepare(harness);
    let last = [];
    const errors = [];
    await harness.render(
      React.createElement(SgFileUpload, {
        id: "f",
        maxFiles: 3,
        onChange: (l) => (last = l),
        onError: (code, message, name) => errors.push(`${name}:${code}`)
      })
    );
    await flushDom();
    const input = harness.document.querySelector("input#f");
    assert.equal(input.multiple, true);
    await choose(harness, input, [file(harness.window, "a.pdf"), file(harness.window, "b.pdf")]);
    assert.equal(names(last), "a.pdf,b.pdf");
    await choose(harness, input, [file(harness.window, "c.pdf"), file(harness.window, "d.pdf")]);
    assert.equal(names(last), "a.pdf,b.pdf,c.pdf");
    assert.deepEqual(errors, ["d.pdf:count"]);
    assert.equal(harness.document.querySelector(sel("open")), null);
    await click(harness, sel("remove", 1));
    assert.equal(names(last), "a.pdf,c.pdf");
    assert.ok(harness.document.querySelector(sel("open")));
  } finally {
    harness.restore();
  }
});

test("mediaType confere pelo conteudo, nao so pela extensao", async () => {
  const harness = setupDomHarness();
  try {
    prepare(harness);
    let last = [];
    const errors = [];
    await harness.render(
      React.createElement(SgFileUpload, {
        id: "f",
        maxFiles: 5,
        mediaType: ["pdf"],
        onChange: (l) => (last = l),
        onError: (code, message, name) => errors.push(`${name}:${code}`)
      })
    );
    await flushDom();
    const input = harness.document.querySelector("input#f");
    assert.equal(input.getAttribute("accept").includes("application/pdf"), true);
    await choose(harness, input, [
      file(harness.window, "certo.pdf"),
      file(harness.window, "falso.pdf", 8, PNG), // diz ser pdf, mas o conteudo e PNG
      file(harness.window, "sem-extensao") // conteudo PDF
    ]);
    assert.equal(names(last), "certo.pdf,sem-extensao");
    assert.deepEqual(errors, ["falso.pdf:type"]);
    assert.match(harness.document.querySelector("[role=alert]").textContent, /pdf/);
  } finally {
    harness.restore();
  }
});

test("maxSizePerFile e maxSizeTotal com unidade, erro por arquivo", async () => {
  const harness = setupDomHarness();
  try {
    prepare(harness);
    let last = [];
    const errors = [];
    await harness.render(
      React.createElement(SgFileUpload, {
        id: "f",
        maxFiles: 10,
        maxSizePerFile: "1KB",
        maxSizeTotal: "1.5KB",
        onChange: (l) => (last = l),
        onError: (code, message, name) => errors.push(`${name}:${code}`)
      })
    );
    await flushDom();
    await choose(harness, harness.document.querySelector("input#f"), [
      file(harness.window, "a.pdf", 1000),
      file(harness.window, "grande.pdf", 2000),
      file(harness.window, "b.pdf", 600),
      file(harness.window, "c.pdf", 100)
    ]);
    assert.equal(names(last), "a.pdf,c.pdf");
    assert.deepEqual(errors, ["grande.pdf:size", "b.pdf:total"]);
    assert.match(harness.document.querySelector("[role=alert]").textContent, /grande\.pdf: .*1[.,]0 KB/);
  } finally {
    harness.restore();
  }
});

test("desabilitado: nao mostra remover nem trocar", async () => {
  const harness = setupDomHarness();
  try {
    prepare(harness);
    await harness.render(React.createElement(SgFileUpload, { id: "f", enabled: false, defaultValue: [file(harness.window, "a.pdf")] }));
    await flushDom();
    assert.equal(harness.document.querySelector("input#f").disabled, true);
    assert.equal(harness.document.querySelector(sel("remove", 0)), null);
    assert.equal(harness.document.querySelector(sel("change")), null);
  } finally {
    harness.restore();
  }
});
