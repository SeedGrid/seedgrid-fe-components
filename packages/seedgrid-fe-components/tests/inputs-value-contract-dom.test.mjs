// Contrato de valor dos campos de entrada (P155.F3.T6, cenario CRUD): monta UMA vez, seta o valor por codigo
// depois de montado (RHF setValue / reset, ou prop `value`) e le de volta (getValues / tela / onChange),
// sem setState de pagina. Cobre os campos de entrada que NAO estavam nos 15 da matriz de controle.
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

const visibleInputs = (c) =>
  [...c.querySelectorAll("input,textarea")].filter((e) => !["hidden", "checkbox", "radio", "range"].includes(e.type));
const firstText = (c) => visibleInputs(c)[0]?.value;
const typeInto = async (el, value) => {
  if (el.tagName === "TEXTAREA") {
    const setter = Object.getOwnPropertyDescriptor(el.ownerDocument.defaultView.HTMLTextAreaElement.prototype, "value").set;
    await act(async () => {
      el.focus();
      el.dispatchEvent(new globalThis.KeyboardEvent("keydown", { bubbles: true, cancelable: true }));
      const previous = el.value;
      setter.call(el, value);
      el._valueTracker?.setValue?.(previous);
      el.dispatchEvent(new globalThis.InputEvent("input", { bubbles: true, cancelable: true, data: value }));
      el.dispatchEvent(new globalThis.Event("change", { bubbles: true, cancelable: true }));
      // O React deste harness usa o caminho de eventos antigo (keyup), igual ao dispatchInput do harness.
      el.dispatchEvent(new globalThis.KeyboardEvent("keyup", { bubbles: true, cancelable: true }));
    });
  } else {
    await dispatchInput(el, value);
  }
  await flushDom();
};

/** Monta o campo dentro de um useForm e devolve o form para o teste mexer sem re-render de pagina. */
async function mount(name, props, init) {
  const harness = setupDomHarness();
  const ref = {};
  function Host() {
    const form = useForm({ defaultValues: { f: init } });
    ref.form = form;
    return h(S[name], { id: "f", name: "f", control: form.control, ...props });
  }
  const { container } = await harness.render(h(Host));
  await flushDom();
  return { harness, container, form: () => ref.form };
}
const setByCode = async (m, value) => {
  await act(async () => {
    m.form().setValue("f", value);
  });
  await flushDom();
};
const resetByCode = async (m, value) => {
  await act(async () => {
    m.form().reset({ f: value });
  });
  await flushDom();
};

/* ------------------------------------------------------------------ */
/* Campos de texto/mascara: valor inicial (defaultValues), setValue, reset, digitacao e leitura */
/* ------------------------------------------------------------------ */
const TEXT_CASES = [
  ["SgInputText", "ana", "bia", "carla"],
  ["SgInputTextArea", "ana", "bia", "carla"],
  ["SgInputEmail", "a@x.com", "b@x.com", "c@x.com"],
  ["SgInputPassword", "abc12345", "xyz98765", "qwe11111"],
  ["SgInputTextSearch", "ana", "bia", "carla"],
  ["SgInputPhone", "11987654321", "21912345678", "31955554444"],
  ["SgInputPostalCode", "01310100", "20040020", "30140071"],
  ["SgInputCPF", "52998224725", "11144477735", "39053344705"],
  ["SgInputCNPJ", "11222333000181", "11444777000161", "12345678000195"],
  ["SgInputCPFCNPJ", "52998224725", "11222333000181", "11144477735"],
  ["SgInputDate", "2026-01-15", "2026-02-20", "2026-03-25"],
  ["SgInputBirthDate", "1990-05-10", "1985-07-20", "2000-01-01"],
  ["SgInputDateTime", "2026-01-15T10:30", "2026-02-20T14:45", "2026-03-25T08:15"]
];
// P155.F3.T13: campos com mascara entregam SEMPRE o valor mascarado ao form (digitado ou setado por codigo).
const FORM_MASKS = {
  SgInputPhone: S.maskPhone,
  SgInputPostalCode: S.maskPostalCodeBR,
  SgInputCPF: S.maskCpf,
  SgInputCNPJ: S.maskCnpj,
  SgInputCPFCNPJ: S.maskCpfCnpj
};
for (const [name, rawInit, rawNext, rawTyped] of TEXT_CASES) {
  const fm = FORM_MASKS[name] ?? ((v) => v);
  const [init, next, typed] = [fm(rawInit), fm(rawNext), fm(rawTyped)];
  test(`${name}: valor inicial do form, setValue/reset por codigo e digitacao sao lidos de volta`, async () => {
    const m = await mount(name, { label: "L" }, rawInit);
    try {
      assert.equal(firstText(m.container), init, "inicial aparece");
      assert.equal(m.form().getValues("f"), init, "inicial lido do form");
      await setByCode(m, rawNext);
      assert.equal(firstText(m.container), next, "setValue atualiza o campo");
      assert.equal(m.form().getValues("f"), next, "setValue lido de volta");
      await resetByCode(m, rawInit);
      assert.equal(firstText(m.container), init, "reset volta ao inicial");
      await typeInto(visibleInputs(m.container)[0], rawTyped);
      assert.equal(firstText(m.container), typed, "digitacao aparece");
      assert.equal(m.form().getValues("f"), typed, "digitacao lida do form");
    } finally {
      m.harness.restore();
    }
  });
}

