// Paths de API keys (espelho de RestControllerPath.java em seedgrid-quarkus-ext-apikeys).

const seg = (value: string): string => encodeURIComponent(value);

export const ApiKeyPaths = {
  /** GET — chaves do usuário corrente. */
  base: "/apikeys",
  /** GET lista · POST cria chave para a role. */
  byRole: (roleName: string) => `/apikeys/role/${seg(roleName)}`,
  /** POST — revoga a chave. */
  revoke: (publicId: string) => `/apikeys/${seg(publicId)}/revoke`,
} as const;
