import test from "node:test";
import assert from "node:assert/strict";

// Testa a saída buildada (convenção da casa). Trava o contrato de paths espelhado
// do RestControllerPath.java — se um path divergir do backend, o teste quebra.
import { SecurityPaths } from "../dist/paths.js";

test("auth (/public/auth)", () => {
  assert.equal(SecurityPaths.auth.login, "/public/auth/login");
  assert.equal(SecurityPaths.auth.refresh, "/public/auth/refresh");
  assert.equal(SecurityPaths.auth.confirmEmail, "/public/auth/confirm-email");
  assert.equal(SecurityPaths.auth.forgotPassword, "/public/auth/forgot-password");
  assert.equal(SecurityPaths.auth.resetPassword, "/public/auth/reset-password");
});

test("2fa: público vs autenticado", () => {
  assert.equal(SecurityPaths.twoFactor.verify, "/public/2f/verify");
  assert.equal(SecurityPaths.twoFactor.resend, "/public/2f/resend");
  assert.equal(SecurityPaths.twoFactor.enable, "/2f/enable");
  assert.equal(SecurityPaths.twoFactor.totpConfirm, "/2f/totp/confirm");
  assert.equal(SecurityPaths.twoFactor.setupConfirm, "/2f/setup/confirm");
  assert.equal(SecurityPaths.twoFactor.disable, "/2f/disable");
});

test("users: estáticos + builders (com encode)", () => {
  assert.equal(SecurityPaths.users.base, "/users");
  assert.equal(SecurityPaths.users.changePassword, "/users/change-password");
  assert.equal(SecurityPaths.users.defaultAvatars, "/users/avatars/defaults");
  assert.equal(SecurityPaths.users.byPublicId("pub-123"), "/users/pub-123");
  assert.equal(SecurityPaths.users.avatar("pub-123"), "/users/pub-123/avatar");
  assert.equal(
    SecurityPaths.users.membership("u-1", "c-2"),
    "/users/u-1/memberships/c-2"
  );
  // encodeURIComponent no segmento
  assert.equal(SecurityPaths.users.byPublicId("a/b"), "/users/a%2Fb");
});

test("roles / permissions", () => {
  assert.equal(SecurityPaths.roles.base, "/roles");
  assert.equal(SecurityPaths.roles.integration, "/roles/integration");
  assert.equal(SecurityPaths.roles.byPublicId("r-1"), "/roles/r-1");
  assert.equal(SecurityPaths.permissions.base, "/permissions");
  assert.equal(SecurityPaths.permissions.byPublicId("p-1"), "/permissions/p-1");
});

test("me / companies", () => {
  assert.equal(SecurityPaths.me.permissions, "/me/permissions");
  assert.equal(SecurityPaths.me.selectCompany, "/me/select-company");
  assert.equal(SecurityPaths.companies.base, "/companies");
  assert.equal(SecurityPaths.companies.public, "/public/companies");
  assert.equal(SecurityPaths.companies.byPublicId("c-1"), "/companies/c-1");
});

test("self-enter (público vs autenticado)", () => {
  assert.equal(SecurityPaths.selfEnter.requests, "/public/self-enter/requests");
  assert.equal(SecurityPaths.selfEnter.requestsToApprove, "/self-enter/requests/to-approve");
  assert.equal(SecurityPaths.selfEnter.requestById("123"), "/public/self-enter/requests/123");
  assert.equal(SecurityPaths.selfEnter.confirmEmail("123"), "/public/self-enter/requests/123/confirm-email");
  assert.equal(SecurityPaths.selfEnter.resendEmail("123"), "/public/self-enter/requests/123/resend-email");
  assert.equal(SecurityPaths.selfEnter.approve("123"), "/self-enter/requests/123/approve");
  assert.equal(SecurityPaths.selfEnter.reject("123"), "/self-enter/requests/123/reject");
  assert.equal(SecurityPaths.selfEnter.invitationByToken("tok"), "/public/self-enter/invitations/tok");
  assert.equal(SecurityPaths.selfEnter.invitationComplete("tok"), "/public/self-enter/invitations/tok/complete");
  assert.equal(SecurityPaths.selfEnter.invitationResend("123"), "/self-enter/invitations/123/resend");
});
