// Barrel client-safe (@seedgrid/fe-security). Sem imports de next/* — pode entrar em
// bundle client. O motor de sessão server-side fica em "@seedgrid/fe-security/server".

export * from "./paths";
export * from "./config";
export * from "./session-contract";
export * from "./session-result";
export * from "./server-contract";
export * from "./dtos";
export * from "./menu";
export * from "./permissions";
export { securityMessages } from "./messages";
