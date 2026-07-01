// Guardrail de i18n do showcase. Como o helper `t()` cai em fallback literal quando falta traducao,
// chaves ausentes nao quebram nada em runtime — passam despercebidas. Este teste torna isso visivel:
//
//  1. pt-BR / pt-PT / es devem ter o MESMO conjunto de chaves (pega traducao parcial: adicionou em um
//     locale e esqueceu os outros).
//  2. en-US e o superset de referencia: nenhum locale nao-en pode ter chave que falte no en-US.
//  3. Ratchet: o gap "so em en-US" (traducoes pendentes) NAO pode crescer alem do baseline atual.
//     Ao traduzir chaves nos 3 locales, ABAIXE o baseline. Adicionar chave nova so no en-US quebra aqui.
//  4. A metadata inline do nav (COMPONENT_HINT_TEXTS_BY_SLUG) deve trazer os 4 locales em toda entrada.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const i18nDir = path.resolve(__dirname, "..", "src", "i18n");
const shellPath = path.resolve(__dirname, "..", "src", "app", "ShowcaseShell.tsx");

const loadKeys = (locale) => {
  // Os bundles JSON tem BOM (U+FEFF); JSON.parse nao o remove sozinho.
  let raw = readFileSync(path.join(i18nDir, `${locale}.json`), "utf8");
  if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1);
  return new Set(Object.keys(JSON.parse(raw)));
};

// Debito atual: chaves que existem em en-US e ainda faltam em pt-BR/pt-PT/es. Ratchet: nunca sobe.
// Ao traduzir, ABAIXE este numero para travar o progresso.
const EN_ONLY_BASELINE = 0;

// Frances em rollout: locale de primeira classe, mas ainda parcial (o resto cai no en-US via t()).
// Ratchet proprio: as chaves do en-US ainda sem fr NAO podem crescer. Ao traduzir, ABAIXE ate 0.
const FR_BASELINE = 0;

// Paginas de componente que NAO usam i18n (0 chamadas a `t(i18n`) — texto hardcoded, nao traduz em
// nenhum locale. Debito pre-existente. Ratchet: nao pode crescer (sem novas paginas hardcoded); ao
// converter uma pagina para i18n, ABAIXE este numero (meta: 0).
const HARDCODED_PAGES_BASELINE = 0;

test("pt-BR / pt-PT / es tem o MESMO conjunto de chaves (sem traducao parcial)", () => {
  const ptbr = loadKeys("pt-BR");
  const ptpt = loadKeys("pt-PT");
  const es = loadKeys("es");
  const diff = (a, b, la, lb) => [...a].filter((k) => !b.has(k)).map((k) => `${la}\\${lb}: ${k}`);
  const problems = [
    ...diff(ptbr, ptpt, "pt-BR", "pt-PT"),
    ...diff(ptpt, ptbr, "pt-PT", "pt-BR"),
    ...diff(ptbr, es, "pt-BR", "es"),
    ...diff(es, ptbr, "es", "pt-BR"),
  ];
  assert.equal(problems.length, 0, `Chaves fora de paridade entre pt-BR/pt-PT/es:\n${problems.slice(0, 20).join("\n")}`);
});

test("en-US e superset: nenhum locale nao-en tem chave ausente no en-US", () => {
  const en = loadKeys("en-US");
  const missing = ["pt-BR", "pt-PT", "es", "fr"].flatMap((l) =>
    [...loadKeys(l)].filter((k) => !en.has(k)).map((k) => `${l}: ${k}`)
  );
  assert.equal(missing.length, 0, `Chaves em locale nao-en ausentes no en-US:\n${missing.slice(0, 20).join("\n")}`);
});

test(`gap de traducao (chaves so em en-US) nao cresce alem de ${EN_ONLY_BASELINE}`, () => {
  const en = loadKeys("en-US");
  const ptbr = loadKeys("pt-BR");
  const enOnly = [...en].filter((k) => !ptbr.has(k));
  assert.ok(
    enOnly.length <= EN_ONLY_BASELINE,
    `Gap en-US-only subiu para ${enOnly.length} (baseline ${EN_ONLY_BASELINE}). ` +
      `Traduza as chaves novas em pt-BR/pt-PT/es, ou ajuste EN_ONLY_BASELINE com justificativa.`
  );
});

test(`gap do frances (chaves do en-US ainda sem fr) nao cresce alem de ${FR_BASELINE}`, () => {
  const en = loadKeys("en-US");
  const fr = loadKeys("fr");
  const enOnly = [...en].filter((k) => !fr.has(k));
  assert.ok(
    enOnly.length <= FR_BASELINE,
    `Gap do frances subiu para ${enOnly.length} (baseline ${FR_BASELINE}). ` +
      `Traduza mais chaves em fr.json e ABAIXE FR_BASELINE (meta: 0).`
  );
});

test(`paginas de componente hardcoded (sem t(i18n)) nao crescem alem de ${HARDCODED_PAGES_BASELINE}`, () => {
  const componentsDir = path.resolve(__dirname, "..", "src", "app", "components");
  const pages = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (entry === "page.tsx") pages.push(full);
    }
  };
  walk(componentsDir);
  const hardcoded = pages.filter((p) => !readFileSync(p, "utf8").includes("t(i18n"));
  assert.ok(
    hardcoded.length <= HARDCODED_PAGES_BASELINE,
    `Paginas hardcoded subiram para ${hardcoded.length} (baseline ${HARDCODED_PAGES_BASELINE}). ` +
      `Converta a nova pagina para i18n (t(i18n, ...)) ou, ao converter uma antiga, ABAIXE o baseline.`
  );
});

test("metadata inline do nav (COMPONENT_HINT_TEXTS_BY_SLUG) traz os 4 locales em toda entrada", () => {
  const src = readFileSync(shellPath, "utf8");
  const start = src.indexOf("COMPONENT_HINT_TEXTS_BY_SLUG");
  const braceStart = src.indexOf("{", start);
  let depth = 0;
  let end = -1;
  for (let i = braceStart; i < src.length; i++) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}" && --depth === 0) {
      end = i;
      break;
    }
  }
  const block = src.slice(braceStart, end + 1);
  const entryRe = /"([a-z0-9-/]+)":\s*\{([^}]*)\}/g;
  const LOCALES = ["pt-BR", "pt-PT", "en-US", "es"];
  const incomplete = [];
  let m;
  while ((m = entryRe.exec(block))) {
    const [, slug, body] = m;
    const present = LOCALES.filter((l) => new RegExp(`("${l}"|(^|[^"])${l})\\s*:`).test(body));
    if (present.length < LOCALES.length) incomplete.push(`${slug} -> [${present.join(", ")}]`);
  }
  assert.equal(incomplete.length, 0, `Entradas de metadata do nav sem os 4 locales:\n${incomplete.join("\n")}`);
});
