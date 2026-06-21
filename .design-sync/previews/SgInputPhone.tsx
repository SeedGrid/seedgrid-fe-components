import React from "react";
import { SgInputPhone } from "@seedgrid/fe-components";
const col: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 14, maxWidth: 320 };
export function Basic() {
  return <div style={col}><SgInputPhone id="tel" label="Telefone" hintText="(11) 99999-0000" onChange={() => {}} /></div>;
}
export function Required() {
  return <div style={col}><SgInputPhone id="tel-req" label="Celular" required onChange={() => {}} /></div>;
}
