import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import React from "react";
import { act } from "react";
import { setupDomHarness, flushDom } from "./dom-harness.mjs";

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

const { SgDatatable, SgEnvironmentProvider, createLocalStorageStrategy } = require("../dist/sandbox.cjs");

Module._load = originalLoad;

const ROWS = [
  { id: 3, name: "Carlos", email: "carlos@exemplo.com" },
  { id: 1, name: "Ana", email: "ana@exemplo.com" },
  { id: 2, name: "Bruno", email: "bruno@exemplo.com" }
];

/**
 * Monta a tela do jeito que as telas reais fazem: `columns` declarado como
 * literal no corpo do componente, portanto com identidade NOVA a cada render do
 * pai. E o caso que este arquivo protege — o componente nao pode transformar
 * isso em trabalho extra de render nem em regravacao do layout de colunas.
 *
 * O ambiente, por outro lado, e' estavel (estrategia e namespace fora do
 * componente), como no consumidor real; recria-lo por render mediria o
 * provider, nao a tabela.
 */
function renderHarness({ tableId, onCellRender = () => {} }) {
  const api = {};
  const environmentValue = {
    namespaceProvider: { getNamespace: () => "testes" },
    persistence: { scope: "datatable-test", mode: "fallback", stateVersion: 1 },
    persistenceStrategy: createLocalStorageStrategy()
  };

  function Screen() {
    const [, setTick] = React.useState(0);
    api.rerenderParent = () => setTick((value) => value + 1);

    const columns = [
      { columnId: "col-id", field: "id", header: "ID", sortable: true },
      { columnId: "col-name", field: "name", header: "Nome", sortable: true },
      {
        columnId: "col-email",
        field: "email",
        header: "E-mail",
        body: (row) => {
          onCellRender();
          return React.createElement("span", null, row.email);
        }
      }
    ];

    return React.createElement(
      SgEnvironmentProvider,
      { value: environmentValue },
      React.createElement(SgDatatable, {
        id: tableId,
        columns,
        dataKey: "id",
        lazy: true,
        paginator: true,
        totalRecords: 137,
        first: 0,
        rows: 3,
        sortField: "name",
        sortOrder: 1,
        value: ROWS
      })
    );
  }

  return { Screen, api };
}

/**
 * Conta acessos ao layout de coluna na persistencia. Leitura e gravacao contam:
 * a releitura vinha do efeito de hidratacao depender do ARRAY de descritores, a
 * regravacao vinha do estado de colunas ganhar identidade nova por render.
 */
function spyStorage(harness) {
  // Precisa ser no prototipo: o Storage do jsdom e' um Proxy, e atribuir
  // `storage.getItem = fn` grava um ITEM chamado "getItem" em vez de substituir
  // o metodo — o espiao ficaria mudo e o teste passaria sempre.
  const proto = harness.window.Storage.prototype;
  const originalSet = proto.setItem;
  const originalGet = proto.getItem;
  const state = { writes: 0, reads: 0 };

  proto.setItem = function patchedSet(key, value) {
    if (String(key).includes("datatable:")) state.writes += 1;
    return originalSet.call(this, key, value);
  };
  proto.getItem = function patchedGet(key) {
    if (String(key).includes("datatable:")) state.reads += 1;
    return originalGet.call(this, key);
  };

  return state;
}

test("lazy: nao ordena localmente — preserva a ordem em que as linhas chegaram", async () => {
  const harness = setupDomHarness();
  try {
    const { Screen } = renderHarness({ tableId: "tabela-lazy" });
    const { container } = await harness.render(React.createElement(Screen));
    await flushDom();

    const nomes = [...container.querySelectorAll("tbody tr td:nth-child(2)")].map(
      (cell) => cell.textContent
    );

    // sortField="name" com sortOrder=1 daria Ana, Bruno, Carlos se houvesse sort
    // local. Em lazy quem ordena e' o servidor: a ordem recebida e' preservada.
    assert.deepEqual(nomes, ["Carlos", "Ana", "Bruno"]);
  } finally {
    harness.restore();
  }
});

test("lazy: nao pagina localmente — nao fatia `value` pelo tamanho da pagina", async () => {
  const harness = setupDomHarness();
  try {
    const { Screen } = renderHarness({ tableId: "tabela-lazy-page" });
    const { container } = await harness.render(React.createElement(Screen));
    await flushDom();

    assert.equal(container.querySelectorAll("tbody tr").length, ROWS.length);
  } finally {
    harness.restore();
  }
});

test("columns instavel: um render do pai produz um render do corpo, nao dois", async () => {
  const harness = setupDomHarness();
  try {
    let cellRenders = 0;
    const { Screen, api } = renderHarness({
      tableId: "tabela-estabilidade",
      onCellRender: () => {
        cellRenders += 1;
      }
    });

    await harness.render(React.createElement(Screen));
    await flushDom();

    const antes = cellRenders;

    await act(async () => {
      api.rerenderParent();
    });
    await flushDom();

    const celulasRenderizadas = cellRenders - antes;
    assert.equal(
      celulasRenderizadas,
      ROWS.length,
      `o corpo deveria renderizar uma vez por render do pai; renderizou ${
        celulasRenderizadas / ROWS.length
      }x (o efeito de sincronizacao de colunas esta forcando um commit extra)`
    );
  } finally {
    harness.restore();
  }
});

test("columns instavel: renders do pai nao tocam na persistencia de colunas", async () => {
  const harness = setupDomHarness();
  try {
    const { Screen, api } = renderHarness({ tableId: "tabela-sem-regravacao" });

    await harness.render(React.createElement(Screen));
    await flushDom();

    // O spy entra depois da hidratacao: o acesso inicial e' esperado. O que nao
    // pode acontecer e' tocar na persistencia de novo a cada render do pai.
    const storage = spyStorage(harness);

    for (let i = 0; i < 5; i += 1) {
      await act(async () => {
        api.rerenderParent();
      });
      await flushDom();
    }

    assert.deepEqual(
      { leituras: storage.reads, gravacoes: storage.writes },
      { leituras: 0, gravacoes: 0 },
      `cinco renders do pai tocaram na persistencia: ${storage.reads} leituras, ${storage.writes} gravacoes`
    );
  } finally {
    harness.restore();
  }
});
