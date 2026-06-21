import React from "react";
import { SgInputBirthDate } from "@seedgrid/fe-components";
const col: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 14, maxWidth: 320 };
export function Basic() {
  return <div style={col}><SgInputBirthDate id="nasc" label="Data de nascimento" minAge={18} onChange={() => {}} /></div>;
}
