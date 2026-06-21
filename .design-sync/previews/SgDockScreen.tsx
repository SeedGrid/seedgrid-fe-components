import React from "react";
import { SgDockScreen, SgDockZone, SgToolBar, SgToolbarIconButton } from "@seedgrid/fe-components";

const ico = (e: string) => <span style={{ fontSize: 16 }}>{e}</span>;

export function Basic() {
  return (
    <SgDockScreen id="ds-basic" fullscreen={false} height={420} className="overflow-hidden rounded-xl border border-border bg-background">
      <SgDockZone zone="top">
        <SgToolBar id="ds-top" dockZone="top" orientationDirection="horizontal-left" title="Topo" draggable>
          <SgToolbarIconButton icon={ico("🏠")} label="Início" hint="Ir para início" />
          <SgToolbarIconButton icon={ico("🔍")} label="Buscar" hint="Pesquisar dados" />
        </SgToolBar>
      </SgDockZone>
      <SgDockZone zone="left">
        <SgToolBar id="ds-left" dockZone="left" orientationDirection="vertical-down" title="Navegação" collapsible draggable>
          <SgToolbarIconButton icon={ico("👥")} label="Clientes" hint="Abrir clientes" />
          <SgToolbarIconButton icon={ico("⚙️")} label="Config" hint="Configurações" />
        </SgToolBar>
      </SgDockZone>
    </SgDockScreen>
  );
}
