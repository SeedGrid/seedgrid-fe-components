"use client";

import { useEffect, useMemo, useState } from "react";

import {
  SgButton,
  SgConfirmationDialog,
  SgDatatable,
  SgInputText,
  SgStack,
  sgWhistle,
} from "@seedgrid/fe-components";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { useI18n } from "@/i18n";
import {
  InlineNotice,
  PageFrame,
  RouteGuard,
  StatusBadge,
  extractApiMessage,
  securityConfig,
  securityService,
  useCrudPermission,
  useDebouncedSearch,
  type SortState,
  type UserSummary,
} from "@/modules/security";
import { isSearchReady } from "@/modules/security/utils";

export default function UsersListPage() {
  return (
    <RouteGuard permissions={["USER_READ"]}>
      <UsersListScreen />
    </RouteGuard>
  );
}

function UsersListScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const permissions = useCrudPermission("USER");
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState<number>(
    securityConfig.pagination.defaultPageSize
  );
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [sort, setSort] = useState<SortState>({
    sortField: "name",
    sortOrder: 1,
  });
  const [selectedUser, setSelectedUser] = useState<UserSummary | null>(null);
  const debouncedSearch = useDebouncedSearch(searchValue);
  const effectiveSearch = isSearchReady(debouncedSearch) ? debouncedSearch : "";

  const searchInputProps = {
    value: searchValue,
    onChange: (event: { target: { value: string } }) => {
      setSearchValue(event.target.value);
      setPage(0);
    },
  };

  useEffect(() => {
    let active = true;
    setLoading(true);

    void (async () => {
      try {
        const response = await securityService.listUsersPage({
          page,
          size: rows,
          search: effectiveSearch,
          sort,
        });

        if (!active) {
          return;
        }

        setUsers(response.items);
        setTotalRecords(response.total);
      } catch (error) {
        if (!active) {
          return;
        }

        sgWhistle.error({
          message:
            extractApiMessage(error) ?? t("security.users.list.delete_error"),
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
        field: "name",
        header: t("security.users.list.column.name"),
        sortable: true,
      },
      {
        field: "email",
        header: t("security.users.list.column.email"),
        sortable: true,
      },
      {
        field: "whatsApp",
        header: t("security.users.list.column.whatsapp"),
      },
      {
        field: "roles",
        header: t("security.users.list.column.roles"),
        body: (user: UserSummary) =>
          user.roles?.map((role) => role.name).join(", ") || "-",
      },
      {
        field: "active",
        header: t("security.users.list.column.status"),
        body: (user: UserSummary) => (
          <StatusBadge
            active={Boolean(user.active)}
            activeLabel={t("security.common.enabled")}
            inactiveLabel={t("security.common.disabled")}
          />
        ),
      },
      {
        header: t("security.common.actions"),
        body: (user: UserSummary) => (
          <SgStack direction="row" wrap gap={8} data-sg-stop-row-select="true">
            <SgButton
              appearance="ghost"
              severity="info"
              iconOnly
              leftIcon={<Pencil size={16} />}
              title={
                permissions.canUpdate
                  ? t("security.users.list.action.edit")
                  : t("security.users.list.action.view")
              }
              aria-label={
                permissions.canUpdate
                  ? t("security.users.list.action.edit")
                  : t("security.users.list.action.view")
              }
              onClick={() => {
                router.push(`${securityConfig.routes.users}/${user.publicId}`);
              }}
              className="border border-slate-200/80 bg-slate-50/55 text-slate-700 hover:border-sky-200 hover:bg-slate-50 hover:text-sky-700"
            />
            {permissions.canDelete ? (
              <SgButton
                appearance="ghost"
                severity="danger"
                iconOnly
                leftIcon={<Trash2 size={16} />}
                title={t("security.users.list.action.delete")}
                aria-label={t("security.users.list.action.delete")}
                onClick={() => {
                  setSelectedUser(user);
                }}
                className="border border-rose-200/80 bg-rose-50/45 text-rose-600 hover:border-rose-200 hover:bg-rose-50/70 hover:text-rose-700"
              />
            ) : null}
          </SgStack>
        ),
      },
    ],
    [permissions.canDelete, permissions.canUpdate, router, t]
  );

  async function handleDelete() {
    if (!selectedUser) {
      return;
    }

    try {
      await securityService.deleteUser(selectedUser.publicId);
      sgWhistle.success({ message: t("security.users.list.delete_success") });
      setSelectedUser(null);
      setLoading(true);
      const response = await securityService.listUsersPage({
        page,
        size: rows,
        search: effectiveSearch,
        sort,
      });
      setUsers(response.items);
      setTotalRecords(response.total);
    } catch (error) {
      sgWhistle.error({
        message: extractApiMessage(error) ?? t("security.users.list.delete_error"),
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageFrame
      title={t("security.users.list.title")}
      description={t("security.users.list.description")}
      readonlyLabel={
        permissions.isReadOnly ? t("security.common.readonly") : null
      }
      actions={
        permissions.canCreate ? (
          <SgButton
            appearance="solid"
            severity="primary"
            shape="rounded"
            label={t("security.users.list.new")}
            onClick={() => {
              router.push(`${securityConfig.routes.users}/new`);
            }}
          />
        ) : undefined
      }
    >
      <SgStack gap={16}>
        <SgInputText
          id="security-users-search"
          label={t("security.common.search")}
          inputProps={searchInputProps}
          placeholder={t("security.users.list.search_placeholder")}
        />

        {!isSearchReady(searchValue) && searchValue.trim().length > 0 ? (
          <InlineNotice>{t("security.common.search_hint")}</InlineNotice>
        ) : null}

        <SgDatatable<UserSummary>
          title=" "
          value={users}
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
          emptyMessage={t("security.users.list.empty")}
          onPage={(event) => {
            setRows(event.rows ?? securityConfig.pagination.defaultPageSize);
            setPage(event.page ?? 0);
          }}
          onSort={(event) => {
            setPage(0);
            setSort({
              sortField: event.sortField ?? "name",
              sortOrder:
                event.sortOrder === 1 || event.sortOrder === -1
                  ? event.sortOrder
                  : 1,
            });
          }}
        />
      </SgStack>

      <SgConfirmationDialog
        open={Boolean(selectedUser)}
        severity="danger"
        title={t("security.users.list.delete_title")}
        message={t("security.users.list.delete_message")}
        onCancel={() => {
          setSelectedUser(null);
        }}
        onConfirm={handleDelete}
      />
    </PageFrame>
  );
}
