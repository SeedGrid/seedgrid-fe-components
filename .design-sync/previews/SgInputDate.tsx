import React from "react";
import { SgInputDate } from "@seedgrid/fe-components";
const col: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 14, maxWidth: 320 };
export function Basic() {
  return <div style={col}><SgInputDate id="data" label="Data" hintText="DD/MM/AAAA" onChange={() => {}} /></div>;
}
export function Required() {
  return <div style={col}><SgInputDate id="data-req" label="Data de início" required onChange={() => {}} /></div>;
}
