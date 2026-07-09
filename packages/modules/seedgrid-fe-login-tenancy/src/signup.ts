// Signup institucional do login-tenancy: cadastro público de EMPRESA (ext-login-tenancy,
// AccountTenancySignupController). BR-coupled. Igual ao tenant signup do subdomain, mas
// SEM subdomínio (login-tenancy = URL única, N empresas). Client-safe.

/** Status do pedido de signup (SignupRequestStatus, enum no back). */
export type SignupRequestStatus = string;

/**
 * Endereço (AddressDTO aninhado). `phone` é `@NotBlank` no backend —
 * corrigido (estava opcional por engano, mesma classe de bug do
 * `legalRepresentative`).
 */
export interface SignupAddress {
  street: string;
  number: string;
  complement?: string | null;
  postalCode: string;
  city: string;
  /** UF brasileira. */
  state: string;
  /** Bairro. */
  district: string;
  phone: string;
}

/**
 * Representante legal (LegalRepresentativeDTO aninhado). Espelha
 * InstitutionalSignupRequest.LegalRepresentativeDTO (seedgrid-quarkus-ext-login-tenancy):
 * firstName/lastName/phone são obrigatórios (`@NotBlank`); cpf e birthDate são
 * validados por formato mas não por `@NotBlank` explícito; whatsapp não tem
 * nenhuma validação (opcional de verdade). Corrigido: faltava `whatsapp` e
 * `phone` estava opcional por engano (mesmo tipo de divergência já achada e
 * corrigida em `fe-subdomain-tenancy`).
 */
export interface SignupLegalRepresentative {
  firstName: string;
  lastName: string;
  cpf: string;
  /** LocalDate "yyyy-MM-dd". */
  birthDate: string;
  phone: string;
  whatsapp?: string | null;
}

/**
 * POST /public/signup.
 *
 * `rootEmail` já existente NÃO é erro: é VINCULAÇÃO de uma nova empresa (novo
 * CNPJ) à conta existente (modelo M2M user↔company) — o backend ignora
 * `plainRootPassword` nesse caso (por isso é opcional aqui: no cadastro novo é
 * obrigatório, mas no fluxo de vinculação a tela nem deveria pedir senha; ver
 * `EmailExistsResponse`/scaffold da tela de signup).
 */
export interface InstitutionalSignupRequest {
  cnpj: string;
  /** Razão Social. */
  corporateName: string;
  /** Nome Fantasia. */
  tradeName: string;
  address: SignupAddress;
  legalRepresentative: SignupLegalRepresentative;
  rootEmail: string;
  plainRootPassword?: string;
}

export interface SignupResponse {
  status: SignupRequestStatus;
  signupRequestId: string;
}

/** GET /public/signup/email-exists?email=. */
export interface EmailExistsResponse {
  exists: boolean;
}

/** POST /public/signup/confirm-email. */
export interface ConfirmSignupRequest {
  token: string;
}

export interface ConfirmSignupResponse {
  status: SignupRequestStatus;
  companyId: string;
  signupRequestId: string;
}

/** POST /public/signup/resend-email. */
export interface ResendSignupEmailRequest {
  email: string;
}

/** GET /public/accounttenancy/status — se o signup/login-tenancy está habilitado (shape flexível). */
export interface AccountTenancyStatus {
  [key: string]: unknown;
}
