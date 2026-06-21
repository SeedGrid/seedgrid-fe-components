import React from "react";
import { SgCarousel } from "@seedgrid/fe-components";
const slide = (bg: string, label: string): React.ReactNode => (
  <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", background: bg, color: "#fff", fontSize: 20, fontWeight: 700 }}>{label}</div>
);
export function Basic() {
  return (
    <div style={{ width: 360 }}>
      <SgCarousel
        items={[slide("#16a34a", "Slide 1"), slide("#2563eb", "Slide 2"), slide("#d97706", "Slide 3")]}
        numVisible={1}
        height={200}
        showIndicators
        showNavigators
        style={{ borderRadius: 12, overflow: "hidden" }}
      />
    </div>
  );
}
