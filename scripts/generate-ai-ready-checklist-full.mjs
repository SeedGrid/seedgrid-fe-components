import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const packageRoot = path.join(repoRoot, "packages", "seedgrid-fe-components");
const packageSrcRoot = path.join(packageRoot, "src");
const showcaseRoot = path.join(repoRoot, "apps", "showcase", "src", "app", "components");
const indexPath = path.join(packageSrcRoot, "index.ts");
const buildManifestScriptPath = path.join(packageRoot, "scripts", "build-ai-manifest.mjs");
const distManifestPath = path.join(packageRoot, "dist", "ai", "seedgrid-components.manifest.json");
const outputPath = path.join(repoRoot, "AI_READY_CHECKLIST_FULL.md");

const GROUP_ORDER = ["input", "action", "layout", "data", "feedback", "navigation", "other"];
const GROUP_LABELS = {
  input: "Input",
  action: "Action",
  layout: "Layout",
  data: "Data",
  feedback: "Feedback",
  navigation: "Navigation",
  other: "Other"
};

const NAVIGATION_COMPONENTS = new Set([
  "SgDockMenu",
  "SgBreadcrumb",
  "SgMenu",
  "SgPageControl",
  "SgPageControlPage",
  "SgTreeView"
]);

const FEEDBACK_COMPONENTS = new Set([
  "SgToaster",
  "SgToastHost",
  "SgWhistleHost",
  "SgPopup",
  "SgDialog",
  "SgConfirmationDialog",
  "SgBadge",
  "SgBadgeOverlay",
  "SgSkeleton"
]);

const META_FILE_OVERRIDES = {
  SgInputTextArea: "SgInputTextarea.meta.ts"
};

function toKebabCase(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

async function fileExists(targetPath) {
  try {
    await stat(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function collectFilesByName(rootDir, fileName, results = []) {
  const entries = await readdir(rootDir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      await collectFilesByName(fullPath, fileName, results);
      continue;
    }
    if (entry.isFile() && entry.name === fileName) {
      results.push(fullPath);
    }
  }
  return results;
}

function classifyComponent(exportName, exportPath) {
  if (exportPath.startsWith("./inputs/")) {
    return exportName === "SgDatatable" ? "data" : "input";
  }
  if (exportPath.startsWith("./buttons/")) {
    return "action";
  }
  if (exportPath.startsWith("./menus/")) {
    return "navigation";
  }
  if (exportPath.startsWith("./layout/")) {
    if (NAVIGATION_COMPONENTS.has(exportName)) {
      return "navigation";
    }
    return "layout";
  }
  if (exportPath.startsWith("./overlay/")) {
    return "feedback";
  }
  if (exportPath.startsWith("./commons/")) {
    return FEEDBACK_COMPONENTS.has(exportName) ? "feedback" : "other";
  }
  return "other";
}

function parseRuntimeExports(indexSource) {
  const exportRegex = /export\s*\{([\s\S]*?)\}\s*from\s*"([^"]+)";/g;
  const components = [];
  const seen = new Set();
  let match;

  while ((match = exportRegex.exec(indexSource)) !== null) {
    const namesBlock = match[1];
    const exportPath = match[2];
    const names = namesBlock
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => part.split(/\s+as\s+/i).pop()?.trim() ?? part);

    for (const exportName of names) {
      if (!exportName.startsWith("Sg")) continue;
      if (seen.has(exportName)) continue;
      seen.add(exportName);
      components.push({ exportName, exportPath, group: classifyComponent(exportName, exportPath) });
    }
  }

  return components.sort((a, b) => a.exportName.localeCompare(b.exportName));
}

