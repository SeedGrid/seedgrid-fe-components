import React from "react";
import { SgInputEmail } from "@seedgrid/fe-components";
const col: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 14, maxWidth: 320 };
export function Basic() {
  return <div style={col}><SgInputEmail id="email" label="E-mail" hintText="nome@empresa.com.br" onChange={() => {}} /></div>;
}
export function States() {
  return (
    <div style={col}>
      <SgInputEmail id="email-req" label="E-mail" required onChange={() => {}} />
      <SgInputEmail id="email-err" label="E-mail" error="E-mail inválido" onChange={() => {}} />
    </div>
  );
}
