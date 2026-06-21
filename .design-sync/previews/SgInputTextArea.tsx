import React from "react";
import { SgInputTextArea } from "@seedgrid/fe-components";
const col: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 14, maxWidth: 360 };
export function Basic() {
  return <div style={col}><SgInputTextArea id="desc" label="Descrição" placeholder="Escreva uma descrição..." onChange={() => {}} /></div>;
}
export function WithCounter() {
  return <div style={col}><SgInputTextArea id="obs" label="Observações" maxLength={200} showCharCounter onChange={() => {}} /></div>;
}
