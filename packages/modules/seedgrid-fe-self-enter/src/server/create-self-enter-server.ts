// Helpers server-side de self-enter, sobre o motor de sessão do fe-security. SERVER-ONLY.
// Reusa SecurityPaths.selfEnter. Endpoints /public/* são não-autenticados; /self-enter/*
// (aprovar/convidar) exigem sessão de admin.
//
//   const session = createSecurityServer({ ... });
//   export const selfEnter = createSelfEnterServer(session);

import { SecurityPaths } from "@seedgrid/fe-security";
import type { SecurityServer } from "@seedgrid/fe-security";

import type {
  CompleteEntryInvitation,
  CreateEntryInvitation,
  CreateEntryRequest,
  EntryInvitationResponse,
  EntryRequestResponse,
} from "../self-enter";

const post = (body?: unknown) => ({
  method: "POST",
  ...(body === undefined ? {} : { body: JSON.stringify(body) }),
});

export interface SelfEnterServer {
  // Público (não-autenticado)
  submitRequest(dto: CreateEntryRequest): Promise<EntryRequestResponse>;
  confirmEmail(requestId: string, body?: unknown): Promise<void>;
  resendEmail(requestId: string): Promise<void>;
  getInvitation(token: string): Promise<EntryInvitationResponse>;
  completeInvitation(token: string, dto: CompleteEntryInvitation): Promise<void>;
  // Admin (sessão)
  listToApprove(): Promise<EntryRequestResponse[]>;
  approve(requestId: string, body?: unknown): Promise<EntryRequestResponse>;
  reject(requestId: string, body?: unknown): Promise<EntryRequestResponse>;
  createInvitation(
    dto: CreateEntryInvitation,
  ): Promise<EntryInvitationResponse>;
  listInvitations(): Promise<EntryInvitationResponse[]>;
  resendInvitation(requestId: string): Promise<void>;
}

export function createSelfEnterServer(session: SecurityServer): SelfEnterServer {
  const SE = SecurityPaths.selfEnter;
  return {
    submitRequest: (dto) =>
      session.apiFetchSecurity<EntryRequestResponse>(SE.requests, post(dto)),
    confirmEmail: (id, body) =>
      session.apiFetchSecurity<void>(SE.confirmEmail(id), post(body)),
    resendEmail: (id) =>
      session.apiFetchSecurity<void>(SE.resendEmail(id), post()),
    getInvitation: (token) =>
      session.apiFetchSecurity<EntryInvitationResponse>(
        SE.invitationByToken(token),
      ),
    completeInvitation: (token, dto) =>
      session.apiFetchSecurity<void>(SE.invitationComplete(token), post(dto)),

    listToApprove: () =>
      session.apiFetchSecurity<EntryRequestResponse[]>(SE.requestsToApprove),
    approve: (id, body) =>
      session.apiFetchSecurity<EntryRequestResponse>(SE.approve(id), post(body)),
    reject: (id, body) =>
      session.apiFetchSecurity<EntryRequestResponse>(SE.reject(id), post(body)),
    createInvitation: (dto) =>
      session.apiFetchSecurity<EntryInvitationResponse>(
        SE.invitations,
        post(dto),
      ),
    listInvitations: () =>
      session.apiFetchSecurity<EntryInvitationResponse[]>(SE.invitations),
    resendInvitation: (id) =>
      session.apiFetchSecurity<void>(SE.invitationResend(id), post()),
  };
}
