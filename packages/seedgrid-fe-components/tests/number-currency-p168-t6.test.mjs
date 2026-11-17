// P168.F1.T6: Number/Currency. (1) Ctrl+A e digitar substitui o valor; Backspace com tudo selecionado apaga tudo.
// (2) Currency em pt-BR mostra "0,00" (virgula) no valor inicial vindo do formulario. (3) required/requiredMessage saem da API.
import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import React from "react";
import { useForm } from "react-hook-form";
import { setupDomHarness, flushDom, dispatchKeyboard, dispatchFocus, dispatchBlur } from "./dom-harness.mjs";

const require = createRequire(import.meta.url);
const Module = require("node:module");
const originalLoad = Module._load;
Module._load = function patchedLoad(request, parent, isMain) {
  if (request === "@tiptap/extension-text-style") {
    return { extend() { return { configure() { return this; } }; } };
  }
  return originalLoad.call(this, request, parent, isMain);
};
const { SgInputNumber, SgInputCurrency, SgComponentsI18nProvider } = require("../dist/sandbox.cjs");
Module._load = originalLoad;

const h = React.createElement;

async function keyDown(_harness, el, key) {
  // O harness usa o caminho antigo de eventos do React: sincroniza o rastreador de valor antes da tecla.
  el._valueTracker?.setValue?.(el.value);
  await dispatchKeyboard(el, "keydown", { key });
  await flushDom();
}

async function selectAll(el) {
  await dispatchFocus(el);
  el.setSelectionRange(0, el.value.length);
}

for (const [name, Comp, extra] of [
  ["SgInputNumber", SgInputNumber, { decimals: 2 }],
  ["SgInputCurrency", SgInputCurrency, { currency: "BRL", locale: "pt-BR", showCurrencySymbol: false }]
]) {
  test(`${name}: Ctrl+A e digitar um digito substitui o valor`, async () => {
    const harness = setupDomHarness();
    try {
      await harness.render(h(Comp, { id: "f", label: "V", ...extra }));
      await flushDom();
      const el = harness.document.querySelector("input#f");
      await dispatchFocus(el);
      for (const k of ["1", "2", "3"]) await keyDown(harness, el, k);
      assert.equal(el.value.replace(/\D/g, ""), "12300", `valor antes: ${el.value}`);
      await selectAll(el);
      await keyDown(harness, el, "9");
      assert.equal(el.value.replace(/[^\d]/g, ""), "900", `valor apos Ctrl+A e 9: ${el.value}`);
    } finally {
      harness.restore();
    }
  });

  test(`${name}: Backspace com tudo selecionado apaga tudo`, async () => {
    const harness = setupDomHarness();
    try {
      await harness.render(h(Comp, { id: "f", label: "V", ...extra }));
      await flushDom();
      const el = harness.document.querySelector("input#f");
      await dispatchFocus(el);
      for (const k of ["1", "2", "3"]) await keyDown(harness, el, k);
      await selectAll(el);
      await keyDown(harness, el, "Backspace");
      assert.equal(el.value.replace(/[^\d]/g, ""), "000", `valor apos Ctrl+A e Backspace: ${el.value}`);
    } finally {
      harness.restore();
    }
  });
}

test("SgInputCurrency pt-BR: valor inicial do formulario aparece com virgula (0,00)", async () => {
  const harness = setupDomHarness();
  function Form() {
    const { register } = useForm({ defaultValues: { total: "0.00", outro: "1234.5" } });
    return h(
      SgComponentsI18nProvider,
      { locale: "pt-BR" },
      h(SgInputCurrency, { id: "a", label: "A", name: "total", register, currency: "BRL" }),
      h(SgInputCurrency, { id: "b", label: "B", name: "outro", register, currency: "BRL" })
    );
  }
  try {
    await harness.render(h(Form));
    await flushDom();
    await flushDom();
    const a = harness.document.querySelector("input#a");
    const b = harness.document.querySelector("input#b");
    assert.equal(a.value, "0,00");
    assert.equal(b.value, "1.234,50");
  } finally {
    harness.restore();
  }
});

test("SgInputNumber/SgInputCurrency: required e requiredMessage nao existem mais (sem erro de obrigatorio)", async () => {
  const harness = setupDomHarness();
  try {
    await harness.render(
      h(
        "div",
        null,
        h(SgInputNumber, { id: "n", label: "N", decimals: 2, required: true, requiredMessage: "x" }),
        h(SgInputCurrency, { id: "c", label: "C", currency: "BRL", required: true, requiredMessage: "x" })
      )
    );
    await flushDom();
    for (const id of ["n", "c"]) {
      const el = harness.document.querySelector(`input#${id}`);
      el.focus();
      el.blur();
      await flushDom();
    }
    assert.equal(harness.document.querySelector("[data-sg-error]"), null);
    assert.equal(harness.document.body.textContent.includes("*"), false);
  } finally {
    harness.restore();
  }
});

for (const [name, Comp, extra] of [
  ["SgInputNumber", SgInputNumber, { decimals: 2 }],
  ["SgInputCurrency", SgInputCurrency, { currency: "BRL" }]
]) {
  test(`${name}: minValue vale para o zero (campo vazio = 0 e abaixo do minimo gera erro)`, async () => {
    const harness = setupDomHarness();
    try {
      await harness.render(h(Comp, { id: "m", label: "M", minValue: 0.01, minValueMessage: "Informe um valor", ...extra }));
      await flushDom();
      const el = harness.document.querySelector("input#m");
      await dispatchFocus(el);
      await dispatchBlur(el);
      await flushDom();
      assert.equal(harness.document.querySelector("[data-sg-error]")?.textContent, "Informe um valor");
    } finally {
      harness.restore();
    }
  });

  test(`${name}: emptyValueIsNull com campo vazio nao dispara minValue`, async () => {
    const harness = setupDomHarness();
    try {
      await harness.render(h(Comp, { id: "m", label: "M", minValue: 1, emptyValueIsNull: true, ...extra }));
      await flushDom();
      const el = harness.document.querySelector("input#m");
      await dispatchFocus(el);
      await dispatchBlur(el);
      await flushDom();
      assert.equal(harness.document.querySelector("[data-sg-error]"), null);
    } finally {
      harness.restore();
    }
  });
}

// P168.F1.T7: a mensagem padrao de minValue/maxValue usa o separador decimal do idioma (pt-BR "0,01"; en-US "0.01").
for (const [name, Comp, extra] of [
  ["SgInputNumber", SgInputNumber, { decimals: 2 }],
  ["SgInputCurrency", SgInputCurrency, { currency: "BRL" }]
]) {
  for (const [locale, expected] of [["pt-BR", "0,01"], ["en-US", "0.01"]]) {
    test(`${name} ${locale}: mensagem padrao de minValue usa o separador do idioma`, async () => {
      const harness = setupDomHarness();
      try {
        await harness.render(
          h(SgComponentsI18nProvider, { locale }, h(Comp, { id: "f", label: "V", minValue: 0.01, ...extra, locale }))
        );
        await flushDom();
        const el = harness.document.querySelector("input#f");
        await dispatchFocus(el);
        await dispatchBlur(el);
        await flushDom();
        const text = harness.document.body.textContent ?? "";
        assert.ok(text.includes(expected), `esperava ${expected} em: ${text.slice(0, 200)}`);
        assert.ok(!(locale === "pt-BR" && text.includes("0.01")), "pt-BR nao pode usar ponto");
      } finally {
        harness.restore();
      }
    });
  }
}
