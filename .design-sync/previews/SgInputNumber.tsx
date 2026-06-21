import React from "react";
import { SgInputNumber } from "@seedgrid/fe-components";
const col: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 14, maxWidth: 320 };
export function Basic() {
  return <div style={col}><SgInputNumber id="qtd" label="Quantidade" decimals={0} hintText="Número inteiro" onChange={() => {}} /></div>;
}
export function Decimals() {
  return (
    <div style={col}>
      <SgInputNumber id="peso" label="Peso (kg)" decimals={2} suffixText="kg" onChange={() => {}} />
      <SgInputNumber id="temp" label="Temperatura" decimals={1} allowNegative suffixText="°C" onChange={() => {}} />
    </div>
  );
}
