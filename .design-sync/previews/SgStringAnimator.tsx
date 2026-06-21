import React from "react";
import { SgStringAnimator } from "@seedgrid/fe-components";

export function Basic() {
  return (
    <div style={{ padding: 28 }}>
      <SgStringAnimator sourceString="" targetString="SEEDGRID" stringAnimatorStyle="roller3d" alignTo="left" fontSize={32} autoStart />
    </div>
  );
}
