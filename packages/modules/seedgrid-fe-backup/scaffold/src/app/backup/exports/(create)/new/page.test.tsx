// seedgrid:managed

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { backupService } from "@/modules/backup/services/backup-service";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/modules/backup/services/backup-service", () => ({
  backupService: {
    createExportJob: vi.fn(),
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
  SgButton: ({ label, onClick, loading, disabled }: any) => (
    <button onClick={onClick} disabled={disabled || loading}>
      {label}
    </button>
  ),
  SgRadioGroup: ({ title, source, value, onChange }: any) => (
    <fieldset>
      <legend>{title}</legend>
      {source.map((opt: any) => (
        <label key={opt.value}>
          <input
            type="radio"
            name={title}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
          />
          {opt.label}
        </label>
      ))}
    </fieldset>
  ),
  SgStack: ({ children }: any) => <div>{children}</div>,
  SgToggleSwitch: ({ id, label, checked, onChange }: any) => (
    <label htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  ),
  sgWhistle: { success: vi.fn(), error: vi.fn() },
}));

const mockCreateExportJob = vi.mocked(backupService.createExportJob);

describe("NewExportPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders format and scope radio groups", async () => {
    const { default: Page } = await import("./page");
    render(<Page />);

    expect(
      screen.getByText("backup.exports.create.format_label")
    ).toBeInTheDocument();
    expect(
      screen.getByText("backup.exports.create.scope_label")
    ).toBeInTheDocument();
  });

  it("submits with CSV_ZIP and DOMAIN by default", async () => {
    mockCreateExportJob.mockResolvedValue({
      jobId: "new-job",
      status: "REQUESTED",
      format: "CSV_ZIP",
      scope: "DOMAIN",
      createdAt: "2026-01-01T00:00:00Z",
    });

    const { default: Page } = await import("./page");
    render(<Page />);

    const submitBtn = screen.getByText("backup.exports.create.submit");
    await userEvent.click(submitBtn);

    await waitFor(() =>
      expect(mockCreateExportJob).toHaveBeenCalledWith(
        expect.objectContaining({ format: "CSV_ZIP", scope: "DOMAIN" })
      )
    );
  });

  it("submits with SQL_DUMP_ZIP when that format is selected", async () => {
    mockCreateExportJob.mockResolvedValue({
      jobId: "new-job",
      status: "REQUESTED",
      format: "SQL_DUMP_ZIP",
      scope: "DOMAIN",
      createdAt: "2026-01-01T00:00:00Z",
    });

    const { default: Page } = await import("./page");
    render(<Page />);

    const sqlDumpRadio = screen.getByDisplayValue("SQL_DUMP_ZIP");
    await userEvent.click(sqlDumpRadio);

    const submitBtn = screen.getByText("backup.exports.create.submit");
    await userEvent.click(submitBtn);

    await waitFor(() =>
      expect(mockCreateExportJob).toHaveBeenCalledWith(
        expect.objectContaining({ format: "SQL_DUMP_ZIP" })
      )
    );
  });

  it("includes attachments when the toggle is checked", async () => {
    mockCreateExportJob.mockResolvedValue({
      jobId: "new-job",
      status: "REQUESTED",
      format: "CSV_ZIP",
      scope: "DOMAIN",
      createdAt: "2026-01-01T00:00:00Z",
    });

    const { default: Page } = await import("./page");
    render(<Page />);

    const toggle = screen.getByRole("checkbox");
    await userEvent.click(toggle);

    const submitBtn = screen.getByText("backup.exports.create.submit");
    await userEvent.click(submitBtn);

    await waitFor(() =>
      expect(mockCreateExportJob).toHaveBeenCalledWith(
        expect.objectContaining({ includeAttachments: true })
      )
    );
  });

  it("disables the submit button while submitting", async () => {
    let resolveCreate!: () => void;
    mockCreateExportJob.mockReturnValue(
      new Promise((res) => {
        resolveCreate = () => res({
          jobId: "x", status: "REQUESTED", format: "CSV_ZIP", scope: "DOMAIN",
          createdAt: "2026-01-01T00:00:00Z",
        });
      })
    );

    const { default: Page } = await import("./page");
    render(<Page />);

    const submitBtn = screen.getByText("backup.exports.create.submit");
    await userEvent.click(submitBtn);

    expect(submitBtn).toBeDisabled();

    resolveCreate();
    await waitFor(() => expect(submitBtn).not.toBeDisabled());
  });
});
