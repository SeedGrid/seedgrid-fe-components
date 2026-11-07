// P153.F3.T1: `enabled` no nivel do componente em SgDatatable, SgWizard e SgCalendar.
// Com enabled=false nada muda por interacao (clique, teclado); com enabled (padrao) tudo funciona.
import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import React from "react";
import { act } from "react";
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
const { SgDatatable, SgWizard, SgWizardPage, SgCalendar } = require("../dist/sandbox.cjs");
Module._load = originalLoad;

const click = async (el) => {
  await act(async () => {
    el.dispatchEvent(new globalThis.window.MouseEvent("click", { bubbles: true, cancelable: true }));
  });
  await flushDom();
};
const key = async (el, k) => {
  await act(async () => {
    el.dispatchEvent(new globalThis.window.KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true }));
  });
  await flushDom();
};
const type = async (input, value) => {
  await act(async () => {
    const setter = Object.getOwnPropertyDescriptor(globalThis.window.HTMLInputElement.prototype, "value").set;
    setter.call(input, value);
    input.dispatchEvent(new globalThis.window.Event("input", { bubbles: true }));
  });
  await flushDom();
};

const byLabel = (container, re) => [...container.querySelectorAll("button[aria-label]")].find((b) => re.test(b.getAttribute("aria-label")));
const NEXT_RE = /next|pr[oó]xim/i;

const ROWS = Array.from({ length: 12 }, (_, i) => ({ id: i + 1, name: `Nome ${String(12 - i).padStart(2, "0")}` }));

function table(extra, spies) {
  return React.createElement(SgDatatable, {
    id: "dt-enabled",
    columns: [
      { field: "id", header: "ID", sortable: true },
      { field: "name", header: "Nome", sortable: true, filter: true }
    ],
    dataKey: "id",
    value: ROWS,
    paginator: true,
    rows: 5,
    selectionMode: "single",
    showGlobalFilter: true,
    showColumnFilters: true,
    onSort: spies.onSort,
    onSelectionChange: spies.onSelection,
    onFilter: spies.onFilter,
    ...extra
  });
}

test("SgDatatable enabled=false: nao ordena, nao seleciona, nao filtra; pagina continua", async () => {
  const h = setupDomHarness();
  try {
    const calls = { sort: 0, sel: 0, filter: 0 };
    const spies = { onSort: () => calls.sort++, onSelection: () => calls.sel++, onFilter: () => calls.filter++ };
    const { container } = await h.render(table({ enabled: false }, spies));
    await flushDom();

    assert.ok(container.querySelector("[aria-disabled='true']"), "raiz com aria-disabled");

    const sortBtn = [...container.querySelectorAll("thead button")].find((b) => b.textContent.includes("ID"));
    assert.ok(sortBtn.disabled, "botao de ordenar desabilitado");
    await click(sortBtn);
    await key(sortBtn, "Enter");
    assert.equal(calls.sort, 0);

    await click(container.querySelector("tbody tr"));
    assert.equal(calls.sel, 0);
    assert.equal(container.querySelector("tbody tr[aria-selected='true']"), null);

    for (const input of container.querySelectorAll("input")) assert.ok(input.disabled, "campo de filtro desabilitado");
    const firstName = container.querySelector("tbody tr td:nth-child(2)").textContent;
    await type(container.querySelector("input"), "zzz");
    assert.equal(container.querySelector("tbody tr td:nth-child(2)").textContent, firstName);
    assert.equal(calls.filter, 0);

    const next = byLabel(container, /next page|pr[oó]xima p/i);
    assert.ok(next && !next.disabled, "botao de proxima pagina habilitado");
    await click(next);
    assert.equal(container.querySelector("tbody tr td:nth-child(1)").textContent, "6");
  } finally {
    h.restore();
  }
});

test("SgDatatable enabled (padrao): ordena e seleciona", async () => {
  const h = setupDomHarness();
  try {
    const calls = { sort: 0, sel: 0, filter: 0 };
    const spies = { onSort: () => calls.sort++, onSelection: () => calls.sel++, onFilter: () => calls.filter++ };
    const { container } = await h.render(table({}, spies));
    await flushDom();
    assert.equal(container.querySelector("[aria-disabled='true']"), null);
    const sortBtn = [...container.querySelectorAll("thead button")].find((b) => b.textContent.includes("ID"));
    await click(sortBtn);
    assert.equal(calls.sort, 1);
    await click(container.querySelector("tbody tr"));
    assert.equal(calls.sel, 1);
  } finally {
    h.restore();
  }
});

