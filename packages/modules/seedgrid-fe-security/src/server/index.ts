// Barrel SERVER-ONLY (@seedgrid/fe-security/server). Usa next/headers e next/server —
// NÃO importe daqui em componentes client.

export { createSecurityServer } from "./create-security-server";
export type {
  SecurityServer,
  SecurityFetchOptions,
} from "../server-contract";
export {
  ApiRequestError,
  ApiConnectionError,
  isApiConnectionError,
} from "./errors";
export { problemResponse } from "./problem-response";
export { toProblem } from "./to-problem";
export { toActionResult } from "./action";
export { toRouteResponse } from "./route";
