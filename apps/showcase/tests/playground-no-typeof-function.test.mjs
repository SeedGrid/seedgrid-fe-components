import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// P135.F0.D2: um `.playground` nao pode testar `typeof XDaLib === "function"`.
// Componentes da lib criados com React.forwardRef/memo sao OBJETOS, entao o teste falha e o playground cai no
// fallback ("X is not available in the published Sandpack version") mesmo com o componente publicado.
// Padrao correto: `X != null`.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const COMPONENTS_ROOT = path.resolve(__dirname, "../src/app/components");

function walkPlaygrounds(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkPlaygrounds(full));
    else if (entry.isFile() && entry.name.endsWith(".playground")) files.push(full);
  }
  return files;
}

const TYPEOF_FUNCTION = /typeof\s+[\w.$]+\s*(?:===?|!==?)\s*["'`]function["'`]/;

test("nenhum .playground usa typeof X === \"function\" (use X != null)", () => {
  const files = walkPlaygrounds(COMPONENTS_ROOT);
  assert.ok(files.length > 0, "nenhum arquivo .playground encontrado");
  const offenders = [];
  for (const file of files) {
    const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
    lines.forEach((line, i) => {
      if (TYPEOF_FUNCTION.test(line)) {
        offenders.push(`${path.relative(COMPONENTS_ROOT, file)}:${i + 1}: ${line.trim()}`);
      }
    });
  }
  assert.deepEqual(
    offenders,
    [],
    `Use "X != null" em vez de typeof X === "function" (forwardRef/memo sao objetos):\n${offenders.join("\n")}`
  );
});

test("o detector reconhece as variantes do padrao proibido", () => {
  for (const bad of [
    'typeof SgDatatableFromLib === "function"',
    "typeof SgButtonFromLib === 'function'",
    'typeof Lib.SgX !== "function"',
    'typeof X == "function"'
  ]) {
    assert.ok(TYPEOF_FUNCTION.test(bad), bad);
  }
  assert.ok(!TYPEOF_FUNCTION.test("SgDatatableFromLib != null"));
  assert.ok(!TYPEOF_FUNCTION.test('typeof x === "string"'));
});
