"use client";

import { SgBadge } from "@seedgrid/fe-components";

export function StatusBadge({
  active,
  activeLabel,
  inactiveLabel,
}: {
  active: boolean;
  activeLabel: string;
  inactiveLabel: string;
}) {
  return (
    <SgBadge
      value={active ? activeLabel : inactiveLabel}
      severity={active ? "success" : "neutral"}
      badgeStyle="solid"
      rounded
    />
  );
}
