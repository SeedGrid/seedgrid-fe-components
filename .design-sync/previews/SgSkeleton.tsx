import React from "react";
import { SgSkeleton } from "@seedgrid/fe-components";
const grid: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", maxWidth: 420 };
export function Shapes() {
  return (
    <div style={grid}>
      <SgSkeleton shape="text" width={160} />
      <SgSkeleton shape="rectangle" width={120} height={48} />
      <SgSkeleton shape="rounded" width={120} height={48} />
      <SgSkeleton shape="square" size={56} />
      <SgSkeleton shape="circle" size={56} />
    </div>
  );
}
export function CardLoading() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 280 }}>
      <SgSkeleton shape="rounded" height={120} />
      <SgSkeleton shape="text" width="80%" />
      <SgSkeleton shape="text" width="60%" />
    </div>
  );
}
