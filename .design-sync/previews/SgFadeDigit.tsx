import React from "react";
import { SgFadeDigit } from "@seedgrid/fe-components";

const row: React.CSSProperties = { display: "flex", gap: 8, alignItems: "center", padding: 20 };

export function Basic() {
  return (
    <div style={row}>
      {["1", "2", "4", "5"].map((d, i) => (
        <SgFadeDigit key={i} value={d} fontSize={56} />
      ))}
    </div>
  );
}
