// P155.F3.T13: campos com mascara + RHF `register` (nao so `control`): setValue por codigo atualiza o input, o watch e o form.
// reset() com register NAO e coberto: o RHF so reescreve o DOM de campos registrados via <form>.reset() (limite do RHF, igual ao SgInputText).
import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import React from "react";
import { act } from "react";
import { useForm } from "react-hook-form";
import { setupDomHarness, flushDom, dispatchInput } from "./dom-harness.mjs";

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
const S = require("../dist/sandbox.cjs");
Module._load = originalLoad;

const h = React.createElement;
const OPTS = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta" },
  { value: "c", label: "Gamma" }
];

const visibleInputs = (c) => [...c.querySelectorAll("input")].filter((e) => !["hidden", "checkbox", "radio", "range"].includes(e.type));
const firstText = (c) => visibleInputs(c)[0]?.value;

async function mountReg(name, init) {
  const harness = setupDomHarness();
  const ref = {};
  function Host() {
    const form = useForm({ defaultValues: { f: init } });
    ref.form = form;
    const shown = String(form.watch("f") ?? "");
    return h("div", null, h(S[name], { id: "f", name: "f", label: "L", register: form.register }), h("p", { "data-watch": true }, shown));
  }
  const { container } = await harness.render(h(Host));
  await flushDom();
  return { harness, container, form: () => ref.form };
}

const CASES = [
  ["SgInputPhone", S.maskPhone, "11987654321", "21912345678"],
  ["SgInputPostalCode", S.maskPostalCodeBR, "01310100", "20040020"],
  ["SgInputCPF", S.maskCpf, "52998224725", "11144477735"],
  ["SgInputCNPJ", S.maskCnpj, "11222333000181", "11444777000161"],
  ["SgInputCPFCNPJ", S.maskCpfCnpj, "52998224725", "11222333000181"]
];
for (const [name, mask, rawInit, rawNext] of CASES) {
  test(`${name} + register: setValue por codigo atualiza o input, o watch e o form (mascarados)`, async () => {
    const m = await mountReg(name, rawInit);
    try {
      assert.equal(firstText(m.container), mask(rawInit), "inicial");
      await act(async () => {
        m.form().setValue("f", rawNext);
      });
      await flushDom();
      assert.equal(m.form().getValues("f"), mask(rawNext), "form mascarado");
      assert.equal(firstText(m.container), mask(rawNext), "input mascarado apos setValue");
      assert.equal(m.container.querySelector("[data-watch]").textContent, mask(rawNext), "watch mascarado");
    } finally {
      m.harness.restore();
    }
  });
}
