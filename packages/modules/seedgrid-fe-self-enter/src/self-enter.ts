// DTOs de self-enter (auto-cadastro de USUÁRIO — name/email/password — na extensão
// ext-security). Feature OPCIONAL com 3 modos no backend: disabled / invite-only /
// public. NÃO confundir com o registro de EMPRESA do login-tenancy (esse é BR/CNPJ).
// Client-safe. Os paths ficam em SecurityPaths.selfEnter (fe-security).

export type EntryRequestOrigin = "INVITE" | "PUBLIC";

export type EntryRequestStatus =
  | "PENDING_EMAIL"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "REJECTED"
  | "EXPIRED";

/** POST /public/self-enter/requests — pedido público de auto-cadastro. */
export interface CreateEntryRequest {
  name: string;
  email: string;
  password: string;
}

/** Pedido de self-enter (EntryRequestDTORes). */
export interface EntryRequestResponse {
  id: string;
  email: string;
  name: string;
  origin: EntryRequestOrigin;
  status: EntryRequestStatus;
  requestedAt: string;
  expiresAt: string | null;
  approvedAt: string | null;
  approvedBy: string | null;
  rejectedAt: string | null;
  rejectedBy: string | null;
  invitedBy: string | null;
  invitationAcceptedAt: string | null;
}

/** POST /self-enter/invitations — cria convite (admin). */
export interface CreateEntryInvitation {
  email: string;
  name: string;
}

/** Convite (EntryInvitationDTORes). */
export interface EntryInvitationResponse {
  requestId: string;
  email: string;
  name: string;
  origin: EntryRequestOrigin;
  status: EntryRequestStatus;
  invitationExpiresAt: string | null;
  invitationAcceptedAt: string | null;
}

/** POST /public/self-enter/invitations/{token}/complete — completa via convite. */
export interface CompleteEntryInvitation {
  name: string;
  email: string;
  password: string;
}