function wizard(extra, spies) {
  const page = (title, body) => React.createElement(SgWizardPage, { title }, React.createElement("div", null, body));
  return React.createElement(
    SgWizard,
    { stepper: "numbered", stepNavigation: "free", initialStep: 1, onFinish: spies.onFinish, onStepChange: spies.onStep, ...extra },
    page("Um", "A"), page("Dois", "B"), page("Tres", "C")
  );
}

test("SgWizard enabled=false: Anterior, Proximo, Concluir e passos nao respondem", async () => {
  const h = setupDomHarness();
  try {
    const steps = [];
    let finished = 0;
    const spies = { onFinish: () => finished++, onStep: (i) => steps.push(i) };
    const { container } = await h.render(wizard({ enabled: false }, spies));
    await flushDom();
    assert.ok(container.querySelector("[aria-disabled='true']"));
    assert.equal(container.querySelectorAll("button[data-sg-wizard-step]").length, 0, "passos nao clicaveis");
    const buttons = [...container.querySelectorAll("button")];
    assert.ok(buttons.length >= 2, "botoes Anterior e Proximo presentes");
    for (const b of buttons) assert.ok(b.disabled, "botao desabilitado");
    for (const b of buttons) await click(b);
    assert.deepEqual(steps, [1], "so a chamada inicial de onStepChange");
    assert.equal(finished, 0);
    assert.match(container.textContent, /B/);
  } finally {
    h.restore();
  }
});

test("SgWizard enabled (padrao): avanca", async () => {
  const h = setupDomHarness();
  try {
    const spies = { onFinish() {}, onStep() {} };
    const { container } = await h.render(wizard({}, spies));
    await flushDom();
    const buttons = [...container.querySelectorAll("button:not([data-sg-wizard-step])")];
    const next = buttons[buttons.length - 1];
    assert.ok(!next.disabled);
    await click(next);
    await flushDom();
    assert.match(container.textContent, /C/);
  } finally {
    h.restore();
  }
});

test("SgCalendar enabled=false: dias, setas e hoje desabilitados; nada muda ao clicar", async () => {
  const h = setupDomHarness();
  try {
    let selected = 0;
    let view = 0;
    const el = React.createElement(SgCalendar, {
      defaultValue: "2026-11-10",
      defaultViewDate: "2026-11-01",
      enabled: false,
      onValueChange: () => selected++,
      onViewDateChange: () => view++
    });
    const { container } = await h.render(el);
    await flushDom();
    assert.ok(container.querySelector("[aria-disabled='true']"));
    const buttons = [...container.querySelectorAll("button[aria-pressed], button[aria-label]")];
    assert.ok(buttons.length > 30);
    const before = container.textContent;
    for (const b of buttons.filter((x) => x.getAttribute("aria-pressed") !== null || /m[eê]s|hoje|today|xim|nterior|prev|next/i.test(x.getAttribute("aria-label") ?? ""))) {
      assert.ok(b.disabled, "botao do calendario desabilitado: " + (b.getAttribute("aria-label") ?? b.textContent));
      await click(b);
    }
    assert.equal(selected, 0);
    assert.equal(view, 0);
    assert.equal(container.textContent, before);
  } finally {
    h.restore();
  }
});

test("SgCalendar enabled (padrao): seleciona o dia e navega o mes", async () => {
  const h = setupDomHarness();
  try {
    let selected = 0;
    let view = 0;
    const el = React.createElement(SgCalendar, {
      defaultValue: "2026-11-10",
      defaultViewDate: "2026-11-01",
      onValueChange: () => selected++,
      onViewDateChange: () => view++
    });
    const { container } = await h.render(el);
    await flushDom();
    const day = [...container.querySelectorAll("button[aria-pressed]")].find((b) => b.textContent === "15");
    await click(day);
    assert.equal(selected, 1);
    await click(byLabel(container, NEXT_RE));
    assert.ok(view >= 1);
  } finally {
    h.restore();
  }
});
