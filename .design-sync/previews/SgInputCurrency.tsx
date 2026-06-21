import React from "react";
import { SgInputCurrency } from "@seedgrid/fe-components";
const col: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 14, maxWidth: 320 };
export function Basic() {
  return <div style={col}><SgInputCurrency id="valor" label="Valor" currency="BRL" locale="pt-BR" decimals={2} onChange={() => {}} /></div>;
}
export function Variants() {
  return (
    <div style={col}>
      <SgInputCurrency id="preco" label="Preço" currency="BRL" locale="pt-BR" decimals={2} onChange={() => {}} />
      <SgInputCurrency id="usd" label="Valor (USD)" currency="USD" locale="en-US" decimals={2} onChange={() => {}} />
    </div>
  );
}
