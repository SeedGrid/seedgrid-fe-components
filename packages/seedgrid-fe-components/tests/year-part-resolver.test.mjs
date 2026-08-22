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

const {
  YearPartKind,
  resolveYearPart,
  yearPartOptions,
  yearPartLabel,
  yearPartCount,
  yearPartMonths,
  isValidYearPart,
  clampYearPart,
  yearPartOf
} = require("../dist/sandbox.cjs");

Module._load = originalLoad;

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

/* ------------------------------------------------------------------ */
/* Forma do recorte                                                    */
/* ------------------------------------------------------------------ */

test("cada recorte divide o ano em fatias de tamanho igual", () => {
  assert.equal(yearPartCount(YearPartKind.SEMESTER), 2);
  assert.equal(yearPartCount(YearPartKind.QUARTER), 4);
  assert.equal(yearPartCount(YearPartKind.BIMESTER), 6);

  assert.equal(yearPartMonths(YearPartKind.SEMESTER), 6);
  assert.equal(yearPartMonths(YearPartKind.QUARTER), 3);
  assert.equal(yearPartMonths(YearPartKind.BIMESTER), 2);
});

test("as fatias de um recorte cobrem o ano inteiro, sem buraco nem sobreposicao", () => {
  for (const kind of [YearPartKind.SEMESTER, YearPartKind.QUARTER, YearPartKind.BIMESTER]) {
    const total = yearPartCount(kind);
    let previousEnd = null;
    for (let part = 1; part <= total; part += 1) {
      const { startDate, endDate } = resolveYearPart({ year: 2026, kind, part });
      if (part === 1) {
        startEq(startDate, 2026, 0, 1);
      } else {
        // O inicio desta fatia e' o instante seguinte ao fim da anterior.
        assert.equal(startDate.getTime() - previousEnd.getTime(), 1, `${kind} fatia ${part}`);
      }
      if (part === total) {
        endEq(endDate, 2026, 11, 31);
      }
      previousEnd = endDate;
    }
  }
});

/* ------------------------------------------------------------------ */
/* Intervalos concretos                                                */
/* ------------------------------------------------------------------ */

test("semestre resolve para os dois blocos de 6 meses", () => {
  const first = resolveYearPart({ year: 2026, kind: YearPartKind.SEMESTER, part: 1 });
  startEq(first.startDate, 2026, 0, 1);
  endEq(first.endDate, 2026, 5, 30); // 30/06

  const second = resolveYearPart({ year: 2026, kind: YearPartKind.SEMESTER, part: 2 });
  startEq(second.startDate, 2026, 6, 1);
  endEq(second.endDate, 2026, 11, 31);
});

test("trimestre resolve para os quatro blocos de 3 meses", () => {
  const esperado = [
    [0, 1, 2, 31], // Q1: 01/01 a 31/03
    [3, 1, 5, 30], // Q2: 01/04 a 30/06
    [6, 1, 8, 30], // Q3: 01/07 a 30/09
    [9, 1, 11, 31] // Q4: 01/10 a 31/12
  ];
  esperado.forEach(([startMonth, startDay, endMonth, endDay], index) => {
    const { startDate, endDate } = resolveYearPart({
      year: 2026,
      kind: YearPartKind.QUARTER,
      part: index + 1
    });
    startEq(startDate, 2026, startMonth, startDay);
    endEq(endDate, 2026, endMonth, endDay);
  });
});

test("bimestre resolve para os seis blocos de 2 meses", () => {
  const primeiro = resolveYearPart({ year: 2026, kind: YearPartKind.BIMESTER, part: 1 });
  startEq(primeiro.startDate, 2026, 0, 1);
  endEq(primeiro.endDate, 2026, 1, 28); // 2026 nao e' bissexto

  const ultimo = resolveYearPart({ year: 2026, kind: YearPartKind.BIMESTER, part: 6 });
  startEq(ultimo.startDate, 2026, 10, 1);
  endEq(ultimo.endDate, 2026, 11, 31);
});

/* ------------------------------------------------------------------ */
/* Fevereiro — o dia que a conta erra quando ha' tabela fixa            */
/* ------------------------------------------------------------------ */

test("fevereiro fecha em 29 no ano bissexto e em 28 fora dele", () => {
  // 2024 e' bissexto; 2025 nao; 2100 tambem nao (divisivel por 100 e nao por 400).
  endEq(resolveYearPart({ year: 2024, kind: YearPartKind.BIMESTER, part: 1 }).endDate, 2024, 1, 29);
  endEq(resolveYearPart({ year: 2025, kind: YearPartKind.BIMESTER, part: 1 }).endDate, 2025, 1, 28);
  endEq(resolveYearPart({ year: 2000, kind: YearPartKind.BIMESTER, part: 1 }).endDate, 2000, 1, 29);
  endEq(resolveYearPart({ year: 2100, kind: YearPartKind.BIMESTER, part: 1 }).endDate, 2100, 1, 28);
});

/* ------------------------------------------------------------------ */
/* Validacao                                                           */
/* ------------------------------------------------------------------ */

