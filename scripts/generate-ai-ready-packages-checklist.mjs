import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const packagesRoot = path.join(repoRoot, "packages");
const outputPath = path.join(repoRoot, "AI_READY_CHECKLIST_PACKAGES.md");

const TARGET_PACKAGES = [
  "seedgrid-fe-theme",
  "seedgrid-fe-playground",
  "seedgrid-fe-core",
  "seedgrid-fe-commons"
];

async function exists(targetPath) {
  try {
    await stat(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function collectFiles(rootDir, predicate, acc = []) {
  const entries = await readdir(rootDir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      await collectFiles(fullPath, predicate, acc);
      continue;
    }
    if (predicate(fullPath)) {
      acc.push(fullPath);
    }
  }
  return acc;
}

function unique(values) {
  return Array.from(new Set(values));
}

function normalizeExportName(name) {
  return String(name ?? "").trim().replace(/[;\r\n]+$/g, "");
}

function parseNamedExports(indexSource) {
  const names = [];
  const exportRegex = /export\s*\{([\s\S]*?)\}\s*from\s*"([^"]+)";/g;
  let match;
  while ((match = exportRegex.exec(indexSource)) !== null) {
    const namesBlock = match[1];
    const rawNames = namesBlock
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);

    for (const part of rawNames) {
      if (part.startsWith("type ")) continue;
      const finalName = normalizeExportName(part.split(/\s+as\s+/i).pop()?.trim() ?? part);
      names.push(finalName);
    }
  }
  return names;
}

function parseRuntimeExportsFromModule(source) {
  const names = [];
  const patterns = [
    /export\s+function\s+([A-Za-z0-9_]+)/g,
    /export\s+class\s+([A-Za-z0-9_]+)/g,
    /export\s+(?:const|let|var)\s+([A-Za-z0-9_]+)/g
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(source)) !== null) {
      names.push(normalizeExportName(match[1]));
    }
  }

  return names.filter((name) => !name.startsWith("use client"));
}

async function resolveExportStarNames(packageRoot, exportPath) {
  const basePath = path.join(packageRoot, "src", exportPath.replace(/^\.\//, ""));
  const candidates = [
    `${basePath}.ts`,
    `${basePath}.tsx`,
    path.join(basePath, "index.ts"),
    path.join(basePath, "index.tsx")
  ];

  for (const candidate of candidates) {
    if (!(await exists(candidate))) continue;
    const source = await readFile(candidate, "utf8");
    return parseRuntimeExportsFromModule(source);
  }

  return [];
}

async function parsePublicRuntimeExports(packageRoot) {
  const indexPath = path.join(packageRoot, "src", "index.ts");
  const indexSource = await readFile(indexPath, "utf8");
  const names = parseNamedExports(indexSource);

  const exportStarRegex = /export\s+\*\s+from\s+"([^"]+)";/g;
  let match;
  while ((match = exportStarRegex.exec(indexSource)) !== null) {
    const exportPath = match[1];
    const starNames = await resolveExportStarNames(packageRoot, exportPath);
    names.push(...starNames);
  }

    return unique(
    names.map(normalizeExportName).filter((name) => {
      if (!name) return false;
      if (name === "default") return false;
      if (/^[a-z]/.test(name) && !/^use[A-Z]/.test(name) && !/^(create|get|set|build|clear|read|write|resolve|normalize|format|register|unregister|list|has|subscribe|dismiss|toast|sgWhistle|can|clamp|buscar)/.test(name)) {
        return false;
      }
      return true;
    })
  ).sort((a, b) => a.localeCompare(b));
}

async function loadMetaInfo(packageRoot) {
  const srcRoot = path.join(packageRoot, "src");
  const metaFiles = await collectFiles(srcRoot, (fullPath) => fullPath.endsWith(".meta.ts"));
  const metaMap = new Map();

  for (const metaPath of metaFiles) {
    const source = await readFile(metaPath, "utf8");
    const exportNameMatch = source.match(/exportName\s*:\s*["'`]([^"'`]+)["'`]/);
    if (!exportNameMatch) continue;
    const exportName = normalizeExportName(exportNameMatch[1]);

    metaMap.set(exportName, {
      path: metaPath,
      hasSgMeta: /export\s+const\s+sgMeta\b/.test(source),
      hasAiHints: /export\s+const\s+aiHints\b/.test(source),
      hasFieldSemantics: /fieldSemantics\s*:\s*\[[\s\S]*?\]/.test(source),
      hasRankingSignals: /rankingSignals\s*:\s*\{[\s\S]*?\}/.test(source),
      hasSduiContract: /sdui\s*:\s*\{[\s\S]*?rendererType\s*:\s*["'`][^"'`]+["'`]/.test(source)
    });
  }

  return metaMap;
}

async function loadManifestExportNames(packageRoot) {
  const distAiDir = path.join(packageRoot, "dist", "ai");
  if (!(await exists(distAiDir))) return new Set();
  const files = await readdir(distAiDir);
  const manifestFile = files.find((file) => file.endsWith(".manifest.json"));
  if (!manifestFile) return new Set();
  const manifest = JSON.parse(await readFile(path.join(distAiDir, manifestFile), "utf8"));
  return new Set((manifest.components ?? []).map((component) => normalizeExportName(component.exportName)).filter(Boolean));
}