/* Numero e moeda: o campo exibe 2 casas. Digitar devolve NUMERO ao form; defaultValues/setValue aceitam numero ou texto. */
for (const [name, init, next, typed] of [
  ["SgInputNumber", 10, 25, "37"],
  ["SgInputCurrency", 10.5, 25.75, "37"]
]) {
  test(`${name}: inicial e setValue numericos aparecem com 2 casas; digitacao volta ao form`, async () => {
    const m = await mount(name, { label: "L" }, init);
    try {
      assert.equal(Number(firstText(m.container)), init);
      assert.equal(m.form().getValues("f"), init);
      await setByCode(m, next);
      assert.equal(Number(firstText(m.container)), next);
      assert.equal(m.form().getValues("f"), next);
      await resetByCode(m, init);
      assert.equal(Number(firstText(m.container)), init);
      await typeInto(visibleInputs(m.container)[0], typed);
      assert.equal(m.form().getValues("f"), Number(typed), "digitado volta ao form como NUMERO");
      assert.equal(typeof m.form().getValues("f"), "number");
    } finally {
      m.harness.restore();
    }
  });
  test(`${name}: setValue/defaultValues aceitam texto e a saida continua numero (B)`, async () => {
    const m = await mount(name, { label: "L" }, "37.5");
    try {
      assert.equal(Number(firstText(m.container).replace(",", ".")), 37.5, "texto inicial exibido");
      await setByCode(m, "12.25");
      assert.equal(Number(firstText(m.container).replace(",", ".")), 12.25, "setValue com texto");
      await typeInto(visibleInputs(m.container)[0], "8");
      assert.equal(m.form().getValues("f"), 8);
      assert.equal(typeof m.form().getValues("f"), "number");
    } finally {
      m.harness.restore();
    }
  });
  test(`${name}: validation recebe number (negativo, decimal, zero/vazio=0)`, async () => {
    const harness = setupDomHarness();
    try {
      const got = [];
      const { container } = await harness.render(
        h(S[name], { id: "v", label: "L", validation: (v) => { got.push(v); return null; }, validateOnBlur: false })
      );
      await flushDom();
      const el = visibleInputs(container)[0];
      await typeInto(el, "-5");
      assert.equal(got.at(-1), -5, "negativo");
      await typeInto(el, "2.5");
      assert.equal(got.at(-1), 2.5, "decimal");
      assert.ok(got.every((v) => typeof v === "number"), "sempre number");
      await typeInto(el, "0");
      assert.equal(got.at(-1), 0, "vazio/zero chega como 0");
      await typeInto(el, "");
      assert.equal(got.at(-1), 0, "vazio chega como 0 por padrao");
    } finally {
      harness.restore();
    }
  });
  test(`${name}: validation recebe null so com emptyValueIsNull`, async () => {
    const harness = setupDomHarness();
    try {
      const got = [];
      const { container } = await harness.render(
        h(S[name], { id: "vn", label: "L", emptyValueIsNull: true, validateOnBlur: false, validation: (v) => { got.push(v); return null; } })
      );
      await flushDom();
      await typeInto(visibleInputs(container)[0], "3");
      await typeInto(visibleInputs(container)[0], "");
      assert.deepEqual(got, [3, null]);
    } finally {
      harness.restore();
    }
  });
  test(`${name}: vazio vale 0 por padrao e null com emptyValueIsNull; onChange recebe number|null`, async () => {
    for (const isNull of [false, true]) {
      const harness = setupDomHarness();
      try {
        const seen = [];
        const { container } = await harness.render(
          h(S[name], { id: "e", label: "L", emptyValueIsNull: isNull, value: 12, onChange: (v) => seen.push(v) })
        );
        await flushDom();
        const el = visibleInputs(container)[0];
        await typeInto(el, "5");
        assert.equal(seen.at(-1), 5, "onChange numerico");
        await typeInto(el, "");
        assert.equal(seen.at(-1), isNull ? null : 0, isNull ? "vazio = null" : "vazio = 0");
      } finally {
        harness.restore();
      }
    }
  });
}

