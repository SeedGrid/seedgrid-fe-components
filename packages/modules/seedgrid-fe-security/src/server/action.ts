// Helper de Server Action (mutações). Roda o motor de sessão e devolve um ActionResult
// tipado — NUNCA lança pro client (evita a redação de erro do Next em produção).
//
// Uso na action:
//   "use server";
//   export async function updateUser(input) {
//     return toActionResult(() =>
//       security.apiFetchSecurity(SecurityPaths.users.byPublicId(input.id), {
//         method: "PUT", body: JSON.stringify(input),
//       }),
//     );
//   }

import type { ActionResult } from "../session-result";
import { toProblem } from "./to-problem";

export async function toActionResult<T>(
  run: () => Promise<T>,
): Promise<ActionResult<T>> {
  try {
    return { ok: true, data: await run() };
  } catch (error) {
    return { ok: false, problem: toProblem(error) };
  }
}
