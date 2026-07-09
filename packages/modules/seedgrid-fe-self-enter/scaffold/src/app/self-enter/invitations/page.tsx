"use client";

import { useEffect, useMemo, useState } from "react";

import {
  SgButton,
  SgDatatable,
  SgGroupBox,
  SgInputEmail,
  SgInputText,
  SgPanel,
  SgStack,
  sgWhistle,
} from "@seedgrid/fe-components";
import { Mail } from "lucide-react";

import { useI18n } from "@/i18n";
import {
  InlineNotice,
  PageFrame,
  RouteGuard,
  classifySelfEnterInvitationAdminError,
  extractApiMessage,
  securityConfig,
  securityService,
  useDebouncedSearch,
  type EntryRequest,
  type SortState,
} from "@/modules/security";
import { formatDateTime, isSearchReady } from "@/modules/security/utils";

export default function SelfEnterInvitationsPage() {
  return (
    <RouteGuard permissions={["SELFENTER_INVITE"]}>
      <SelfEnterInvitationsScreen />
    </RouteGuard>
  );
}

function SelfEnterInvitationsScreen() {
  const { t, locale } = useI18n();
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePending, setInvitePending] = useState(false);
  const [requests, setRequests] = useState<EntryRequest[]>([]);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState<number>(
    securityConfig.pagination.defaultPageSize
  );
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [sort, setSort] = useState<SortState>({
    sortField: "requestedAt",
    sortOrder: -1,
  });
  const [resendingId, setResendingId] = useState<string | null>(null);
  const debouncedSearch = useDebouncedSearch(searchValue);
  const effectiveSearch = isSearchReady(debouncedSearch) ? debouncedSearch : "";
  const inviteNameInputProps = {
    value: inviteName,
    onChange: (event: { target: { value: string } }) => {
      setInviteName(event.target.value);
    },
  };
  const inviteEmailInputProps = {
    value: inviteEmail,
    onChange: (event: { target: { value: string } }) => {
      setInviteEmail(event.target.value);
    },
  };
  const searchInputProps = {
    value: searchValue,
    onChange: (event: { target: { value: string } }) => {
      setSearchValue(event.target.value);
      setPage(0);
    },
  };

  async function loadInvitations() {
    const response = await securityService.listSelfEnterInvitationsPage({
      page,
      size: rows,
      search: effectiveSearch,
      sort,
    });

    setRequests(response.items);
    setTotalRecords(response.total);
  }

  useEffect(() => {
    let active = true;
    setLoading(true);

    void (async () => {
      try {
        const response = await securityService.listSelfEnterInvitationsPage({
          page,
          size: rows,
          search: effectiveSearch,
          sort,
        });

        if (!active) {
          return;
        }

        setRequests(response.items);
        setTotalRecords(response.total);
      } catch (error) {
        if (!active) {
          return;
        }

        sgWhistle.error({
          message:
            extractApiMessage(error) ??
            t("security.self_enter.invitation_admin.error"),
        });
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [effectiveSearch, page, rows, sort, t]);

  const columns = useMemo(
    () => [
      {
        field: "email",
        header: t("security.self_enter.invitation_admin.email"),
        sortable: true,
      },
      {
        field: "name",
        header: t("security.self_enter.invitation_admin.name"),
        sortable: true,
      },
      {
        field: "invitedBy",
        header: t("security.self_enter.invitation_admin.column.invited_by"),
      },
      {
        field: "expiresAt",
        header: t("security.self_enter.invitation_admin.column.expires_at"),
        sortable: true,
        body: (item: EntryRequest) => formatDateTime(item.expiresAt, locale),
      },
      {
        header: t("security.common.actions"),
        body: (item: EntryRequest) => (
          <div className="flex flex-wrap gap-2" data-sg-stop-row-select="true">
            <SgButton
              size="sm"
              appearance="solid"
              severity="info"
              shape="rounded"
              leftIcon={<Mail size={16} />}
              label={t("security.self_enter.invitation_admin.resend")}
              aria-label={t("security.self_enter.invitation_admin.resend")}
              title={t("security.self_enter.invitation_admin.resend")}
              loading={resendingId === item.id}
              disabled={resendingId === item.id}
              onClick={() => {
                void handleResend(item.id);
              }}
            />
          </div>
        ),
      },
    ],
    [locale, resendingId, t]
  );

  async function handleInviteSubmit() {
    const normalizedEmail = inviteEmail.trim();
    const normalizedName = inviteName.trim();

    if (!normalizedEmail || invitePending) {
      return;
    }

    setInvitePending(true);

    try {
      await securityService.createSelfEnterInvitation({
        email: normalizedEmail,
        name: normalizedName || undefined,
      });
      sgWhistle.success({
        message: t("security.self_enter.invitation_admin.success"),
      });
      setInviteName("");
      setInviteEmail("");
      await loadInvitations();
    } catch (error) {
      const inviteError =
        classifySelfEnterInvitationAdminError(error) === "duplicate_email"
          ? t("security.self_enter.invitation_admin.duplicate_email")
          : t("security.self_enter.invitation_admin.error");

      sgWhistle.error({
        message: inviteError,
      });
    } finally {
      setInvitePending(false);
    }
  }

  async function handleResend(id: string | number) {
    const normalizedId = `${id}`.trim();

    if (!normalizedId || resendingId) {
      return;
    }

    setResendingId(normalizedId);

    try {
      await securityService.resendSelfEnterInvitation(normalizedId);
      sgWhistle.success({
        message: t("security.self_enter.invitation_admin.resend_success"),
      });
      await loadInvitations();
    } catch (error) {
      sgWhistle.error({
        message:
          extractApiMessage(error) ??
          t("security.self_enter.invitation_admin.resend_error"),
      });
    } finally {
      setResendingId(null);
    }
  }

  return (
    <PageFrame
      title={t("security.self_enter.invitation_admin.nav_title")}
      description={t("security.self_enter.invitation_admin.page_description")}
    >
      <div className="space-y-4">
        <SgPanel borderStyle="none" className="mx-auto w-full">
          <SgStack gap={16}>
            <SgStack gap={4}>
              <h2 className="text-base font-semibold">
                {t("security.self_enter.invitation_admin.form_title")}
              </h2>
              <p className="text-sm text-slate-500">
                {t("security.self_enter.invitation_admin.description")}
              </p>
            </SgStack>

            <div className="grid gap-4 md:grid-cols-2">
              <SgInputEmail
                id="security-self-enter-invite-email"
                label={t("security.self_enter.invitation_admin.email")}
                required
                inputProps={inviteEmailInputProps}
              />
              <SgInputText
                id="security-self-enter-invite-name"
                label={t("security.self_enter.invitation_admin.name")}
                inputProps={inviteNameInputProps}
              />
            </div>

            <div className="flex justify-end">
              <SgButton
                appearance="solid"
                severity="primary"
                shape="rounded"
                label={t("security.self_enter.invitation_admin.submit")}
                loading={invitePending}
                disabled={invitePending}
                onClick={() => {
                  void handleInviteSubmit();
                }}
              />
            </div>
          </SgStack>
        </SgPanel>

        <SgGroupBox title={t("security.self_enter.invitation_admin.list_title")}>
          <SgStack gap={16}>
            <SgInputText
              id="security-self-enter-invitation-search"
              label={t("security.common.search")}
              inputProps={searchInputProps}
              placeholder={t("security.self_enter.approval.search_placeholder")}
            />

            {!isSearchReady(searchValue) && searchValue.trim().length > 0 ? (
              <InlineNotice>{t("security.common.search_hint")}</InlineNotice>
            ) : null}

            <SgDatatable<EntryRequest>
              title=" "
              value={requests}
              columns={columns}
              dataKey="id"
              lazy
              paginator
              rows={rows}
              first={page * rows}
              totalRecords={totalRecords}
              sortField={sort.sortField}
              sortOrder={sort.sortOrder}
              loading={loading}
              emptyMessage={t("security.self_enter.invitation_admin.list_empty")}
              onPage={(event) => {
                setRows(event.rows ?? securityConfig.pagination.defaultPageSize);
                setPage(event.page ?? 0);
              }}
              onSort={(event) => {
                setPage(0);
                setSort({
                  sortField: event.sortField ?? "createdAt",
                  sortOrder:
                    event.sortOrder === 1 || event.sortOrder === -1
                      ? event.sortOrder
                      : -1,
                });
              }}
            />
          </SgStack>
        </SgGroupBox>
      </div>
    </PageFrame>
  );
}
