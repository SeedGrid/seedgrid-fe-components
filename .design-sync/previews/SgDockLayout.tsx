import React from "react";
import { SgDockLayout, SgDockZone, SgToolBar, SgToolbarIconButton } from "@seedgrid/fe-components";

const ico = (e: string) => <span style={{ fontSize: 16 }}>{e}</span>;

export function Basic() {
  return (
    <div style={{ position: "relative", height: 420, overflow: "hidden", borderRadius: 12, border: "1px solid hsl(var(--border))", background: "#0b0b0f" }}>
      <SgDockLayout id="dl-basic" className="grid h-full grid-cols-[8rem_1fr_8rem] grid-rows-[auto_1fr_auto]">
        <SgDockZone zone="top" className="col-span-3 row-start-1 items-start">
          <SgToolBar id="dl-top" dockZone="top" orientationDirection="horizontal-left" title="Topo" draggable>
            <SgToolbarIconButton icon={ico("🏠")} label="Início" hint="Ir para início" />
            <SgToolbarIconButton icon={ico("🔍")} label="Buscar" hint="Pesquisar registros" />
          </SgToolBar>
        </SgDockZone>
        <SgDockZone zone="left" className="col-start-1 row-start-2 items-start">
          <SgToolBar id="dl-left" dockZone="left" orientationDirection="vertical-down" title="Menu" collapsible draggable>
            <SgToolbarIconButton icon={ico("👥")} label="Clientes" hint="Abrir clientes" />
            <SgToolbarIconButton icon={ico("⚙️")} label="Config" hint="Configurações" />
          </SgToolBar>
        </SgDockZone>
        <SgDockZone zone="bottom" className="col-span-3 row-start-3 items-end">
          <SgToolBar id="dl-bottom" dockZone="bottom" orientationDirection="horizontal-left" title="Rodapé" draggable>
            <SgToolbarIconButton icon={ico("📊")} label="Painel" hint="Abrir painel" />
            <SgToolbarIconButton icon={ico("📋")} label="Relatórios" hint="Abrir relatórios" />
          </SgToolBar>
        </SgDockZone>
      </SgDockLayout>
    </div>
  );
}
