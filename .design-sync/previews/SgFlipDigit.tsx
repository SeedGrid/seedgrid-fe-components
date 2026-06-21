import React from "react";
import { SgFlipDigit } from "@seedgrid/fe-components";

const row: React.CSSProperties = { display: "flex", gap: 8, alignItems: "center", padding: 20 };

export function Basic() {
  return (
    <div style={row}>
      {["0", "7", "4", "2"].map((d, i) => (
        <SgFlipDigit key={i} value={d} fontSize={56} />
      ))}
    </div>
  );
}
