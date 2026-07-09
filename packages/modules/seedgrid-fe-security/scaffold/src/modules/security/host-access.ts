"use client";

import { useEffect, useState } from "react";

import { appEnvironment } from "@/config/environment";

export type SecurityHostKind = "local" | "master" | "tenant" | "unknown";

export function resolveSecurityHostKind(hostname: string): SecurityHostKind {
  const normalizedHostname = hostname.trim().toLowerCase();
  const masterHost = appEnvironment.hosts.masterAppHost.trim().toLowerCase();

  if (
    !normalizedHostname ||
    normalizedHostname === "localhost" ||
    normalizedHostname === "127.0.0.1" ||
    normalizedHostname.endsWith(".local")
  ) {
    return "local";
  }

  if (normalizedHostname === masterHost) {
    return "master";
  }

  if (masterHost && normalizedHostname.endsWith(`.${masterHost}`)) {
    return "tenant";
  }

  return "unknown";
}

export function isCompanyManagementEnabledForHostKind(
  hostKind: SecurityHostKind
) {
  return hostKind !== "master";
}

export function useSecurityHostKind() {
  const [hostKind, setHostKind] = useState<SecurityHostKind | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    setHostKind(resolveSecurityHostKind(window.location.hostname));
  }, []);

  return hostKind;
}

export function useCompanyManagementEnabledForCurrentHost() {
  const hostKind = useSecurityHostKind();

  return hostKind == null
    ? null
    : isCompanyManagementEnabledForHostKind(hostKind);
}
