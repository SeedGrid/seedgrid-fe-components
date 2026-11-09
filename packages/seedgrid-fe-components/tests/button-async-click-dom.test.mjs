// SgButton: onClick pode devolver uma Promise; o botao fica em loading ate ela terminar ou falhar.
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import React from "react";
import { act } from "react";
import { setupDomHarness, flushDom } from "./dom-harness.mjs";

const require = createRequire(import.meta.url);
const Module = require("node:module");
const originalLoad = Module._load;
Module._load = function patchedLoad(request, parent, isMain) {
  if (request === "@tiptap/extension-text-style") {
    return { extend() { return { configure() { return this; } }; } };
  }
  return originalLoad.call(this, request, parent, isMain);
};
const { SgButton } = require("../dist/sandbox.cjs");
Module._load = originalLoad;

const click = async (el) => {
  await act(async () => {
    el.dispatchEvent(new globalThis.window.MouseEvent("click", { bubbles: true, cancelable: true }));
  });
  await flushDom();
};

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

const settle = async (fn) => {
  await act(async () => {
    fn();
    await Promise.resolve();
  });
  await flushDom();
};

test("SgButton: Promise do onClick liga loading, ignora cliques e volta ao normal ao resolver", async () => {
  const h = setupDomHarness();
  try {
    const d = deferred();
    let calls = 0;
    const { container } = await h.render(
      React.createElement(SgButton, { onClick: () => { calls++; return d.promise; } }, "Go")
    );
    const btn = container.querySelector("button");
    assert.equal(btn.disabled, false);
    assert.equal(btn.getAttribute("aria-busy"), null);

    await click(btn);
    assert.equal(calls, 1);
    assert.equal(btn.disabled, true, "desabilitado durante a Promise");
    assert.equal(btn.getAttribute("aria-busy"), "true");
    assert.ok(btn.querySelector("svg.animate-spin"), "spinner visivel");

    await click(btn);
    assert.equal(calls, 1, "clique ignorado durante o loading");

    await settle(() => d.resolve());
    assert.equal(btn.disabled, false);
    assert.equal(btn.getAttribute("aria-busy"), null);
    assert.equal(btn.querySelector("svg.animate-spin"), null);

    await click(btn);
    assert.equal(calls, 2, "volta a aceitar cliques");
  } finally {
    h.restore();
  }
});

test("SgButton: Promise rejeitada sai do loading e o erro nao e engolido", async () => {
  const h = setupDomHarness();
  const unhandled = [];
  const onUnhandled = (reason) => unhandled.push(reason);
  // O test runner trata unhandledRejection como falha: troca os ouvintes so durante o teste.
  const previous = process.listeners("unhandledRejection");
  process.removeAllListeners("unhandledRejection");
  process.on("unhandledRejection", onUnhandled);
  try {
    const d = deferred();
    const boom = new Error("boom");
    const { container } = await h.render(
      React.createElement(SgButton, { onClick: () => d.promise }, "Go")
    );
    const btn = container.querySelector("button");
    await click(btn);
    assert.equal(btn.disabled, true);

    await settle(() => d.reject(boom));
    await new Promise((r) => setTimeout(r, 20));
    assert.equal(btn.disabled, false, "saiu do loading apos falhar");
    assert.equal(btn.getAttribute("aria-busy"), null);
    assert.deepEqual(unhandled, [boom], "erro relancado, nao engolido");
  } finally {
    process.off("unhandledRejection", onUnhandled);
    for (const l of previous) process.on("unhandledRejection", l);
    h.restore();
  }
});

test("SgButton: onClick sincrono nao muda o comportamento", async () => {
  const h = setupDomHarness();
  try {
    let calls = 0;
    const { container } = await h.render(React.createElement(SgButton, { onClick: () => { calls++; } }, "Sync"));
    const btn = container.querySelector("button");
    await click(btn);
    assert.equal(calls, 1);
    assert.equal(btn.disabled, false);
    assert.equal(btn.getAttribute("aria-busy"), null);
    await click(btn);
    assert.equal(calls, 2);
  } finally {
    h.restore();
  }
});

test("SgButton: loading manual vence sobre o onClick", async () => {
  const h = setupDomHarness();
  try {
    let calls = 0;
    const { container } = await h.render(
      React.createElement(SgButton, { loading: true, onClick: () => { calls++; return new Promise(() => {}); } }, "Manual")
    );
    const btn = container.querySelector("button");
    assert.equal(btn.disabled, true);
    assert.equal(btn.getAttribute("aria-busy"), "true");
    await click(btn);
    assert.equal(calls, 0, "loading manual bloqueia o clique");
  } finally {
    h.restore();
  }
});

test("SgButton: enabled=false nao dispara onClick", async () => {
  const h = setupDomHarness();
  try {
    let calls = 0;
    const { container } = await h.render(
      React.createElement(SgButton, { enabled: false, onClick: () => { calls++; } }, "Off")
    );
    await click(container.querySelector("button"));
    assert.equal(calls, 0);
  } finally {
    h.restore();
  }
});
