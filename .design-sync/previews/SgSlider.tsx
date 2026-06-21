import React from "react";
import { SgSlider } from "@seedgrid/fe-components";
const col: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 24, maxWidth: 320, paddingTop: 8 };
export function Basic() {
  return <div style={col}><SgSlider id="vol" minValue={0} maxValue={100} defaultValue={60} onChange={() => {}} /></div>;
}
export function Steps() {
  return (
    <div style={col}>
      <SgSlider id="preco" minValue={0} maxValue={1000} step={50} defaultValue={400} onChange={() => {}} />
      <SgSlider id="nota" minValue={0} maxValue={10} step={1} defaultValue={8} onChange={() => {}} />
    </div>
  );
}