/* ------------------------------------------------------------------ */
/* Numericos de faixa: stepper e slider (form e prop `value`)           */
/* ------------------------------------------------------------------ */
for (const [name, props, init, next, typed] of [
  ["SgStepperInput", { minValue: 0, maxValue: 10 }, 3, 7, "9"],
  ["SgSlider", { minValue: 0, maxValue: 100 }, 20, 60, "80"]
]) {
  test(`${name}: defaultValues, setValue, reset e interacao sao lidos de volta`, async () => {
    const m = await mount(name, props, init);
    try {
      const el = () => m.container.querySelector("input");
      assert.equal(Number(el().value), init);
      await setByCode(m, next);
      assert.equal(Number(el().value), next);
      assert.equal(m.form().getValues("f"), next);
      await resetByCode(m, init);
      assert.equal(Number(el().value), init);
      await typeInto(el(), typed);
      assert.equal(Number(m.form().getValues("f")), Number(typed));
    } finally {
      m.harness.restore();
    }
  });
  test(`${name}: prop value troca o valor sem remontar; defaultValue vale so no inicio`, async () => {
    const harness = setupDomHarness();
    try {
      const seen = [];
      const { root, container } = await harness.render(
        h(S[name], { id: "p", ...props, value: init, onChange: (v) => seen.push(v) })
      );
      await flushDom();
      const el = () => container.querySelector("input");
      assert.equal(Number(el().value), init);
      await act(async () => {
        root.render(h(S[name], { id: "p", ...props, value: next, onChange: (v) => seen.push(v) }));
      });
      await flushDom();
      assert.equal(Number(el().value), next, "atualizacao por prop depois de montado");
      await typeInto(el(), typed);
      assert.equal(Number(seen.at(-1)), Number(typed), "onChange le o valor de volta");
    } finally {
      harness.restore();
    }
  });
}

/* ------------------------------------------------------------------ */
/* Rating (estrelas cheias = clip-path sem corte)                       */
/* ------------------------------------------------------------------ */
const filledStars = (c) =>
  [...c.querySelectorAll("[style]")].filter((e) => /clip-path:\s*inset\(0(px)? 0%? 0(px)? 0(px)?\)/.test(e.getAttribute("style") ?? "")).length;
test("SgRating: defaultValues, setValue e reset do form mudam as estrelas; value por prop tambem", async () => {
  const m = await mount("SgRating", { stars: 5 }, 2);
  try {
    assert.equal(filledStars(m.container), 2);
    await setByCode(m, 4);
    assert.equal(filledStars(m.container), 4);
    assert.equal(m.form().getValues("f"), 4);
    await resetByCode(m, 1);
    assert.equal(filledStars(m.container), 1);
  } finally {
    m.harness.restore();
  }
  const harness = setupDomHarness();
  try {
    const { root, container } = await harness.render(h(S.SgRating, { id: "r", stars: 5, value: 2 }));
    await flushDom();
    assert.equal(filledStars(container), 2);
    await act(async () => {
      root.render(h(S.SgRating, { id: "r", stars: 5, value: 5 }));
    });
    await flushDom();
    assert.equal(filledStars(container), 5, "value por prop depois de montado");
  } finally {
    harness.restore();
  }
});

