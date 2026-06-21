import React from "react";
import { SgInputOTP } from "@seedgrid/fe-components";
const col: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 14, maxWidth: 360 };
export function Basic() {
  return <div style={col}><SgInputOTP id="otp" label="Código de verificação" hintText="Digite os 6 dígitos" onChange={() => {}} /></div>;
}
