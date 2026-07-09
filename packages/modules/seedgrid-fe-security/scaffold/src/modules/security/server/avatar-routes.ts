import { NextResponse } from "next/server";

import { getSecuritySessionServer } from "./session-server";

// Proxy do avatar do usuário: repassa o binário do report-api com a sessão do
// usuário (cookie→Bearer, refresh em 401). Usa o MESMO motor de sessão
// (createSecurityServer, via getSecuritySessionServer) que o resto do app —
// `fetchWithSession` devolve a Response crua, ideal pra repassar bytes.
export async function createUserAvatarRouteResponse(
  publicId: string,
  version: string | null
) {
  const normalizedPublicId = publicId.trim();

  if (!normalizedPublicId) {
    return NextResponse.json(
      {
        message: "User publicId is required.",
      },
      {
        status: 400,
      }
    );
  }

  const query = version ? `?v=${encodeURIComponent(version)}` : "";
  const path = `/users/${encodeURIComponent(normalizedPublicId)}/avatar${query}`;

  let upstreamResponse: Response;
  try {
    const session = await getSecuritySessionServer();
    upstreamResponse = await session.fetchWithSession(path, { cache: "no-store" });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Unexpected avatar proxy error.",
      },
      {
        status: 500,
      }
    );
  }

  if (!upstreamResponse.ok) {
    const text = await upstreamResponse.text();
    const trimmed = text.trim();

    if (!trimmed) {
      return new NextResponse(null, { status: upstreamResponse.status });
    }

    const contentType =
      upstreamResponse.headers.get("content-type") ?? "text/plain; charset=utf-8";

    return new NextResponse(trimmed, {
      status: upstreamResponse.status,
      headers: { "content-type": contentType },
    });
  }

  const headers = new Headers();
  copyResponseHeader(upstreamResponse, headers, "content-type");
  copyResponseHeader(upstreamResponse, headers, "content-disposition");
  copyResponseHeader(upstreamResponse, headers, "content-length");
  copyResponseHeader(upstreamResponse, headers, "cache-control");
  copyResponseHeader(upstreamResponse, headers, "etag");
  copyResponseHeader(upstreamResponse, headers, "last-modified");

  return new NextResponse(await upstreamResponse.arrayBuffer(), {
    status: upstreamResponse.status,
    headers,
  });
}

function copyResponseHeader(
  response: Response,
  headers: Headers,
  headerName: string
) {
  const value = response.headers.get(headerName);

  if (value) {
    headers.set(headerName, value);
  }
}
