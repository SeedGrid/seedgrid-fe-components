import React from "react";
import { SgConfirmationDialog } from "@seedgrid/fe-components";
export function Basic() {
  return (
    <SgConfirmationDialog
      open
      title="Excluir permissão"
      message="Tem certeza que deseja excluir esta permissão? A ação não pode ser desfeita."
      severity="danger"
    />
  );
}
