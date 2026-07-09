"use client";

import { useMemo } from "react";

import { buildCrudPermissions } from "@seedgrid/fe-security";
import { useAuth } from "./useAuth";

export function usePermission(permission: string) {
  const auth = useAuth();

  return auth.hasPermission(permission);
}

export function useCrudPermission(resource: string) {
  const auth = useAuth();

  return useMemo(() => {
    const permissions = buildCrudPermissions(resource);

    return {
      ...permissions,
      canRead: auth.hasPermission(permissions.read),
      canCreate: auth.hasPermission(permissions.create),
      canUpdate: auth.hasPermission(permissions.update),
      canDelete: auth.hasPermission(permissions.delete),
      isReadOnly:
        auth.hasPermission(permissions.read) &&
        !auth.hasAnyPermission([
          permissions.create,
          permissions.update,
          permissions.delete,
        ]),
    };
  }, [auth, resource]);
}
