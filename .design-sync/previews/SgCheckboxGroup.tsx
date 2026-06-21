import React from "react";
import { SgCheckboxGroup } from "@seedgrid/fe-components";
const box: React.CSSProperties = { maxWidth: 320 };
const PERMS = [
  { label: "Visualizar relatórios", value: "ver" },
  { label: "Editar cadastros", value: "editar" },
  { label: "Aprovar pagamentos", value: "aprovar" },
];
export function Basic() {
  return <div style={box}><SgCheckboxGroup id="perms" title="Permissões" source={PERMS} value={["ver","editar"]} onChange={() => {}} /></div>;
}
