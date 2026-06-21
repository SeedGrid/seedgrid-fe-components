import React from "react";
import { SgDockLayout, SgDockZone, SgToolBar, SgToolbarIconButton } from "@seedgrid/fe-components";

const ico = (e: string) => <span style={{ fontSize: 16 }}>{e}</span>;

export function Severities() {
  return (
    <div style={{ position: "relative", height: 260, padding: 16 }}>
      <SgDockLayout id="tib-layout" className="grid grid-cols-1 grid-rows-1">
        <SgDockZone zone="free" className="col-start-1 row-start-1 !items-start !justify-start !p-0">
          <SgToolBar id="tib-bar" title="Ações" orientationDirection="vertical-down">
            <SgToolbarIconButton icon={ico("🏠")} label="Início" hint="Ir para início" severity="primary" />
            <SgToolbarIconButton icon={ico("💾")} label="Salvar" hint="Salvar alterações" severity="success" />
            <SgToolbarIconButton icon={ico("🗑️")} label="Excluir" hint="Excluir item" severity="danger" />
          </SgToolBar>
        </SgDockZone>
      </SgDockLayout>
    </div>
  );
}
