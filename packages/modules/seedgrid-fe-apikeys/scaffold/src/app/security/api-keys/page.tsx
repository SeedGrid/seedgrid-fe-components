"use client";

import { useEffect, useMemo, useState } from "react";

import {
  SgButton,
  SgCombobox,
  SgConfirmationDialog,
  SgDatatable,
  SgInputText,
  toast,
} from "@seedgrid/fe-components";

import { useI18n } from "@/i18n";
import {
  InlineNotice,
  PageFrame,
  RouteGuard,
  StatusBadge,
  extractApiMessage,
  securityConfig,
  securityService,
  useDebouncedSearch,
  usePermission,
  type ApiKeyListItem,
  type RoleSummary,
  type SortState,
} from "@/modules/security";
import { formatDateTime, isSearchReady } from "@/modules/security/utils";

const ACCESS_PERMISSIONS = ["APIKEY_READ", "APIKEY_CREATE", "APIKEY_REVOKE"];

export default function ApiKeysPage() {
  return (
    <RouteGuard permissions={ACCESS_PERMISSIONS} permissionMode="any">
      <ApiKeysScreen />
    </RouteGuard>
  );
}

function ApiKeysScreen() {
  const { t, locale } = useI18n();
  const canRead = usePermission("APIKEY_READ");
  const canCreate = usePermission("APIKEY_CREATE");
  const canRevoke = usePermission("APIKEY_REVOKE");
  const [roles, setRoles] = useState<RoleSummary[]>([]);
  const [items, setItems] = useState<ApiKeyListItem[]>([]);
  const [page, setPage] = useState(0);
  // <number>: defaultPageSize e literal, sem anotacao o setRows(number)
  // falharia (TS2345 SetStateAction<literal>).
  const [rows, setRows] = useState<number>(securityConfig.pagination.defaultPageSize);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pendingCreate, setPendingCreate] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [createRole, setCreateRole] = useState("");
  const [createName, setCreateName] = useState("");
  const [expiresDays, setExpiresDays] = useState("");
  const [sort, setSort] = useState<SortState>({
    sortField: "createdAt",
    sortOrder: -1,
  });
  const [createdSecret, setCreatedSecret] = useState<string | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<ApiKeyListItem | null>(null);
  const debouncedSearch = useDebouncedSearch(searchValue);
  const effectiveSearch = isSearchReady(debouncedSearch) ? debouncedSearch : "";
  const createNameInputProps = {
    value: createName,
    onChange: (event: { target: { value: string } }) =>
      setCreateName(event.target.value),
  };
  const expiresDaysInputProps = {
    value: expiresDays,
    // `as const`: sem isso "numeric" alarga pra `string` e o inputProps
    // (InputHTMLAttributes.inputMode e uma uniao literal) recusa (TS2322).
    inputMode: "numeric" as const,
    onChange: (event: { target: { value: string } }) =>
      setExpiresDays(event.target.value),
  };
  const searchInputProps = {
    value: searchValue,
    onChange: (event: { target: { value: string } }) => {
      setSearchValue(event.target.value);
      setPage(0);
    },
  };
  const roleOptions = useMemo(
    () =>
      roles.map((role) => ({
        id: role.name,
        value: role.name,
        label: role.name,
      })),
    [roles]
  );
  const filterRoleOptions = useMemo(
    () => [{ id: "", value: "", label: "-" }, ...roleOptions],
    [roleOptions]
  );

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        const loadedRoles = await securityService.listIntegrationRoles();

        if (!active) {
          return;
        }

        setRoles(loadedRoles);
        setCreateRole((current) => current || loadedRoles[0]?.name || "");
      } catch (error) {
        if (!active) {
          return;
        }

        toast.error(extractApiMessage(error) ?? t("security.api_keys.form.error"));
      }
    })();

    return () => {
      active = false;
    };
  }, [t]);

  useEffect(() => {
    if (!canRead) {
      return;
    }

    let active = true;
    setLoading(true);

    void (async () => {
      try {
        const response = await securityService.listApiKeysPage({
          page,
          size: rows,
          search: effectiveSearch,
          roleName: filterRole || undefined,
          sort,
        });

        if (!active) {
          return;
        }

        setItems(response.items);
        setTotalRecords(response.total);
      } catch (error) {
        if (!active) {
          return;
        }

        toast.error(
          extractApiMessage(error) ?? t("security.api_keys.revoke_error")
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [canRead, effectiveSearch, filterRole, page, rows, sort, t]);

  const columns = useMemo(
    () => [
      {
        field: "name",
        header: t("security.api_keys.column.name"),
        sortable: true,
      },
      {
        field: "roleName",
        header: t("security.api_keys.column.role"),
      },
      {
        field: "active",
        header: t("security.api_keys.column.status"),
        body: (item: ApiKeyListItem) => (
          <StatusBadge
            active={Boolean(item.active ?? !item.revokedAt)}
            activeLabel={t("security.common.enabled")}
            inactiveLabel={t("security.common.disabled")}
          />
        ),
      },
      {
        field: "expiresAt",
        header: t("security.api_keys.column.expires_at"),
        body: (item: ApiKeyListItem) => formatDateTime(item.expiresAt, locale),
      },
      {
        field: "lastUsedAt",
        header: t("security.api_keys.column.last_used_at"),
        body: (item: ApiKeyListItem) => formatDateTime(item.lastUsedAt, locale),
      },
      {
        header: t("security.common.actions"),
        body: (item: ApiKeyListItem) => (
          <div className="flex flex-wrap gap-2" data-sg-stop-row-select="true">
            {canRevoke ? (
              <SgButton
                size="sm"
                appearance="outline"
                severity="danger"
                label={t("security.api_keys.revoke")}
                onClick={() => {
                  setRevokeTarget(item);
                }}
              />
            ) : null}
          </div>
        ),
      },
    ],
    [canRevoke, locale, t]
  );

  async function handleCreate() {
    if (!createRole.trim()) {
      return;
    }

    setPendingCreate(true);

    try {
      const response = await securityService.createApiKey({
        roleName: createRole,
        name: createName.trim(),
        expiresDays: expiresDays.trim() ? Number(expiresDays) : null,
      });

      setCreatedSecret(response.key ?? null);
      setCreateName("");
      setExpiresDays("");
      toast.success(t("security.api_keys.form.success"));

      if (canRead) {
        const refreshed = await securityService.listApiKeysPage({
          page,
          size: rows,
          search: effectiveSearch,
          roleName: filterRole || undefined,
          sort,
        });
        setItems(refreshed.items);
        setTotalRecords(refreshed.total);
      }
    } catch (error) {
      toast.error(extractApiMessage(error) ?? t("security.api_keys.form.error"));
    } finally {
      setPendingCreate(false);
    }
  }

  async function handleRevoke() {
    if (!revokeTarget) {
      return;
    }

    try {
      await securityService.revokeApiKey(revokeTarget.publicId);
      toast.success(t("security.api_keys.revoke_success"));
      setRevokeTarget(null);

      if (canRead) {
        const refreshed = await securityService.listApiKeysPage({
          page,
          size: rows,
          search: effectiveSearch,
          roleName: filterRole || undefined,
          sort,
        });
        setItems(refreshed.items);
        setTotalRecords(refreshed.total);
      }
    } catch (error) {
      toast.error(
        extractApiMessage(error) ?? t("security.api_keys.revoke_error")
      );
    }
  }

  return (
    <PageFrame
      title={t("security.api_keys.title")}
      description={t("security.api_keys.description")}
    >
      <div className="space-y-6">
        {canCreate ? (
          <div className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,14rem)_auto] lg:items-end">
            <SgInputText
              id="security-api-key-name"
              label={t("security.api_keys.form.name")}
              inputProps={createNameInputProps}
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <SgCombobox
                id="security-api-key-role"
                width="100%"
                label={t("security.api_keys.form.role")}
                source={roleOptions}
                value={createRole}
                onValueChange={(value) => {
                  setCreateRole(String(value ?? ""));
                }}
              />
              <SgInputText
                id="security-api-key-expires-days"
                label={t("security.api_keys.form.expires_days")}
                inputProps={expiresDaysInputProps}
              />
            </div>
            <SgButton
              appearance="solid"
              severity="primary"
              shape="rounded"
              label={t("security.api_keys.form.create")}
              loading={pendingCreate}
              disabled={pendingCreate || !createRole.trim() || !createName.trim()}
              onClick={handleCreate}
            />
          </div>
        ) : null}

        {createdSecret ? (
          <InlineNotice tone="success">
            <div className="space-y-3">
              <div>{t("security.api_keys.form.secret")}</div>
              <div className="rounded-2xl border border-emerald-200 bg-white px-4 py-3 font-mono text-sm break-all">
                {createdSecret}
              </div>
            </div>
          </InlineNotice>
        ) : null}

        {canRead ? (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_16rem]">
              <SgInputText
                id="security-api-key-search"
                label={t("security.common.search")}
                inputProps={searchInputProps}
                placeholder={t("security.api_keys.search_placeholder")}
              />
              <SgCombobox
                id="security-api-key-filter-role"
                width="100%"
                label={t("security.api_keys.filter_role")}
                source={filterRoleOptions}
                value={filterRole}
                onValueChange={(value) => {
                  setFilterRole(String(value ?? ""));
                  setPage(0);
                }}
              />
            </div>

            {!isSearchReady(searchValue) && searchValue.trim().length > 0 ? (
              <InlineNotice>{t("security.common.search_hint")}</InlineNotice>
            ) : null}

            <SgDatatable<ApiKeyListItem>
              title=" "
              value={items}
              columns={columns}
              dataKey="publicId"
              lazy
              paginator
              rows={rows}
              first={page * rows}
              totalRecords={totalRecords}
              sortField={sort.sortField}
              sortOrder={sort.sortOrder}
              loading={loading}
              emptyMessage={t("security.api_keys.empty")}
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
          </div>
        ) : (
          <InlineNotice>{t("security.guard.unauthorized.message")}</InlineNotice>
        )}
      </div>

      <SgConfirmationDialog
        open={Boolean(revokeTarget)}
        severity="danger"
        title={t("security.api_keys.revoke_title")}
        message={t("security.api_keys.revoke_message")}
        onCancel={() => {
          setRevokeTarget(null);
        }}
        onConfirm={handleRevoke}
      />
    </PageFrame>
  );
}
