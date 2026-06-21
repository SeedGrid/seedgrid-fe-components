import React from "react";
import { SgStepperInput } from "@seedgrid/fe-components";
const col: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 14 };
export function Basic() {
  return <div style={col}><SgStepperInput id="qtd" minValue={0} maxValue={40} step={1} defaultValue={3} width={210} onChange={() => {}} /></div>;
}
export function Step() {
  return <div style={col}><SgStepperInput id="cx" minValue={0} maxValue={100} step={5} defaultValue={20} width={210} onChange={() => {}} /></div>;
}
