// Serializes dist/module.js (compiled from src/module.ts) into dist/module.json —
// the only artifact the SeedGrid CLI (Rust) reads. Keeps module.ts as the typed
// source of truth for package authors without requiring a JS runtime in the CLI.
// See seedgrid-cli/docs/adr/0004-module-manifest-contract.md.
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const distModuleUrl = new URL("../dist/module.js", import.meta.url);
const distModulePath = fileURLToPath(distModuleUrl);
const outputPath = fileURLToPath(new URL("../dist/module.json", import.meta.url));

const { module: manifest } = await import(distModuleUrl);

if (!manifest || typeof manifest !== "object") {
  throw new Error(`No "module" export found in ${distModulePath}`);
}

await writeFile(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Wrote ${outputPath}`);
