import React from "react";
import { SgPickList } from "@seedgrid/fe-components";
const SOURCE = [
  { label: "Autenticação", value: "auth" },
  { label: "Dashboard", value: "dashboard" },
  { label: "Notificações", value: "notif" },
  { label: "Auditoria", value: "audit" },
];
const TARGET = [
  { label: "Faturamento", value: "billing" },
  { label: "Relatórios", value: "reports" },
];
export function Basic() {
  return (
    <div style={{ maxWidth: 520 }}>
      <SgPickList
        id="roadmap"
        title="Planejamento do roadmap"
        source={SOURCE}
        target={TARGET}
        value={{ source: SOURCE, target: TARGET }}
        sourceHeader="Disponíveis"
        targetHeader="Selecionados"
        onChange={() => {}}
      />
    </div>
  );
}
