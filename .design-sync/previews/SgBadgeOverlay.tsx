import React from "react";
import { Bell, Mail } from "lucide-react";
import { SgBadge, SgBadgeOverlay } from "@seedgrid/fe-components";
const tile: React.CSSProperties = { display: "inline-flex", width: 44, height: 44, alignItems: "center", justifyContent: "center", border: "1px solid hsl(var(--border))", borderRadius: 10 };
const row: React.CSSProperties = { display: "flex", gap: 24, alignItems: "center" };
export function Basic() {
  return (
    <div style={row}>
      <SgBadgeOverlay badge={<SgBadge value={7} severity="danger" size="xs" />}><span style={tile}><Bell size={20} /></span></SgBadgeOverlay>
      <SgBadgeOverlay badge={<SgBadge value={12} severity="primary" size="xs" />}><span style={tile}><Mail size={20} /></span></SgBadgeOverlay>
      <SgBadgeOverlay badge={<SgBadge dot severity="success" />}><span style={tile}><Bell size={20} /></span></SgBadgeOverlay>
    </div>
  );
}
