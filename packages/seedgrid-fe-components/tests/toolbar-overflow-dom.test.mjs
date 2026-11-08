import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import React from "react";
import { setupDomHarness, flushDom, dispatchMouse } from "./dom-harness.mjs";

const require = createRequire(import.meta.url);
const Module = require("node:module");
const originalLoad = Module._load;

Module._load = function patchedLoad(request, parent, isMain) {
  if (request === "@tiptap/extension-text-style") {
    return {
      extend() {
        return {
          configure() {
            return this;
          }
        };
      }
    };
  }
  return originalLoad.call(this, request, parent, isMain);
};

const { SgToolBar, SgToolbarIconButton, resolveToolbarOverflow } = require("../dist/sandbox.cjs");

Module._load = originalLoad;

test("resolveToolbarOverflow: tudo cabe, nao cabe, e reserva espaco do botao '...'", () => {
  const extents = [40, 40, 40, 40, 40];
  assert.equal(resolveToolbarOverflow({ extents, available: 1000, gap: 8, overflowExtent: 40 }), 5);
  assert.equal(resolveToolbarOverflow({ extents, available: 232, gap: 8, overflowExtent: 40 }), 5);
  assert.equal(resolveToolbarOverflow({ extents, available: 100, gap: 8, overflowExtent: 40 }), 1);
  assert.equal(resolveToolbarOverflow({ extents, available: 150, gap: 8, overflowExtent: 40 }), 2);
  assert.equal(resolveToolbarOverflow({ extents, available: 30, gap: 8, overflowExtent: 40 }), 0);
  assert.equal(resolveToolbarOverflow({ extents, available: Infinity, gap: 8, overflowExtent: 40 }), 5);
});

function stubLayout(harness, available) {
  const proto = harness.window.HTMLElement.prototype;
  const restore = [];
  const define = (name, getter) => {
    const prev = Object.getOwnPropertyDescriptor(proto, name);
    Object.defineProperty(proto, name, { configurable: true, get: getter });
    restore.push(() => {
      if (prev) Object.defineProperty(proto, name, prev);
      else delete proto[name];
    });
  };
  define("offsetWidth", () => 40);
  define("offsetHeight", () => 40);
  define("clientWidth", function clientWidth() {
    return this.getAttribute?.("data-sg-toolbar-overflow") === "true" ? available : 0;
  });
  define("clientHeight", function clientHeight() {
    return this.getAttribute?.("data-sg-toolbar-overflow") === "true" ? available : 0;
  });
  return () => restore.forEach((fn) => fn());
}

function buildBar(log, props = {}) {
  return React.createElement(
    SgToolBar,
    { id: "tb-overflow", orientationDirection: "horizontal-left", collapsible: false, overflow: true, ...props },
    ...["Novo", "Editar", "Copiar", "Imprimir", "Compartilhar"].map((label) =>
      React.createElement(SgToolbarIconButton, { key: label, label, onClick: () => log.push(label) })
    )
  );
}

const visibleLabels = (document) =>
  Array.from(document.querySelectorAll('[data-sg-toolbar-overflow-items="true"] button'))
    .map((b) => b.getAttribute("aria-label"))
    .filter(Boolean);

test("SgToolBar overflow: itens que nao cabem vao para o menu '...' e o clique funciona", async () => {
  const harness = setupDomHarness();
  const restoreLayout = stubLayout(harness, 100);
  try {
    const log = [];
    await harness.render(buildBar(log));
    await flushDom();

    const more = harness.document.querySelector('[data-sg-toolbar-overflow-button="true"] button');
    assert.ok(more, "botao '...' deve existir");
    assert.equal(more.getAttribute("aria-label"), "Open menu");
    assert.deepEqual(visibleLabels(harness.document), ["Novo", "Open menu"]);

    await dispatchMouse(more, "click");
    await flushDom();
    const text = harness.document.body.textContent ?? "";
    for (const label of ["Editar", "Copiar", "Imprimir", "Compartilhar"]) assert.match(text, new RegExp(label));

    const row = Array.from(harness.document.querySelectorAll('[role="dialog"] button')).find((b) =>
      (b.textContent ?? "").includes("Compartilhar")
    );
    assert.ok(row, "linha do menu para o item escondido");
    await dispatchMouse(row, "click");
    await flushDom();
    assert.deepEqual(log, ["Compartilhar"]);
    assert.equal(harness.document.querySelector('[role="dialog"]'), null, "menu fecha apos o clique");
  } finally {
    restoreLayout();
    harness.restore();
  }
});

test("SgToolBar overflow: cabe tudo sem botao '...' e sem a prop nada muda", async () => {
  const harness = setupDomHarness();
  const restoreLayout = stubLayout(harness, 1000);
  try {
    await harness.render(buildBar([]));
    await flushDom();
    assert.equal(harness.document.querySelector('[data-sg-toolbar-overflow-button="true"]'), null);
    assert.equal(visibleLabels(harness.document).length, 5);
  } finally {
    restoreLayout();
    harness.restore();
  }

  const harness2 = setupDomHarness();
  const restoreLayout2 = stubLayout(harness2, 100);
  try {
    await harness2.render(buildBar([], { overflow: false }));
    await flushDom();
    assert.equal(harness2.document.querySelector('[data-sg-toolbar-overflow]'), null);
    assert.equal(harness2.document.querySelector('[data-sg-toolbar-overflow-button="true"]'), null);
  } finally {
    restoreLayout2();
    harness2.restore();
  }
});
