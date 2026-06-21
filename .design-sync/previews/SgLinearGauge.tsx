import React from "react";
import { SgLinearGauge } from "@seedgrid/fe-components";

export function Basic() {
  return (
    <div style={{ padding: 24 }}>
      <SgLinearGauge
        min={0}
        max={100}
        value={64}
        ranges={[
          { start: 0, end: 30, color: "#22c55e" },
          { start: 30, end: 70, color: "#f59e0b" },
          { start: 70, end: 100, color: "#ef4444" },
        ]}
        showTicks
        showLabels
        majorTickCount={5}
        barPointer
      />
    </div>
  );
}
