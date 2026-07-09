// Contrato de resposta do login do seedgrid-security (espelha o backend). É genérico
// aos dois modos de tenancy — por isso mora no barrel client-safe, não no /server.

export type SecurityLoginResponse =
  | {
      status: "OK";
      token: string;
      tokenType?: string;
      refreshToken?: string;
      publicId?: string;
      changePasswordRequired?: boolean;
      twoFactorEnabled?: boolean;
    }
  | {
      status: "2F_REQUIRED";
      tempToken: string;
      method?: string;
    }
  | {
      status: string;
      [key: string]: unknown;
    };

export type SecurityResend2FAResponse = {
  status: string;
  method?: string;
  message?: string;
  tempToken?: string;
  metadata?: Record<string, unknown>;
  error?: string;
};

/** Escopo de permissões do usuário corrente (GET /me/permissions). */
export interface MePermissions {
  userPublicId: string;
  name: string;
  roles: string[];
  permissions: string[];
}

/** Narrowing: login concluído com token (status "OK"). */
export function isLoginSuccess(
  payload: SecurityLoginResponse,
): payload is Extract<SecurityLoginResponse, { status: "OK" }> {
  return (
    payload.status === "OK" &&
    "token" in payload &&
    typeof payload.token === "string"
  );
}
