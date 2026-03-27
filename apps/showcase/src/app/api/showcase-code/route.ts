import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const repoRoot = path.resolve(process.cwd(), "..", "..");

function resolveSamplePath(sampleFile: string) {
  const resolvedPath = path.resolve(repoRoot, sampleFile);
  const relativeToRoot = path.relative(repoRoot, resolvedPath);

  if (relativeToRoot.startsWith("..") || path.isAbsolute(relativeToRoot)) {
    throw new Error("Invalid sample file path");
  }

  return resolvedPath;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sampleFile = searchParams.get("path");

  if (!sampleFile) {
    return NextResponse.json({ error: "Missing path parameter" }, { status: 400 });
  }

  try {
    const resolvedPath = resolveSamplePath(sampleFile);
    const code = await readFile(resolvedPath, "utf8");
    return NextResponse.json({ code });
  } catch {
    return NextResponse.json({ error: "Unable to read sample file" }, { status: 404 });
  }
}
