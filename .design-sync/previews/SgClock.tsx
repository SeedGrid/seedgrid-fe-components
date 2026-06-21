import React from "react";
import { SgClock } from "@seedgrid/fe-components";

const SERVER_TIME = "2026-06-20T14:30:00-03:00";
const center: React.CSSProperties = { padding: 16, display: "flex", justifyContent: "center" };

export function Analog() {
  return (
    <div style={center}>
      <SgClock clockStyle="analog" size={240} initialServerTime={SERVER_TIME} themeId="seedgrid" showSeconds timezone="America/Sao_Paulo" />
    </div>
  );
}

export function Digital() {
  return (
    <div style={center}>
      <SgClock clockStyle="digital" size="lg" initialServerTime={SERVER_TIME} timezone="America/Sao_Paulo" format="24h" digitalStyle="default" />
    </div>
  );
}
