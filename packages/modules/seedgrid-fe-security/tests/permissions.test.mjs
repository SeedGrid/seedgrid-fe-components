import test from "node:test";
import assert from "node:assert/strict";

import {
  buildCrudPermissions,
  createPermissionSet,
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
  normalizePermission,
} from "../dist/permissions.js";

test("normalizePermission normaliza espaços, pontos e hífens pra upper snake_case", () => {
  assert.equal(normalizePermission("user.read"), "USER_READ");
  assert.equal(normalizePermission("user read"), "USER_READ");
  assert.equal(normalizePermission("user-read"), "USER_READ");
  assert.equal(normalizePermission(null), "");
  assert.equal(normalizePermission(undefined), "");
});

test("hasPermission checa contra o set normalizado", () => {
  const permissions = createPermissionSet(["user.read", "role.read"]);

  assert.equal(hasPermission(permissions, "USER_READ"), true);
  assert.equal(hasPermission(permissions, "user-read"), true);
  assert.equal(hasPermission(permissions, "USER_DELETE"), false);
  assert.equal(hasPermission(permissions, null), false);
});

test("hasAnyPermission / hasAllPermissions", () => {
  const permissions = createPermissionSet(["USER_READ", "USER_UPDATE"]);

  assert.equal(hasAnyPermission(permissions, ["USER_DELETE", "USER_READ"]), true);
  assert.equal(hasAnyPermission(permissions, ["USER_DELETE"]), false);
  assert.equal(hasAllPermissions(permissions, ["USER_READ", "USER_UPDATE"]), true);
  assert.equal(hasAllPermissions(permissions, ["USER_READ", "USER_DELETE"]), false);
});

test("buildCrudPermissions deriva as 4 permissões a partir do recurso", () => {
  assert.deepEqual(buildCrudPermissions("user"), {
    read: "USER_READ",
    create: "USER_CREATE",
    update: "USER_UPDATE",
    delete: "USER_DELETE",
  });
  assert.deepEqual(buildCrudPermissions("USER_READ"), {
    read: "USER_READ",
    create: "USER_CREATE",
    update: "USER_UPDATE",
    delete: "USER_DELETE",
  });
});
