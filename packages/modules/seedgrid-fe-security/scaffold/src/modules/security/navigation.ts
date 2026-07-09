import { securityConfig } from "./config";

// seedgrid:post-auth-resolvers-imports:start
// seedgrid:post-auth-resolvers-imports:end

/**
 * Resolve pra onde mandar o usuário logo após um login bem-sucedido. Devolve
 * a rota, ou `null` pra deixar o próximo resolver (ou o dashboard) decidir.
 * Pode ser síncrono ou assíncrono (ex.: consultar as empresas do usuário).
 */
export type PostAuthResolver = (
  permissions: Iterable<string>,
) => Promise<string | null> | string | null;

// Módulos registram seus resolvers aqui via o campo `postAuthResolver` do
// module.ts (o CLI insere no marcador abaixo). Ex.: login-tenancy manda pro
// select-company quando o usuário tem mais de uma empresa.
const postAuthResolvers: PostAuthResolver[] = [
  // seedgrid:post-auth-resolvers-register:start
  // seedgrid:post-auth-resolvers-register:end
];

export async function resolvePostAuthPath(
  permissions: Iterable<string>,
): Promise<string> {
  const permissionList = Array.from(permissions);

  for (const resolver of postAuthResolvers) {
    try {
      const path = await resolver(permissionList);
      if (path) {
        return path;
      }
    } catch {
      // Um resolver que falha não pode travar o login — segue pro próximo
      // (e, no fim, pro dashboard).
    }
  }

  return securityConfig.routes.dashboard;
}
