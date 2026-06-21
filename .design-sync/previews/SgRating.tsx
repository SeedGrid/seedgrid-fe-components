import React from "react";
import { SgRating } from "@seedgrid/fe-components";
const col: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 14 };
export function Basic() {
  return <div style={col}><SgRating value={4} onChange={() => {}} /></div>;
}
export function Values() {
  return (
    <div style={col}>
      <SgRating value={3} onChange={() => {}} />
      <SgRating value={5} onChange={() => {}} />
    </div>
  );
}