function resolveMetaPath(component) {
  const overrideFile = META_FILE_OVERRIDES[component.exportName];
  if (overrideFile) {
    return path.join(packageSrcRoot, component.exportPath.replace(/^\.\//, "").replace(/[^/]+$/, overrideFile));
  }
  const normalizedExportPath = component.exportPath.replace(/^\.\//, "");
  const exportBaseName = path.basename(normalizedExportPath);
  if (exportBaseName.startsWith("Sg")) {
    return path.join(packageSrcRoot, normalizedExportPath.replace(/[^/]+$/, `${component.exportName}.meta.ts`));
  }
  return path.join(packageSrcRoot, normalizedExportPath, `${component.exportName}.meta.ts`);
}

function parseManifestEntriesFromScript(scriptSource) {
  const manifestEntries = new Set();
  const matches = scriptSource.matchAll(/loadComponentMeta\(path\.join\([^)]*"([^"]+\.meta\.js)"\)\)/g);
  for (const match of matches) {
    const fileName = path.basename(match[1], ".js");
    if (fileName === "SgInputTextarea.meta") {
      manifestEntries.add("SgInputTextArea");
      continue;
    }
    manifestEntries.add(fileName.replace(/\.meta$/, ""));
  }
  return manifestEntries;
}

async function loadManifestExportNames() {
  if (await fileExists(distManifestPath)) {
    const raw = await readFile(distManifestPath, "utf8");
    const manifest = JSON.parse(raw);
    return new Set((manifest.components ?? []).map((component) => component.exportName).filter(Boolean));
  }

  const scriptSource = await readFile(buildManifestScriptPath, "utf8");
  return parseManifestEntriesFromScript(scriptSource);
}

async function loadShowcasePages() {
  const pageFileName = "page.tsx";
  const pagePaths = await collectFilesByName(showcaseRoot, pageFileName);
  return Promise.all(
    pagePaths.map(async (pagePath) => ({
      pagePath,
      source: await readFile(pagePath, "utf8")
    }))
  );
}

function loadShowcaseStatus(exportName, showcasePages) {
  const expectedSlug = toKebabCase(exportName);
  const candidates = showcasePages.filter(({ pagePath }) => pagePath.toLowerCase().includes(expectedSlug.toLowerCase()));

  for (const { source } of candidates) {
    const hasAiUsage =
      source.includes("ComponentAiSummary") ||
      source.includes("ComponentAiPropsTable") ||
      source.includes(`loadAiManifestComponent("${exportName}")`) ||
      source.includes(`loadAiManifestComponent('${exportName}')`);
    if (hasAiUsage) {
      return true;
    }
  }

  return false;
}

function formatChecked(value) {
  return value ? "[x]" : "[ ]";
}

function toRepoRelative(targetPath) {
  return path.relative(repoRoot, targetPath).replace(/\\/g, "/");
}

function buildMarkdown(components, stats) {
  const grouped = new Map(GROUP_ORDER.map((group) => [group, []]));
  for (const component of components) {
    grouped.get(component.group)?.push(component);
  }

  const lines = [];
  lines.push("# AI Ready Checklist Full", "");
  lines.push("## Summary", "");
  lines.push(`- Total components: ${stats.total}`);
  lines.push(`- With metadata: ${stats.withMetadata}`);
  lines.push(`- Without metadata: ${stats.withoutMetadata}`);
  lines.push(`- Coverage: ${stats.coverage}%`, "");
  lines.push("## Guardrails", "");
  lines.push("- Metadata deve ficar em sidecar `*.meta.ts`; nao embutir inteligencia diretamente no JSX nem anexar metadata ao runtime do componente.");
  lines.push("- O rollout deve ser incremental e de baixo risco: sem refactor global, sem trocar docs manuais em massa e sem quebrar o comportamento atual.");
  lines.push("- A fonte primaria da semantica deve ser o sidecar; o artefato consolidado e o manifesto JSON gerado no build.");
  lines.push("- O showcase deve consumir o manifesto apenas em pontos especificos e complementares, sem reescrever a pagina inteira.");
  lines.push("- JSON-LD nao e prioridade deste checklist; so entra no futuro para paginas publicas e canonicas.");
  lines.push("- O foco principal e metadata + semantica + manifesto + consumo por tooling/IA/SDUI, com compatibilidade com a arquitetura atual.", "");
  lines.push("## Completion Model", "");
  lines.push("- Um componente so deve ser considerado IA-ready de forma robusta quando tiver sidecar, semantica minima (`sgMeta`), hints de decisao (`aiHints`), contrato SDUI minimo e entrada no manifesto.");
  lines.push("- O checklist abaixo mistura verificacoes automaticas do repo com criterios de completude recomendados pelo `IA_READY_ANALYSIS.md`.");
  lines.push("- Itens marcados refletem o estado detectado hoje; itens desmarcados indicam lacunas reais ou pontos ainda nao auditados automaticamente.", "");
  lines.push("## Automated Checks Legend", "");
  lines.push("- `Criar .meta.ts`: existe sidecar correspondente.");
  lines.push("- `sgMeta completo`: sidecar exporta `sgMeta`.");
  lines.push("- `aiHints completo`: sidecar exporta `aiHints`.");
  lines.push("- `identity core`: `componentId`, `slug`, `category` e `description` presentes.");
  lines.push("- `use-case hints`: `preferredUseCases`, `avoidUseCases`, `synonyms`, `relatedEntityFields` e `compositionHints` presentes.");
  lines.push("- `rankingSignals`: `aiHints.rankingSignals` presente.");
  lines.push("- `fieldSemantics`: `sgMeta.fieldSemantics` presente e nao vazio.");
  lines.push("- `props semantics`: ha props com `semanticRole` e `bindable`.");
  lines.push("- `sdui contract`: ha bloco `sdui` com `rendererType` e `defaultProps`.");
  lines.push("- `incluido no manifesto`: componente aparece no manifesto consolidado ou nas entradas do build.");
  lines.push("- `exibido no showcase`: ha pagina do showcase consumindo manifesto via `ComponentAiSummary`, `ComponentAiPropsTable` ou `loadAiManifestComponent(...)`.", "");

  for (const group of GROUP_ORDER) {
    const items = grouped.get(group) ?? [];
    if (items.length === 0) continue;
    lines.push(`## ${GROUP_LABELS[group]}`, "");

    for (const component of items) {
      lines.push(`### ${component.exportName}`, "");
      lines.push(`- Group: ${GROUP_LABELS[component.group]}`);
      lines.push(`- Export source: \`${component.exportPath}\``);
      lines.push(`- Expected metadata: \`${component.metaPathRelative}\``, "");
      lines.push(`- ${formatChecked(component.checks.hasMeta)} Criar .meta.ts`);
      lines.push(`- ${formatChecked(component.checks.hasSgMeta)} sgMeta completo`);
      lines.push(`- ${formatChecked(component.checks.hasAiHints)} aiHints completo`);
      lines.push(`- ${formatChecked(component.checks.hasIdentityCore)} identity core`);
      lines.push(`- ${formatChecked(component.checks.hasUseCaseHints)} use-case hints`);
      lines.push(`- ${formatChecked(component.checks.hasRankingSignals)} rankingSignals`);
      lines.push(`- ${formatChecked(component.checks.hasFieldSemantics)} fieldSemantics`);
      lines.push(`- ${formatChecked(component.checks.hasPropSemantics)} props semantics`);
      lines.push(`- ${formatChecked(component.checks.hasSduiContract)} sdui contract`);
      lines.push(`- ${formatChecked(component.checks.inManifest)} incluido no manifesto`);
      lines.push(`- ${formatChecked(component.checks.inShowcase)} exibido no showcase`, "");
    }
  }

  return `${lines.join("\n").trim()}\n`;
}

async function main() {
  const indexSource = await readFile(indexPath, "utf8");
  const components = parseRuntimeExports(indexSource);
  const manifestExportNames = await loadManifestExportNames();
  const showcasePages = await loadShowcasePages();

  for (const component of components) {
    const metaPath = resolveMetaPath(component);
    component.metaPathRelative = toRepoRelative(metaPath);
    const hasMeta = await fileExists(metaPath);
    let hasSgMeta = false;
    let hasAiHints = false;
    let hasFieldSemantics = false;
    let hasRankingSignals = false;
    let hasIdentityCore = false;
    let hasUseCaseHints = false;
    let hasPropSemantics = false;
    let hasSduiContract = false;

    if (hasMeta) {
      const metaSource = await readFile(metaPath, "utf8");
      hasSgMeta = /export\s+const\s+sgMeta\b/.test(metaSource);
      hasAiHints = /export\s+const\s+aiHints\b/.test(metaSource);
      hasFieldSemantics = /fieldSemantics\s*:\s*\[[\s\S]*?\]/.test(metaSource);
      hasRankingSignals = /rankingSignals\s*:\s*\{[\s\S]*?\}/.test(metaSource);
      hasIdentityCore =
        /componentId\s*:\s*["'`][^"'`]+["'`]/.test(metaSource) &&
        /slug\s*:\s*["'`][^"'`]+["'`]/.test(metaSource) &&
        /category\s*:\s*["'`][^"'`]+["'`]/.test(metaSource) &&
        /description\s*:\s*["'`][\s\S]*?["'`]/.test(metaSource);
      hasUseCaseHints =
        /preferredUseCases\s*:\s*\[[\s\S]*?\]/.test(metaSource) &&
        /avoidUseCases\s*:\s*\[[\s\S]*?\]/.test(metaSource) &&
        /synonyms\s*:\s*\[[\s\S]*?\]/.test(metaSource) &&
        /relatedEntityFields\s*:\s*\[[\s\S]*?\]/.test(metaSource) &&
        /compositionHints\s*:\s*\[[\s\S]*?\]/.test(metaSource);
      hasPropSemantics =
        /semanticRole\s*:\s*["'`][^"'`]+["'`]/.test(metaSource) &&
        /bindable\s*:\s*(true|false)/.test(metaSource);
      hasSduiContract =
        /sdui\s*:\s*\{[\s\S]*?rendererType\s*:\s*["'`][^"'`]+["'`][\s\S]*?defaultProps\s*:\s*\{[\s\S]*?\}[\s\S]*?\}/.test(metaSource);
    }

    component.checks = {
      hasMeta,
      hasSgMeta,
      hasAiHints,
      hasIdentityCore,
      hasUseCaseHints,
      hasFieldSemantics,
      hasRankingSignals,
      hasPropSemantics,
      hasSduiContract,
      inManifest: manifestExportNames.has(component.exportName),
      inShowcase: loadShowcaseStatus(component.exportName, showcasePages)
    };
  }

  const stats = {
    total: components.length,
    withMetadata: components.filter((component) => component.checks.hasMeta).length,
    withoutMetadata: components.filter((component) => !component.checks.hasMeta).length,
    coverage: ((components.filter((component) => component.checks.hasMeta).length / Math.max(components.length, 1)) * 100).toFixed(1)
  };

  const markdown = buildMarkdown(components, stats);
  await writeFile(outputPath, markdown, "utf8");

  console.log(`Generated ${outputPath}`);
  console.log(`Total components: ${stats.total}`);
  console.log(`With metadata: ${stats.withMetadata}`);
  console.log(`Without metadata: ${stats.withoutMetadata}`);
  console.log(`Coverage: ${stats.coverage}%`);
}

await main();
