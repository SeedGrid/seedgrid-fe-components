import React from "react";
import { SgDiscardDigit } from "@seedgrid/fe-components";

const row: React.CSSProperties = { display: "flex", gap: 8, alignItems: "center", padding: 20 };

export function Basic() {
  return (
    <div style={row}>
      {["3", "1", "4", "0"].map((d, i) => (
        <SgDiscardDigit key={i} value={d} fontSize={56} />
      ))}
    </div>
  );
}
