import React from "react";
import { SgInputPassword } from "@seedgrid/fe-components";
const col: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 14, maxWidth: 320 };
export function Basic() {
  return <div style={col}><SgInputPassword id="senha" label="Senha" hintText="Mínimo 8 caracteres" onChange={() => {}} /></div>;
}
export function States() {
  return (
    <div style={col}>
      <SgInputPassword id="senha-req" label="Senha" required onChange={() => {}} />
      <SgInputPassword id="senha-err" label="Senha" error="Senha muito curta" onChange={() => {}} />
    </div>
  );
}
