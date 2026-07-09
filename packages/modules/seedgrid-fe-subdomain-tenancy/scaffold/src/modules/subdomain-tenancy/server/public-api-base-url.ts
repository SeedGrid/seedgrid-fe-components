"use server";

// seedgrid:managed

import { headers } from "next/headers";

import { resolveApiBaseUrlForHostname } from "@/config/environment";

export async function resolvePublicApiBaseUrl() {
  const requestHeaders = await headers();
  const hostname = resolveRequestHostname(requestHeaders);

  if (!hostname) {
    throw new Error(
      "Could not resolve the public API base URL. Access the app through a configured domain hostname and provide the corresponding host header."
    );
  }

  return resolveApiBaseUrlForHostname(hostname);
}

function resolveRequestHostname(requestHeaders: Headers) {
  const forwardedHost = requestHeaders.get("x-forwarded-host")?.trim();
  const hostHeader = requestHeaders.get("host")?.trim();
  const candidate = forwardedHost || hostHeader || "";

  return candidate.replace(/:\d+$/, "");
}
