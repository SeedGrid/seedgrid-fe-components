// seedgrid:managed

import { beforeEach, describe, expect, it, vi } from "vitest";

import { backupApi } from "./backup-api";
import { backupService } from "./backup-service";
import type { ExportRequest, ExportResponse } from "../types";

vi.mock("./backup-api", () => ({
  backupApi: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockGet = vi.mocked(backupApi.get);
const mockPost = vi.mocked(backupApi.post);
const mockDelete = vi.mocked(backupApi.delete);

const makeExportResponse = (
  overrides: Partial<ExportResponse> = {}
): ExportResponse => ({
  jobId: "job-abc-123",
  status: "REQUESTED",
  format: "CSV_ZIP",
  scope: "DOMAIN",
  progress: 0,
  createdAt: "2024-01-15T10:30:00",
  downloadable: false,
  ...overrides,
});

describe("backupService.createExportJob", () => {
  beforeEach(() => vi.clearAllMocks());

  it("posts to /exports with the given request body", async () => {
    const request: ExportRequest = {
      format: "CSV_ZIP",
      scope: "DOMAIN",
      includeAttachments: false,
    };
    const expected = makeExportResponse({ status: "REQUESTED" });
    mockPost.mockResolvedValueOnce(expected);

    const result = await backupService.createExportJob(request);

    expect(mockPost).toHaveBeenCalledWith("/exports", { body: request });
    expect(result).toEqual(expected);
  });

  it("propagates API errors from createExportJob", async () => {
    const request: ExportRequest = { format: "SQL_DUMP_ZIP", scope: "RAW" };
    mockPost.mockRejectedValueOnce(new Error("Network error"));

    await expect(backupService.createExportJob(request)).rejects.toThrow(
      "Network error"
    );
  });
});

describe("backupService.listExportJobs", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls GET /exports with page and size query params", async () => {
    const jobs = [makeExportResponse(), makeExportResponse({ jobId: "job-def-456" })];
    mockGet.mockResolvedValueOnce(jobs);

    const result = await backupService.listExportJobs({ page: 0, size: 10 });

    expect(mockGet).toHaveBeenCalledWith("/exports?page=0&size=10");
    expect(result).toHaveLength(2);
  });

  it("passes the correct page when paginating", async () => {
    mockGet.mockResolvedValueOnce([]);

    await backupService.listExportJobs({ page: 2, size: 20 });

    expect(mockGet).toHaveBeenCalledWith("/exports?page=2&size=20");
  });
});

describe("backupService.getExportStatus", () => {
  beforeEach(() => vi.clearAllMocks());

  it("fetches status for the given jobId", async () => {
    const job = makeExportResponse({ status: "RUNNING", progress: 45 });
    mockGet.mockResolvedValueOnce(job);

    const result = await backupService.getExportStatus("job-abc-123");

    expect(mockGet).toHaveBeenCalledWith("/exports/job-abc-123");
    expect(result.status).toBe("RUNNING");
    expect(result.progress).toBe(45);
  });

  it("URL-encodes the jobId when calling the API", async () => {
    mockGet.mockResolvedValueOnce(makeExportResponse());

    await backupService.getExportStatus("job/with/slashes");

    expect(mockGet).toHaveBeenCalledWith("/exports/job%2Fwith%2Fslashes");
  });
});

describe("backupService.deleteExportJob", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls DELETE for the given jobId", async () => {
    mockDelete.mockResolvedValueOnce(undefined);

    await backupService.deleteExportJob("job-abc-123");

    expect(mockDelete).toHaveBeenCalledWith("/exports/job-abc-123");
  });

  it("propagates errors from the delete call", async () => {
    mockDelete.mockRejectedValueOnce(new Error("Not found"));

    await expect(backupService.deleteExportJob("missing-id")).rejects.toThrow(
      "Not found"
    );
  });
});
