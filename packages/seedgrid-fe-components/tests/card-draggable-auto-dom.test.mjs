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
  proto.getBoundingClientRect = function () {
    // como no navegador: o retangulo acompanha o transform inline ja aplicado
    const m = /translate3d\(\s*(-?[\d.]+)px,\s*(-?[\d.]+)px/.exec(this.style?.transform || "");
    const dx = m && this.tagName === "SECTION" ? parseFloat(m[1]) : 0;
    const dy = m && this.tagName === "SECTION" ? parseFloat(m[2]) : 0;
    const left = rect.left + dx;
    const top = rect.top + dy;
    return { ...rect, left, top, x: left, y: top, right: left + rect.width, bottom: top + rect.height, toJSON() { return this; } };
  };
  return () => { proto.getBoundingClientRect = original; };
}

async function transformOf(Comp, props, narrow, rect, saved = { x: 50, y: 20 }) {
  const harness = setupDomHarness();
  let restoreRect = () => {};
  try {
    setMedia(narrow);
    globalThis.localStorage.setItem(KEY, JSON.stringify(saved));
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
const belowFold = { left: 100, top: 5000, width: 200, height: 100 };
const aboveContent = { left: 100, top: -500, width: 200, height: 100 };

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

  test(`${name}: cartao abaixo da dobra (rolagem) mantem a posicao salva`, async () => {
    const r = await transformOf(Comp, props, false, belowFold);
    assert.match(r.transform, /translate3d\(50px, 20px, 0\)/);
    // a chave salva continua com a posicao (nao e sobrescrita por {0,0} na hidratacao)
    assert.equal(r.stored, JSON.stringify({ x: 50, y: 20 }));
  });

  test(`${name}: y salvo muito negativo (natural 1500 + -5000) e descartado`, async () => {
    const r = await transformOf(Comp, props, false, { left: 100, top: 1500, width: 200, height: 100 }, { x: 0, y: -5000 });
    assert.equal(r.transform, "");
  });

  test(`${name}: cartao acima do inicio do conteudo descarta a posicao salva`, async () => {
    const r = await transformOf(Comp, props, false, aboveContent);
    assert.equal(r.transform, "");
  });
}

test("SgClock sem id/dragPersistKey nao persiste posicao (nem grava chave compartilhada)", async () => {
  const harness = setupDomHarness();
  try {
    setMedia(false);
    globalThis.localStorage.clear();
    await harness.render(
      React.createElement(
        "div",
        null,
        React.createElement(SgClock, clockProps),
        React.createElement(SgClock, clockProps),
        React.createElement(SgClock, clockProps)
      )
    );
    await flushDom();
    await flushDom();
    const keys = Object.keys(globalThis.localStorage).filter((k) => k.startsWith("sg-clock"));
    assert.deepEqual(keys, []);
  } finally {
    harness.restore();
  }
});

test("SgClock com cardProps.id persiste na chave sg-clock:<id>", async () => {
  const harness = setupDomHarness();
  try {
    setMedia(false);
    globalThis.localStorage.clear();
    await harness.render(
      React.createElement(SgClock, { ...clockProps, cardProps: { id: "meu" } })
    );
    await flushDom();
    await flushDom();
    assert.ok(globalThis.localStorage.getItem("sg-clock:meu") !== null);
  } finally {
    harness.restore();
  }
});
