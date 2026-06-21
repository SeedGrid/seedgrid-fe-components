import React from "react";
import { SgRadialGauge } from "@seedgrid/fe-components";

export function Speedometer() {
  return (
    <div style={{ padding: 16, display: "flex", justifyContent: "center" }}>
      <SgRadialGauge
        min={0}
        max={100}
        value={62}
        startAngle={140}
        endAngle={40}
        ranges={[
          { start: 0, end: 40, color: "#22c55e", width: 14 },
          { start: 40, end: 75, color: "#f59e0b", width: 14 },
          { start: 75, end: 100, color: "#ef4444", width: 14 },
        ]}
        showTicks
        showLabels
        majorTickCount={5}
        minorTicksPerInterval={2}
        primaryPointerType="needle"
        primaryPointerColor="#2563eb"
        centerContent={
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", opacity: 0.6 }}>RPM</div>
            <div style={{ fontSize: 20, fontWeight: 600 }}>62</div>
          </div>
        }
      />
    </div>
  );
}
