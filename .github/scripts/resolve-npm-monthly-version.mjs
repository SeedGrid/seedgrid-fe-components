#!/usr/bin/env node
import { execFileSync } from "node:child_process";

const [packageName, base, mode = "stable"] = process.argv.slice(2);

if (!packageName || !base) {
  console.error("Usage: resolve-npm-monthly-version.mjs <package-name> <YYYY.M> [stable|rc]");
  process.exit(1);
}

const escapedBase = base.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const versionPattern = new RegExp(`^${escapedBase}\\.(\\d+)(?:-(.+))?$`);
const rcPattern = /^rc\.(\d+)$/;

function readPublishedVersions(name) {
  try {
    const output = execFileSync("npm", ["view", name, "versions", "--json"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"]
    }).trim();

    if (!output) return [];
    const parsed = JSON.parse(output);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return [];
  }
}

const versions = readPublishedVersions(packageName);
let maxReleasedPatch = -1;

for (const version of versions) {
  const match = versionPattern.exec(version);
  if (!match) continue;

  const patch = Number(match[1]);
  const prerelease = match[2];

  // Stable versions and old numeric prereleases such as 2026.9.9-1 both reserve
  // the patch number. New rc prereleases do not consume the eventual stable slot.
  if (!prerelease || /^\d+$/.test(prerelease)) {
    maxReleasedPatch = Math.max(maxReleasedPatch, patch);
  }
}

const nextPatch = maxReleasedPatch + 1;

if (mode === "stable") {
  console.log(`${base}.${nextPatch}`);
  process.exit(0);
}

let maxRc = 0;
const rcPrefix = `${base}.${nextPatch}-`;

for (const version of versions) {
  if (!version.startsWith(rcPrefix)) continue;
  const match = versionPattern.exec(version);
  const rcMatch = match?.[2] ? rcPattern.exec(match[2]) : null;
  if (rcMatch) maxRc = Math.max(maxRc, Number(rcMatch[1]));
}

console.log(`${base}.${nextPatch}-rc.${maxRc + 1}`);
