import React from "react";
import { SgRadioGroup } from "@seedgrid/fe-components";
const box: React.CSSProperties = { maxWidth: 320 };
const PLANOS = [
  { label: "Mensal — R$ 49", value: "mensal" },
  { label: "Anual — R$ 470", value: "anual" },
  { label: "Empresarial", value: "empresarial" },
];
export function Basic() {
  return <div style={box}><SgRadioGroup id="plano" title="Escolha um plano" source={PLANOS} value="anual" onChange={() => {}} /></div>;
}
export function Horizontal() {
  return <div style={box}><SgRadioGroup id="envio" title="Forma de envio" orientation="horizontal" source={[{label:"PAC",value:"pac"},{label:"SEDEX",value:"sedex"}]} value="sedex" onChange={() => {}} /></div>;
}
