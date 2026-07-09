// DTOs de cadastro de TENANT (subdomain-tenancy: cada tenant tem seu subdomínio/DB).
// Espelham TenantSignupRequest (ext-subdomain-tenancy). Público (pré-auth). BR-coupled.
// Distinto do login-tenancy (lá é 1 backend, N empresas, escolhe no login) e do
// self-enter (lá é usuário name/email/password). Aqui cria um TENANT novo.

/** UF brasileira (StateEnum) — ex.: "SP", "RJ". */
export type BrazilianState = string;

/** Endereço (AddressDTO aninhado). */
export interface TenantAddress {
  street: string;
  number: string;
  complement?: string | null;
  postalCode: string;
  city: string;
  state: BrazilianState;
  /** Bairro. */
  district: string;
  phone?: string | null;
}

/**
 * Representante legal (LegalRepresentativeDTO aninhado). Espelha
 * TenantSignupRequest.LegalRepresentativeDTO (seedgrid-quarkus-ext-subdomain-tenancy):
 * firstName/lastName/phone são `@NotBlank` no backend (obrigatórios); cpf e
 * birthDate são validados por formato mas não por `@NotBlank` explícito;
 * whatsapp não tem nenhuma validação (opcional de verdade).
 */
export interface TenantLegalRepresentative {
  firstName: string;
  lastName: string;
  cpf: string;
  /** LocalDate "yyyy-MM-dd". */
  birthDate: string;
  phone: string;
  whatsapp?: string | null;
}

/** POST /public/tenants — cria o tenant + usuário root. */
export interface TenantSignupRequest {
  subdomain: string;
  cnpj: string;
  /** Razão Social. */
  corporateName: string;
  /** Nome Fantasia. */
  tradeName: string;
  address: TenantAddress;
  legalRepresentative: TenantLegalRepresentative;
  rootEmail: string;
  plainRootPassword: string;
}

/** POST /public/tenants/validate-email — confirma o e-mail com o código. */
export interface TenantValidateEmailRequest {
  subdomain: string;
  code: string;
}

/**
 * Resultado do signup (shape do backend não confirmado — flexível). O fluxo tem
 * confirmação de e-mail (validate/resend), então normalmente volta um status pendente.
 */
export interface TenantSignupResult {
  subdomain?: string;
  status?: string;
  message?: string;
  [key: string]: unknown;
}
