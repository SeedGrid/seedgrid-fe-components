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
  extractApiMessage,
  securityConfig,
  securityService,
  useCrudPermission,
  useDebouncedSearch,
  type SortState,
  type RoleSummary,
} from "@/modules/security";
import { isSearchReady } from "@/modules/security/utils";

export default function RolesListPage() {
  return (
    <RouteGuard permissions={["ROLE_READ"]}>
      <RolesListScreen />
    </RouteGuard>
  );
}

function RolesListScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const permissions = useCrudPermission("ROLE");
  const [roles, setRoles] = useState<RoleSummary[]>([]);
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
  const [selectedRole, setSelectedRole] = useState<RoleSummary | null>(null);
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
        const response = await securityService.listRolesPage({
          page,
          size: rows,
          search: effectiveSearch,
          sort,
        });

        if (!active) {
          return;
        }

        setRoles(response.items);
        setTotalRecords(response.total);
      } catch (error) {
        if (!active) {
          return;
        }

        sgWhistle.error({
          message: extractApiMessage(error) ?? t("security.roles.form.load_error"),
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
        header: t("security.roles.list.column.name"),
        sortable: true,
      },
      {
        field: "permissions",
        header: t("security.roles.list.column.permissions"),
        body: (role: RoleSummary) =>
          role.permissions?.length
            ? role.permissions.map((permission) => permission.name).join(", ")
            : "-",
      },
      {
        field: "forIntegration",
        header: t("security.roles.list.column.integration"),
        body: (role: RoleSummary) =>
          role.forIntegration ? t("security.common.yes") : t("security.common.no"),
      },
      {
        header: t("security.common.actions"),
        body: (role: RoleSummary) => (
          <SgStack direction="row" wrap gap={8} data-sg-stop-row-select="true">
            <SgButton
              appearance="ghost"
              severity="info"
              iconOnly
              leftIcon={<Pencil size={16} />}
              title={
                permissions.canUpdate
                  ? t("security.roles.list.action.edit")
                  : t("security.roles.list.action.view")
              }
              aria-label={
                permissions.canUpdate
                  ? t("security.roles.list.action.edit")
                  : t("security.roles.list.action.view")
              }
              onClick={() => {
                router.push(`${securityConfig.routes.roles}/${role.publicId}`);
              }}
              className="border border-slate-200/80 bg-slate-50/55 text-slate-700 hover:border-sky-200 hover:bg-slate-50 hover:text-sky-700"
            />
            {permissions.canDelete ? (
              <SgButton
                appearance="ghost"
                severity="danger"
                iconOnly
                leftIcon={<Trash2 size={16} />}
                title={t("security.roles.list.action.delete")}
                aria-label={t("security.roles.list.action.delete")}
                onClick={() => {
                  setSelectedRole(role);
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
    if (!selectedRole) {
      return;
    }

    try {
      await securityService.deleteRole(selectedRole.publicId);
      const response = await securityService.listRolesPage({
        page,
        size: rows,
        search: effectiveSearch,
        sort,
      });
      setRoles(response.items);
      setTotalRecords(response.total);
      setSelectedRole(null);
      sgWhistle.success({ message: t("security.roles.list.delete_success") });
    } catch (error) {
      sgWhistle.error({
        message: extractApiMessage(error) ?? t("security.roles.list.delete_error"),
      });
    }
  }

  return (
    <PageFrame
      title={t("security.roles.list.title")}
      description={t("security.roles.list.description")}
      readonlyLabel={permissions.isReadOnly ? t("security.common.readonly") : null}
      actions={
        permissions.canCreate ? (
          <SgButton
            appearance="solid"
            severity="primary"
            shape="rounded"
            label={t("security.roles.list.new")}
            onClick={() => {
              router.push(`${securityConfig.routes.roles}/new`);
            }}
          />
        ) : undefined
      }
    >
      <SgStack gap={16}>
        <SgInputText
          id="security-roles-search"
          label={t("security.common.search")}
          inputProps={searchInputProps}
          placeholder={t("security.roles.list.search_placeholder")}
        />

        {!isSearchReady(searchValue) && searchValue.trim().length > 0 ? (
          <InlineNotice>{t("security.common.search_hint")}</InlineNotice>
        ) : null}

        <SgDatatable<RoleSummary>
          title=" "
          value={roles}
          columns={columns}
          dataKey="publicId"
          paginator
          lazy
          first={page * rows}
          rows={rows}
          totalRecords={totalRecords}
          onPage={(event) => {
            setPage(event.page ?? 0);
            setRows(event.rows ?? securityConfig.pagination.defaultPageSize);
          }}
          sortField={sort.sortField ?? undefined}
          sortOrder={sort.sortOrder}
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
          loading={loading}
          emptyMessage={t("security.roles.list.empty")}
        />
      </SgStack>

      <SgConfirmationDialog
        open={Boolean(selectedRole)}
        severity="danger"
        title={t("security.roles.list.delete_title")}
        message={t("security.roles.list.delete_message")}
        onCancel={() => {
          setSelectedRole(null);
        }}
        onConfirm={handleDelete}
      />
    </PageFrame>
  );
}
