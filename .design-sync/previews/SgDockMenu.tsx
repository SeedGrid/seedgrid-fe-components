import React from "react";
import { SgDockMenu } from "@seedgrid/fe-components";

const ico = (e: string) => <span style={{ fontSize: 22 }}>{e}</span>;

export function Basic() {
  const items = [
    { id: "home", icon: ico("🏠"), label: "Início" },
    { id: "mail", icon: ico("✉️"), label: "Mensagens", badge: 5 },
    { id: "reports", icon: ico("📊"), label: "Relatórios" },
    { id: "notifications", icon: ico("🔔"), label: "Notificações", badge: 12 },
    { id: "settings", icon: ico("⚙️"), label: "Configurações" },
  ];
  return (
    <div style={{ position: "relative", height: 200, background: "hsl(var(--muted))", borderRadius: 12 }}>
      <SgDockMenu id="dm-basic" items={items} position="center-bottom" zIndex={10} style={{ position: "absolute" }} />
    </div>
  );
}
