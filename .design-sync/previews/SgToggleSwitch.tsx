import React from "react";
import { SgToggleSwitch } from "@seedgrid/fe-components";
const col: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 14 };
export function Basic() {
  return (
    <div style={col}>
      <SgToggleSwitch id="notif" label="Ativar notificações" checked onChange={() => {}} />
      <SgToggleSwitch id="news" label="Receber novidades" checked={false} onChange={() => {}} />
      <SgToggleSwitch id="dis" label="Opção desabilitada" checked disabled onChange={() => {}} />
    </div>
  );
}
