"use client";

import { useEffect, useMemo, useState } from "react";

import {
  SgButton,
  SgConfirmationDialog,
  SgDatatable,
  SgInputText,
  sgWhistle,
} from "@seedgrid/fe-components";
import { ThumbsDown, ThumbsUp } from "lucide-react";

import { useI18n } from "@/i18n";
import {
  InlineNotice,
  PageFrame,
  RouteGuard,
  extractApiMessage,
  securityConfig,
  securityService,
  useDebouncedSearch,
  usePermission,
  type EntryRequest,
  type SortState,
} from "@/modules/security";
import { formatDateTime, isSearchReady } from "@/modules/security/utils";

export default function SelfEnterApprovalPage() {
  return (
    <RouteGuard
      permissions={["SELFENTER_APPROVE", "SELFENTER_REJECT"]}
      permissionMode="any"
    >
      <SelfEnterApprovalScreen />
    </RouteGuard>
  );
}

function SelfEnterApprovalScreen() {
  const { t, locale } = useI18n();
  const canApprove = usePermission("SELFENTER_APPROVE");
  const canReject = usePermission("SELFENTER_REJECT");
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
  const [confirmAction, setConfirmAction] = useState<{
    type: "approve" | "reject";
    item: EntryRequest;
  } | null>(null);
  const debouncedSearch = useDebouncedSearch(searchValue);
  const effectiveSearch = isSearchReady(debouncedSearch) ? debouncedSearch : "";
  const approveButtonColors = {
    bg: "rgba(34, 197, 94, 0.10)",
    border: "rgba(34, 197, 94, 0.12)",
    hoverBg: "rgba(34, 197, 94, 0.16)",
    activeBg: "rgba(34, 197, 94, 0.22)",
  };
  const rejectButtonColors = {
    bg: "rgba(239, 68, 68, 0.10)",
    border: "rgba(239, 68, 68, 0.12)",
    hoverBg: "rgba(239, 68, 68, 0.16)",
    activeBg: "rgba(239, 68, 68, 0.22)",
  };
  const searchInputProps = {
    value: searchValue,
    onChange: (event: { target: { value: string } }) => {
      setSearchValue(event.target.value);
      setPage(0);
    },
  };

  async function loadRequests() {
    const response = await securityService.listSelfEnterRequestsPage({
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
        const response = await securityService.listSelfEnterRequestsPage({
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
            t("security.self_enter.approval.load_error"),
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
        header: t("security.self_enter.approval.column.name"),
        sortable: true,
      },
      {
        field: "email",
        header: t("security.self_enter.approval.column.email"),
      },
      {
        field: "requestedAt",
        header: t("security.self_enter.approval.column.requested_at"),
        sortable: true,
        body: (item: EntryRequest) =>
          formatDateTime(item.requestedAt ?? item.createdAt, locale),
      },
      {
        header: t("security.common.actions"),
        body: (item: EntryRequest) => (
          <div className="flex flex-wrap gap-2" data-sg-stop-row-select="true">
            {canApprove ? (
              <SgButton
                size="sm"
                appearance="ghost"
                severity="success"
                shape="circle"
                iconOnly
                leftIcon={<ThumbsUp size={16} />}
                customColors={approveButtonColors}
                aria-label={t("security.self_enter.approval.approve")}
                title={t("security.self_enter.approval.approve")}
                onClick={() => {
                  setConfirmAction({
                    type: "approve",
                    item,
                  });
                }}
              />
            ) : null}
            {canReject ? (
              <SgButton
                size="sm"
                appearance="ghost"
                severity="danger"
                shape="circle"
                iconOnly
                leftIcon={<ThumbsDown size={16} />}
                customColors={rejectButtonColors}
                aria-label={t("security.self_enter.approval.reject")}
                title={t("security.self_enter.approval.reject")}
                onClick={() => {
                  setConfirmAction({
                    type: "reject",
                    item,
                  });
                }}
              />
            ) : null}
          </div>
        ),
      },
    ],
    [canApprove, canReject, locale, t]
  );

  async function handleConfirmAction() {
    if (!confirmAction) {
      return;
    }

    try {
      if (confirmAction.type === "approve") {
        await securityService.approveSelfEnterRequest(confirmAction.item.id);
        sgWhistle.success({
          message: t("security.self_enter.approval.approve_success"),
        });
      } else {
        await securityService.rejectSelfEnterRequest(confirmAction.item.id);
        sgWhistle.success({
          message: t("security.self_enter.approval.reject_success"),
        });
      }

      setConfirmAction(null);
      await loadRequests();
    } catch (error) {
      sgWhistle.error({
        message:
          extractApiMessage(error) ??
          t("security.self_enter.approval.action_error"),
      });
    }
  }

  return (
    <PageFrame
      title={t("security.self_enter.approval.title")}
      description={t("security.self_enter.approval.description")}
    >
      <div className="space-y-4">
        <SgInputText
          id="security-self-enter-approval-search"
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
          emptyMessage={t("security.self_enter.approval.empty")}
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

      <SgConfirmationDialog
        open={Boolean(confirmAction)}
        severity={confirmAction?.type === "approve" ? "warning" : "danger"}
        title={
          confirmAction?.type === "approve"
            ? t("security.self_enter.approval.approve_title")
            : t("security.self_enter.approval.reject_title")
        }
        message={
          confirmAction?.type === "approve"
            ? t("security.self_enter.approval.approve_message")
            : t("security.self_enter.approval.reject_message")
        }
        onCancel={() => {
          setConfirmAction(null);
        }}
        onConfirm={handleConfirmAction}
      />
    </PageFrame>
  );
}


