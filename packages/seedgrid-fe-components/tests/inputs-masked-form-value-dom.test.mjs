// P155.F3.T13: campos com mascara (CPF, CNPJ, CPF/CNPJ, telefone, CEP) entregam SEMPRE o valor mascarado,
// em qualquer caminho: standalone (onChange), control e register — digitado ou setado por codigo
// (defaultValues / setValue / reset), aceitando entrada crua ou ja mascarada.
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
  if (request === "@tiptap/extension-text-style") return { extend: () => ({ configure() { return this; } }) };
  return originalLoad.call(this, request, parent, isMain);
};
const S = require("../dist/sandbox.cjs");
Module._load = originalLoad;
const h = React.createElement;

const CASES = [
  ["SgInputCPF", S.maskCpf, "52998224725", "11144477735", "39053344705"],
  ["SgInputCNPJ", S.maskCnpj, "11222333000181", "11444777000161", "12345678000195"],
  ["SgInputCPFCNPJ", S.maskCpfCnpj, "52998224725", "11222333000181", "11144477735"],
  ["SgInputPhone", S.maskPhone, "11987654321", "21912345678", "31955554444"],
  ["SgInputPostalCode", S.maskPostalCodeBR, "01310100", "20040020", "30140071"]
];
const input = (c) => c.querySelector("input:not([type=hidden])");

async function mountForm(name, mode, init) {
  const harness = setupDomHarness();
  const ref = {};
  function Host() {
    const form = useForm({ defaultValues: { f: init } });
    ref.form = form;
    const bind = mode === "control" ? { control: form.control } : { register: form.register };
    return h(S[name], { id: "f", name: "f", label: "L", ...bind });
  }
  const { container } = await harness.render(h(Host));
  await flushDom();
  return { harness, container, form: () => ref.form };
}

for (const [name, mask, a, b, c] of CASES) {
  for (const mode of ["control", "register"]) {
    test(`${name} (${mode}): form e tela sempre mascarados (inicial, setValue, reset, digitado, entrada ja mascarada)`, async () => {
      const m = await mountForm(name, mode, a);
      try {
        assert.equal(input(m.container).value, mask(a), "inicial na tela");
        assert.equal(m.form().getValues("f"), mask(a), "inicial no form");
        await act(async () => m.form().setValue("f", b));
        await flushDom();
        assert.equal(input(m.container).value, mask(b), "setValue na tela");
        assert.equal(m.form().getValues("f"), mask(b), "setValue no form");
        await act(async () => m.form().setValue("f", mask(c)));
        await flushDom();
        assert.equal(m.form().getValues("f"), mask(c), "setValue ja mascarado");
        if (mode === "control") {
          // register: o reset do RHF nao toca o DOM de campos nao controlados (limite do react-hook-form).
          await act(async () => m.form().reset({ f: a }));
          await flushDom();
          assert.equal(m.form().getValues("f"), mask(a), "reset no form");
        }
        await dispatchInput(input(m.container), c);
        await flushDom();
        assert.equal(input(m.container).value, mask(c), "digitado na tela");
        assert.equal(m.form().getValues("f"), mask(c), "digitado no form");
      } finally {
        m.harness.restore();
      }
    });
  }

  test(`${name} (standalone): digitado entrega mascarado no onChange e value cru aparece mascarado`, async () => {
    const harness = setupDomHarness();
    try {
      const seen = [];
      const { container } = await harness.render(
        h(S[name], { id: "f", label: "L", inputProps: { defaultValue: a, onChange: (e) => seen.push(e.target.value) } })
      );
      await flushDom();
      assert.equal(input(container).value, mask(a), "defaultValue cru mascarado");
      await dispatchInput(input(container), c);
      await flushDom();
      assert.equal(seen.at(-1), mask(c), "onChange mascarado");
    } finally {
      harness.restore();
    }
  });
}

for (const mode of ["control", "register"]) {
  test(`SgInputPhone (${mode}): valor externo com DDI (+55) vira o numero mascarado, sem cortar digitos`, async () => {
    const m = await mountForm("SgInputPhone", mode, "+5511987654321");
    try {
      assert.equal(input(m.container).value, "(11) 98765-4321");
      assert.equal(m.form().getValues("f"), "(11) 98765-4321");
    } finally {
      m.harness.restore();
    }
  });
  for (const [comp, raw, expected] of [
    ["SgInputCPF", "529982247251234", "529.982.247-25"],
    ["SgInputCNPJ", "112223330001819999", "11.222.333/0001-81"],
    ["SgInputPostalCode", "045381329999", "04538-132"]
  ]) {
    test(`${comp} (${mode}): valor externo maior que a mascara e cortado na mascara (defaultValue e setValue)`, async () => {
      const m = await mountForm(comp, mode, raw);
      try {
        assert.equal(input(m.container).value, expected, "campo (defaultValue)");
        assert.equal(m.form().getValues("f"), expected, "form (defaultValue)");
        await act(async () => m.form().setValue("f", ""));
        await flushDom();
        await act(async () => m.form().setValue("f", raw));
        await flushDom();
        assert.equal(input(m.container).value, expected, "campo (setValue)");
        assert.equal(m.form().getValues("f"), expected, "form (setValue)");
      } finally {
        m.harness.restore();
      }
    });
  }
}

for (const mode of ["control", "register"]) {
  test(`SgInputPhone (${mode}): colar numero com DDI (+55) tira o 55 no campo e no form`, async () => {
    const m = await mountForm("SgInputPhone", mode, "");
    try {
      for (const pasted of ["+5511987654321", "5511987654321", "+55 (11) 98765-4321"]) {
        await act(async () => m.form().setValue("f", ""));
        await flushDom();
        await dispatchInput(input(m.container), "");
        await flushDom();
        await dispatchInput(input(m.container), pasted);
        await flushDom();
        assert.equal(input(m.container).value, "(11) 98765-4321", `campo: ${pasted}`);
        assert.equal(m.form().getValues("f"), "(11) 98765-4321", `form: ${pasted}`);
      }
    } finally {
      m.harness.restore();
    }
  });
}
test("SgInputPhone (standalone): colar numero com DDI (+55) tira o 55", async () => {
  const harness = setupDomHarness();
  try {
    const seen = [];
    const { container } = await harness.render(
      h(S.SgInputPhone, { id: "f", label: "L", inputProps: { onChange: (e) => seen.push(e.target.value) } })
    );
    await flushDom();
    await dispatchInput(input(container), "+5511987654321");
    await flushDom();
    assert.equal(seen.at(-1), "(11) 98765-4321");
  } finally {
    harness.restore();
  }
});
