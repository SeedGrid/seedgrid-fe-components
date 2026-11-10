import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, mkdtempSync, readFileSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { createRequire, } from "node:module";
import { pathToFileURL } from "node:url";

// Paridade de tema com o Flutter: os vetores sao gravados DESTE codigo (tools/parity_vectors/generate_theme.mjs no repo
// Flutter) e o Dart os confere. Aqui o React confere que ainda produz exatamente o gravado, entao qualquer mudanca nos
// tokens de severidade (success, info, warning, error: escalas, on-cores, hover) sem regerar os vetores falha.
const THEME_SRC = resolve(process.cwd(), "..", "seedgrid-fe-theme", "src", "theme");
const VECTORS = resolve(process.cwd(), "..", "..", "..", "seedgrid-fe-flutter", "packages", "seedgrid_theme", "test", "parity", "theme_vectors.json");

function findEsbuild() {
  const pnpm = resolve(process.cwd(), "..", "..", "node_modules", ".pnpm");
  const hit = readdirSync(pnpm).filter((n) => /^esbuild@/.test(n)).sort().pop();
  return hit ? join(pnpm, hit, "node_modules", "esbuild", "lib", "main.js") : null;
}

const esbuildPath = existsSync(VECTORS) ? findEsbuild() : null;
const available = Boolean(esbuildPath);

async function load(entry) {
  const esbuild = createRequire(import.meta.url)(esbuildPath);
  const dir = mkdtempSync(join(tmpdir(), "sg-theme-"));
  const outfile = join(dir, "out.mjs");
  await esbuild.build({ entryPoints: [join(THEME_SRC, entry)], bundle: true, format: "esm", platform: "node", outfile, logLevel: "silent" });
  return import(pathToFileURL(outfile).href);
}

test("pickOnColor identico ao gravado (contraste minimo 4,5:1)", { skip: !available }, async () => {
  const V = JSON.parse(readFileSync(VECTORS, "utf8"));
  const { pickOnColor } = await load("colorUtils.ts");
  for (const c of V.pickOnColor) assert.equal(pickOnColor(c.in), c.out, JSON.stringify(c));
});

test("generateThemeVars: todas as variaveis (severidades e overrides inclusos) iguais ao gravado", { skip: !available }, async () => {
  const V = JSON.parse(readFileSync(VECTORS, "utf8"));
  const { generateThemeVars } = await load("themeGenerator.ts");
  const { generateComponentTokens } = await load("componentTokens.ts");
  // Igual ao SeedThemeProvider: variaveis base + tokens de componente.
  const themeVars = (input, mode) => {
    const base = generateThemeVars(input, mode);
    return { ...base, ...generateComponentTokens(base) };
  };
  for (const t of V.themes) assert.deepEqual(themeVars(t.input, t.mode), t.vars, JSON.stringify(t.input) + " " + t.mode);
  const severity = /^--sg-(success|info|warning|error)-(50|500|900|hover)$|^--sg-on-(success|info|warning|error)$/;
  const keys = Object.keys(V.themes[0].vars).filter((k) => severity.test(k));
  assert.ok(keys.length >= 16, "tokens de severidade presentes nos vetores");
  assert.ok(V.themes.some((t) => t.input.warning && t.input.error && t.input.info && t.input.success), "override de cores semanticas coberto");
});
