import assert from "node:assert/strict";
import test from "node:test";
import { mkdtempSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

// P155.F3.T19 (simplificada): as 7 predefinicoes do seletor de tema. Regras:
//  - texto sobre o fundo cheio (cor pura da semente): preto/branco automatico >= 4,5:1;
//  - borda, anel e rotulo dos campos no claro usam a PROPRIA SEMENTE (sem correcao automatica);
//  - borda e rotulo sao so MEDIDOS (nao ha correcao automatica); cor livre so ganha aviso abaixo de 2:1.
// Mantenha a lista igual a PRESET_COLORS de apps/showcase/src/app/ThemeEditor.tsx.
const PRESETS = [
  { name: "Verde SeedGrid", value: "#16803D" },
  { name: "Azul", value: "#0EA5E9" },
  { name: "Roxo", value: "#7C3AED" },
  { name: "Rosa", value: "#EC4899" },
  { name: "Laranja", value: "#F97316" },
  { name: "Vermelho", value: "#EF4444" },
  { name: "Verde", value: "#10B981" },
];

const THEME_SRC = resolve(process.cwd(), "..", "seedgrid-fe-theme", "src", "theme");

function findEsbuild() {
  const pnpm = resolve(process.cwd(), "..", "..", "node_modules", ".pnpm");
  const hit = readdirSync(pnpm).filter((n) => /^esbuild@/.test(n)).sort().pop();
  return hit ? join(pnpm, hit, "node_modules", "esbuild", "lib", "main.js") : null;
}
const esbuildPath = findEsbuild();

async function load(entry) {
  const esbuild = createRequire(import.meta.url)(esbuildPath);
  const dir = mkdtempSync(join(tmpdir(), "sg-presets-"));
  const outfile = join(dir, "out.mjs");
  await esbuild.build({ entryPoints: [join(THEME_SRC, entry)], bundle: true, format: "esm", platform: "node", outfile, logLevel: "silent" });
  return import(pathToFileURL(outfile).href);
}

const hslOf = (cu, hex) => {
  const { r, g, b } = cu.hexToRgb(hex);
  const { h, s, l } = cu.rgbToHsl(r, g, b);
  return `${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%`;
};

test("predefinicoes: texto no botao cheio >= 4,5:1; borda/anel/rotulo na semente ", { skip: !esbuildPath }, async () => {
  const cu = await load("colorUtils.ts");
  const { generateThemeVars } = await load("themeGenerator.ts");
  const medidas = [];
  for (const p of PRESETS) {
    const vars = generateThemeVars({ seed: p.value }, "light");
    const on = cu.pickOnColor(p.value);
    assert.ok(cu.contrastRatio(p.value, on) >= 4.5, `${p.name}: texto ${on} sobre ${p.value}`);
    const campo = p.value;
    assert.equal(vars["--primary"], hslOf(cu, campo), `${p.name}: --primary`);
    assert.equal(vars["--sg-ring"], cu.toRgbVarValue(campo), `${p.name}: --sg-ring`);
    assert.equal(vars["--primary-fill"], hslOf(cu, p.value), `${p.name}: --primary-fill (cor pura)`);
    medidas.push(`${p.name} ${campo} ${cu.lightContrastOf(campo, p.value).toFixed(2)}:1`);
  }
  // borda e rotulo sao so medidos; toda predefinicao precisa ficar fora do aviso (>= 2:1)
  for (const p of PRESETS) assert.ok(cu.lightContrastOf(p.value, p.value) >= 2, `${p.name} abaixo de 2:1`);
  console.log("contraste borda/rotulo (claro):", medidas.join(" | "));
});

test("cor livre: sem correcao automatica; so avisa abaixo de 2:1", { skip: !esbuildPath }, async () => {
  const cu = await load("colorUtils.ts");
  const { generateThemeVars } = await load("themeGenerator.ts");
  for (const seed of ["#FACC15", "#84CC16", "#FFFF00", "#16803D"]) {
    const vars = generateThemeVars({ seed }, "light");
    assert.equal(vars["--primary"], hslOf(cu, seed), seed);
  }
  assert.equal(cu.isLowContrastOnLight("#FACC15"), true);
  assert.equal(cu.isLowContrastOnLight("#84CC16"), true);
  assert.equal(cu.isLowContrastOnLight("#F59E0B"), true);
  for (const p of PRESETS) assert.equal(cu.isLowContrastOnLight(p.value), false, p.name);
});
