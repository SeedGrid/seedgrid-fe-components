import React from "react";
import { SgInputCPFCNPJ } from "@seedgrid/fe-components";
const col: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 14, maxWidth: 320 };
export function Basic() {
  return <div style={col}><SgInputCPFCNPJ id="doc" label="CPF ou CNPJ" hintText="Pessoa física ou jurídica" onChange={() => {}} /></div>;
}
export function Required() {
  return <div style={col}><SgInputCPFCNPJ id="doc-req" label="Documento" required onChange={() => {}} /></div>;
}
