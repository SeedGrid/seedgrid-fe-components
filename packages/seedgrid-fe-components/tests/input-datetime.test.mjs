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

test("formatWallClock por idioma (mesma entrada e saida do teste Dart)", () => {
  const esperado = { "pt-BR": "05/11/2026 14:30", "pt-PT": "05/11/2026 14:30", "en-US": "11/5/2026 14:30", es: "5/11/2026 14:30", fr: "05/11/2026 14:30" };
  for (const [locale, out] of Object.entries(esperado)) assert.equal(L.formatWallClock("2026-11-05T14:30", locale), out, locale);
  assert.equal(L.formatWallClock("2026-11-05T14:30:09", "es", true), "5/11/2026 14:30:09");
  assert.equal(L.formatWallClock("2026-11-05T14:30", "xx-YY"), "05/11/2026 14:30");
});

test("formatLocalizedDate por idioma (mensagens do SgInputDate; mesma entrada e saida do teste Dart)", () => {
  const esperado = { "pt-BR": "05/11/2026", "pt-PT": "05/11/2026", "en-US": "11/5/2026", es: "5/11/2026", fr: "05/11/2026" };
  for (const [locale, out] of Object.entries(esperado)) assert.equal(L.formatLocalizedDate(2026, 11, 5, locale), out, locale);
  assert.equal(L.formatLocalizedDate(2026, 11, 5, "xx-YY"), "05/11/2026");
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

test("SgInputDateTime recalcula a mensagem de erro quando o idioma muda (sem nova validacao)", async () => {
  const { SgComponentsI18nProvider } = require("../dist/sandbox.cjs");
  const { act } = await import("react");
  const harness = setupDomHarness();
  try {
    const msgs = [];
    const tree = (locale) =>
      React.createElement(SgComponentsI18nProvider, { locale }, mount({ timeZone: "UTC", minDate: "2026-11-01T08:00:00Z", maxDate: "2026-11-30T18:00:00Z", onValidation: (m) => msgs.push(m) }));
    const { root } = await harness.render(tree("pt-BR"));
    await flushDom();
    const input = harness.document.querySelector("input#dt");
    await dispatchInput(input, "2026-12-01T10:00");
    await act(async () => { input.blur(); });
    await flushDom();
    assert.match(msgs.at(-1) ?? "", /^Data e hora devem estar entre 01\/11\/2026 08:00 e 30\/11\/2026 18:00\.$/);
    await act(async () => { root.render(tree("en-US")); });
    await flushDom();
    assert.equal(msgs.at(-1), "Date and time must be between 11/1/2026 08:00 and 11/30/2026 18:00.");
    await act(async () => { root.render(tree("fr")); });
    await flushDom();
    assert.match(msgs.at(-1) ?? "", /^La date et l.heure doivent .tre comprises entre 01\/11\/2026 08:00 et 30\/11\/2026 18:00\.$/);
    // sem erro, trocar o idioma nao cria mensagem
    await dispatchInput(input, "2026-11-10T10:00");
    await act(async () => { input.blur(); });
    await flushDom();
    assert.equal(msgs.at(-1), null);
    const n = msgs.length;
    await act(async () => { root.render(tree("es")); });
    await flushDom();
    assert.ok(msgs.slice(n).every((m) => m === null), "sem erro nao deve aparecer mensagem ao trocar o idioma");
  } finally {
    harness.restore();
  }
});
