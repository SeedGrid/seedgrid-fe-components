import React from "react";
import { SgSegmentDigit } from "@seedgrid/fe-components";

const row: React.CSSProperties = { display: "flex", gap: 10, alignItems: "center", padding: 24, background: "#0b0b0f", borderRadius: 8 };

export function Basic() {
  return (
    <div style={row}>
      {["1", "8", "0", "5"].map((d, i) => (
        <SgSegmentDigit key={i} value={d} size={64} color="#ff4d4d" />
      ))}
    </div>
  );
}
