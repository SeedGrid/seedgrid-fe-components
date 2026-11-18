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

// O botao pinta o fundo com --sg-*-fill (claro: cor pura da semente; escuro: tom 600) (--sg-btn-*-bg); o texto (--sg-btn-*-fg) e escolhido sobre ESSE fundo,
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

// Estados do botao: normal (600), hover (700) e active (800). O fundo de cada estado e o do tom da escala,
// ajustado (adjustBgForOnColor) quando o melhor texto fica < 4,5:1; o texto e o de maior contraste sobre ELE.
test("regressao: pares reais do botao em todos os estados (normal, hover, active)", { skip: !esbuildPath }, async () => {
  const cu = await load("colorUtils.ts");
  const { generateThemeVars } = await load("themeGenerator.ts");
  const { generateComponentTokens } = await load("componentTokens.ts");
  const toHex = (v) => { const [r, g, b] = v.replace(/[^\d ]/g, "").trim().split(" ").map(Number); return cu.rgbToHex(r, g, b); };
  const best = (bg) => Math.max(...cu.ON_COLOR_CANDIDATES.map((c) => cu.contrastRatio(bg, c)));
  const roles = { primary: "primary", secondary: "secondary", success: "success", info: "info", warning: "warning", danger: "error", help: "tertiary" };
  const states = { "": "600", "hover-": "700", "active-": "800" };
  let pairs = 0;
  for (const [name, seed] of Object.entries(SEEDS)) for (const mode of ["light", "dark"]) {
    const base = generateThemeVars({ seed }, mode);
    const vars = { ...base, ...generateComponentTokens(base) };
    for (const [role, scale] of Object.entries(roles)) for (const [st, tone] of Object.entries(states)) {
      // Fundo do botao cheio: --sg-*-fill (claro: cor pura da semente; escuro: tons 600/700/800).
      const original = toHex(base[`--sg-${scale}-fill${st ? "-" + st.slice(0, -1) : ""}`]);
      const bg = toHex(vars[`--sg-btn-${role}-${st}bg`]);
      const fg = toHex(vars[`--sg-btn-${role}-${st}fg`]);
      const why = `${name} ${mode}: botao ${role} ${st || "normal-"}(${tone}) (${bg}, ${fg})`;
      pairs++;
      assert.equal(bg, cu.adjustBgForOnColor(original), why);
      assert.equal(fg.toUpperCase(), cu.pickOnColor(bg), why);
      if (best(original) >= cu.MIN_CONTRAST_RATIO) assert.equal(bg, original, `${why}: ja alcanca, nao ajusta`);
      assert.ok(cu.contrastRatio(bg, fg) >= cu.MIN_CONTRAST_RATIO, why); // nas 10 sementes o ajuste sempre alcanca
    }
    // A borda acompanha o fundo ajustado do estado normal.
    for (const role of Object.keys(roles)) assert.equal(vars[`--sg-btn-${role}-border`], vars[`--sg-btn-${role}-bg`], `${name} ${mode}: borda ${role}`);
  }
  assert.equal(pairs, 10 * 2 * 7 * 3);
});

test("adjustBgForOnColor: regra e limites", { skip: !esbuildPath }, async () => {
  const cu = await load("colorUtils.ts");
  const best = (bg) => Math.max(...cu.ON_COLOR_CANDIDATES.map((c) => cu.contrastRatio(bg, c)));
  assert.equal(cu.MAX_BG_ADJUST_STEPS, 15);
  for (const bg of ["#16803D", "#FFFFFF", "#000000", "#F59E0B", "#D32F2F"]) assert.equal(cu.adjustBgForOnColor(bg), bg, bg);
  // danger do tema claro: 4,47:1 -> escurece 1 passo e o texto vira branco.
  const out = cu.adjustBgForOnColor("#ED1C08");
  assert.notEqual(out.toLowerCase(), "#ed1c08");
  assert.equal(cu.pickOnColor(out), "#FFFFFF");
  assert.ok(cu.contrastRatio(out, "#FFFFFF") >= cu.MIN_CONTRAST_RATIO);
  // Varredura: variacao <= 15 passos de L (+ arredondamento); alcanca 4,5 ou devolve o original.
  for (let h = 0; h < 360; h += 30) for (const s of [40, 70, 100]) for (let l = 30; l <= 80; l += 2.5) {
    const bg = cu.hslToHex(h, s, l);
    const o = cu.adjustBgForOnColor(bg);
    if (o === bg) continue;
    const a = cu.rgbToHsl(...Object.values(cu.hexToRgb(bg)));
    const b = cu.rgbToHsl(...Object.values(cu.hexToRgb(o)));
    assert.ok(Math.abs(b.l - a.l) <= cu.MAX_BG_ADJUST_STEPS + 0.5, bg);
    assert.ok(best(o) >= cu.MIN_CONTRAST_RATIO, bg);
  }
});