function statusMark(value) {
  return value ? "[x]" : "[ ]";
}

function relativeToRepo(targetPath) {
  return path.relative(repoRoot, targetPath).replace(/\\/g, "/");
}

function buildPackageSection(pkg) {
  const lines = [];
  lines.push(`## ${pkg.packageJson.name}`, "");
  lines.push(`- Package dir: \`packages/${pkg.dirName}\``);
  lines.push(`- Public runtime exports: ${pkg.exports.length}`);
  lines.push(`- Exports with metadata: ${pkg.withMetadata}`);
  lines.push(`- Exports without metadata: ${pkg.withoutMetadata}`);
  lines.push(`- Coverage: ${pkg.coverage}%`, "");

  for (const entry of pkg.entries) {
    lines.push(`### ${entry.exportName}`, "");
    lines.push(`- ${statusMark(entry.hasMeta)} Criar .meta.ts`);
    lines.push(`- ${statusMark(entry.hasSgMeta)} sgMeta completo`);
    lines.push(`- ${statusMark(entry.hasAiHints)} aiHints completo`);
    lines.push(`- ${statusMark(entry.hasFieldSemantics)} fieldSemantics`);
    lines.push(`- ${statusMark(entry.hasRankingSignals)} rankingSignals`);
    lines.push(`- ${statusMark(entry.hasSduiContract)} sdui contract`);
    lines.push(`- ${statusMark(entry.inManifest)} incluido no manifesto`);
    if (entry.metaPathRelative) {
      lines.push(`- Meta path: \`${entry.metaPathRelative}\``);
    }
    lines.push("");
  }

  return lines;
}

async function main() {
  const packageReports = [];

  for (const dirName of TARGET_PACKAGES) {
    const packageRoot = path.join(packagesRoot, dirName);
    const packageJson = JSON.parse(await readFile(path.join(packageRoot, "package.json"), "utf8"));
    const exports = await parsePublicRuntimeExports(packageRoot);
    const metaMap = await loadMetaInfo(packageRoot);
    const manifestNames = await loadManifestExportNames(packageRoot);

    const entries = exports.map((exportName) => {
      const meta = metaMap.get(exportName);
      return {
        exportName: normalizeExportName(exportName),
        hasMeta: !!meta,
        hasSgMeta: meta?.hasSgMeta ?? false,
        hasAiHints: meta?.hasAiHints ?? false,
        hasFieldSemantics: meta?.hasFieldSemantics ?? false,
        hasRankingSignals: meta?.hasRankingSignals ?? false,
        hasSduiContract: meta?.hasSduiContract ?? false,
        inManifest: manifestNames.has(normalizeExportName(exportName)),
        metaPathRelative: meta ? relativeToRepo(meta.path) : null
      };
    });

    const withMetadata = entries.filter((entry) => entry.hasMeta).length;
    const withoutMetadata = entries.length - withMetadata;
    packageReports.push({
      dirName,
      packageJson,
      exports,
      entries,
      withMetadata,
      withoutMetadata,
      coverage: ((withMetadata / Math.max(entries.length, 1)) * 100).toFixed(1)
    });
  }

  const totalExports = packageReports.reduce((sum, pkg) => sum + pkg.exports.length, 0);
  const totalWithMetadata = packageReports.reduce((sum, pkg) => sum + pkg.withMetadata, 0);
  const totalWithoutMetadata = packageReports.reduce((sum, pkg) => sum + pkg.withoutMetadata, 0);
  const totalCoverage = ((totalWithMetadata / Math.max(totalExports, 1)) * 100).toFixed(1);

  const lines = [];
  lines.push("# AI Ready Checklist Packages", "");
  lines.push("## Summary", "");
  lines.push(`- Total public runtime exports: ${totalExports}`);
  lines.push(`- With metadata: ${totalWithMetadata}`);
  lines.push(`- Without metadata: ${totalWithoutMetadata}`);
  lines.push(`- Coverage: ${totalCoverage}%`, "");
  lines.push("## Notes", "");
  lines.push("- Este relatorio cobre apenas `seedgrid-fe-theme`, `seedgrid-fe-playground`, `seedgrid-fe-core` e `seedgrid-fe-commons`.");
  lines.push("- O criterio principal e export publico em `src/index.ts` cruzado com `.meta.ts` e manifesto do proprio pacote.");
  lines.push("- Aqui nao existe validacao de consumo no showcase, porque o showcase atual foi desenhado para `@seedgrid/fe-components`.", "");

  for (const pkg of packageReports) {
    lines.push(...buildPackageSection(pkg));
  }

  await writeFile(outputPath, `${lines.join("\n").trim()}\n`, "utf8");
  console.log(`Generated ${outputPath}`);
  console.log(`Total public runtime exports: ${totalExports}`);
  console.log(`With metadata: ${totalWithMetadata}`);
  console.log(`Without metadata: ${totalWithoutMetadata}`);
  console.log(`Coverage: ${totalCoverage}%`);
}

await main();
