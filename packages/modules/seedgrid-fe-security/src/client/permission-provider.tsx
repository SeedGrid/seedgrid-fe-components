"use client";

// Contexto de permissões do usuário corrente (portado do admin-web AdminAccessProvider).
// Client-safe: usa next/navigation (hook client) e react. Endpoint e role-superuser são
// parametrizáveis — o "ADMIN implica tudo" e o "/api/auth/me" eram hardcode do admin.

import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { MePermissions } from "../session-contract";

export interface PermissionContextValue {
  loading: boolean;
  me: MePermissions | null;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
}

const PermissionContext = createContext<PermissionContextValue>({
  loading: true,
  me: null,
  hasRole: () => false,
  hasPermission: () => false,
});

export interface PermissionProviderProps {
  children: ReactNode;
  /** Endpoint que devolve MePermissions. Default: "/api/auth/me". */
  meUrl?: string;
  /** Role que implica TODAS as permissões (superuser). Default: "ADMIN". */
  adminRole?: string;
}

export function PermissionProvider({
  children,
  meUrl = "/api/auth/me",
  adminRole = "ADMIN",
}: PermissionProviderProps) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<MePermissions | null>(null);

  const loadPermissions = useCallback(
    async (signal?: AbortSignal) => {
      try {
        const response = await fetch(meUrl, { cache: "no-store", signal });
        if (!response.ok) {
          setMe(null);
          return;
        }
        setMe((await response.json()) as MePermissions);
      } catch {
        // Aborts são ignorados; demais erros deixam me = null.
      } finally {
        setLoading(false);
      }
    },
    [meUrl],
  );

  // Rebusca o `me` a CADA navegação — a sessão pode ter trocado de usuário (logout +
  // login com outra conta). O cookie é httpOnly (não observável no client), então a
  // navegação é o sinal de "sessão pode ter mudado". Refetch em background (não mexe em
  // `loading` após a 1ª carga), então não pisca a UI.
  useEffect(() => {
    const controller = new AbortController();
    void loadPermissions(controller.signal);
    return () => controller.abort();
  }, [pathname, loadPermissions]);

  const value = useMemo<PermissionContextValue>(() => {
    const roles = new Set(me?.roles ?? []);
    const permissions = new Set(me?.permissions ?? []);

    return {
      loading,
      me,
      hasRole: (role) => roles.has(role),
      hasPermission: (permission) =>
        roles.has(adminRole) || permissions.has(permission),
    };
  }, [loading, me, adminRole]);

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissions(): PermissionContextValue {
  return useContext(PermissionContext);
}
