// seedgrid:managed

// Um agente anterior tinha redeclarado BackupFormat/ArtifactInfo aqui porque
// divergiam do que existia em @seedgrid/fe-backup (BackupFormat tinha 8
// valores fictícios; ArtifactInfo.id era string). Conferi contra o backend
// real (seedgrid-quarkus-ext-backup/.../domains/BackupFormat.java,
// dtos/ExportResponse.java) e corrigi @seedgrid/fe-backup pra bater com o
// contrato de verdade (BackupFormat só tem CSV_ZIP/SQL_DUMP_ZIP; ArtifactInfo.id
// é number). Com isso não há mais divergência — tudo reexportado da lib.
export type {
  ArtifactInfo,
  BackupFormat,
  ExportRequest,
  ExportResponse,
  ExportScope,
  ExportStatus,
} from "@seedgrid/fe-backup";
