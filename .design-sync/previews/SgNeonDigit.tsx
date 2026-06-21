import React from "react";
import { SgNeonDigit } from "@seedgrid/fe-components";

const row: React.CSSProperties = { display: "flex", gap: 12, alignItems: "center", padding: 28, background: "#0a0a12", borderRadius: 8 };

export function Basic() {
  return (
    <div style={row}>
      {["2", "0", "2", "6"].map((d, i) => (
        <SgNeonDigit key={i} value={d} fontSize={56} />
      ))}
    </div>
  );
}
