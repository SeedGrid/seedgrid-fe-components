// seedgrid:managed

import { type NextRequest, NextResponse } from "next/server";

import { appEnvironment } from "@/config/environment";

/**
 * GET /api/backup/exports/[jobId]/download
 *
 * Server-side proxy that forwards the download request to the backend
 * with the user's authorization token from the session cookie.
 * Returns the ZIP file stream directly to the browser.
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await context.params;
  const decodedJobId = decodeURIComponent(jobId);

  const authHeader = request.headers.get("authorization");
  const cookieHeader = request.headers.get("cookie");

  const backendUrl = `${appEnvironment.hosts.apiOrigin}/exports/${encodeURIComponent(decodedJobId)}/download`;

  const headers: HeadersInit = {
    Accept: "application/zip, application/octet-stream",
  };

  if (authHeader) {
    headers["Authorization"] = authHeader;
  }

  if (cookieHeader) {
    headers["Cookie"] = cookieHeader;
  }

  try {
    const upstream = await fetch(backendUrl, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!upstream.ok) {
      if (upstream.status === 404) {
        return NextResponse.json(
          { message: "Export not found or not ready" },
          { status: 404 }
        );
      }

      if (upstream.status === 410) {
        return NextResponse.json(
          { message: "Export expired or failed" },
          { status: 410 }
        );
      }

      return NextResponse.json(
        { message: "Failed to download export" },
        { status: upstream.status }
      );
    }

    const contentDisposition =
      upstream.headers.get("Content-Disposition") ??
      `attachment; filename="export-${decodedJobId}.zip"`;

    const contentType =
      upstream.headers.get("Content-Type") ?? "application/zip";

    return new NextResponse(upstream.body, {
      status: 200,
      headers: {
        "Content-Disposition": contentDisposition,
        "Content-Type": contentType,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Could not reach the export service" },
      { status: 502 }
    );
  }
}
