// Barrel client-safe do módulo login-tenancy no app gerado. NÃO reexporta
// `server.ts` ("use server") — o resolver pós-login é client-side.

export { resolveLoginTenancyPostAuthPath } from "./post-auth";
