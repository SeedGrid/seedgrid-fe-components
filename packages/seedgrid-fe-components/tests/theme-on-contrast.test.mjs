import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, mkdtempSync, readFileSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

// Escolha do texto sobre um fundo por contraste minimo (4,5:1). Mesma regra do Flutter (seedgrid_theme):
// o primeiro candidato [#FFFFFF, #0B0B0C] com razao >= 4,5; sem nenhum que alcance, o de maior contraste.
const THEME_SRC = resolve(process.cwd(), "..", "seedgrid-fe-theme", "src", "theme");
const VECTORS = resolve(process.cwd(), "..", "..", "..", "seedgrid-fe-flutter", "packages", "seedgrid_theme", "test", "parity", "theme_vectors.json");

function findEsbuild() {
  const pnpm = resolve(process.cwd(), "..", "..", "node_modules", ".pnpm");
  const hit = readdirSync(pnpm).filter((n) => /^esbuild@/.test(n)).sort().pop();
  return hit ? join(pnpm, hit, "node_modules", "esbuild", "lib", "main.js") : null;
}

const esbuildPath = findEsbuild();

async function load(entry) {
  const esbuild = createRequire(import.meta.url)(esbuildPath);
  const dir = mkdtempSync(join(tmpdir(), "sg-oncolor-"));
  const outfile = join(dir, "out.mjs");
  await esbuild.build({ entryPoints: [join(THEME_SRC, entry)], bundle: true, format: "esm", platform: "node", outfile, logLevel: "silent" });
  return import(pathToFileURL(outfile).href);
}

const PAIRS = {
  "--sg-on-primary": "--sg-primary-500",
  "--sg-on-secondary": "--sg-secondary-500",
  "--sg-on-tertiary": "--sg-tertiary-500",
  "--sg-on-error": "--sg-error-500",
  "--sg-on-warning": "--sg-warning-500",
  "--sg-on-info": "--sg-info-500",
  "--sg-on-success": "--sg-success-500",
  "--sg-on-badge": "--sg-badge",
  "--sg-on-tooltip": "--sg-tooltip",
};

const SEEDS = {
  "padrao (verde SeedGrid)": "#16803D",
  verde: "#22C55E",
  azul: "#2563EB",
  laranja: "#F59E0B",
  "laranja forte": "#FF8800",
  vermelho: "#EF4444",
  amarelo: "#FACC15",
  roxo: "#8B5CF6",
  cinza: "#6B7280",
  teal: "#14B8A6",
};

test("constantes e casos claros, escuros e medios", { skip: !esbuildPath }, async () => {
  const cu = await load("colorUtils.ts");
  assert.equal(cu.MIN_CONTRAST_RATIO, 4.5);
  assert.deepEqual([...cu.ON_COLOR_CANDIDATES], ["#FFFFFF", "#0B0B0C"]);
  const expected = {
    "#FFFFFF": "#0B0B0C", "#F5F5F5": "#0B0B0C", "#000000": "#FFFFFF",
    "#16803D": "#FFFFFF", "#1FA84F": "#0B0B0C", "#F59E0B": "#0B0B0C", "#E0541E": "#0B0B0C",
    "#EF4444": "#0B0B0C", "#D32F2F": "#FFFFFF", "#808080": "#0B0B0C",
    "#767676": "#FFFFFF", // limiar: 4,54 com branco
    "#777777": "#FFFFFF", // 4,48 branco / 4,39 preto: nenhum alcanca, vence o maior
    "#B04AD4": "#0B0B0C", // 4,40 branco / 4,47 preto: nenhum alcanca, vence o maior
  };
  for (const [bg, on] of Object.entries(expected)) assert.equal(cu.pickOnColor(bg), on, bg);
  assert.ok(Math.abs(cu.contrastRatio("#000000", "#FFFFFF") - 21) < 1e-9);
});

test("varredura: razao >= 4,5 sempre que algum candidato alcanca", { skip: !esbuildPath }, async () => {
  const cu = await load("colorUtils.ts");
  const best = (bg) => Math.max(...cu.ON_COLOR_CANDIDATES.map((c) => cu.contrastRatio(bg, c)));
  for (let h = 0; h < 360; h += 15) for (const s of [0, 25, 50, 75, 100]) for (let l = 5; l <= 95; l += 5) {
    const bg = cu.hslToHex(h, s, l);
    const out = cu.pickOnColor(bg);
    assert.ok(cu.ON_COLOR_CANDIDATES.includes(out), bg);
    if (best(bg) >= cu.MIN_CONTRAST_RATIO) assert.ok(cu.contrastRatio(bg, out) >= cu.MIN_CONTRAST_RATIO, `${bg} -> ${out}`);
    else assert.equal(cu.contrastRatio(bg, out), best(bg), bg);
  }
});

