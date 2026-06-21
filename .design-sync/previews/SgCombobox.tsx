import React from "react";
import { SgCombobox } from "@seedgrid/fe-components";
const ESTADOS = [
  { id: 1, description: "São Paulo", code: "SP", region: "Sudeste" },
  { id: 2, description: "Rio de Janeiro", code: "RJ", region: "Sudeste" },
  { id: 3, description: "Bahia", code: "BA", region: "Nordeste" },
  { id: 4, description: "Paraná", code: "PR", region: "Sul" },
  { id: 5, description: "Amazonas", code: "AM", region: "Norte" },
];
export function Basic() {
  return (
    <div style={{ maxWidth: 320 }}>
      <SgCombobox id="estado" label="Estado" placeholder="Selecione" source={ESTADOS} optionLabel="description" optionValue="code" onChange={() => {}} />
    </div>
  );
}
export function Grouped() {
  return (
    <div style={{ maxWidth: 320 }}>
      <SgCombobox id="estado-g" label="Estado (por região)" placeholder="Selecione" source={ESTADOS} optionLabel="description" optionValue="code" optionGroupLabel="region" onChange={() => {}} />
    </div>
  );
}
