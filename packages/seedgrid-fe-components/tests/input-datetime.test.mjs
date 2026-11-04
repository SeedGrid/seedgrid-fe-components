import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import React from "react";
import { setupDomHarness, flushDom, dispatchInput } from "./dom-harness.mjs";

// P132 - SgInputDateTime. Logica pura (vetores compartilhados com o Flutter) + comportamento no DOM.
const require = createRequire(import.meta.url);
const Module = require("node:module");
const originalLoad = Module._load;
Module._load = function patchedLoad(request, parent, isMain) {
  if (request === "@tiptap/extension-text-style") {
    return { extend() { return { configure() { return this; } }; } };
  }
  return originalLoad.call(this, request, parent, isMain);
};
const { SgInputDateTime } = require("../dist/sandbox.cjs");
Module._load = originalLoad;
const L = require("../dist/inputs/dateTimeLogic.js");

const VECTORS = join(process.cwd(), "..", "..", "..", "seedgrid-fe-flutter", "packages", "seedgrid_components", "test", "widgets", "datetime_vectors", "vectors.json");
const available = existsSync(VECTORS);
const V = available ? JSON.parse(readFileSync(VECTORS, "utf8")) : null;

test("vetores compartilhados: React produz exatamente o que foi gravado", { skip: !available }, () => {
  for (const c of V.offsets) assert.equal(L.parseFixedOffset(c.input), c.out, `offset ${c.input}`);
  for (const c of V.toWall) assert.equal(L.instantToWallClock(c.instant, c.zone, c.seconds), c.out, JSON.stringify(c));
  for (const c of V.toInstant) assert.equal(L.wallClockToInstant(c.local, c.zone), c.out, JSON.stringify(c));
  for (const c of V.snap) assert.equal(L.snapMinutes(c.local, c.step ?? undefined), c.out, JSON.stringify(c));
  for (const c of V.validate)
    assert.equal(L.validateDateTime(c.local, { required: c.required, min: c.min, max: c.max, timeZone: c.zone }), c.out, JSON.stringify(c));
  for (const c of V.format) assert.equal(L.formatWallClock(c.local, c.locale, c.seconds), c.out, JSON.stringify(c));
});

test("fuso IANA (so React): Sao Paulo e UTC-3 sem horario de verao", () => {
  assert.equal(L.instantToWallClock("2026-11-03T17:30:00.000Z", "America/Sao_Paulo"), "2026-11-03T14:30");
  assert.equal(L.wallClockToInstant("2026-11-03T14:30", "America/Sao_Paulo"), "2026-11-03T17:30:00.000Z");
  assert.equal(L.instantToWallClock("2026-07-01T12:00:00.000Z", "Europe/Lisbon"), "2026-07-01T13:00");
});

function mount(props) {
  return React.createElement(SgInputDateTime, { id: "dt", label: "Quando", ...props });
}

test("SgInputDateTime mostra o instante no fuso e emite ISO UTC ao digitar", async () => {
  const harness = setupDomHarness();
  try {
    const calls = [];
    await harness.render(mount({ timeZone: "-03:00", defaultValue: "2026-11-03T17:30:00Z", onChange: (v, l) => calls.push([v, l]) }));
    await flushDom();
    const input = harness.document.querySelector("input#dt");
    assert.ok(input);
    assert.equal(input.type, "datetime-local");
    assert.equal(input.value, "2026-11-03T14:30");
    await dispatchInput(input, "2026-11-04T08:15");
    await flushDom();
    assert.deepEqual(calls.at(-1), ["2026-11-04T11:15:00.000Z", "2026-11-04T08:15"]);
  } finally {
    harness.restore();
  }
});

test("SgInputDateTime controlado segue o value e aplica min/max como atributos", async () => {
  const harness = setupDomHarness();
  try {
    await harness.render(mount({ timeZone: "UTC", value: "2026-11-03T17:30:00Z", minDate: "2026-11-01T00:00:00Z", maxDate: "2026-11-30T23:59:00Z", minuteStep: 15 }));
    await flushDom();
    const input = harness.document.querySelector("input#dt");
    assert.equal(input.value, "2026-11-03T17:30");
    assert.equal(input.getAttribute("min"), "2026-11-01T00:00");
    assert.equal(input.getAttribute("max"), "2026-11-30T23:59");
    assert.equal(input.getAttribute("step"), "900");
  } finally {
    harness.restore();
  }
});

test("SgInputDateTime valida limite ao perder o foco e emite null ao limpar", async () => {
  const harness = setupDomHarness();
  try {
    const msgs = [];
    const values = [];
    await harness.render(mount({ timeZone: "UTC", maxDate: "2026-11-03T12:00:00Z", onValidation: (m) => msgs.push(m), onChange: (v) => values.push(v) }));
    await flushDom();
    const input = harness.document.querySelector("input#dt");
    await dispatchInput(input, "2026-11-03T13:00");
    input.dispatchEvent(new harness.window.FocusEvent("focusout", { bubbles: true }));
    const { act } = await import("react");
    await act(async () => { input.blur(); });
    await flushDom();
    assert.ok(msgs.some((m) => typeof m === "string" && m.length > 0), "mensagem de maximo esperada");
    await dispatchInput(input, "");
    await flushDom();
    assert.equal(values.at(-1), null);
  } finally {
    harness.restore();
  }
});

test("SgInputDateTime controlado: digitar por cima (parcial) nao volta ao value do pai", async () => {
  const harness = setupDomHarness();
  try {
    const calls = [];
    await harness.render(mount({ timeZone: "UTC", value: "2026-11-03T17:30:00Z", onChange: (v) => calls.push(v) }));
    await flushDom();
    const input = harness.document.querySelector("input#dt");
    assert.equal(input.value, "2026-11-03T17:30");
    // segmento apagado: o navegador entrega "" com badInput e o pai ignora o null (mantem o value)
    Object.defineProperty(input, "validity", { configurable: true, value: { badInput: true } });
    await dispatchInput(input, "");
    await flushDom();
    assert.equal(calls.at(-1), null);
    assert.equal(input.value, "", "o campo parcial nao pode voltar ao value do pai");
  } finally {
    harness.restore();
  }
});

test("SgInputDateTime controlado: limpar de verdade (sem badInput) segue o value do pai", async () => {
  const harness = setupDomHarness();
  try {
    await harness.render(mount({ timeZone: "UTC", value: "2026-11-03T17:30:00Z" }));
    await flushDom();
    const input = harness.document.querySelector("input#dt");
    await dispatchInput(input, "");
    await flushDom();
    assert.equal(input.value, "2026-11-03T17:30", "o pai manda: sem parcial, o React restaura o value");
  } finally {
    harness.restore();
  }
});
