import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const Module = require("node:module");
const originalLoad = Module._load;

// Same tiptap shim used by the other node --test suites so the sandbox bundle loads.
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

const { resolvePeriod, PeriodPreset, periodPresetLabel } = require("../dist/sandbox.cjs");

Module._load = originalLoad;

// Reference: Wednesday, June 17, 2026 (local time).
const REF = new Date(2026, 5, 17, 10, 30, 0, 0);

function startEq(actual, y, m, d) {
  assert.equal(actual.getFullYear(), y);
  assert.equal(actual.getMonth(), m);
  assert.equal(actual.getDate(), d);
  assert.equal(actual.getHours(), 0);
  assert.equal(actual.getMinutes(), 0);
  assert.equal(actual.getSeconds(), 0);
  assert.equal(actual.getMilliseconds(), 0);
}

function endEq(actual, y, m, d) {
  assert.equal(actual.getFullYear(), y);
  assert.equal(actual.getMonth(), m);
  assert.equal(actual.getDate(), d);
  assert.equal(actual.getHours(), 23);
  assert.equal(actual.getMinutes(), 59);
  assert.equal(actual.getSeconds(), 59);
  assert.equal(actual.getMilliseconds(), 999);
}

test("ALL returns null bounds", () => {
  const r = resolvePeriod(PeriodPreset.ALL, REF);
  assert.equal(r.startDate, null);
  assert.equal(r.endDate, null);
  assert.equal(r.preset, PeriodPreset.ALL);
});

test("CUSTOM returns null bounds and Periodo label (pt-BR)", () => {
  const r = resolvePeriod(PeriodPreset.CUSTOM, REF);
  assert.equal(r.startDate, null);
  assert.equal(r.endDate, null);
  assert.equal(r.label, "Periodo");
});

test("TODAY / YESTERDAY / TOMORROW are single days", () => {
  const today = resolvePeriod(PeriodPreset.TODAY, REF);
  startEq(today.startDate, 2026, 5, 17);
  endEq(today.endDate, 2026, 5, 17);

  const yst = resolvePeriod(PeriodPreset.YESTERDAY, REF);
  startEq(yst.startDate, 2026, 5, 16);
  endEq(yst.endDate, 2026, 5, 16);

  const tmr = resolvePeriod(PeriodPreset.TOMORROW, REF);
  startEq(tmr.startDate, 2026, 5, 18);
  endEq(tmr.endDate, 2026, 5, 18);
});

test("WEEK starts on Monday", () => {
  const wk = resolvePeriod(PeriodPreset.THIS_WEEK, REF);
  startEq(wk.startDate, 2026, 5, 15); // Monday
  endEq(wk.endDate, 2026, 5, 21); // Sunday

  const last = resolvePeriod(PeriodPreset.LAST_WEEK, REF);
  startEq(last.startDate, 2026, 5, 8);
  endEq(last.endDate, 2026, 5, 14);

  const next = resolvePeriod(PeriodPreset.NEXT_WEEK, REF);
  startEq(next.startDate, 2026, 5, 22);
  endEq(next.endDate, 2026, 5, 28);
});

test("QUINZENA is a calendar fortnight and can cross months", () => {
  // Ref day 17 -> second fortnight (16..30 of June).
  const thisQ = resolvePeriod(PeriodPreset.THIS_QUINZENA, REF);
  startEq(thisQ.startDate, 2026, 5, 16);
  endEq(thisQ.endDate, 2026, 5, 30);

  // Previous fortnight -> first half of June.
  const lastQ = resolvePeriod(PeriodPreset.LAST_QUINZENA, REF);
  startEq(lastQ.startDate, 2026, 5, 1);
  endEq(lastQ.endDate, 2026, 5, 15);

  // Next fortnight -> first half of July.
  const nextQ = resolvePeriod(PeriodPreset.NEXT_QUINZENA, REF);
  startEq(nextQ.startDate, 2026, 6, 1);
  endEq(nextQ.endDate, 2026, 6, 15);

  // From the first fortnight, previous crosses into the prior month's second half.
  const firstHalfRef = new Date(2026, 5, 5);
  const crossing = resolvePeriod(PeriodPreset.LAST_QUINZENA, firstHalfRef);
  startEq(crossing.startDate, 2026, 4, 16); // May 16
  endEq(crossing.endDate, 2026, 4, 31); // May 31
});

test("MONTH bounds", () => {
  startEq(resolvePeriod(PeriodPreset.THIS_MONTH, REF).startDate, 2026, 5, 1);
  endEq(resolvePeriod(PeriodPreset.THIS_MONTH, REF).endDate, 2026, 5, 30);
  startEq(resolvePeriod(PeriodPreset.LAST_MONTH, REF).startDate, 2026, 4, 1);
  endEq(resolvePeriod(PeriodPreset.LAST_MONTH, REF).endDate, 2026, 4, 31);
  startEq(resolvePeriod(PeriodPreset.NEXT_MONTH, REF).startDate, 2026, 6, 1);
  endEq(resolvePeriod(PeriodPreset.NEXT_MONTH, REF).endDate, 2026, 6, 31);
});

test("QUARTER bounds (Apr-Jun for June)", () => {
  startEq(resolvePeriod(PeriodPreset.THIS_QUARTER, REF).startDate, 2026, 3, 1);
  endEq(resolvePeriod(PeriodPreset.THIS_QUARTER, REF).endDate, 2026, 5, 30);
  startEq(resolvePeriod(PeriodPreset.NEXT_QUARTER, REF).startDate, 2026, 6, 1); // Jul
  endEq(resolvePeriod(PeriodPreset.NEXT_QUARTER, REF).endDate, 2026, 8, 30); // Sep
});

test("SEMESTER bounds (Jan-Jun for June)", () => {
  startEq(resolvePeriod(PeriodPreset.THIS_SEMESTER, REF).startDate, 2026, 0, 1);
  endEq(resolvePeriod(PeriodPreset.THIS_SEMESTER, REF).endDate, 2026, 5, 30);
  startEq(resolvePeriod(PeriodPreset.NEXT_SEMESTER, REF).startDate, 2026, 6, 1);
  endEq(resolvePeriod(PeriodPreset.NEXT_SEMESTER, REF).endDate, 2026, 11, 31);
});

test("YEAR bounds", () => {
  startEq(resolvePeriod(PeriodPreset.THIS_YEAR, REF).startDate, 2026, 0, 1);
  endEq(resolvePeriod(PeriodPreset.THIS_YEAR, REF).endDate, 2026, 11, 31);
  startEq(resolvePeriod(PeriodPreset.LAST_YEAR, REF).startDate, 2025, 0, 1);
  endEq(resolvePeriod(PeriodPreset.LAST_YEAR, REF).endDate, 2025, 11, 31);
});

test("minDate / maxDate clamp the resolved interval", () => {
  const min = new Date(2026, 5, 10, 8, 0, 0, 0);
  const max = new Date(2026, 5, 20, 8, 0, 0, 0);
  const r = resolvePeriod(PeriodPreset.THIS_MONTH, REF, { minDate: min, maxDate: max });
  assert.equal(r.startDate.getTime(), min.getTime());
  assert.equal(r.endDate.getTime(), max.getTime());
});

test("locale option drives the label", () => {
  assert.equal(resolvePeriod(PeriodPreset.THIS_MONTH, REF, { locale: "en-US" }).label, "This month");
  assert.equal(resolvePeriod(PeriodPreset.THIS_MONTH, REF, { locale: "fr" }).label, "Ce mois");
  assert.equal(periodPresetLabel(PeriodPreset.THIS_MONTH, "pt-BR"), "Este mes");
});
