import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import React from "react";
import { act } from "react";
import { setupDomHarness, flushDom } from "./dom-harness.mjs";

// P133 - SgImageUpload. Logica pura (vetores compartilhados com o Flutter) + comportamento no DOM.
const require = createRequire(import.meta.url);
const Module = require("node:module");
const originalLoad = Module._load;
Module._load = function patchedLoad(request, parent, isMain) {
  if (request === "@tiptap/extension-text-style") {
    return { extend() { return { configure() { return this; } }; } };
  }
  return originalLoad.call(this, request, parent, isMain);
};
const { SgImageUpload } = require("../dist/sandbox.cjs");
Module._load = originalLoad;
const L = require("../dist/inputs/imageUploadLogic.js");

const VECTORS = join(process.cwd(), "..", "..", "..", "seedgrid-fe-flutter", "packages", "seedgrid_components", "test", "widgets", "image_upload_vectors", "vectors.json");
const available = existsSync(VECTORS);
const V = available ? JSON.parse(readFileSync(VECTORS, "utf8")) : null;

test("vetores compartilhados: React produz exatamente o que foi gravado", { skip: !available }, () => {
  for (const c of V.accept) assert.equal(L.matchesAccept(c.name, c.type, c.accept ?? undefined), c.out, JSON.stringify(c));
  for (const c of V.validate) assert.equal(L.validateImage(c.file, c.rules), c.out, JSON.stringify(c));
  for (const c of V.bytes) assert.equal(L.formatBytes(c.bytes, c.locale), c.out, JSON.stringify(c));
  for (const c of V.aspect) assert.equal(L.formatAspect(c.aspect), c.out, JSON.stringify(c));
});

