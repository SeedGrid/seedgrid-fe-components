import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import React from "react";
import { act } from "react";
import { setupDomHarness, flushDom } from "./dom-harness.mjs";

// P134 - SgCameraCapture. Logica pura (vetores compartilhados com o Flutter) + comportamento no DOM com getUserMedia simulado.
const require = createRequire(import.meta.url);
const Module = require("node:module");
const originalLoad = Module._load;
Module._load = function patchedLoad(request, parent, isMain) {
  if (request === "@tiptap/extension-text-style") {
    return { extend() { return { configure() { return this; } }; } };
  }
  return originalLoad.call(this, request, parent, isMain);
};
const { SgCameraCapture } = require("../dist/sandbox.cjs");
Module._load = originalLoad;
const L = require("../dist/inputs/cameraLogic.js");

const VECTORS = join(process.cwd(), "..", "..", "..", "seedgrid-fe-flutter", "packages", "seedgrid_components", "test", "widgets", "camera_vectors", "vectors.json");
const available = existsSync(VECTORS);
const V = available ? JSON.parse(readFileSync(VECTORS, "utf8")) : null;

test("vetores compartilhados: React produz exatamente o que foi gravado", { skip: !available }, () => {
  for (const c of V.resolution) assert.deepEqual(L.resolutionSize(c.resolution), c.out, JSON.stringify(c));
  for (const c of V.guide) assert.deepEqual(L.guideBox(c.guide, c.width, c.height), c.out, JSON.stringify(c));
  for (const c of V.errors) assert.equal(L.classifyCameraError(c.name), c.out, JSON.stringify(c));
  for (const c of V.facing) assert.equal(L.nextFacing(c.facing), c.out, JSON.stringify(c));
});

function fakeTrack(stops) {
  return { stop: () => stops.push(1) };
}

function installMedia(harness, impl) {
  Object.defineProperty(harness.window.navigator, "mediaDevices", { configurable: true, value: { getUserMedia: impl } });
  Object.defineProperty(globalThis, "navigator", { configurable: true, writable: true, value: harness.window.navigator });
  harness.window.HTMLMediaElement.prototype.play = () => Promise.resolve();
}

test("SgCameraCapture abre a camera pedida, mostra o guia e libera a trilha ao desmontar", async () => {
  const harness = setupDomHarness();
  try {
    const stops = [];
    const calls = [];
    installMedia(harness, (constraints) => {
      calls.push(constraints);
      return Promise.resolve({ getTracks: () => [fakeTrack(stops)] });
    });
    await harness.render(React.createElement(SgCameraCapture, { id: "cam", label: "Foto", guide: "oval", facing: "environment", resolution: "high" }));
    await flushDom();
    await flushDom();
    assert.equal(calls.length, 1);
    assert.deepEqual(calls[0].video.facingMode, { ideal: "environment" });
    assert.equal(calls[0].video.width.ideal, 1920);
    const capture = [...harness.document.querySelectorAll("button")].find((b) => b.getAttribute("aria-label") === "Tirar foto" || /foto|photo/i.test(b.getAttribute("aria-label") ?? ""));
    assert.ok(capture);
    assert.equal(capture.disabled, false);
    await act(async () => {
      harness.root?.unmount?.();
    });
    harness.restore();
    assert.ok(stops.length >= 1, "trilha liberada");
  } finally {
    try { harness.restore(); } catch { /* ja restaurado */ }
  }
});

test("SgCameraCapture mostra permissao negada e chama onError; tentar de novo reabre", async () => {
  const harness = setupDomHarness();
  try {
    let attempts = 0;
    installMedia(harness, () => {
      attempts += 1;
      const error = new Error("denied");
      error.name = "NotAllowedError";
      return Promise.reject(error);
    });
    const errors = [];
    await harness.render(React.createElement(SgCameraCapture, { id: "cam", onError: (code, message) => errors.push([code, message]) }));
    await flushDom();
    await flushDom();
    assert.equal(errors[0][0], "permission");
    const alert = harness.document.querySelector("[role=alert]");
    assert.ok(alert);
    const retry = alert.querySelector("button");
    await act(async () => {
      retry.dispatchEvent(new harness.window.MouseEvent("click", { bubbles: true }));
    });
    await flushDom();
    assert.equal(attempts, 2);
  } finally {
    harness.restore();
  }
});

test("SgCameraCapture sem mediaDevices vira noCamera", async () => {
  const harness = setupDomHarness();
  try {
    Object.defineProperty(globalThis, "navigator", { configurable: true, writable: true, value: harness.window.navigator });
    const errors = [];
    await harness.render(React.createElement(SgCameraCapture, { id: "cam", onError: (code) => errors.push(code) }));
    await flushDom();
    assert.deepEqual(errors, ["noCamera"]);
  } finally {
    harness.restore();
  }
});
