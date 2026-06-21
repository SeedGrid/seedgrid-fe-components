import React from "react";
import { SgInputCNPJ } from "@seedgrid/fe-components";
const col: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 14, maxWidth: 320 };
export function Basic() {
  return <div style={col}><SgInputCNPJ id="cnpj" label="CNPJ" hintText="00.000.000/0000-00" onChange={() => {}} /></div>;
}
export function States() {
  return (
    <div style={col}>
      <SgInputCNPJ id="cnpj-req" label="CNPJ" required onChange={() => {}} />
      <SgInputCNPJ id="cnpj-err" label="CNPJ" error="CNPJ inválido" onChange={() => {}} />
    </div>
  );
}
