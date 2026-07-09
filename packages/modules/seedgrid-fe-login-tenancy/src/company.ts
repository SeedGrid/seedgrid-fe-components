// Contrato do escopo de empresa no login-tenancy (espelha o report-api). Client-safe.
// login-tenancy = tenancy definida NO LOGIN: o usuário escolhe a empresa e o token é
// re-escopado (contrasta com multi-tenancy, resolvida por host/subdomínio).

/** Empresa (membership) disponível pro usuário corrente — GET /me/companies (MyCompanyDTORes). */
export interface MyCompany {
  publicId: string;
  tradeName?: string | null;
  corporateName?: string | null;
  /** Se o usuário é root NAQUELA empresa. */
  isRoot?: boolean;
}

/**
 * Resultado de selecionar a empresa (POST /me/select-company). `kind === "signed_in"`
 * = token re-escopado e login concluído; qualquer outro `kind` = precisa de tratamento
 * (usa `message` quando presente).
 */
export interface SelectCompanyResult {
  kind: string;
  message?: string;
}

/** Rótulo exibível de uma empresa: tradeName → corporateName → publicId. */
export function companyLabel(company: MyCompany): string {
  return company.tradeName ?? company.corporateName ?? company.publicId;
}
