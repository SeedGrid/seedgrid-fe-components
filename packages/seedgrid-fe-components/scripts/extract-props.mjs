// Extrai a superficie de props de cada componente a partir do TIPO TypeScript `<Export>Props`
// (fonte da verdade), para alimentar o manifesto de IA (MCP) e a tabela de props do showcase.
//
// exportName vem do proprio `.meta.ts` (campo exportName, casing autoritativo). O tipo `<Export>Props`
// e procurado em TODOS os arquivos do pacote (nao so no de mesmo nome), cobrindo sub-componentes
// co-locados no arquivo do pai (ex.: SgAvatarGroupProps em SgAvatar.tsx). Hooks/funcoes sem tipo
// `*Props` (ex.: toast, useSgTime, providers sem props) sao ignorados.
//
// Saida: src/ai-meta/generated-props.json  ->  { [exportName]: [{ name, type, required, description }] }
// O merge com a curadoria (semanticRole/bindable/default/descricao melhor) acontece nos consumidores
// (build-ai-manifest e ComponentAiPropsTable), preservando o que ja existe no .meta.ts.
import { readdirSync, statSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, "..");
const srcRoot = path.join(packageRoot, "src");
const outPath = path.join(srcRoot, "ai-meta", "generated-props.json");

// Props que NAO entram no manifesto de IA: passthrough/DOM, estilo de baixo nivel, plumbing RHF.
// (RHF e coberto pela capability "rhf"; estilo/escape-hatch nao ajuda a IA a escolher/configurar.)
const IGNORED_PROPS = new Set([
  "control", "register", "rules", // RHF wiring
  "inputProps", "className", "labelClassName", "style", "ref", "key", // passthrough/estilo
  "elevation", "borderRadius", // estilo de baixo nivel
]);
const isIgnored = (name) =>
  IGNORED_PROPS.has(name) || name.startsWith("aria-") || name.startsWith("data-");

function listMetaFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...listMetaFiles(full));
    else if (entry.endsWith(".meta.ts")) out.push(full);
  }
  return out;
}

function buildProgram() {
  const configPath = ts.findConfigFile(packageRoot, ts.sys.fileExists, "tsconfig.json");
  const { config } = ts.readConfigFile(configPath, ts.sys.readFile);
  const parsed = ts.parseJsonConfigFileContent(config, ts.sys, packageRoot);
  return ts.createProgram(parsed.fileNames, parsed.options);
}

const SRC_PREFIX = path.normalize(srcRoot).toLowerCase();

// exportName autoritativo lido do proprio meta (corrige casing como SgInputTextarea.meta.ts -> SgInputTextArea).
function readExportName(metaFile) {
  const src = readFileSync(metaFile, "utf8");
  const m = src.match(/exportName:\s*["']([^"']+)["']/);
  return m ? m[1] : path.basename(metaFile).replace(/\.meta\.ts$/, "");
}

// Indexa TODOS os tipos `*Props` declarados dentro do pacote (por nome), procurando em cada arquivo.
// Assim um sub-componente (SgAvatarGroupProps) declarado no arquivo do pai (SgAvatar.tsx) e encontrado.
function buildPropsTypeIndex(program) {
  const index = new Map();
  for (const sourceFile of program.getSourceFiles()) {
    const file = path.normalize(sourceFile.fileName).toLowerCase();
    if (!file.startsWith(SRC_PREFIX)) continue;
    sourceFile.forEachChild((node) => {
      if (
        (ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node)) &&
        node.name.text.endsWith("Props") &&
        !index.has(node.name.text)
      ) {
        index.set(node.name.text, node);
      }
    });
  }
  return index;
}

// Mantem apenas props DECLARADOS dentro do pacote (src/). Props herdados de atributos DOM/React
// (node_modules/@types/react, lib.dom.d.ts) sao a maior parte da superficie de tipos como
// ButtonHTMLAttributes/HTMLAttributes e NAO sao API curavel do componente — ficam de fora.
function isDeclaredInPackage(sym) {
  for (const decl of sym.declarations ?? []) {
    const file = path.normalize(decl.getSourceFile().fileName).toLowerCase();
    if (file.startsWith(SRC_PREFIX)) return true;
  }
  return false;
}

function extractProps(checker, declNode) {
  const type = checker.getTypeAtLocation(declNode);
  return checker
    .getPropertiesOfType(type)
    .filter((sym) => isDeclaredInPackage(sym) && !isIgnored(sym.getName()))
    .map((sym) => {
      const decl = sym.valueDeclaration ?? sym.declarations?.[0] ?? declNode;
      const propType = checker.getTypeOfSymbolAtLocation(sym, decl);
      const required = !(sym.flags & ts.SymbolFlags.Optional);
      const description = ts.displayPartsToString(sym.getDocumentationComment(checker)).trim();
      // `required: false` ja indica opcionalidade; tira o `| undefined` ruidoso do tipo.
      let typeStr = checker.typeToString(propType);
      if (!required) {
        typeStr = typeStr.replace(/\s*\|\s*undefined\b/g, "").replace(/\bundefined\s*\|\s*/g, "").trim();
      }
      return {
        name: sym.getName(),
        type: typeStr,
        required,
        ...(description ? { description } : {}),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

function main() {
  const program = buildProgram();
  const checker = program.getTypeChecker();
  const metaFiles = listMetaFiles(srcRoot);
  const typeIndex = buildPropsTypeIndex(program);

  const result = {};
  const skipped = [];
  for (const metaFile of metaFiles) {
    const exportName = readExportName(metaFile);
    const declNode = typeIndex.get(`${exportName}Props`);
    if (!declNode) {
      skipped.push(`${exportName} (sem tipo ${exportName}Props)`);
      continue;
    }
    result[exportName] = extractProps(checker, declNode);
  }

  mkdirSync(path.dirname(outPath), { recursive: true });
  const ordered = Object.fromEntries(Object.keys(result).sort().map((k) => [k, result[k]]));
  writeFileSync(outPath, `${JSON.stringify(ordered, null, 2)}\n`, "utf8");

  const counts = Object.entries(ordered).map(([k, v]) => `${k}:${v.length}`);
  console.log(`Extraidos ${Object.keys(ordered).length} componentes -> ${path.relative(packageRoot, outPath)}`);
  console.log(`Skipped (${skipped.length}): ${skipped.join(", ")}`);
  console.log(`Props por componente: ${counts.join("  ")}`);
}

main();
