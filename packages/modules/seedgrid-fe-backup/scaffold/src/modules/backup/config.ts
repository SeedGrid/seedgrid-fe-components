// seedgrid:managed

import { appEnvironment } from "@/config/environment";

function resolveApiBaseUrl() {
  // Client-side: route through Next.js proxy to avoid CORS on error responses.
  if (globalThis.window !== undefined) {
    return "/api";
  }

  return appEnvironment.hosts.apiOrigin;
}

export const backupConfig = {
  apiBaseUrl: resolveApiBaseUrl(),
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [10, 20, 50],
  },
  polling: {
    intervalMs: 5000,
  },
  routes: {
    exports: "/backup/exports",
    newExport: "/backup/exports/new",
  },
} as const;
