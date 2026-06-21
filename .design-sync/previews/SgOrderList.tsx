import React from "react";
import { SgOrderList } from "@seedgrid/fe-components";
const ITEMS = [
  { label: "Notebook", value: "notebook" },
  { label: "Mouse", value: "mouse" },
  { label: "Teclado", value: "keyboard" },
  { label: "Monitor", value: "monitor" },
  { label: "Webcam", value: "webcam" },
];
export function Basic() {
  return (
    <div style={{ maxWidth: 360 }}>
      <SgOrderList id="produtos" title="Prioridade dos produtos" source={ITEMS} value={ITEMS} onChange={() => {}} />
    </div>
  );
}
