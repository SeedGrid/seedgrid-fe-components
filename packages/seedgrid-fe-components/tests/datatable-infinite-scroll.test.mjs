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
const { SgDatatable } = require("../dist/sandbox.cjs");
Module._load = originalLoad;

// P137: rolagem infinita do SgDatatable. O IntersectionObserver nao existe no jsdom; um falso permite
// "rolar ate o fim" disparando a intersecao do sentinela.
const ROWS = Array.from({ length: 5 }, (_, i) => ({ id: i + 1, name: `Pessoa ${i + 1}`, city: "X" }));
const COLUMNS = [
  { field: "id", header: "Id", cardHidden: true },
  { field: "name", header: "Nome", cardTitle: true },
  { field: "city", header: "Cidade" }
];

function setup(width) {
  const harness = setupDomHarness();
  harness.window.HTMLElement.prototype.getBoundingClientRect = function () {
    return { x: 0, y: 0, top: 0, left: 0, right: width, bottom: 0, width, height: 0 };
  };
  const observers = new Set();
  const previous = globalThis.IntersectionObserver;
  globalThis.IntersectionObserver = class {
    constructor(cb) { this.cb = cb; this.targets = new Set(); observers.add(this); }
    observe(el) { this.targets.add(el); }
    disconnect() { this.targets.clear(); observers.delete(this); }
    unobserve(el) { this.targets.delete(el); }
  };
  /** Simula o sentinela entrando na area visivel. */
  const scrollToEnd = async () => {
    await act(async () => {
      for (const o of [...observers]) {
        if (o.targets.size) o.cb([{ isIntersecting: true, target: [...o.targets][0] }]);
      }
    });
    await flushDom();
  };
  const restore = () => {
    if (previous === undefined) delete globalThis.IntersectionObserver;
    else globalThis.IntersectionObserver = previous;
    harness.restore();
  };
  return { harness, scrollToEnd, restore };
}

async function mount(harness, props) {
  const result = await harness.render(
    React.createElement(SgDatatable, { value: ROWS, columns: COLUMNS, dataKey: "id", ...props })
  );
  await flushDom();
  return result;
}

const cards = (c) => c.querySelectorAll("li[data-sg-card]").length;
const rowsOf = (c) => c.querySelectorAll("tbody tr").length;
const sentinel = (c) => c.querySelector("[data-sg-infinite-sentinel]");
const paginatorNav = (c) => c.querySelector("nav");

test("cartoes (padrao automatico, 400 px): sem paginador, sentinela presente e proxima pagina ao rolar", async () => {
  const t = setup(400);
  try {
    const events = [];
    const { container } = await mount(t.harness, { paginator: true, rows: 2, onPage: (e) => events.push(e) });
    assert.equal(cards(container), 2);
    assert.equal(paginatorNav(container), null);
    assert.ok(sentinel(container));
    await t.scrollToEnd();
    assert.equal(cards(container), 4);
    await t.scrollToEnd();
    assert.equal(cards(container), 5);
    assert.deepEqual(
      events.map((e) => [e.first, e.rows, e.page, e.pageCount, e.totalRecords]),
      [[2, 2, 2, 3, 5], [4, 2, 3, 3, 5]]
    );
    // no fim da lista: indicador de fim e nenhuma nova pagina
    assert.notEqual(text(sentinel(container)), "");
    await t.scrollToEnd();
    assert.equal(cards(container), 5);
    assert.equal(events.length, 2);
  } finally {
    t.restore();
  }
});

const text = (el) => (el?.textContent ?? "").replace(/\s+/g, " ").trim();

test("infiniteScroll=false nos cartoes mantem o paginador e nao ha sentinela", async () => {
  const t = setup(400);
  try {
    const { container } = await mount(t.harness, { paginator: true, rows: 2, infiniteScroll: false });
    assert.equal(cards(container), 2);
    assert.ok(paginatorNav(container));
    assert.equal(sentinel(container), null);
  } finally {
    t.restore();
  }
});

test("tabela larga: padrao tem paginador; infiniteScroll=true troca por rolagem infinita", async () => {
  const t = setup(900);
  try {
    const a = await mount(t.harness, { paginator: true, rows: 2 });
    assert.equal(rowsOf(a.container), 2);
    assert.ok(paginatorNav(a.container));
    assert.equal(sentinel(a.container), null);
  } finally {
    t.restore();
  }
  const u = setup(900);
  try {
    const { container } = await mount(u.harness, { paginator: true, rows: 2, infiniteScroll: true });
    assert.equal(rowsOf(container), 2);
    assert.equal(paginatorNav(container), null);
    await u.scrollToEnd();
    assert.equal(rowsOf(container), 4);
  } finally {
    u.restore();
  }
});

test("sem paginator nao ha rolagem infinita (todas as linhas aparecem)", async () => {
  const t = setup(400);
  try {
    const { container } = await mount(t.harness, {});
    assert.equal(cards(container), 5);
    assert.equal(sentinel(container), null);
  } finally {
    t.restore();
  }
});

test("lazy: pede a proxima pagina uma vez por tamanho de value e chama onLoadMore e onPage", async () => {
  const t = setup(400);
  try {
    const loads = [];
    const pages = [];
    const props = (value) => ({
      value,
      lazy: true,
      totalRecords: 5,
      paginator: true,
      rows: 2,
      onLoadMore: (e) => loads.push(e),
      onPage: (e) => pages.push(e)
    });
    const { container, root } = await mount(t.harness, props(ROWS.slice(0, 2)));
    assert.equal(cards(container), 2);
    await t.scrollToEnd();
    await t.scrollToEnd(); // value nao cresceu: nao repete o pedido
    assert.deepEqual(loads.map((e) => [e.first, e.page, e.totalRecords]), [[2, 2, 5]]);
    assert.equal(pages.length, 1);
    await act(async () => root.render(React.createElement(SgDatatable, { columns: COLUMNS, dataKey: "id", ...props(ROWS.slice(0, 4)) })));
    await flushDom();
    assert.equal(cards(container), 4);
    await t.scrollToEnd();
    assert.deepEqual(loads.map((e) => e.first), [2, 4]);
    // value completo: fim da lista, sem novo pedido
    await act(async () => root.render(React.createElement(SgDatatable, { columns: COLUMNS, dataKey: "id", ...props(ROWS) })));
    await flushDom();
    await t.scrollToEnd();
    assert.equal(loads.length, 2);
    assert.equal(cards(container), 5);
  } finally {
    t.restore();
  }
});

test("ordenar recomeca a rolagem infinita na primeira pagina", async () => {
  const t = setup(400);
  try {
    const { container, root } = await mount(t.harness, { paginator: true, rows: 2 });
    await t.scrollToEnd();
    assert.equal(cards(container), 4);
    await act(async () =>
      root.render(React.createElement(SgDatatable, { value: ROWS, columns: COLUMNS, dataKey: "id", paginator: true, rows: 2, sortField: "name", sortOrder: -1 }))
    );
    await flushDom();
    assert.equal(cards(container), 2);
  } finally {
    t.restore();
  }
});
