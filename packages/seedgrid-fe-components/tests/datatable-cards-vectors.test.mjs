import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import React from "react";
import { act } from "react";
import { setupDomHarness, flushDom } from "./dom-harness.mjs";

// Paridade React x vetores compartilhados (P127). Os vetores moram no repositorio do Flutter
// (seedgrid_components/test/widgets/datatable_vectors/vectors.json, chave `cardCases`) e sao gerados a partir
// DESTE componente; este teste garante que o componente continua produzindo exatamente o que foi gravado.
// Se o repositorio irmao nao estiver ao lado, o teste e' pulado.
const require = createRequire(import.meta.url);

const VECTORS = join(
  process.cwd(),
  "..",
  "..",
  "..",
  "seedgrid-fe-flutter",
  "packages",
  "seedgrid_components",
  "test",
  "widgets",
  "datatable_vectors",
  "vectors.json"
);
const available = existsSync(VECTORS);

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
const { SgDatatable } = require("../dist/sandbox.cjs");
Module._load = originalLoad;

const txt = (el) => (el?.textContent ?? "").replace(/\s+/g, " ").trim();
const pairs = (root) => [...root.querySelectorAll("dt")].map((dt) => [txt(dt), txt(dt.nextElementSibling)]);

function buildColumns(spec) {
  return spec.map((c) => {
    const col = { ...c };
    if (c.footer === "count") col.footer = (rows) => `count:${rows.length}`;
    else if (c.footer === "sumAge") col.footer = (rows) => String(rows.reduce((a, r) => a + (typeof r.age === "number" ? r.age : 0), 0));
    else if (c.footer === "text") col.footer = "Rodape";
    return col;
  });
}

function extract(host) {
  const root = host.querySelector("[data-sg-datatable-cards]");
  if (!root) return { mode: "table" };
  const panel = host.querySelector("[data-sg-datatable-filters-panel]");
  const sortSelect = root.querySelector('select[aria-label="Sort by"]');
  const stateEl = root.querySelector("[data-sg-card-state]");
  return {
    mode: "cards",
    cards: [...root.querySelectorAll("li[data-sg-card]")].map((li) => ({
      title: li.querySelector("[data-sg-card-title]") ? txt(li.querySelector("[data-sg-card-title]")) : null,
      fields: pairs(li),
      selected: li.getAttribute("aria-selected") === "true"
    })),
    state: stateEl ? { kind: stateEl.getAttribute("data-sg-card-state"), text: txt(stateEl) } : null,
    sort: sortSelect
      ? {
          options: [...sortSelect.querySelectorAll("option")].map((o) => ({ value: o.getAttribute("value"), label: txt(o) })),
          value: sortSelect.value ?? ""
        }
      : null,
    filters: {
      toggle: [...root.querySelectorAll("button")].some((b) => txt(b) === "Filters"),
      open: Boolean(panel),
      inputs: panel
        ? [...panel.querySelectorAll("label")].map((l) => ({
            label: txt(l.querySelector("span")),
            placeholder: l.querySelector("input").getAttribute("placeholder"),
            value: l.querySelector("input").getAttribute("value") ?? ""
          }))
        : []
    },
    footer: root.querySelector("[data-sg-card-footer]") ? pairs(root.querySelector("[data-sg-card-footer]")) : null
  };
}

test("vetores de cartoes: arquivo de vetores encontrado", { skip: !available && "repositorio seedgrid-fe-flutter ao lado nao encontrado" }, () => {
  const vectors = JSON.parse(readFileSync(VECTORS, "utf8"));
  assert.ok(Array.isArray(vectors.cardCases) && vectors.cardCases.length >= 30);
});

if (available) {
  const vectors = JSON.parse(readFileSync(VECTORS, "utf8"));
  for (const c of vectors.cardCases ?? []) {
    test(`React x vetor: ${c.name}`, async () => {
      const harness = setupDomHarness();
      try {
        harness.window.HTMLElement.prototype.getBoundingClientRect = () => ({
          x: 0, y: 0, top: 0, left: 0, right: c.width, bottom: 0, width: c.width, height: 0
        });
        const props = { ...c.props };
        const rowsData = props.rowsData;
        delete props.rowsData;
        props.value = rowsData ?? vectors.rows;
        props.columns = buildColumns(c.props.columns);
        const { container } = await harness.render(React.createElement(SgDatatable, props));
        await flushDom();
        for (const action of c.actions) {
          if (action === "openFilters") {
            const button = [...container.querySelectorAll("button")].find((b) => txt(b) === "Filters");
            await act(async () => {
              button.click();
            });
          }
        }
        const got = extract(container);
        const want = c.expected;
        assert.equal(got.mode, want.mode);
        if (want.mode === "cards") {
          assert.deepEqual(got.cards, want.cards);
          assert.deepEqual(got.state, want.state);
          assert.deepEqual(got.sort, want.sort && { options: want.sort.options, value: want.sort.value });
          assert.deepEqual(got.filters, want.filters);
          assert.deepEqual(got.footer, want.footer);
        }
      } finally {
        harness.restore();
      }
    });
  }
}
