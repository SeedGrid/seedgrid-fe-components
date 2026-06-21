import React from "react";
import { SgDialog, SgButton } from "@seedgrid/fe-components";
export function Basic() {
  return (
    <SgDialog
      open
      title="Confirmar exclusão"
      subtitle="Esta ação não pode ser desfeita"
      footer={
        <>
          <SgButton appearance="ghost">Cancelar</SgButton>
          <SgButton severity="danger">Excluir</SgButton>
        </>
      }
    >
      <p style={{ margin: 0, fontSize: 14 }}>
        O cliente <strong>Ana Souza</strong> e todos os seus pedidos serão removidos permanentemente.
      </p>
    </SgDialog>
  );
}
