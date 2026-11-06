import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

// P146.F1.T2: toda chave `components.*` usada no codigo (t(i18n, "chave")) existe nos 5 idiomas. Sem isso o
// componente cai no texto de reserva (fallback) em um idioma so e ninguem percebe.
const root = path.join(process.cwd(), "src");
const LOCALES = ["pt-BR", "pt-PT", "en-US", "es", "fr"];

function keysOf(locale) {
  const text = fs.readFileSync(path.join(root, "i18n", `${locale}.ts`), "utf8");
  return new Set([...text.matchAll(/"(components\.[A-Za-z0-9_.]+)"\s*:/g)].map((m) => m[1]));
}

function usedKeys() {
  const used = new Map();
  (function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== "i18n") walk(file);
      } else if (/\.tsx?$/.test(entry.name) && !/\.meta\./.test(entry.name)) {
        const text = fs.readFileSync(file, "utf8");
        for (const m of text.matchAll(/\bt\(\s*[A-Za-z0-9_.]+\s*,\s*"(components\.[A-Za-z0-9_.]+)"/g)) {
          if (!used.has(m[1])) used.set(m[1], path.relative(root, file));
        }
      }
    }
  })(root);
  return used;
}

test("toda chave components.* usada no codigo existe nos 5 idiomas", () => {
  const dictionaries = Object.fromEntries(LOCALES.map((l) => [l, keysOf(l)]));
  const used = usedKeys();
  assert.ok(used.size > 100, `poucas chaves encontradas (${used.size}): o scanner quebrou?`);
  const missing = [];
  for (const [key, file] of used) {
    const where = LOCALES.filter((l) => !dictionaries[l].has(key));
    if (where.length > 0) missing.push(`${key} falta em ${where.join(", ")} (${file})`);
  }
  assert.deepEqual(missing, []);
});
