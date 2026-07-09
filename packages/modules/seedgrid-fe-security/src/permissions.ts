type PermissionInput = Iterable<string> | Set<string>;

export function normalizePermission(permission: string | null | undefined) {
  return String(permission ?? "")
    .trim()
    .replace(/[.\s-]+/g, "_")
    .replace(/__+/g, "_")
    .toUpperCase();
}

export function createPermissionSet(permissions: Iterable<string>) {
  return new Set(
    Array.from(permissions)
      .map((permission) => normalizePermission(permission))
      .filter(Boolean)
  );
}

function ensurePermissionSet(permissions: PermissionInput) {
  return permissions instanceof Set
    ? createPermissionSet(permissions)
    : createPermissionSet(permissions);
}

export function hasPermission(
  permissions: PermissionInput,
  permission: string | null | undefined
) {
  const normalizedPermission = normalizePermission(permission);

  if (!normalizedPermission) {
    return false;
  }

  return ensurePermissionSet(permissions).has(normalizedPermission);
}

export function hasAnyPermission(
  permissions: PermissionInput,
  requiredPermissions: Array<string | null | undefined>
) {
  return requiredPermissions.some((permission) =>
    hasPermission(permissions, permission)
  );
}

export function hasAllPermissions(
  permissions: PermissionInput,
  requiredPermissions: Array<string | null | undefined>
) {
  return requiredPermissions.every((permission) =>
    hasPermission(permissions, permission)
  );
}

export function buildCrudPermissions(resource: string) {
  const normalizedResource = normalizePermission(resource).replace(
    /_(READ|CREATE|UPDATE|DELETE)$/,
    ""
  );

  return {
    read: `${normalizedResource}_READ`,
    create: `${normalizedResource}_CREATE`,
    update: `${normalizedResource}_UPDATE`,
    delete: `${normalizedResource}_DELETE`,
  };
}