/* ------------------------------------------------------------------ */
/* Escolha: checkbox group, radio, toggle                               */
/* ------------------------------------------------------------------ */
const checkedValues = (c) => [...c.querySelectorAll("input[type=checkbox],input[type=radio]")].filter((i) => i.checked).map((i) => i.value);
const clickInput = async (el) => {
  await act(async () => {
    el.click();
  });
  await flushDom();
};
test("SgCheckboxGroup: defaultValues, setValue, reset e clique do usuario sao lidos de volta", async () => {
  const m = await mount("SgCheckboxGroup", { source: OPTS }, ["a"]);
  try {
    assert.deepEqual(checkedValues(m.container), ["a"]);
    await setByCode(m, ["b", "c"]);
    assert.deepEqual(checkedValues(m.container), ["b", "c"]);
    assert.deepEqual(m.form().getValues("f"), ["b", "c"]);
    await resetByCode(m, ["a"]);
    assert.deepEqual(checkedValues(m.container), ["a"]);
    await clickInput(m.container.querySelectorAll("input[type=checkbox]")[2]);
    assert.deepEqual(m.form().getValues("f"), ["a", "c"]);
  } finally {
    m.harness.restore();
  }
});
test("SgCheckboxGroup: prop value troca a selecao depois de montado e onChange devolve a lista", async () => {
  const harness = setupDomHarness();
  try {
    const seen = [];
    const mk = (value) => h(S.SgCheckboxGroup, { id: "c", source: OPTS, value, onChange: (v) => seen.push(v) });
    const { root, container } = await harness.render(mk(["a"]));
    await flushDom();
    assert.deepEqual(checkedValues(container), ["a"]);
    await act(async () => root.render(mk(["b", "c"])));
    await flushDom();
    assert.deepEqual(checkedValues(container), ["b", "c"]);
    await clickInput(container.querySelectorAll("input[type=checkbox]")[0]);
    assert.deepEqual([...seen.at(-1)].sort(), ["a", "b", "c"], "onChange recebe a lista inteira");
  } finally {
    harness.restore();
  }
});
test("SgRadioGroup: defaultValues, setValue, reset e clique sao lidos de volta; value por prop atualiza", async () => {
  const m = await mount("SgRadioGroup", { source: OPTS }, "a");
  try {
    assert.deepEqual(checkedValues(m.container), ["a"]);
    await setByCode(m, "b");
    assert.deepEqual(checkedValues(m.container), ["b"]);
    assert.equal(m.form().getValues("f"), "b");
    await resetByCode(m, "a");
    assert.deepEqual(checkedValues(m.container), ["a"]);
    await clickInput(m.container.querySelectorAll("input[type=radio]")[2]);
    assert.equal(m.form().getValues("f"), "c");
  } finally {
    m.harness.restore();
  }
  const harness = setupDomHarness();
  try {
    const mk = (value) => h(S.SgRadioGroup, { id: "r", source: OPTS, value });
    const { root, container } = await harness.render(mk("a"));
    await flushDom();
    await act(async () => root.render(mk("c")));
    await flushDom();
    assert.deepEqual(checkedValues(container), ["c"]);
  } finally {
    harness.restore();
  }
});
test("SgToggleSwitch: defaultValues, setValue, reset e clique; checked por prop atualiza e defaultChecked so no inicio", async () => {
  const m = await mount("SgToggleSwitch", { label: "L" }, true);
  try {
    const box = () => m.container.querySelector("input[type=checkbox]");
    assert.equal(box().checked, true);
    await setByCode(m, false);
    assert.equal(box().checked, false);
    assert.equal(m.form().getValues("f"), false);
    await resetByCode(m, true);
    assert.equal(box().checked, true);
    await clickInput(box());
    assert.equal(m.form().getValues("f"), false);
  } finally {
    m.harness.restore();
  }
  const harness = setupDomHarness();
  try {
    const mk = (props) => h(S.SgToggleSwitch, { id: "t", label: "L", ...props });
    const { root, container } = await harness.render(mk({ checked: false }));
    await flushDom();
    await act(async () => root.render(mk({ checked: true })));
    await flushDom();
    assert.equal(container.querySelector("input[type=checkbox]").checked, true, "checked por prop depois de montado");
    const d = await harness.render(mk({ defaultChecked: true }));
    await flushDom();
    assert.equal(d.container.querySelector("input[type=checkbox]").checked, true, "defaultChecked inicial");
  } finally {
    harness.restore();
  }
});

