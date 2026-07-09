import test from "node:test";
import assert from "node:assert/strict";

// Portado (node --test, convenção da casa) de
// seedgrid-cli/templates/modules/backup/src/modules/backup/components/ExportStatusBadge.test.tsx.hbs —
// apesar do nome do arquivo de origem, o conteúdo nunca testou o componente
// ExportStatusBadge em si (que ficou scaffold, por causa do useI18n real);
// testava classifyExportStatus/isExportInProgress/isExportDownloadable, que
// foram promovidos pra lib. Ver scaffold/README.md.
import {
  classifyExportStatus,
  isExportDownloadable,
  isExportInProgress,
} from "../dist/export-status.js";

test("classifyExportStatus classifica REQUESTED e QUEUED como pending", () => {
  assert.equal(classifyExportStatus("REQUESTED"), "pending");
  assert.equal(classifyExportStatus("QUEUED"), "pending");
});

test("classifyExportStatus classifica RUNNING como running", () => {
  assert.equal(classifyExportStatus("RUNNING"), "running");
});

test("classifyExportStatus classifica DONE e DONE_NOTIFIED como done", () => {
  assert.equal(classifyExportStatus("DONE"), "done");
  assert.equal(classifyExportStatus("DONE_NOTIFIED"), "done");
});

test("classifyExportStatus classifica FAILED como failed", () => {
  assert.equal(classifyExportStatus("FAILED"), "failed");
});

test("classifyExportStatus classifica EXPIRED e CANCELLED como terminal", () => {
  assert.equal(classifyExportStatus("EXPIRED"), "terminal");
  assert.equal(classifyExportStatus("CANCELLED"), "terminal");
});

test("isExportInProgress retorna true pros estados ativos", () => {
  for (const status of ["REQUESTED", "QUEUED", "RUNNING"]) {
    assert.equal(isExportInProgress(status), true);
  }
});

test("isExportInProgress retorna false pros estados terminais/concluídos", () => {
  for (const status of ["DONE", "DONE_NOTIFIED", "FAILED", "EXPIRED", "CANCELLED"]) {
    assert.equal(isExportInProgress(status), false);
  }
});

test("isExportDownloadable retorna true só pra DONE e DONE_NOTIFIED", () => {
  assert.equal(isExportDownloadable("DONE"), true);
  assert.equal(isExportDownloadable("DONE_NOTIFIED"), true);
});

test("isExportDownloadable retorna false pros demais status", () => {
  for (const status of ["REQUESTED", "QUEUED", "RUNNING", "FAILED", "EXPIRED", "CANCELLED"]) {
    assert.equal(isExportDownloadable(status), false);
  }
});