test("fatia fora da faixa do recorte e' recusada", () => {
  assert.equal(isValidYearPart(YearPartKind.SEMESTER, 3), false);
  assert.equal(isValidYearPart(YearPartKind.QUARTER, 5), false);
  assert.equal(isValidYearPart(YearPartKind.BIMESTER, 7), false);
  assert.equal(isValidYearPart(YearPartKind.QUARTER, 0), false);
  assert.equal(isValidYearPart(YearPartKind.QUARTER, 1.5), false);
  assert.equal(isValidYearPart(YearPartKind.QUARTER, 4), true);
});

test("resolver com fatia inexistente lanca em vez de devolver intervalo errado", () => {
  assert.throws(
    () => resolveYearPart({ year: 2026, kind: YearPartKind.SEMESTER, part: 3 }),
    RangeError
  );
  assert.throws(
    () => resolveYearPart({ year: 2026.5, kind: YearPartKind.QUARTER, part: 1 }),
    RangeError
  );
});

test("clamp mantem a fatia quando ela cabe e volta pra primeira quando nao cabe", () => {
  // O caso real: usuario estava no Q4 e trocou o recorte para semestre, que so' tem 2.
  assert.equal(clampYearPart(YearPartKind.SEMESTER, 4), 1);
  assert.equal(clampYearPart(YearPartKind.SEMESTER, 2), 2);
  assert.equal(clampYearPart(YearPartKind.BIMESTER, 4), 4);
});

/* ------------------------------------------------------------------ */
/* Rotulos                                                             */
/* ------------------------------------------------------------------ */

test("rotulo traz a sigla certa de cada lingua", () => {
  // Q e' do portugues do Brasil e do ingles; es/fr/pt-PT dizem T.
  assert.equal(yearPartLabel(YearPartKind.QUARTER, 1, "pt-BR"), "Trimestre 1 (Q1)");
  assert.equal(yearPartLabel(YearPartKind.QUARTER, 1, "en-US"), "Quarter 1 (Q1)");
  assert.equal(yearPartLabel(YearPartKind.QUARTER, 3, "es"), "Trimestre 3 (T3)");
  assert.equal(yearPartLabel(YearPartKind.QUARTER, 3, "fr"), "Trimestre 3 (T3)");
  assert.equal(yearPartLabel(YearPartKind.QUARTER, 2, "pt-PT"), "Trimestre 2 (T2)");

  assert.equal(yearPartLabel(YearPartKind.SEMESTER, 1, "pt-BR"), "Semestre 1 (S1)");
  assert.equal(yearPartLabel(YearPartKind.SEMESTER, 2, "en-US"), "Half-year 2 (H2)");

  // Bimestre nao tem sigla consagrada em lingua nenhuma: sai sem parenteses.
  assert.equal(yearPartLabel(YearPartKind.BIMESTER, 5, "pt-BR"), "Bimestre 5");
});

test("locale desconhecido cai no pt-BR em vez de sair vazio", () => {
  assert.equal(yearPartLabel(YearPartKind.QUARTER, 1, "de-DE"), "Trimestre 1 (Q1)");
});

test("as opcoes do combo saem completas e na ordem", () => {
  const opcoes = yearPartOptions(YearPartKind.BIMESTER, "pt-BR");
  assert.equal(opcoes.length, 6);
  assert.deepEqual(
    opcoes.map((o) => o.value),
    [1, 2, 3, 4, 5, 6]
  );
  assert.equal(opcoes[0].label, "Bimestre 1");
  assert.equal(yearPartOptions(YearPartKind.SEMESTER).length, 2);
  assert.equal(yearPartOptions(YearPartKind.QUARTER).length, 4);
});

/* ------------------------------------------------------------------ */
/* Em que fatia uma data cai                                           */
/* ------------------------------------------------------------------ */

test("yearPartOf acha a fatia de uma data em cada recorte", () => {
  const agosto = new Date(2026, 7, 22); // 22/08/2026

  assert.deepEqual(yearPartOf(agosto, YearPartKind.SEMESTER), {
    year: 2026,
    kind: YearPartKind.SEMESTER,
    part: 2
  });
  assert.deepEqual(yearPartOf(agosto, YearPartKind.QUARTER), {
    year: 2026,
    kind: YearPartKind.QUARTER,
    part: 3
  });
  assert.deepEqual(yearPartOf(agosto, YearPartKind.BIMESTER), {
    year: 2026,
    kind: YearPartKind.BIMESTER,
    part: 4
  });
});

test("yearPartOf e resolveYearPart sao consistentes: a data cai dentro do intervalo devolvido", () => {
  for (const kind of [YearPartKind.SEMESTER, YearPartKind.QUARTER, YearPartKind.BIMESTER]) {
    for (let month = 0; month < 12; month += 1) {
      const data = new Date(2026, month, 15);
      const { startDate, endDate } = resolveYearPart(yearPartOf(data, kind));
      assert.ok(
        data >= startDate && data <= endDate,
        `${kind}: ${data.toISOString()} fora de ${startDate.toISOString()}..${endDate.toISOString()}`
      );
    }
  }
});
