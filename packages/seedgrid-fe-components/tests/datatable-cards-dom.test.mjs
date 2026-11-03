import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import React from "react";
import { act } from "react";
import { setupDomHarness, flushDom, dispatchInput } from "./dom-harness.mjs";

const require = createRequire(import.meta.url);

// Mesmo mock dos demais testes DOM: o bundle sandbox carrega o editor rich text
// junto, e o TipTap nao sobrevive ao ambiente de teste.
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

const { SgDatatable, SG_DATATABLE_MOBILE_BREAKPOINT } = require("../dist/sandbox.cjs");

Module._load = originalLoad;

const ROWS = [
  { id: 1, name: "Carlos", city: "Recife", age: 30 },
  { id: 2, name: "Ana", city: "Santos", age: 25 },
  { id: 3, name: "Bruno", city: "Rio", age: 41 }
];

const COLUMNS = [
  { field: "id", header: "Id", cardHidden: true },
  { field: "name", header: "Nome", sortable: true, filter: true, cardTitle: true },
  { field: "city", header: "Cidade", sortable: true, filter: true },
  { field: "age", header: "Idade", sortable: true, footer: (rows) => `soma:${rows.reduce((a, r) => a + r.age, 0)}` }
];

/** Monta o harness com a largura do container controlada pelo teste. */
function setup(initialWidth) {
  const harness = setupDomHarness();
  const state = { width: initialWidth };
  harness.window.HTMLElement.prototype.getBoundingClientRect = function getBoundingClientRect() {
    return { x: 0, y: 0, top: 0, left: 0, right: state.width, bottom: 0, width: state.width, height: 0 };
  };
  const setWidth = async (width) => {
    state.width = width;
    await act(async () => {
      harness.window.dispatchEvent(new harness.window.Event("resize"));
    });
    await flushDom();
  };
  return { harness, setWidth };
}

async function mount(harness, props) {
  const result = await harness.render(
    React.createElement(SgDatatable, { value: ROWS, columns: COLUMNS, dataKey: "id", ...props })
  );
  await flushDom();
  return result;
}

const text = (el) => (el.textContent ?? "").replace(/\s+/g, " ").trim();

async function typeInto(_harness, input, value) {
  await dispatchInput(input, value);
}

test("corte de 600 px, igual ao do Flutter", () => {
  assert.equal(SG_DATATABLE_MOBILE_BREAKPOINT, 600);
});

test("mobileMode omitido (automatico): vira cartoes em container estreito", async () => {
  const { harness } = setup(320);
  try {
    const { container } = await mount(harness, {});
    assert.equal(container.querySelectorAll("table").length, 0);
    assert.equal(container.querySelectorAll("[data-sg-datatable-cards]").length, 1);
  } finally {
    harness.restore();
  }
});

test("mobileMode=scroll forca a tabela mesmo em container estreito", async () => {
  const { harness } = setup(320);
  try {
    const { container } = await mount(harness, { mobileMode: "scroll" });
    assert.equal(container.querySelectorAll("table").length, 1);
    assert.equal(container.querySelector("[data-sg-datatable-cards]"), null);
  } finally {
    harness.restore();
  }
});

test("mobileMode omitido: acima do corte continua tabela", async () => {
  const { harness } = setup(800);
  try {
    const { container } = await mount(harness, {});
    assert.equal(container.querySelectorAll("table").length, 1);
    assert.equal(container.querySelector("[data-sg-datatable-cards]"), null);
  } finally {
    harness.restore();
  }
});

test("mobileMode=cards forca cartoes mesmo em container largo", async () => {
  const { harness } = setup(900);
  try {
    const { container } = await mount(harness, { mobileMode: "cards" });
    assert.equal(container.querySelectorAll("table").length, 0);
    assert.equal(container.querySelectorAll("[data-sg-datatable-cards]").length, 1);
  } finally {
    harness.restore();
  }
});

test("automatico: exatamente no corte (600) ainda e tabela; 599 vira cartoes", async () => {
  const { harness, setWidth } = setup(600);
  try {
    const { container } = await mount(harness, {});
    assert.equal(container.querySelectorAll("table").length, 1);
    await setWidth(599);
    assert.equal(container.querySelectorAll("table").length, 0);
    assert.equal(container.querySelectorAll("li[data-sg-card]").length, 3);
  } finally {
    harness.restore();
  }
});

