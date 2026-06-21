import React from "react";
import { Check, Search, Trash2 } from "lucide-react";
import { SgButton } from "@seedgrid/fe-components";

const SEVERITIES = ["primary", "secondary", "success", "info", "warning", "help", "danger"] as const;
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const row: React.CSSProperties = { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 };
const col: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 12 };

export function Severities() {
  return (
    <div style={row}>
      {SEVERITIES.map((s) => (
        <SgButton key={s} severity={s}>{cap(s)}</SgButton>
      ))}
    </div>
  );
}

export function Appearances() {
  return (
    <div style={col}>
      <div style={row}>
        <SgButton appearance="solid">Solid</SgButton>
        <SgButton appearance="outline">Outline</SgButton>
        <SgButton appearance="ghost">Ghost</SgButton>
      </div>
      <div style={row}>
        {SEVERITIES.map((s) => (
          <SgButton key={s} severity={s} appearance="outline">{cap(s)}</SgButton>
        ))}
      </div>
    </div>
  );
}

export function Sizes() {
  return (
    <div style={row}>
      <SgButton size="sm">Small</SgButton>
      <SgButton size="md">Medium</SgButton>
      <SgButton size="lg">Large</SgButton>
    </div>
  );
}

export function WithIcons() {
  return (
    <div style={row}>
      <SgButton severity="primary" leftIcon={<Search size={16} />}>Buscar</SgButton>
      <SgButton severity="success" leftIcon={<Check size={16} />}>Confirmar</SgButton>
      <SgButton severity="danger" appearance="outline" leftIcon={<Trash2 size={16} />}>Excluir</SgButton>
    </div>
  );
}

export function States() {
  return (
    <div style={row}>
      <SgButton loading>Salvando</SgButton>
      <SgButton disabled>Desabilitado</SgButton>
      <SgButton severity="secondary" disabled>Indisponível</SgButton>
    </div>
  );
}
