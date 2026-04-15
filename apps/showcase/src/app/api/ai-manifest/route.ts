import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const manifestPath = path.resolve(
  process.cwd(),
  "..",
  "..",
  "packages",
  "seedgrid-fe-components",
  "dist",
  "ai",
  "seedgrid-components.manifest.json"
);

export async function GET() {
  try {
    const manifest = await readFile(manifestPath, "utf8");
    return new NextResponse(manifest, {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store"
      }
    });
  } catch {
    return NextResponse.json({ error: "AI manifest not available" }, { status: 404 });
  }
}
