import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const require = createRequire(import.meta.url);
const Module = require("node:module");
const originalLoad = Module._load;
Module._load = function patchedLoad(request, parent, isMain) {
  if (request === "@tiptap/extension-text-style") {
    return { extend() { return { configure() { return this; } }; } };
  }
  return originalLoad.call(this, request, parent, isMain);
};
const { SgDockMenu } = require("../dist/sandbox.cjs");
Module._load = originalLoad;

// P140: a sombra do dock fica no wrapper `.sg-dock`; sem border-radius ela desenhava um retangulo quadrado
// atras da parte arredondada.
test("SgDockMenu: o wrapper com a sombra respeita o raio do dock", () => {
  const html = renderToStaticMarkup(
    React.createElement(SgDockMenu, {
      items: [{ id: "a", label: "A", icon: React.createElement("i") }],
      borderRadius: 20,
      elevation: "lg"
    })
  );
  const wrapper = html.match(/<div[^>]*class="sg-dock [^"]*"[^>]*style="([^"]*)"/);
  assert.ok(wrapper, "wrapper .sg-dock nao encontrado: " + html.slice(0, 300));
  assert.match(wrapper[1], /border-radius:\s*20px/);
});

test("SgDockMenu: raio padrao 16 no wrapper", () => {
  const html = renderToStaticMarkup(
    React.createElement(SgDockMenu, { items: [{ id: "a", label: "A", icon: React.createElement("i") }] })
  );
  const wrapper = html.match(/<div[^>]*class="sg-dock [^"]*"[^>]*style="([^"]*)"/);
  assert.ok(wrapper);
  assert.match(wrapper[1], /border-radius:\s*16px/);
});
