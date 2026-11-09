import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import React from "react";
import { setupDomHarness, flushDom } from "./dom-harness.mjs";

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

const { SgClock } = require("../dist/sandbox.cjs");

Module._load = originalLoad;

const baseProps = {
  clockStyle: "digital",
  initialServerTime: "2026-06-15T15:41:07Z",
  timezone: "UTC",
  locale: "en-US"
};

test("SgClock digitBuilder draws the digits when digitalStyle is custom", async () => {
  const harness = setupDomHarness();
  try {
    const received = [];
    await harness.render(
      React.createElement(SgClock, {
        ...baseProps,
        format: "24h",
        digitalStyle: "custom",
        digitBuilder: (parts) => {
          received.push(parts);
          return React.createElement(
            "div",
            { "data-testid": "custom-digits" },
            parts.text.split("").map((ch, i) => React.createElement("span", { key: i, "data-digit": ch }, ch))
          );
        }
      })
    );
    await flushDom();

    const root = harness.document.querySelector('[data-testid="custom-digits"]');
    assert.ok(root);
    assert.equal(root.querySelectorAll("[data-digit]").length, "15:41:07".length);
    assert.equal(root.parentElement.getAttribute("aria-label") !== null, true);

    const parts = received[0];
    assert.equal(parts.hour, "15");
    assert.equal(parts.minute, "41");
    assert.equal(parts.second, "07");
    assert.equal(parts.text, "15:41:07");
    assert.equal(parts.is12h, false);
    assert.equal(parts.dayPeriod, undefined);
    assert.equal(parts.showSeconds, true);
    assert.equal(parts.size, "md");
    assert.equal(parts.sizePx, 16);
  } finally {
    harness.restore();
  }
});

test("SgClock digitBuilder receives the 12h period and hides seconds", async () => {
  const harness = setupDomHarness();
  try {
    let parts = null;
    await harness.render(
      React.createElement(SgClock, {
        ...baseProps,
        format: "12h",
        showSeconds: false,
        size: "lg",
        digitalStyle: "custom",
        digitBuilder: (p) => {
          parts = p;
          return React.createElement("b", { "data-testid": "custom-12h" }, p.textWithPeriod);
        }
      })
    );
    await flushDom();

    assert.ok(parts);
    assert.equal(parts.is12h, true);
    assert.equal(parts.showSeconds, false);
    assert.equal(parts.second, "");
    assert.equal(parts.hour, "03");
    assert.equal(parts.text, "03:41");
    assert.match(parts.dayPeriod ?? "", /PM/i);
    assert.equal(parts.sizePx, 28);
    assert.match(harness.document.querySelector('[data-testid="custom-12h"]').textContent ?? "", /^03:41 PM$/i);
  } finally {
    harness.restore();
  }
});

test("SgClock custom without digitBuilder falls back to the default style, and digitBuilder is ignored for other styles", async () => {
  const harness = setupDomHarness();
  try {
    await harness.render(React.createElement(SgClock, { ...baseProps, digitalStyle: "custom" }));
    await flushDom();
    assert.match(harness.document.body.textContent ?? "", /15:41:07/);

    let called = false;
    await harness.render(
      React.createElement(SgClock, {
        ...baseProps,
        digitalStyle: "default",
        digitBuilder: () => {
          called = true;
          return "x";
        }
      })
    );
    await flushDom();
    assert.equal(called, false);
    assert.match(harness.document.body.textContent ?? "", /15:41:07/);
  } finally {
    harness.restore();
  }
});