test("mesmo texto que o Flutter para os mesmos fundos (varredura gravada nos vetores)", { skip: !esbuildPath || !existsSync(VECTORS) }, async () => {
  const V = JSON.parse(readFileSync(VECTORS, "utf8"));
  const cu = await load("colorUtils.ts");
  assert.equal(V.minContrastRatio, cu.MIN_CONTRAST_RATIO);
  assert.ok(V.pickOnColorSweep.length > 200);
  for (const c of V.pickOnColorSweep) assert.equal(cu.pickOnColor(c.in), c.out, JSON.stringify(c));
});

test("regressao: todo par fundo/on gerado pelo tema tem contraste >= 4,5 (ou o melhor possivel)", { skip: !esbuildPath }, async () => {
  const cu = await load("colorUtils.ts");
  const { generateThemeVars } = await load("themeGenerator.ts");
  const { generateComponentTokens } = await load("componentTokens.ts");
  const toHex = (v) => { const [r, g, b] = v.split(" ").map(Number); return cu.rgbToHex(r, g, b); };
  const best = (bg) => Math.max(...cu.ON_COLOR_CANDIDATES.map((c) => cu.contrastRatio(bg, c)));
  for (const [name, seed] of Object.entries(SEEDS)) for (const mode of ["light", "dark"]) {
    const base = generateThemeVars({ seed }, mode);
    const vars = { ...base, ...generateComponentTokens(base) };
    for (const [onKey, bgKey] of Object.entries(PAIRS)) {
      const bg = toHex(vars[bgKey]);
      const on = toHex(vars[onKey]);
      const why = `${name} ${mode}: ${onKey} sobre ${bgKey} (${bg}, ${on})`;
      assert.ok(cu.ON_COLOR_CANDIDATES.includes(on.toUpperCase()), why);
      if (best(bg) >= cu.MIN_CONTRAST_RATIO) assert.ok(cu.contrastRatio(bg, on) >= cu.MIN_CONTRAST_RATIO, why);
      else assert.equal(cu.contrastRatio(bg, on), best(bg), why);
    }
  }
});

// O botao pinta o fundo no tom 600 (--sg-btn-*-bg); o texto (--sg-btn-*-fg) e escolhido sobre ESSE fundo,
// nao sobre o tom 500 usado por --sg-on-*.
test("regressao: par real do botao (bg 600 x fg) tem contraste >= 4,5 (ou o melhor possivel)", { skip: !esbuildPath }, async () => {
  const cu = await load("colorUtils.ts");
  const { generateThemeVars } = await load("themeGenerator.ts");
  const { generateComponentTokens } = await load("componentTokens.ts");
  const toHex = (v) => { const [r, g, b] = v.replace(/[^\d ]/g, "").trim().split(" ").map(Number); return cu.rgbToHex(r, g, b); };
  const best = (bg) => Math.max(...cu.ON_COLOR_CANDIDATES.map((c) => cu.contrastRatio(bg, c)));
  const roles = ["primary", "secondary", "success", "info", "warning", "danger", "help"];
  for (const [name, seed] of Object.entries(SEEDS)) for (const mode of ["light", "dark"]) {
    const base = generateThemeVars({ seed }, mode);
    const vars = { ...base, ...generateComponentTokens(base) };
    for (const role of roles) {
      const bg = toHex(vars[`--sg-btn-${role}-bg`]);
      const fg = toHex(vars[`--sg-btn-${role}-fg`]);
      const why = `${name} ${mode}: botao ${role} (${bg}, ${fg})`;
      assert.equal(fg.toUpperCase(), cu.pickOnColor(bg), why);
      if (best(bg) >= cu.MIN_CONTRAST_RATIO) assert.ok(cu.contrastRatio(bg, fg) >= cu.MIN_CONTRAST_RATIO, why);
      else assert.equal(cu.contrastRatio(bg, fg), best(bg), why);
    }
    // --primary-foreground / --sg-on-primary continuam sobre o tom 500 (--primary).
    assert.equal(toHex(vars["--sg-on-primary"]).toUpperCase(), cu.pickOnColor(toHex(vars["--sg-primary-500"])), `${name} ${mode}: on-primary`);
  }
});
