import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import React from "react";
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
const { SgClock, SgCalendar } = require("../dist/sandbox.cjs");
Module._load = originalLoad;

const KEY = "sg-test-drag";
const clockProps = {
  clockStyle: "digital",
  initialServerTime: "2026-06-15T15:41:07Z",
  timezone: "UTC",
  locale: "en-US"
};

function setMedia(narrow) {
  globalThis.window.matchMedia = (query) => ({
    matches: narrow && /max-width:\s*639px/.test(query),
    media: query,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {}
  });
}

function stubRect(proto, rect) {
  const original = proto.getBoundingClientRect;
  proto.getBoundingClientRect = () => ({
    ...rect,
    x: rect.left,
    y: rect.top,
    right: rect.left + rect.width,
    bottom: rect.top + rect.height,
    toJSON() { return this; }
  });
  return () => { proto.getBoundingClientRect = original; };
}

async function transformOf(Comp, props, narrow, rect) {
  const harness = setupDomHarness();
  let restoreRect = () => {};
  try {
    setMedia(narrow);
    globalThis.localStorage.setItem(KEY, JSON.stringify({ x: 50, y: 20 }));
    if (rect) restoreRect = stubRect(harness.window.HTMLElement.prototype, rect);
    await harness.render(React.createElement(Comp, { ...props, cardProps: { ...props.cardProps, dragPersistKey: KEY } }));
    await flushDom();
    await flushDom();
    const section = harness.document.querySelector("section");
    return { transform: section?.style.transform ?? "", stored: globalThis.localStorage.getItem(KEY) };
  } finally {
    restoreRect();
    harness.restore();
  }
}

const inside = { left: 100, top: 100, width: 200, height: 100 };
const outside = { left: 5000, top: 100, width: 200, height: 100 };

for (const [name, Comp, props] of [
  ["SgClock", SgClock, clockProps],
  ["SgCalendar", SgCalendar, { locale: "en-US" }]
]) {
  test(`${name}: draggable automatico (undefined) arrasta em >= 640px e aplica a posicao salva`, async () => {
    const r = await transformOf(Comp, props, false, inside);
    assert.match(r.transform, /translate3d\(50px, 20px, 0\)/);
  });

  test(`${name}: draggable automatico fica desligado < 640px e ignora a posicao salva (sem sobrescrever)`, async () => {
    const r = await transformOf(Comp, props, true, inside);
    assert.equal(r.transform, "");
    assert.equal(r.stored, JSON.stringify({ x: 50, y: 20 }));
  });

  test(`${name}: draggable true arrasta sempre, mesmo < 640px`, async () => {
    const r = await transformOf(Comp, { ...props, cardProps: { draggable: true } }, true, inside);
    assert.match(r.transform, /translate3d\(50px, 20px, 0\)/);
  });

  test(`${name}: draggable false nunca arrasta, mesmo >= 640px`, async () => {
    const r = await transformOf(Comp, { ...props, cardProps: { draggable: false } }, false, inside);
    assert.equal(r.transform, "");
  });

  test(`${name}: posicao salva que deixa o cartao fora da viewport e descartada`, async () => {
    const r = await transformOf(Comp, props, false, outside);
    assert.equal(r.transform, "");
  });
}
