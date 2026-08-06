// Compiles a self-contained dist/style.css: Tailwind utilities used by our own
// src/**/*.tsx (so consumers don't need Tailwind configured at all) plus a
// :root block with the library's default theme CSS vars (same values
// SeedThemeProvider would inject with defaultSeedTheme), so components render
// styled even if the app never mounts a ThemeProvider.
import { execFileSync } from "node:child_process";
import { register } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import fs from "node:fs";

const root = path.dirname(fileURLToPath(import.meta.url));
register("./extensionless-loader.mjs", pathToFileURL(root + path.sep));

// Deep-import the theme dist files directly (bypassing the package's public
// "." export, which chains through manifest.js -> a JSON import that plain
// Node ESM here can't load) so we reuse the exact same color math the
// SeedThemeProvider runs, instead of duplicating it.
const themeDistDir = path.join(root, "..", "node_modules", "@seedgrid", "fe-theme", "dist", "theme");
const { defaultSeedTheme } = await import(pathToFileURL(path.join(themeDistDir, "ThemeConfig.js")));
const { generateThemeVars } = await import(pathToFileURL(path.join(themeDistDir, "themeGenerator.js")));
const { generateComponentTokens } = await import(pathToFileURL(path.join(themeDistDir, "componentTokens.js")));
const tailwindBin = path.join(root, "..", "node_modules", ".bin", process.platform === "win32" ? "tailwindcss.cmd" : "tailwindcss");
const input = path.join(root, "..", "styles", "tailwind.css");
const outDir = path.join(root, "..", "dist");
const utilitiesOut = path.join(outDir, ".tailwind-utilities.css");
const finalOut = path.join(outDir, "style.css");

fs.mkdirSync(outDir, { recursive: true });

execFileSync(tailwindBin, [
  "-c", path.join(root, "..", "tailwind.config.js"),
  "-i", input,
  "-o", utilitiesOut,
  "--minify",
], { stdio: "inherit", shell: process.platform === "win32" });

const baseVars = generateThemeVars(defaultSeedTheme, "light");
const componentVars = generateComponentTokens(baseVars);
const vars = { ...baseVars, ...componentVars };

const rootBlock = `:root{${Object.entries(vars)
  .map(([key, value]) => `${key}:${value}`)
  .join(";")}}`;

const utilities = fs.readFileSync(utilitiesOut, "utf8");
fs.writeFileSync(
  finalOut,
  `/* Default light theme (defaultSeedTheme). Mount SeedThemeProvider to customize at runtime. */\n${rootBlock}\n${utilities}`
);
fs.rmSync(utilitiesOut);

console.log(`built ${path.relative(process.cwd(), finalOut)} (${(fs.statSync(finalOut).size / 1024).toFixed(1)} KB)`);
