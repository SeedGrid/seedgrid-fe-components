import React from "react";
import { SgClockThemePicker } from "@seedgrid/fe-components";

export function Basic() {
  const [theme, setTheme] = React.useState("seedgrid");
  return (
    <div style={{ padding: 16, maxWidth: 280 }}>
      <SgClockThemePicker value={theme} onChange={setTheme} label="Tema do relógio" />
    </div>
  );
}
