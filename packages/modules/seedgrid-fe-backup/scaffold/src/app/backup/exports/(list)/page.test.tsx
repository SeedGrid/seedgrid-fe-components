// seedgrid:managed

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { backupService } from "@/modules/backup/services/backup-service";
import type { ExportResponse } from "@/modules/backup/types";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/modules/backup/services/backup-service", () => ({
  backupService: {
    listExportJobs: vi.fn(),
    deleteExportJob: vi.fn(),
  },
}));

vi.mock("@/modules/security", () => ({
  RouteGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  PageFrame: ({ children, actions }: { children: React.ReactNode; actions?: React.ReactNode }) => (
    <div>
      {actions}
      {children}
    </div>
  ),
}));

vi.mock("@/i18n", () => ({
  useI18n: () => ({ t: (key: string) => key }),
}));

vi.mock("@seedgrid/fe-components", () => ({
  SgButton: ({ label, onClick, children, "aria-label": ariaLabel }: any) => (
    <button onClick={onClick} aria-label={ariaLabel}>
      {label ?? children}
    </button>
  ),
  // ExportStatusBadge (renderizado numa coluna do datatable) usa SgBadge; sem
  // ele no mock, <SgBadge> fica undefined e o componente quebra no render.
  SgBadge: ({ value }: any) => <span>{value}</span>,
  SgConfirmationDialog: ({ open, onConfirm, onCancel }: any) =>
    open ? (
      <div>
        <button onClick={onConfirm}>confirm</button>
        <button onClick={onCancel}>cancel</button>
      </div>
    ) : null,
  SgDatatable: ({ value, columns, emptyMessage }: any) =>
    value.length === 0 ? (
      <div>{emptyMessage}</div>
    ) : (
      <table>
        <tbody>
          {value.map((row: any, i: number) => (
            <tr key={i}>
              {columns.map((col: any, j: number) => (
                <td key={j}>{col.body ? col.body(row) : row[col.field]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    ),
  SgStack: ({ children }: any) => <div>{children}</div>,
  sgWhistle: { success: vi.fn(), error: vi.fn() },
}));

const mockListExportJobs = vi.mocked(backupService.listExportJobs);
const mockDeleteExportJob = vi.mocked(backupService.deleteExportJob);

function makeJob(overrides: Partial<ExportResponse> = {}): ExportResponse {
  return {
    jobId: "job-abc-123",
    status: "DONE",
    format: "CSV_ZIP",
    scope: "DOMAIN",
    progress: 100,
    downloadable: true,
    createdAt: "2024-01-15T10:30:00",
    ...overrides,
  };
}

describe("ExportsListPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockListExportJobs.mockResolvedValue([]);
  });

  it("shows the empty message when there are no export jobs", async () => {
    const { default: Page } = await import("./page");
    render(<Page />);

    await waitFor(() => {
      expect(
        screen.getByText("backup.exports.list.empty")
      ).toBeInTheDocument();
    });
  });

  it("renders export rows when the service returns data", async () => {
    const jobs = [
      makeJob({ jobId: "job-abc-123", status: "DONE" }),
      makeJob({ jobId: "job-def-456", status: "RUNNING" }),
    ];
    mockListExportJobs.mockResolvedValue(jobs);

    const { default: Page } = await import("./page");
    render(<Page />);

    await waitFor(() => {
      expect(screen.getByText(/job-abc/)).toBeInTheDocument();
    });
  });

  it("calls deleteExportJob when the confirmation dialog is confirmed", async () => {
    const job = makeJob({ jobId: "job-to-delete" });
    mockListExportJobs.mockResolvedValue([job]);
    mockDeleteExportJob.mockResolvedValue(undefined);

    const { default: Page } = await import("./page");
    render(<Page />);

    await waitFor(() =>
      expect(screen.getByText(/job-to-d/)).toBeInTheDocument()
    );

    const deleteBtn = screen.getByRole("button", { name: "backup.exports.list.action.delete" });
    await userEvent.click(deleteBtn);

    const confirmBtn = screen.getByText("confirm");
    await userEvent.click(confirmBtn);

    await waitFor(() =>
      expect(mockDeleteExportJob).toHaveBeenCalledWith("job-to-delete")
    );
  });

  it("closes the confirmation dialog when cancelled", async () => {
    const job = makeJob({ jobId: "job-cancel-test" });
    mockListExportJobs.mockResolvedValue([job]);

    const { default: Page } = await import("./page");
    render(<Page />);

    // A coluna do jobId exibe row.jobId.slice(0, 8) — "job-cancel-test" vira
    // "job-canc" (8 chars). O regex tem que casar a forma truncada.
    await waitFor(() =>
      expect(screen.getByText(/job-canc/)).toBeInTheDocument()
    );

    const deleteBtn = screen.getByRole("button", { name: "backup.exports.list.action.delete" });
    await userEvent.click(deleteBtn);

    expect(screen.getByText("confirm")).toBeInTheDocument();

    const cancelBtn = screen.getByText("cancel");
    await userEvent.click(cancelBtn);

    expect(screen.queryByText("confirm")).not.toBeInTheDocument();
    expect(mockDeleteExportJob).not.toHaveBeenCalled();
  });
});
