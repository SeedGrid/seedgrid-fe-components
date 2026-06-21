import React from "react";
import { SgSevenSegmentDigit } from "@seedgrid/fe-components";

const row: React.CSSProperties = { display: "flex", gap: 10, alignItems: "center", padding: 24, background: "#0b0b0f", borderRadius: 8 };

export function Basic() {
  return (
    <div style={row}>
      {["2", "3", "5", "9"].map((d, i) => (
        <SgSevenSegmentDigit key={i} value={d} fontSize={56} />
      ))}
    </div>
  );
}
