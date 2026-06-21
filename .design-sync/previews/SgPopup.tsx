import React from "react";
import { SgPopup, SgButton } from "@seedgrid/fe-components";
export function Basic() {
  const anchor = React.useRef<HTMLButtonElement>(null);
  return (
    <div style={{ padding: 40, display: "flex", justifyContent: "center" }}>
      <SgButton ref={anchor as React.RefObject<HTMLButtonElement>}>Ações</SgButton>
      <SgPopup
        open
        title="Configuração"
        subtitle="Resumo da ação"
        anchorRef={anchor as React.RefObject<HTMLElement>}
        placement="auto"
        preferPlacement="bottom"
        align="start"
        actions={[{ label: "Confirmar" }, { label: "Cancelar" }]}
      />
    </div>
  );
}
