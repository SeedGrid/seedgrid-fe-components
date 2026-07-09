// seedgrid:managed

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { classifyExportStatus, isExportDownloadable, isExportInProgress } from "@seedgrid/fe-backup";
import type { ExportStatus } from "@seedgrid/fe-backup";

describe("classifyExportStatus", () => {
  it("classifies REQUESTED and QUEUED as pending", () => {
    expect(classifyExportStatus("REQUESTED")).toBe("pending");
    expect(classifyExportStatus("QUEUED")).toBe("pending");
  });

  it("classifies RUNNING as running", () => {
    expect(classifyExportStatus("RUNNING")).toBe("running");
  });

  it("classifies DONE and DONE_NOTIFIED as done", () => {
    expect(classifyExportStatus("DONE")).toBe("done");
    expect(classifyExportStatus("DONE_NOTIFIED")).toBe("done");
  });

  it("classifies FAILED as failed", () => {
    expect(classifyExportStatus("FAILED")).toBe("failed");
  });

  it("classifies EXPIRED and CANCELLED as terminal", () => {
    expect(classifyExportStatus("EXPIRED")).toBe("terminal");
    expect(classifyExportStatus("CANCELLED")).toBe("terminal");
  });
});

describe("isExportInProgress", () => {
  it("returns true for active states", () => {
    const inProgressStates: ExportStatus[] = ["REQUESTED", "QUEUED", "RUNNING"];
    for (const status of inProgressStates) {
      expect(isExportInProgress(status)).toBe(true);
    }
  });

  it("returns false for terminal and done states", () => {
    const notInProgress: ExportStatus[] = [
      "DONE",
      "DONE_NOTIFIED",
      "FAILED",
      "EXPIRED",
      "CANCELLED",
    ];
    for (const status of notInProgress) {
      expect(isExportInProgress(status)).toBe(false);
    }
  });
});

describe("isExportDownloadable", () => {
  it("returns true only for DONE and DONE_NOTIFIED", () => {
    expect(isExportDownloadable("DONE")).toBe(true);
    expect(isExportDownloadable("DONE_NOTIFIED")).toBe(true);
  });

  it("returns false for all other statuses", () => {
    const nonDownloadable: ExportStatus[] = [
      "REQUESTED",
      "QUEUED",
      "RUNNING",
      "FAILED",
      "EXPIRED",
      "CANCELLED",
    ];
    for (const status of nonDownloadable) {
      expect(isExportDownloadable(status)).toBe(false);
    }
  });
});
