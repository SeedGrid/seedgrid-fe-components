import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const ts = require(path.resolve(__dirname, "../../../node_modules/typescript"));

const COMPONENTS_ROOT = path.resolve(__dirname, "../src/app/components");

function walkPageFiles(dir) {
  const files = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkPageFiles(fullPath));
      continue;
    }
    if (entry.isFile() && /page\.(tsx|ts)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

function extractAppFileConstNames(fileText) {
  const constNames = new Set();

  for (const match of fileText.matchAll(/<SgPlayground[\s\S]*?codeContract="appFile"[\s\S]*?code=\{([A-Z0-9_]+)\}/g)) {
    constNames.add(match[1]);
  }

  return [...constNames];
}

function extractSnippetText(fileText, constName) {
  const match = fileText.match(new RegExp(`const\\s+${constName}\\s*=\\s*\`([\\s\\S]*?)\`;`));
  return match?.[1] ?? null;
}

function collectMissingSgSymbols(code) {
  const sourceFile = ts.createSourceFile("snippet.tsx", code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const imported = new Set();
  const declared = new Set();
  const valueUsed = new Set();
  const typeUsed = new Set();

  function addDeclared(name) {
    if (/^Sg[A-Z]/.test(name)) {
      declared.add(name);
    }
  }

  function visit(node) {
    if (ts.isImportSpecifier(node)) {
      imported.add(node.name.text);
    }

    if (
      (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node) || ts.isJsxClosingElement(node)) &&
      ts.isIdentifier(node.tagName) &&
      /^Sg[A-Z]/.test(node.tagName.text)
    ) {
      valueUsed.add(node.tagName.text);
    }

    if (ts.isTypeReferenceNode(node) && ts.isIdentifier(node.typeName) && /^Sg[A-Z]/.test(node.typeName.text)) {
      typeUsed.add(node.typeName.text);
    }

    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)) addDeclared(node.name.text);
    if (ts.isFunctionDeclaration(node) && node.name) addDeclared(node.name.text);
    if (ts.isClassDeclaration(node) && node.name) addDeclared(node.name.text);
    if (ts.isTypeAliasDeclaration(node)) addDeclared(node.name.text);
    if (ts.isInterfaceDeclaration(node)) addDeclared(node.name.text);
    if (ts.isEnumDeclaration(node)) addDeclared(node.name.text);

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return [...new Set([...valueUsed, ...typeUsed])].filter((name) => !imported.has(name) && !declared.has(name));
}

test("all showcase appFile playground snippets import every Sg symbol they use", () => {
  const failures = [];

  for (const filePath of walkPageFiles(COMPONENTS_ROOT)) {
    const fileText = fs.readFileSync(filePath, "utf8");

    for (const constName of extractAppFileConstNames(fileText)) {
      const snippetText = extractSnippetText(fileText, constName);
      if (!snippetText) continue;

      const missing = collectMissingSgSymbols(snippetText);
      if (missing.length === 0) continue;

      failures.push({
        filePath,
        constName,
        missing
      });
    }
  }

  assert.deepEqual(failures, []);
});
