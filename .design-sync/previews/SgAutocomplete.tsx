import React from "react";
import { SgAutocomplete } from "@seedgrid/fe-components";
const CIDADES = [
  { id: 1, description: "São Paulo", code: "SP" },
  { id: 2, description: "Rio de Janeiro", code: "RJ" },
  { id: 3, description: "Belo Horizonte", code: "MG" },
  { id: 4, description: "Curitiba", code: "PR" },
  { id: 5, description: "Porto Alegre", code: "RS" },
];
const source = async (query: string) => {
  const q = (query ?? "").toLowerCase();
  return CIDADES.filter((c) => c.description.toLowerCase().includes(q));
};
export function Basic() {
  return (
    <div style={{ maxWidth: 320 }}>
      <SgAutocomplete id="cidade" label="Cidade" placeholder="Digite para buscar" source={source} optionLabel="description" onChange={() => {}} />
    </div>
  );
}