test("automatico: acompanha o redimensionamento nos dois sentidos", async () => {
  const { harness, setWidth } = setup(900);
  try {
    const { container } = await mount(harness, {});
    assert.equal(container.querySelectorAll("table").length, 1);
    await setWidth(400);
    assert.equal(container.querySelectorAll("table").length, 0);
    assert.equal(container.querySelectorAll("[data-sg-datatable-cards]").length, 1);
    await setWidth(900);
    assert.equal(container.querySelectorAll("table").length, 1);
  } finally {
    harness.restore();
  }
});

test("cards: titulo, rotulo: valor e colunas cardHidden", async () => {
  const { harness } = setup(400);
  try {
    const { container } = await mount(harness, { mobileMode: "cards" });
    const first = container.querySelector("li[data-sg-card]");
    assert.equal(text(first.querySelector("[data-sg-card-title]")), "Carlos");
    const labels = [...first.querySelectorAll("dt")].map(text);
    const values = [...first.querySelectorAll("dd")].map(text);
    // Id (cardHidden) e Nome (cardTitle) nao entram na lista rotulo: valor
    assert.deepEqual(labels, ["Cidade", "Idade"]);
    assert.deepEqual(values, ["Recife", "30"]);
  } finally {
    harness.restore();
  }
});

test("cards: sem cardTitle todas as colunas visiveis viram rotulo: valor", async () => {
  const { harness } = setup(400);
  try {
    const columns = COLUMNS.map(({ cardTitle, cardHidden, ...rest }) => rest);
    const { container } = await mount(harness, { mobileMode: "cards", columns });
    const first = container.querySelector("li[data-sg-card]");
    assert.equal(first.querySelector("[data-sg-card-title]"), null);
    assert.deepEqual([...first.querySelectorAll("dt")].map(text), ["Id", "Nome", "Cidade", "Idade"]);
  } finally {
    harness.restore();
  }
});

test("cards: celula com body (acoes da linha) e' renderizada no cartao", async () => {
  const { harness } = setup(400);
  try {
    const clicked = [];
    const columns = [
      ...COLUMNS,
      {
        columnId: "acoes",
        header: "Acoes",
        body: (row) =>
          React.createElement("button", { type: "button", "data-acao": "editar", onClick: () => clicked.push(row.id) }, "Editar")
      }
    ];
    const { container } = await mount(harness, { mobileMode: "cards", columns, selectionMode: "single" });
    const buttons = container.querySelectorAll('li[data-sg-card] button[data-acao="editar"]');
    assert.equal(buttons.length, 3);
    await act(async () => {
      buttons[1].click();
    });
    assert.deepEqual(clicked, [2]);
    // clicar na acao nao seleciona a linha
    assert.equal(container.querySelectorAll('li[aria-selected="true"]').length, 0);
  } finally {
    harness.restore();
  }
});

test("cards: selecao por toque no cartao e aria-selected", async () => {
  const { harness } = setup(400);
  try {
    const events = [];
    const { container } = await mount(harness, {
      mobileMode: "cards",
      selectionMode: "multiple",
      onSelectionChange: (s) => events.push(s)
    });
    const cards = container.querySelectorAll("li[data-sg-card]");
    await act(async () => {
      cards[0].click();
    });
    assert.deepEqual(events.at(-1).map((r) => r.id), [1]);
    assert.equal(container.querySelectorAll('li[aria-selected="true"]').length, 1);
    await act(async () => {
      container.querySelectorAll("li[data-sg-card]")[2].click();
    });
    assert.deepEqual(events.at(-1).map((r) => r.id), [1, 3]);
    await act(async () => {
      container.querySelectorAll("li[data-sg-card]")[0].click();
    });
    assert.deepEqual(events.at(-1).map((r) => r.id), [3]);
  } finally {
    harness.restore();
  }
});

test("cards: ordenacao pelo seletor 'Ordenar por' e botao de direcao", async () => {
  const { harness } = setup(400);
  try {
    const sorts = [];
    const { container } = await mount(harness, { mobileMode: "cards", onSort: (e) => sorts.push(e) });
    const select = container.querySelector("select");
    const optionLabels = [...select.querySelectorAll("option")].map(text);
    assert.deepEqual(optionLabels, ["No sorting", "Nome", "Cidade", "Idade"]);

    await act(async () => {
      select.value = "name";
      select.dispatchEvent(new harness.window.Event("change", { bubbles: true }));
    });
    assert.deepEqual(sorts.at(-1), { sortField: "name", sortOrder: 1 });
    const titles = [...container.querySelectorAll("[data-sg-card-title]")].map(text);
    assert.deepEqual(titles, ["Ana", "Bruno", "Carlos"]);

    const direction = container.querySelector('button[aria-label="Reverse order"]');
    await act(async () => {
      direction.click();
    });
    assert.deepEqual(sorts.at(-1), { sortField: "name", sortOrder: -1 });
    assert.deepEqual([...container.querySelectorAll("[data-sg-card-title]")].map(text), ["Carlos", "Bruno", "Ana"]);

    await act(async () => {
      select.value = "";
      select.dispatchEvent(new harness.window.Event("change", { bubbles: true }));
    });
    assert.deepEqual(sorts.at(-1), { sortField: null, sortOrder: 0 });
  } finally {
    harness.restore();
  }
});

