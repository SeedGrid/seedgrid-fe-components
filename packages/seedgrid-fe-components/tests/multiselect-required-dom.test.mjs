// P168.F1.T2: campo `required` SEMPRE mostra a mensagem de obrigatorio (texto padrao do idioma ou `requiredMessage`),
// dentro e fora de formulario, no SgMultiSelect (dropdown) e no SgMultiSelectChips.
import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import React from "react";
import { useForm } from "react-hook-form";
import { setupDomHarness, flushDom, dispatchMouse, dispatchFocus, dispatchBlur } from "./dom-harness.mjs";

const require = createRequire(import.meta.url);
const Module = require("node:module");
const originalLoad = Module._load;
Module._load = function patchedLoad(request, parent, isMain) {
  if (request === "@tiptap/extension-text-style") {
    return { extend() { return { configure() { return this; } }; } };
  }
  return originalLoad.call(this, request, parent, isMain);
};
const { SgMultiSelect, SgMultiSelectChips } = require("../dist/sandbox.cjs");
Module._load = originalLoad;

const h = React.createElement;
const OPTS = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta" }
];

const errorText = (harness) => harness.document.querySelector("[data-sg-error]")?.textContent ?? null;

function Standalone({ Comp, id, props = {} }) {
  const [value, setValue] = React.useState([]);
  return h(Comp, { id, label: "Tags", options: OPTS, value, onChange: setValue, required: true, ...props });
}

for (const [name, Comp, id, focusSel] of [
  ["SgMultiSelect", SgMultiSelect, "ms-req", "input#ms-req"],
  ["SgMultiSelectChips", SgMultiSelectChips, "chips-req", '#chips-req[role="combobox"]']
]) {
  test(`${name}: required fora de formulario mostra a mensagem padrao ao sair sem selecao`, async () => {
    const harness = setupDomHarness();
    try {
      await harness.render(h(Standalone, { Comp, id }));
      await flushDom();
      assert.equal(errorText(harness), null);
      const el = harness.document.querySelector(focusSel);
      assert.ok(el);
      await dispatchFocus(el);
      await dispatchBlur(el);
      await flushDom();
      assert.equal(errorText(harness), "Required field.");
    } finally {
      harness.restore();
    }
  });

  test(`${name}: requiredMessage substitui o texto padrao fora de formulario`, async () => {
    const harness = setupDomHarness();
    try {
      await harness.render(h(Standalone, { Comp, id, props: { requiredMessage: "Escolha ao menos uma" } }));
      await flushDom();
      const el = harness.document.querySelector(focusSel);
      await dispatchFocus(el);
      await dispatchBlur(el);
      await flushDom();
      assert.equal(errorText(harness), "Escolha ao menos uma");
    } finally {
      harness.restore();
    }
  });

  test(`${name}: required em formulario (control) mostra a mensagem e requiredMessage vale`, async () => {
    const harness = setupDomHarness();
    let api;
    function Form() {
      api = useForm({ defaultValues: { tags: [] } });
      return h(Comp, { id, label: "Tags", options: OPTS, name: "tags", control: api.control, required: true, requiredMessage: "Do formulario" });
    }
    try {
      await harness.render(h(Form));
      await flushDom();
      await api.trigger();
      await flushDom();
      assert.equal(errorText(harness), "Do formulario");
    } finally {
      harness.restore();
    }
  });
}

void dispatchMouse;
