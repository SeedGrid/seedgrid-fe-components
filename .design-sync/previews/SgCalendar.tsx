import React from "react";
import { SgCalendar } from "@seedgrid/fe-components";

export function Basic() {
  return (
    <div style={{ padding: 16 }}>
      <SgCalendar locale="pt-BR" defaultValue="2026-03-10" defaultViewDate="2026-03-01" cardTitle="Agenda" />
    </div>
  );
}
