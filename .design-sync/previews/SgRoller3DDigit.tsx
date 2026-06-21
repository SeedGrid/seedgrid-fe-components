import React from "react";
import { SgRoller3DDigit } from "@seedgrid/fe-components";

const row: React.CSSProperties = { display: "flex", gap: 8, alignItems: "center", padding: 20 };

export function Basic() {
  return (
    <div style={row}>
      {["9", "8", "7", "6"].map((d, i) => (
        <SgRoller3DDigit key={i} value={d} fontSize={56} />
      ))}
    </div>
  );
}
