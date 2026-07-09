export const RESERVED_SUBDOMAINS = [
  "panel",
  "admin",
  "adm",
  "api",
  "app",
  "auth",
  "backoffice",
  "billing",
  "dashboard",
  "dev",
  "docs",
  "email",
  "ftp",
  "help",
  "homolog",
  "internal",
  "mail",
  "manager",
  "monitor",
  "portal",
  "root",
  "seedgrid",
  "signin",
  "signup",
  "site",
  "smtp",
  "staging",
  "status",
  "suporte",
  "support",
  "system",
  "tenant",
  "test",
  "web",
  "www",
] as const;

const RESERVED_SUBDOMAIN_SET = new Set<string>(RESERVED_SUBDOMAINS);
const SUBDOMAIN_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type SubdomainValidationKey =
  | "multitenancy.signup.fields.subdomain.validation.required"
  | "multitenancy.signup.fields.subdomain.validation.too_short"
  | "multitenancy.signup.fields.subdomain.validation.too_long"
  | "multitenancy.signup.fields.subdomain.validation.invalid_pattern"
  | "multitenancy.signup.fields.subdomain.validation.reserved";

export function normalizeSubdomain(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function isReservedSubdomain(value: string) {
  return RESERVED_SUBDOMAIN_SET.has(normalizeSubdomain(value));
}

export function getSubdomainValidationKey(
  value: string
): SubdomainValidationKey | null {
  const normalized = normalizeSubdomain(value);

  if (!normalized) {
    return "multitenancy.signup.fields.subdomain.validation.required";
  }

  if (normalized.length < 3) {
    return "multitenancy.signup.fields.subdomain.validation.too_short";
  }

  if (normalized.length > 32) {
    return "multitenancy.signup.fields.subdomain.validation.too_long";
  }

  if (!SUBDOMAIN_PATTERN.test(normalized)) {
    return "multitenancy.signup.fields.subdomain.validation.invalid_pattern";
  }

  if (isReservedSubdomain(normalized)) {
    return "multitenancy.signup.fields.subdomain.validation.reserved";
  }

  return null;
}

/**
 * `translate` is any function that resolves an i18n key to a display string
 * (e.g. the app's own `t` from `@/i18n`). Kept as a plain function type
 * instead of importing the app's `Translator` type, so this stays lib-safe
 * (no `@/...` import).
 */
export function validateSubdomain(
  value: string,
  translate?: (key: SubdomainValidationKey) => string
) {
  const key = getSubdomainValidationKey(value);

  if (!key) {
    return null;
  }

  return translate ? translate(key) : key;
}
