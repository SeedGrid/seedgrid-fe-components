"use client";

import { useEffect, useMemo, useState } from "react";

import {
  SgButton,
  SgConfirmationDialog,
  SgDatatable,
  SgInputText,
  SgStack,
  toast,
} from "@seedgrid/fe-components";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { useI18n } from "@/i18n";
import {
  CompanyManagementGuard,
  InlineNotice,
  PageFrame,
  RouteGuard,
  StatusBadge,
  extractApiMessage,
  securityConfig,
  securityService,
  useCrudPermission,
  useDebouncedSearch,
  type CompanySummary,
  type SortState,
} from "@/modules/security";
import { isSearchReady } from "@/modules/security/utils";

export default function CompaniesListPage() {
  return (
    <CompanyManagementGuard>
      <RouteGuard permissions={["COMPANY_READ"]}>
        <CompaniesListScreen />
      </RouteGuard>
    </CompanyManagementGuard>
  );
}

function CompaniesListScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const permissions = useCrudPermission("COMPANY");
  const [companies, setCompanies] = useState<CompanySummary[]>([]);
  const [page, setPage] = useState(0);
  // <number> explicito: defaultPageSize e um literal (ex.: 10), entao sem a
  // anotacao o useState inferiria o tipo `10` e setRows(event.rows ?? ...)
  // recusaria um number qualquer (TS2345 SetStateAction<10>).
  const [rows, setRows] = useState<number>(securityConfig.pagination.defaultPageSize);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [sort, setSort] = useState<SortState>({
    sortField: "tradeName",
    sortOrder: 1,
  });
  const [selectedCompany, setSelectedCompany] = useState<CompanySummary | null>(
    null
  );
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
        const response = await securityService.listCompaniesPage({
          page,
          size: rows,
          search: effectiveSearch,
          sort,
        });

        if (!active) {
          return;
        }

        setCompanies(response.items);
        setTotalRecords(response.total);
      } catch (error) {
        if (!active) {
          return;
        }

        toast.error(
          extractApiMessage(error) ??
            t("security.companies.list.delete_error")
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
  }, [effectiveSearch, page, rows, sort, t]);

  const columns = useMemo(
    () => [
      {
        field: "tradeName",
        header: t("security.companies.list.column.trade_name"),
        sortable: true,
      },
      {
        field: "corporateName",
        header: t("security.companies.list.column.corporate_name"),
        sortable: true,
      },
      {
        field: "cnpj",
        header: t("security.companies.list.column.cnpj"),
      },
      {
        field: "addrCity",
        header: t("security.companies.list.column.location"),
        body: (company: CompanySummary) =>
          [company.addrCity, company.addrState].filter(Boolean).join(" / ") ||
          "-",
      },
      {
        field: "active",
        header: t("security.companies.list.column.status"),
        body: (company: CompanySummary) => (
          <StatusBadge
            active={Boolean(company.active)}
            activeLabel={t("security.common.enabled")}
            inactiveLabel={t("security.common.disabled")}
          />
        ),
      },
      {
        header: t("security.common.actions"),
        body: (company: CompanySummary) => (
          <SgStack direction="row" wrap gap={8} data-sg-stop-row-select="true">
            <SgButton
              appearance="ghost"
              severity="info"
              iconOnly
              leftIcon={<Pencil size={16} />}
              title={
                permissions.canUpdate
                  ? t("security.companies.list.action.edit")
                  : t("security.companies.list.action.view")
              }
              aria-label={
                permissions.canUpdate
                  ? t("security.companies.list.action.edit")
                  : t("security.companies.list.action.view")
              }
              onClick={() => {
                router.push(
                  `${securityConfig.routes.companies}/${company.publicId}`
                );
              }}
              className="border border-slate-200/80 bg-slate-50/55 text-slate-700 hover:border-sky-200 hover:bg-slate-50 hover:text-sky-700"
            />
            {permissions.canDelete ? (
              <SgButton
                appearance="ghost"
                severity="danger"
                iconOnly
                leftIcon={<Trash2 size={16} />}
                title={t("security.companies.list.action.delete")}
                aria-label={t("security.companies.list.action.delete")}
                onClick={() => {
                  setSelectedCompany(company);
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
    if (!selectedCompany) {
      return;
    }

    try {
      await securityService.deleteCompany(selectedCompany.publicId);
      toast.success(t("security.companies.list.delete_success"));
      setSelectedCompany(null);
      setLoading(true);
      const response = await securityService.listCompaniesPage({
        page,
        size: rows,
        search: effectiveSearch,
        sort,
      });
      setCompanies(response.items);
      setTotalRecords(response.total);
    } catch (error) {
      toast.error(
        extractApiMessage(error) ?? t("security.companies.list.delete_error")
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageFrame
      title={t("security.companies.list.title")}
      description={t("security.companies.list.description")}
      readonlyLabel={
        permissions.isReadOnly ? t("security.common.readonly") : null
      }
      actions={
        permissions.canCreate ? (
          <SgButton
            appearance="solid"
            severity="primary"
            shape="rounded"
            label={t("security.companies.list.new")}
            onClick={() => {
              router.push(`${securityConfig.routes.companies}/new`);
            }}
          />
        ) : undefined
      }
    >
      <SgStack gap={16}>
        <SgInputText
          id="security-companies-search"
          label={t("security.common.search")}
          inputProps={searchInputProps}
          placeholder={t("security.companies.list.search_placeholder")}
        />

        {!isSearchReady(searchValue) && searchValue.trim().length > 0 ? (
          <InlineNotice>{t("security.common.search_hint")}</InlineNotice>
        ) : null}

        <SgDatatable<CompanySummary>
          title=" "
          value={companies}
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
          emptyMessage={t("security.companies.list.empty")}
          onPage={(event) => {
            setRows(event.rows ?? securityConfig.pagination.defaultPageSize);
            setPage(event.page ?? 0);
          }}
          onSort={(event) => {
            setPage(0);
            setSort({
              sortField: event.sortField ?? "tradeName",
              sortOrder:
                event.sortOrder === 1 || event.sortOrder === -1
                  ? event.sortOrder
                  : 1,
            });
          }}
        />
      </SgStack>

      <SgConfirmationDialog
        open={Boolean(selectedCompany)}
        severity="danger"
        title={t("security.companies.list.delete_title")}
        message={t("security.companies.list.delete_message")}
        onCancel={() => {
          setSelectedCompany(null);
        }}
        onConfirm={handleDelete}
      />
    </PageFrame>
  );
}
