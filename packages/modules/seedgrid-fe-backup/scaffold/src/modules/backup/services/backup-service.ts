// seedgrid:managed

import { backupApi } from "./backup-api";
import type { ExportRequest, ExportResponse } from "../types";

const EXPORTS_PATH = "/exports";

export const backupService = {
  async createExportJob(request: ExportRequest): Promise<ExportResponse> {
    return backupApi.post<ExportResponse>(EXPORTS_PATH, {
      body: request,
    });
  },

  async listExportJobs(params: {
    page: number;
    size: number;
  }): Promise<ExportResponse[]> {
    const query = new URLSearchParams({
      page: String(params.page),
      size: String(params.size),
    });

    return backupApi.get<ExportResponse[]>(`${EXPORTS_PATH}?${query}`);
  },

  async getExportStatus(jobId: string): Promise<ExportResponse> {
    return backupApi.get<ExportResponse>(`${EXPORTS_PATH}/${encodeURIComponent(jobId)}`);
  },

  async deleteExportJob(jobId: string): Promise<void> {
    await backupApi.delete(`${EXPORTS_PATH}/${encodeURIComponent(jobId)}`);
  },
};
