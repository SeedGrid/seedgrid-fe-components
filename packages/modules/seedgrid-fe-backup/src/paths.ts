// Paths do backup/export (espelho de RestControllerPath.java em seedgrid-quarkus-ext-backup).
// A extensão monta em /exports; o prefixo final depende de como o app inclui a extensão.

const seg = (value: string): string => encodeURIComponent(value);

export const BackupPaths = {
  /** POST cria export · GET lista exports. */
  exports: "/exports",
  /** GET status · DELETE remove. */
  byId: (jobId: string) => `/exports/${seg(jobId)}`,
  /** GET download (application/zip). */
  download: (jobId: string) => `/exports/${seg(jobId)}/download`,
} as const;
