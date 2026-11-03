import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import React from "react";
import { act } from "react";
import { setupDomHarness } from "./dom-harness.mjs";

// SgPlayground: o codigo digitado pelo usuario nao pode sumir/voltar ao original depois do Run (ou de qualquer
// re-render). Causa: SandpackProvider RESETA todos os arquivos para a prop `files` sempre que a identidade dela
// muda; a folha de estilos do host ficava dentro de `files`, entao qualquer mutacao de tema/estilo no <html>
// recriava `files` e apagava a edicao. A folha agora e' semeada uma vez e sincronizada por updateFile.
const PLAYGROUND = join(process.cwd(), "..", "seedgrid-fe-playground");
const SOURCE = join(PLAYGROUND, "src", "SgPlayground.tsx");
const available = existsSync(SOURCE);

test("contrato: a folha de estilos do host nao e' dependencia do memo de `files`", { skip: !available && "pacote playground ao lado nao encontrado" }, () => {
  const src = readFileSync(SOURCE, "utf8");
  const start = src.indexOf("const files = React.useMemo<SandpackFiles>");
  assert.ok(start > 0, "memo de files encontrado");
  const end = src.indexOf("const deps = React.useMemo", start);
  const memo = src.slice(start, end);
  const depsArray = memo.slice(memo.lastIndexOf("}, ["));
  assert.ok(!depsArray.includes("sandpackStylesCss"), "sandpackStylesCss nao pode estar nas deps de `files`");
  assert.ok(src.includes("function StylesSync"), "StylesSync sincroniza o css sem resetar o editor");
  assert.ok(src.includes("<StylesSync css={sandpackStylesCss} />"), "StylesSync montado dentro do provider");
});

test("layout responsivo nao depende de utilitarios md: do Tailwind do consumidor", { skip: !available && "pacote playground ao lado nao encontrado" }, () => {
  // Causa real do "codigo some depois do Run": o painel de codigo recebia `hidden md:block`, mas o Tailwind do
  // showcase nao varre o pacote do playground, `md:block` nunca era gerado e o painel ficava display:none no desktop.
  const src = readFileSync(SOURCE, "utf8");
  assert.ok(!/hidden md:block/.test(src), "nao usar `hidden md:block` (classe nao gerada no consumidor)");
  assert.ok(!/"[^"]*md:(block|hidden|grid-cols-2|border-r)/.test(src), "layout nao pode usar md:* do Tailwind");
  assert.ok(src.includes(".sg-pg-panel[data-mobile-hidden=\"true\"] { display: block; }"), "CSS proprio reexibe o painel a partir de 768px");
});

test("comportamento do Sandpack: nova identidade de `files` reseta a edicao; updateFile nao", { skip: !available && "pacote playground ao lado nao encontrado" }, async () => {
  const requireFromPlayground = createRequire(join(PLAYGROUND, "package.json"));
  const sandpack = requireFromPlayground("@codesandbox/sandpack-react");
  const harness = setupDomHarness();
  try {
    let api;
    function Probe() {
      api = sandpack.useSandpack().sandpack;
      return null;
    }
    const mount = (files) =>
      React.createElement(
        sandpack.SandpackProvider,
        { template: "react-ts", files, options: { autorun: false } },
        React.createElement(Probe)
      );
    const base = { "/App.tsx": { code: "ORIGINAL", active: true }, "/styles.css": { code: "a{}" } };
    const { root } = await harness.render(mount(base));

    await act(async () => api.updateFile("/App.tsx", "EDITADO"));
    assert.equal(api.files["/App.tsx"].code, "EDITADO");

    // css novo via updateFile (o que StylesSync faz): a edicao permanece
    await act(async () => api.updateFile("/styles.css", "b{}"));
    assert.equal(api.files["/App.tsx"].code, "EDITADO");
    assert.equal(api.files["/styles.css"].code, "b{}");

    // o caso que causava o bug: `files` recriado (qualquer mudanca de identidade) => edicao perdida
    await act(async () => root.render(mount({ ...base, "/styles.css": { code: "c{}" } })));
    assert.equal(api.files["/App.tsx"].code, "ORIGINAL");
  } finally {
    harness.restore();
  }
});