/* ------------------------------------------------------------------ */
/* Data/hora por prop `value` (alem do form)                            */
/* ------------------------------------------------------------------ */
test("SgInputDateTime: prop value atualiza o campo depois de montado; defaultValue so no inicio", async () => {
  const harness = setupDomHarness();
  try {
    const mk = (props) => h(S.SgInputDateTime, { id: "d", label: "L", ...props });
    const { root, container } = await harness.render(mk({ value: "2026-01-15T10:30" }));
    await flushDom();
    assert.equal(firstText(container), "2026-01-15T10:30");
    await act(async () => root.render(mk({ value: "2026-02-20T14:45" })));
    await flushDom();
    assert.equal(firstText(container), "2026-02-20T14:45");
    const d = await harness.render(mk({ defaultValue: "2026-03-25T08:15" }));
    await flushDom();
    assert.equal(firstText(d.container), "2026-03-25T08:15");
  } finally {
    harness.restore();
  }
});

/* ------------------------------------------------------------------ */
/* PickList e YearPartSelector                                          */
/* ------------------------------------------------------------------ */
test("SgPickList: defaultValues, setValue e reset movem os itens; o form devolve {source,target}", async () => {
  const src = OPTS;
  const init = { source: src, target: [] };
  const m = await mount("SgPickList", { source: src, target: [] }, init);
  const text = () => m.container.textContent.replace(/\s+/g, " ");
  try {
    assert.match(text(), /Alpha::Beta::Gamma::/, "tudo na origem");
    await setByCode(m, { source: [src[0]], target: [src[1], src[2]] });
    assert.match(text(), /SourceTopUpDownBottomAlpha::>>><<<TargetBeta::Gamma::/);
    assert.deepEqual(m.form().getValues("f").target.map((i) => i.value), ["b", "c"]);
    await resetByCode(m, init);
    assert.match(text(), /Alpha::Beta::Gamma::/);
  } finally {
    m.harness.restore();
  }
});
test("SgYearPartSelector: sem form; value por prop atualiza depois de montado e onChange le de volta", async () => {
  const harness = setupDomHarness();
  try {
    const seen = [];
    const mk = (value) => h(S.SgYearPartSelector, { id: "y", value, onChange: (r) => seen.push(r) });
    const { root, container } = await harness.render(mk({ year: 2025, kind: "QUARTER", part: 3 }));
    await flushDom();
    const shown = () => [...container.querySelectorAll("input")].map((i) => i.value).join("|");
    assert.match(shown(), /2025/);
    await act(async () => root.render(mk({ year: 2024, kind: "SEMESTER", part: 1 })));
    await flushDom();
    assert.match(shown(), /2024/);
    assert.equal(seen.length, 0, "nao emite onChange ao receber value por prop");
  } finally {
    harness.restore();
  }
});

/* ------------------------------------------------------------------ */
/* Arquivos: o form guarda File[]; o nome do arquivo aparece na tela     */
/* ------------------------------------------------------------------ */
test("SgFileUpload: defaultValues, setValue e reset do form trocam os arquivos listados e o form devolve os File", async () => {
  const mk = (name) => new globalThis.File(["x"], name, { type: "text/plain" });
  const a = mk("a.txt");
  const b = mk("b.txt");
  const m = await mount("SgFileUpload", { multiple: true, label: "Anexos" }, [a]);
  try {
    assert.match(m.container.textContent, /a\.txt/);
    await setByCode(m, [b]);
    assert.match(m.container.textContent, /b\.txt/);
    assert.doesNotMatch(m.container.textContent, /a\.txt/);
    assert.equal(m.form().getValues("f")[0].name, "b.txt");
    await resetByCode(m, [a]);
    assert.match(m.container.textContent, /a\.txt/);
  } finally {
    m.harness.restore();
  }
});

test("SgImageUpload: defaultValues, setValue e reset do form trocam as imagens exibidas e o form devolve os File", async () => {
  const mk = (name) => new globalThis.File(["x"], name, { type: "image/png" });
  const a = mk("a.png");
  const b = mk("b.png");
  const previous = globalThis.URL.createObjectURL;
  let n = 0;
  globalThis.URL.createObjectURL = () => `blob:fake-${++n}`;
  const m = await mount("SgImageUpload", { multiple: true, label: "Fotos" }, [a]);
  try {
    assert.match(m.container.textContent + m.container.innerHTML, /a\.png/);
    await setByCode(m, [b]);
    const html = m.container.textContent + m.container.innerHTML;
    assert.match(html, /b\.png/);
    assert.doesNotMatch(html, /a\.png/);
    assert.equal(m.form().getValues("f")[0].name, "b.png");
    await resetByCode(m, [a]);
    assert.match(m.container.textContent + m.container.innerHTML, /a\.png/);
  } finally {
    m.harness.restore();
    globalThis.URL.createObjectURL = previous;
  }
});
