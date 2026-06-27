// Espelho do RestControllerPath.java (seedgrid-quarkus-ext-security): contrato único
// dos paths REST do SeedGrid Security — front e back falam o MESMO. Mudou um path no
// backend? Atualize aqui também. Paths sob `/public/*` são não-autenticados.
//
// Convenção: endpoints estáticos são strings; endpoints com parâmetro são funções
// builder (já aplicam encodeURIComponent no segmento).

const seg = (value: string): string => encodeURIComponent(value);

export const SecurityPaths = {
  /** AUTH (/public/auth) — não-autenticado. */
  auth: {
    login: "/public/auth/login",
    refresh: "/public/auth/refresh",
    confirmEmail: "/public/auth/confirm-email",
    forgotPassword: "/public/auth/forgot-password",
    resetPassword: "/public/auth/reset-password",
  },

  /** TWO-FACTOR (/2f autenticado, /public/2f não-autenticado). */
  twoFactor: {
    verify: "/public/2f/verify",
    resend: "/public/2f/resend",
    enable: "/2f/enable",
    status: "/2f/status",
    totpConfirm: "/2f/totp/confirm",
    setupConfirm: "/2f/setup/confirm",
    disable: "/2f/disable",
  },

  /** USERS (/users). */
  users: {
    base: "/users",
    changePassword: "/users/change-password",
    defaultAvatars: "/users/avatars/defaults",
    byPublicId: (publicId: string) => `/users/${seg(publicId)}`,
    avatar: (publicId: string) => `/users/${seg(publicId)}/avatar`,
    // Membership por conta (root + roles do usuário NAQUELA company).
    membership: (publicId: string, companyPublicId: string) =>
      `/users/${seg(publicId)}/memberships/${seg(companyPublicId)}`,
  },

  /** ROLES (/roles). */
  roles: {
    base: "/roles",
    integration: "/roles/integration",
    byPublicId: (publicId: string) => `/roles/${seg(publicId)}`,
  },

  /** PERMISSIONS (/permissions). */
  permissions: {
    base: "/permissions",
    byPublicId: (publicId: string) => `/permissions/${seg(publicId)}`,
  },

  /** ME (/me) — escopo do usuário corrente pelo token. */
  me: {
    permissions: "/me/permissions",
    selectCompany: "/me/select-company",
  },

  /** COMPANIES (/companies, /public/companies). */
  companies: {
    base: "/companies",
    public: "/public/companies",
    byPublicId: (publicId: string) => `/companies/${seg(publicId)}`,
  },

  /** SELF-ENTER (/self-enter autenticado, /public/self-enter não-autenticado). */
  selfEnter: {
    requests: "/public/self-enter/requests",
    requestsToApprove: "/self-enter/requests/to-approve",
    invitations: "/self-enter/invitations",
    requestById: (id: string) => `/public/self-enter/requests/${seg(id)}`,
    confirmEmail: (id: string) => `/public/self-enter/requests/${seg(id)}/confirm-email`,
    resendEmail: (id: string) => `/public/self-enter/requests/${seg(id)}/resend-email`,
    approve: (id: string) => `/self-enter/requests/${seg(id)}/approve`,
    reject: (id: string) => `/self-enter/requests/${seg(id)}/reject`,
    invitationByToken: (token: string) => `/public/self-enter/invitations/${seg(token)}`,
    invitationComplete: (token: string) =>
      `/public/self-enter/invitations/${seg(token)}/complete`,
    invitationResend: (id: string) => `/self-enter/invitations/${seg(id)}/resend`,
  },
} as const;

export type SecurityPaths = typeof SecurityPaths;
