import React from "react";
import { SgDockLayout, SgDockZone, SgToolBar, SgToolbarIconButton } from "@seedgrid/fe-components";

const ico = (e: string) => <span style={{ fontSize: 16 }}>{e}</span>;

export function Basic() {
  return (
    <div style={{ position: "relative", height: 360, overflow: "hidden", borderRadius: 12, border: "1px solid hsl(var(--border))", background: "#0b0b0f" }}>
      <SgDockLayout id="dz-layout" className="grid h-full grid-cols-[8rem_1fr] grid-rows-1">
        <SgDockZone zone="left" className="col-start-1 row-start-1 items-start border-r border-white/20">
          <SgToolBar id="dz-left" dockZone="left" orientationDirection="vertical-down" title="Zona esquerda" draggable>
            <SgToolbarIconButton icon={ico("👥")} label="Clientes" hint="Abrir clientes" />
            <SgToolbarIconButton icon={ico("📋")} label="Tarefas" hint="Abrir tarefas" />
          </SgToolBar>
        </SgDockZone>
        <SgDockZone zone="free" className="col-start-2 row-start-1 !items-start !justify-start">
          <SgToolBar id="dz-free" orientationDirection="vertical-down" title="Zona livre">
            <SgToolbarIconButton icon={ico("⚙️")} label="Config" hint="Configurações" />
          </SgToolBar>
        </SgDockZone>
      </SgDockLayout>
    </div>
  );
}