test("cards: filtros por coluna ficam num painel aberto por botao", async () => {
  const { harness } = setup(400);
  try {
    const filters = [];
    const { container } = await mount(harness, {
      mobileMode: "cards",
      showColumnFilters: true,
      onFilter: (e) => filters.push(e)
    });
    // sem linha de filtros no cabecalho (nao ha cabecalho) e painel fechado
    assert.equal(container.querySelector("thead"), null);
    assert.equal(container.querySelector("[data-sg-datatable-filters-panel]"), null);

    const toggle = [...container.querySelectorAll("button")].find((b) => text(b) === "Filters");
    assert.ok(toggle, "botao Filtros");
    assert.equal(toggle.getAttribute("aria-expanded"), "false");
    await act(async () => {
      toggle.click();
    });
    const panel = container.querySelector("[data-sg-datatable-filters-panel]");
    assert.ok(panel, "painel aberto");
    const inputs = panel.querySelectorAll("input");
    assert.equal(inputs.length, 2); // Nome e Cidade (Idade nao tem filter)

    await typeInto(harness, inputs[0], "ana");
    assert.deepEqual(filters.at(-1).filters, { name: "ana" });
    assert.deepEqual([...container.querySelectorAll("[data-sg-card-title]")].map(text), ["Ana"]);
  } finally {
    harness.restore();
  }
});

test("cards: sem showColumnFilters nao ha botao de filtros", async () => {
  const { harness } = setup(400);
  try {
    const { container } = await mount(harness, { mobileMode: "cards" });
    assert.equal([...container.querySelectorAll("button")].some((b) => text(b) === "Filters"), false);
  } finally {
    harness.restore();
  }
});

test("cards: rodape vira bloco rotulo: valor com os totais", async () => {
  const { harness } = setup(400);
  try {
    const { container } = await mount(harness, { mobileMode: "cards" });
    const footer = container.querySelector("[data-sg-card-footer]");
    assert.ok(footer);
    assert.deepEqual([...footer.querySelectorAll("dt")].map(text), ["Idade"]);
    assert.deepEqual([...footer.querySelectorAll("dd")].map(text), ["soma:96"]);
  } finally {
    harness.restore();
  }
});

test("cards: paginacao continua e fatia os cartoes", async () => {
  const { harness } = setup(400);
  try {
    const { container } = await mount(harness, { mobileMode: "cards", paginator: true, rows: 2, infiniteScroll: false });
    assert.equal(container.querySelectorAll("li[data-sg-card]").length, 2);
    const next = container.querySelector('nav button[aria-label="Next page"]');
    assert.ok(next, "botao proxima pagina");
    await act(async () => {
      next.click();
    });
    assert.equal(container.querySelectorAll("li[data-sg-card]").length, 1);
    assert.equal(text(container.querySelector("[data-sg-card-title]")), "Bruno");
  } finally {
    harness.restore();
  }
});

test("cards: estados vazio e carregando", async () => {
  const { harness } = setup(400);
  try {
    const empty = await mount(harness, { mobileMode: "cards", value: [], emptyMessage: "Nada aqui" });
    assert.equal(text(empty.container.querySelector('[data-sg-card-state="empty"]')), "Nada aqui");
    const loading = await mount(harness, { mobileMode: "cards", loading: true });
    assert.ok(loading.container.querySelector('[data-sg-card-state="loading"]'));
    assert.equal(loading.container.querySelectorAll("li[data-sg-card]").length, 0);
  } finally {
    harness.restore();
  }
});

test("cards: coluna oculta pelo gerenciador de colunas (hidden) nao aparece no cartao", async () => {
  const { harness } = setup(400);
  try {
    const columns = COLUMNS.map((c) => (c.field === "city" ? { ...c, hidden: true } : c));
    const { container } = await mount(harness, { mobileMode: "cards", columns });
    const first = container.querySelector("li[data-sg-card]");
    assert.deepEqual([...first.querySelectorAll("dt")].map(text), ["Idade"]);
  } finally {
    harness.restore();
  }
});
