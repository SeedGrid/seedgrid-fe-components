// P155.F2.T3: depois da P149 o nome da prop e `enabled`. Este teste impede a volta de `disabled=` em
// componentes SeedGrid (`<Sg...>`) nas paginas e nos samples do showcase, e de `rules`/`SgRules`.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..", "src", "app", "components");

function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(tsx|sample|playground)$/.test(e.name)) out.push(p);
  }
  return out;
}

// tags de abertura `<SgXxx ...>` (atributos podem ter `{}` aninhados); nao olha elementos nativos
function sgTags(text) {
  const tags = [];
  for (const m of text.matchAll(/<(Sg[A-Za-z0-9]*)\b/g)) {
    let i = m.index + m[0].length;
    let depth = 0;
    let str = null;
    for (; i < text.length; i++) {
      const c = text[i];
      if (str) {
        if (c === "\\") i++;
        else if (c === str) str = null;
        continue;
      }
      if (c === '"' || c === "'" || c === "`") str = c;
      else if (c === "{") depth++;
      else if (c === "}") depth--;
      else if (c === ">" && depth === 0) break;
    }
    tags.push({ name: m[1], attrs: text.slice(m.index + m[0].length, i), at: m.index });
  }
  return tags;
}

const files = walk(root);

test("exemplos do showcase nao usam `disabled=` em componentes Sg (use `enabled`)", () => {
  const bad = [];
  for (const f of files) {
    const text = readFileSync(f, "utf8");
    for (const t of sgTags(text)) {
      if (/(^|\s)disabled\s*=/.test(t.attrs)) bad.push(`${path.relative(root, f)}: <${t.name} disabled=...>`);
    }
  }
  assert.deepEqual(bad, [], `use enabled no lugar de disabled:\n${bad.join("\n")}`);
});

test("exemplos do showcase nao usam `rules=` nem SgRules", () => {
  const bad = [];
  for (const f of files) {
    const text = readFileSync(f, "utf8");
    if (/\bSgRules\b/.test(text)) bad.push(`${path.relative(root, f)}: SgRules`);
    for (const t of sgTags(text)) {
      if (/(^|\s)rules\s*=/.test(t.attrs)) bad.push(`${path.relative(root, f)}: <${t.name} rules=...>`);
    }
  }
  assert.deepEqual(bad, [], bad.join("\n"));
});
