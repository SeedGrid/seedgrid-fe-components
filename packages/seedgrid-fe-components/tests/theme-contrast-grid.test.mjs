import assert from "node:assert/strict";
import test from "node:test";
import { mkdtempSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

// P155.F3.T19: contraste do tema para QUALQUER semente. Grade: matiz de 5 em 5 graus x saturacao 20/50/80/100 x
// luminosidade 15..90 + extremos (branco, preto, cinzas, cores puras), tema claro e escuro. Texto fino >= 4,5:1;
// borda/icone sem texto >= 3:1. Mesma grade no Flutter (seedgrid_theme).
const THEME_SRC = resolve(process.cwd(), "..", "seedgrid-fe-theme", "src", "theme");

function findEsbuild() {
  const pnpm = resolve(process.cwd(), "..", "..", "node_modules", ".pnpm");
  const hit = readdirSync(pnpm).filter((n) => /^esbuild@/.test(n)).sort().pop();
  return hit ? join(pnpm, hit, "node_modules", "esbuild", "lib", "main.js") : null;
}
const esbuildPath = findEsbuild();

async function load(entry) {
  const esbuild = createRequire(import.meta.url)(esbuildPath);
  const dir = mkdtempSync(join(tmpdir(), "sg-grid-"));
  const outfile = join(dir, "out.mjs");
  await esbuild.build({ entryPoints: [join(THEME_SRC, entry)], bundle: true, format: "esm", platform: "node", outfile, logLevel: "silent" });
  return import(pathToFileURL(outfile).href);
}

const EXTREMES = ["#FFFFFF", "#000000", "#808080", "#777777", "#BBBBBB", "#444444", "#FFFF00", "#00FFFF", "#FF00FF", "#FF0000", "#00FF00", "#0000FF", "#FFFACD", "#1A1A1A"];
const SCALES = ["primary", "secondary", "tertiary", "warning", "error", "info", "success"];
const ROLES = { primary: "primary", secondary: "secondary", success: "success", info: "info", warning: "warning", danger: "error", help: "tertiary" };

test("contraste: toda semente da grade (claro e escuro) mantem texto >= 4,5:1 e borda/icone >= 3:1", { skip: !esbuildPath }, async () => {
  const cu = await load("colorUtils.ts");
  const { generateThemeVars } = await load("themeGenerator.ts");
  const { generateComponentTokens } = await load("componentTokens.ts");
  const hex = (v) => { const [r, g, b] = v.replace(/[^\d ]/g, "").trim().split(" ").map(Number); return cu.rgbToHex(r, g, b); };
  const seeds = [...EXTREMES];
  for (let h = 0; h < 360; h += 5) for (const s of [20, 50, 80, 100]) for (const l of [15, 30, 45, 60, 75, 90]) seeds.push(cu.hslToHex(h, s, l));
  const failures = [];
  let pairs = 0;
  const check = (why, a, b, min) => { pairs++; const r = cu.contrastRatio(a, b); if (r < min) failures.push(`${why}: ${a} x ${b} = ${r.toFixed(2)} < ${min}`); };
  for (const seed of seeds) for (const mode of ["light", "dark"]) {
    const base = generateThemeVars({ seed }, mode);
    const vars = { ...base, ...generateComponentTokens(base) };
    const bg = hex(base["--sg-bg"]), surface = hex(base["--sg-surface"]);
    const tag = `${seed} ${mode}`;
    for (const sc of SCALES) for (const stop of [400, 500, 600, 700, 800, 900]) {
      const c = hex(base[`--sg-${sc}-${stop}`]);
      check(`${tag} ${sc}-${stop} x fundo`, c, bg, 4.5);
      check(`${tag} ${sc}-${stop} x surface`, c, surface, 4.5);
    }
    check(`${tag} anel (foco)`, hex(base["--sg-ring"]), bg, 3);
    check(`${tag} texto`, hex(base["--sg-text"]), bg, 4.5);
    check(`${tag} texto suave`, hex(base["--sg-muted"]), surface, 4.5);
    for (const role of Object.keys(ROLES)) {
      // botao cheio (todos os estados): texto automatico sobre o preenchimento
      for (const st of ["", "hover-", "active-"]) check(`${tag} botao ${role} ${st || "normal"}`, hex(vars[`--sg-btn-${role}-${st}bg`]), hex(vars[`--sg-btn-${role}-${st}fg`]), 4.5);
      // botao com contorno/fantasma: texto e borda sobre o fundo e a surface
      const text = hex(vars[`--sg-btn-${role}-text`]);
      check(`${tag} contorno ${role} x fundo`, text, bg, 4.5);
      check(`${tag} contorno ${role} x surface`, text, surface, 4.5);
    }
  }
  assert.ok(pairs > 50000, `pares verificados: ${pairs}`);
  assert.deepEqual(failures.slice(0, 15), [], `${failures.length} par(es) abaixo do minimo de ${pairs}`);
});

test("contraste: dark nao muda o que ja passa (escala nominal intacta)", { skip: !esbuildPath }, async () => {
  const cu = await load("colorUtils.ts");
  const nominal = cu.buildScaleFromHex("#16803D", "dark", { boostS: 4 });
  const fitted = cu.buildScaleFromHex("#16803D", "dark", { boostS: 4, against: ["#171C19", "#1F2823"] });
  assert.deepEqual(fitted, nominal);
});

test("contraste: claro so mexe nos degraus de texto (50-300 intactos)", { skip: !esbuildPath }, async () => {
  const cu = await load("colorUtils.ts");
  const nominal = cu.buildScaleFromHex("#F59E0B", "light", { boostS: 4 });
  const fitted = cu.buildScaleFromHex("#F59E0B", "light", { boostS: 4, against: ["#FAFAF9", "#F4F3F1"] });
  for (const k of [50, 100, 200, 300]) assert.equal(fitted[k], nominal[k], `degrau ${k}`);
  for (const k of [400, 500, 600]) assert.ok(cu.contrastRatio(fitted[k], "#FAFAF9") >= 4.5, `degrau ${k}`);
});
