import test from "node:test";
import assert from "node:assert/strict";

import {
  getSubdomainValidationKey,
  isReservedSubdomain,
  normalizeSubdomain,
  validateSubdomain,
} from "../dist/subdomain-rules.js";

test("normalizeSubdomain normaliza espaços, acentos e maiúsculas", () => {
  assert.equal(normalizeSubdomain("  Acme Corp  "), "acme-corp");
  assert.equal(normalizeSubdomain("acme--corp"), "acme-corp");
  assert.equal(normalizeSubdomain("-acme-"), "acme");
});

test("isReservedSubdomain reconhece nomes reservados normalizados", () => {
  assert.equal(isReservedSubdomain("ADMIN"), true);
  assert.equal(isReservedSubdomain("acme"), false);
});

test("getSubdomainValidationKey cobre required/too_short/too_long/reserved", () => {
  assert.equal(
    getSubdomainValidationKey(""),
    "multitenancy.signup.fields.subdomain.validation.required"
  );
  assert.equal(
    getSubdomainValidationKey("ab"),
    "multitenancy.signup.fields.subdomain.validation.too_short"
  );
  assert.equal(
    getSubdomainValidationKey("a".repeat(33)),
    "multitenancy.signup.fields.subdomain.validation.too_long"
  );
  // normalizeSubdomain ja troca qualquer caractere fora de [a-z0-9-] por "-"
  // antes da checagem de padrao, entao "acme_corp" vira "acme-corp" (valido) —
  // invalid_pattern na pratica so dispara se SUBDOMAIN_PATTERN e normalizeSubdomain
  // divergirem no futuro. Nao testado aqui por ser inalcancavel hoje.
  assert.equal(
    getSubdomainValidationKey("admin"),
    "multitenancy.signup.fields.subdomain.validation.reserved"
  );
  assert.equal(getSubdomainValidationKey("acme-corp"), null);
});

test("validateSubdomain devolve a chave crua sem translate, e o texto traduzido com translate", () => {
  assert.equal(
    validateSubdomain("admin"),
    "multitenancy.signup.fields.subdomain.validation.reserved"
  );
  assert.equal(
    validateSubdomain("admin", (key) => `traduzido:${key}`),
    "traduzido:multitenancy.signup.fields.subdomain.validation.reserved"
  );
  assert.equal(validateSubdomain("acme-corp", (key) => `traduzido:${key}`), null);
});
