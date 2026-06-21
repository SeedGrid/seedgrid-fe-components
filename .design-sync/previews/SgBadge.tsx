import React from "react";
import { SgBadge } from "@seedgrid/fe-components";

const row: React.CSSProperties = { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 };

export function Variants() {
  return (
    <div style={row}>
      <SgBadge value="Solid" badgeStyle="solid" />
      <SgBadge value="Soft" badgeStyle="soft" severity="secondary" />
      <SgBadge value="Outline" badgeStyle="outline" severity="info" />
      <SgBadge value="Ghost" badgeStyle="ghost" severity="neutral" />
    </div>
  );
}

export function Severities() {
  return (
    <div style={row}>
      <SgBadge value="Ativo" badgeStyle="solid" severity="success" />
      <SgBadge value="Pendente" badgeStyle="solid" severity="warning" />
      <SgBadge value="Erro" badgeStyle="solid" severity="danger" />
      <SgBadge value="Info" badgeStyle="solid" severity="info" />
      <SgBadge value="Novo" badgeStyle="solid" severity="primary" />
    </div>
  );
}

export function Removable() {
  return (
    <div style={row}>
      <SgBadge value="Filtro: SP" removable onRemove={() => {}} />
      <SgBadge value="Status: Ativo" severity="success" removable onRemove={() => {}} />
    </div>
  );
}
