import React from "react";
import { SgDockLayout, SgDockZone, SgToolBar, SgToolbarIconButton } from "@seedgrid/fe-components";

const ico = (e: string) => <span style={{ fontSize: 16 }}>{e}</span>;

export function Vertical() {
  return (
    <div style={{ position: "relative", height: 300, padding: 16 }}>
      <SgDockLayout id="tb-layout" className="grid grid-cols-1 grid-rows-1">
        <SgDockZone zone="free" className="col-start-1 row-start-1 !items-start !justify-start !p-0">
          <SgToolBar id="tb-vertical" title="Navegação" orientationDirection="vertical-down">
            <SgToolbarIconButton icon={ico("🏠")} label="Início" hint="Ir para início" severity="primary" />
            <SgToolbarIconButton icon={ico("👥")} label="Usuários" hint="Abrir usuários" />
            <SgToolbarIconButton icon={ico("⚙️")} label="Config" hint="Configurações" />
          </SgToolBar>
        </SgDockZone>
      </SgDockLayout>
    </div>
  );
}
