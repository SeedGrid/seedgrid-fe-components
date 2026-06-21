import React from "react";
import { SgInputCPF } from "@seedgrid/fe-components";
const col: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 14, maxWidth: 320 };
export function Basic() {
  return <div style={col}><SgInputCPF id="cpf" label="CPF" hintText="000.000.000-00" onChange={() => {}} /></div>;
}
export function States() {
  return (
    <div style={col}>
      <SgInputCPF id="cpf-req" label="CPF" required onChange={() => {}} />
      <SgInputCPF id="cpf-err" label="CPF" error="CPF inválido" onChange={() => {}} />
    </div>
  );
}
