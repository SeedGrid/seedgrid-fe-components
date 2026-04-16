import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, "..");
const distRoot = path.join(packageRoot, "dist");
const manifestOutputPath = path.join(distRoot, "ai", "seedgrid-theme.manifest.json");

async function loadPackageVersion() {
  const packageJsonPath = path.join(packageRoot, "package.json");
  const packageJsonRaw = await readFile(packageJsonPath, "utf8");
  const packageJson = JSON.parse(packageJsonRaw);
  return String(packageJson.version ?? "0.0.0");
}

async function loadComponentMeta(relativeModulePath) {
  const moduleUrl = pathToFileURL(path.join(distRoot, relativeModulePath)).href;
  const module = await import(moduleUrl);

  return {
    componentId: module.sgMeta.componentId,
    exportName: module.sgMeta.exportName,
    sgMeta: module.sgMeta,
    aiHints: module.aiHints
  };
}

async function main() {
  const packageVersion = await loadPackageVersion();
  const components = await Promise.all([
    loadComponentMeta(path.join("theme", "SeedThemeProvider.meta.js")),
    loadComponentMeta(path.join("theme", "useSgTheme.meta.js"))
  ]);

  const manifest = {
    schemaVersion: "0.1",
    package: "@seedgrid/fe-theme",
    packageVersion,
    components
  };

  await mkdir(path.dirname(manifestOutputPath), { recursive: true });
  await writeFile(manifestOutputPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(`AI manifest generated at ${manifestOutputPath}`);
}

await main();
