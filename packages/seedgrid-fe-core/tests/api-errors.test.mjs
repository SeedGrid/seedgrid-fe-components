import test from "node:test";
import assert from "node:assert/strict";

// Testa a saída BUILDADA (convenção da casa: `pnpm build && node --test`).
// `api-errors` é self-contained (sem React), então importamos o módulo isolado em
// vez do barrel `dist/index.js` — evita puxar dependências de browser para o Node.
import {
  extractApiErrorMessage,
  readApiErrorMessage,
  isApiClientErrorLike,
} from "../dist/http/api-errors.js";

// Helper: simula o ApiClientError do createApiClient (Error + responseBody/status).
function apiError(message, responseBody, status = 400) {
  const error = new Error(message);
  error.responseBody = responseBody;
  error.status = status;
  return error;
}

test("extractApiErrorMessage: violations[].message tem prioridade", () => {
  const body = {
    title: "Dados inválidos",
    detail: "Revise os campos.",
    violations: [{ field: "name", message: "Nome é obrigatório" }],
  };
  assert.equal(extractApiErrorMessage(apiError("HTTP 400", body)), "Nome é obrigatório");
});

test("extractApiErrorMessage: errors[] como fallback de violations", () => {
  const body = { errors: [{ message: "Campo inválido" }], detail: "x" };
  assert.equal(extractApiErrorMessage(apiError("HTTP 400", body)), "Campo inválido");
});

test("extractApiErrorMessage: userMessage acima de detail/title", () => {
  const body = { userMessage: "Mensagem amigável", detail: "técnico", title: "T" };
  assert.equal(extractApiErrorMessage(apiError("HTTP 400", body)), "Mensagem amigável");
});

test("extractApiErrorMessage: detail acima de title", () => {
  const body = { title: "Erro", detail: "Saldo insuficiente" };
  assert.equal(extractApiErrorMessage(apiError("HTTP 400", body)), "Saldo insuficiente");
});

test("extractApiErrorMessage: pula o Error.message genérico e acha o responseBody", () => {
  // O ponto-chave: a mensagem genérica do Error NÃO deve mascarar o detail real.
  const error = apiError("Request failed with status 400", { detail: "CNPJ já cadastrado" });
  assert.equal(extractApiErrorMessage(error), "CNPJ já cadastrado");
});

test("extractApiErrorMessage: responseBody como string JSON (corpo não desserializado)", () => {
  const error = apiError("HTTP 422", JSON.stringify({ detail: "Quota excedida" }));
  assert.equal(extractApiErrorMessage(error), "Quota excedida");
});

test("extractApiErrorMessage: erro aninhado via cause", () => {
  const inner = apiError("inner", { violations: [{ message: "Email inválido" }] });
  const outer = new Error("wrapper");
  outer.cause = inner;
  assert.equal(extractApiErrorMessage(outer), "Email inválido");
});

test("extractApiErrorMessage: Error simples cai no próprio message", () => {
  assert.equal(extractApiErrorMessage(new Error("Falha de rede")), "Falha de rede");
});

test("extractApiErrorMessage: objeto sem sinais de problema -> null (nunca JSON cru)", () => {
  assert.equal(extractApiErrorMessage({ foo: 1, bar: true }), null);
});

test("extractApiErrorMessage: ApiClientError sem mensagem útil -> null (fallback do chamador vence)", () => {
  // O `.message` genérico ("API request failed with status N") NÃO deve vazar:
  // como o erro tem `responseBody`, retorna null pra o fallback por-ação prevalecer.
  const error = apiError("API request failed with status 500", { foo: 1 }, 500);
  assert.equal(extractApiErrorMessage(error), null);
});

test("extractApiErrorMessage: nulos/primitivos -> null", () => {
  assert.equal(extractApiErrorMessage(null), null);
  assert.equal(extractApiErrorMessage(undefined), null);
  assert.equal(extractApiErrorMessage("texto solto"), null);
});

test("readApiErrorMessage: objeto problem+json", () => {
  assert.equal(readApiErrorMessage({ detail: "X" }), "X");
});

test("readApiErrorMessage: string JSON parseável", () => {
  assert.equal(readApiErrorMessage('{"violations":[{"message":"V"}]}'), "V");
});

test("readApiErrorMessage: texto simples não-JSON -> o próprio texto", () => {
  assert.equal(readApiErrorMessage("Algo deu errado"), "Algo deu errado");
});

test("readApiErrorMessage: objeto JSON sem mensagem útil -> null (sem vazar JSON)", () => {
  assert.equal(readApiErrorMessage({ foo: 1 }), null);
  assert.equal(readApiErrorMessage('{"foo":1}'), null);
});

test("readApiErrorMessage: vazio/nulo -> null", () => {
  assert.equal(readApiErrorMessage(""), null);
  assert.equal(readApiErrorMessage("   "), null);
  assert.equal(readApiErrorMessage(null), null);
});

test("isApiClientErrorLike: objeto sim, primitivos não", () => {
  assert.equal(isApiClientErrorLike({}), true);
  assert.equal(isApiClientErrorLike(new Error("x")), true);
  assert.equal(isApiClientErrorLike(null), false);
  assert.equal(isApiClientErrorLike("x"), false);
  assert.equal(isApiClientErrorLike(42), false);
});
