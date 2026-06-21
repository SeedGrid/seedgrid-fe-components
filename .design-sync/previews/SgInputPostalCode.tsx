import React from "react";
import { SgInputPostalCode } from "@seedgrid/fe-components";
const col: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 14, maxWidth: 320 };
export function Basic() {
  return <div style={col}><SgInputPostalCode id="cep" label="CEP" hintText="00000-000" onChange={() => {}} /></div>;
}
export function Required() {
  return <div style={col}><SgInputPostalCode id="cep-req" label="CEP" required onChange={() => {}} /></div>;
}
