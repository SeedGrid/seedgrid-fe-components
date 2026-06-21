import React from "react";
import { SgMatrixDigit } from "@seedgrid/fe-components";

const row: React.CSSProperties = { display: "flex", gap: 12, alignItems: "center", padding: 28, background: "#02060a", borderRadius: 8 };

export function Basic() {
  return (
    <div style={row}>
      {["4", "2", "0", "1"].map((d, i) => (
        <SgMatrixDigit key={i} value={d} fontSize={56} />
      ))}
    </div>
  );
}
