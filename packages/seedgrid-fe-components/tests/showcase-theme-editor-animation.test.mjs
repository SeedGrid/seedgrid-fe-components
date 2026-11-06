import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// P144.F2.T10: o editor de tema do showcase entra deslizando da borda inferior (nao so um fade de 8 px).
const app = join(process.cwd(), "..", "..", "apps", "showcase", "src", "app");
const css = readFileSync(join(app, "globals.css"), "utf8");
const editor = readFileSync(join(app, "ThemeEditor.tsx"), "utf8");

test("keyframes do editor de tema partem da borda inferior da tela", () => {
  const m = /@keyframes sg-showcase-sheet-in\s*\{\s*from\s*\{\s*transform:\s*translateY\((\d+)vh\)/.exec(css);
  assert.ok(m, "keyframes sg-showcase-sheet-in com translateY em vh");
  assert.ok(Number(m[1]) >= 100, "o deslocamento inicial cobre a altura da tela (>= 100vh)");
  assert.match(css, /\.sg-showcase-sheet-in\s*\{\s*animation:\s*sg-showcase-sheet-in\s+\d+ms/);
});

test("a animacao respeita prefers-reduced-motion", () => {
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)\s*\{\s*\.sg-showcase-sheet-in\s*\{\s*animation:\s*none/);
});

test("o ThemeEditor aplica a classe de entrada no conteudo do dialogo", () => {
  assert.match(editor, /contentClassName="sg-showcase-sheet-in"/);
  assert.doesNotMatch(editor, /animation="slideUp"/);
});