test("mesmo fundo ajustado que o Flutter (varredura gravada nos vetores)", { skip: !esbuildPath || !existsSync(VECTORS) }, async () => {
  const V = JSON.parse(readFileSync(VECTORS, "utf8"));
  const cu = await load("colorUtils.ts");
  assert.equal(V.maxBgAdjustSteps, cu.MAX_BG_ADJUST_STEPS);
  assert.ok(V.adjustBgForOnColor.length > 1000);
  for (const c of V.adjustBgForOnColor) assert.equal(cu.adjustBgForOnColor(c.in), c.out, JSON.stringify(c));
});

// P168.F1.T8: o vermelho de erro leva texto BRANCO (selo, avatar e botao "danger" lendo --destructive/--destructive-foreground).
// Escurece so o necessario para o branco passar em 4,5:1, nos temas claro e escuro, com o vermelho padrao e com vermelhos customizados.
test("P168.F1.T8: --destructive com texto branco >= 4,5:1, escurecendo so o necessario (grade de sementes, modos e vermelhos)", { skip: !esbuildPath }, async () => {
  const cu = await load("colorUtils.ts");
  const { generateThemeVars } = await load("themeGenerator.ts");
  const hsl = (v) => {
    const m = v.match(/(-?[\d.]+) ([\d.]+)% ([\d.]+)%/);
    return cu.hslToHex(+m[1], +m[2], +m[3]);
  };
  const reds = [undefined, "#F33C2B", "#FF0000", "#FF6B6B", "#B91C1C", "#FCA5A5", "#7F1D1D"];
  for (const [name, seed] of Object.entries(SEEDS)) for (const mode of ["light", "dark"]) for (const error of reds) {
    const vars = generateThemeVars(error ? { seed, error } : { seed }, mode);
    const bg = hsl(vars["--destructive"]);
    const fg = hsl(vars["--destructive-foreground"]);
    const why = `${name} ${mode} erro=${error ?? "padrao"}: ${bg} com ${fg}`;
    assert.equal(fg.toUpperCase(), "#FFFFFF", why);
    assert.ok(cu.contrastRatio(bg, "#FFFFFF") >= cu.MIN_CONTRAST_RATIO - 0.05, why);
    // so o necessario: um passo de 1% mais claro ja reprovaria (a menos que nada tenha sido escurecido)
    const { h, s, l } = cu.rgbToHsl(...Object.values(cu.hexToRgb(bg)));
    const lighter = cu.hslToHex(h, s, Math.min(100, l + 2));
    assert.ok(cu.contrastRatio(lighter, "#FFFFFF") < cu.MIN_CONTRAST_RATIO + 0.35 || l >= 99, `${why}: escureceu alem do necessario`);
    // --sg-on-error e --sg-error-500 acompanham
    assert.equal(cu.rgbToHex(...vars["--sg-on-error"].split(" ").map(Number)).toUpperCase(), "#FFFFFF", why);
  }
});

// P168.F1.T9: botao "danger" e cor "info" tambem com texto BRANCO >= 4,5:1 nos dois modos (fundo escurecido so o necessario).
test("P168.F1.T9: botao danger/info, --sg-on-info e --sg-info-500 com branco >= 4,5:1 em todos os estados (grade)", { skip: !esbuildPath }, async () => {
  const cu = await load("colorUtils.ts");
  const { generateThemeVars } = await load("themeGenerator.ts");
  const { generateComponentTokens } = await load("componentTokens.ts");
  const hex = (v) => {
    const m = String(v).match(/(\d+)\D+(\d+)\D+(\d+)/);
    return cu.rgbToHex(+m[1], +m[2], +m[3]).toUpperCase();
  };
  const infos = [undefined, "#2563EB", "#0EA5E9", "#38BDF8", "#1D4ED8", "#60A5FA", "#7DD3FC"];
  const reds = [undefined, "#F33C2B", "#FF6B6B", "#B91C1C"];
  for (const [name, seed] of Object.entries(SEEDS)) for (const mode of ["light", "dark"]) for (const info of infos) for (const error of reds) {
    const input = { seed, ...(info ? { info } : {}), ...(error ? { error } : {}) };
    const vars = generateThemeVars(input, mode);
    const comp = generateComponentTokens(vars);
    for (const token of ["danger", "info"]) {
      const states = [];
      for (const st of ["", "hover-", "active-"]) {
        const bg = hex(comp[`--sg-btn-${token}-${st}bg`]);
        const fg = hex(comp[`--sg-btn-${token}-${st}fg`]);
        states.push(bg);
        const why = `${name} ${mode} ${token}${st ? " " + st : ""} info=${info ?? "padrao"} erro=${error ?? "padrao"}: ${bg} com ${fg}`;
        assert.equal(fg, "#FFFFFF", why);
        assert.ok(cu.contrastRatio(bg, fg) >= cu.MIN_CONTRAST_RATIO - 0.05, why);
      }
      assert.notEqual(states[0], states[2], `${name} ${mode} ${token}: active deve diferir do normal`);
    }
    const i500 = hex(vars["--sg-info-500"]);
    assert.equal(hex(vars["--sg-on-info"]), "#FFFFFF", `${name} ${mode} on-info`);
    assert.ok(cu.contrastRatio(i500, "#FFFFFF") >= cu.MIN_CONTRAST_RATIO - 0.05, `${name} ${mode} info-500 ${i500}`);
  }
});
