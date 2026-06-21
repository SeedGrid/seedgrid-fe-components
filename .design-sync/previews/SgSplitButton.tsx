import React from "react";
import { Save, RefreshCw, Trash2, Download } from "lucide-react";
import { SgSplitButton } from "@seedgrid/fe-components";
const items = [
  { label: "Atualizar", icon: <RefreshCw size={15} />, onClick: () => {} },
  { label: "Baixar", icon: <Download size={15} />, onClick: () => {} },
  { label: "Excluir", icon: <Trash2 size={15} />, onClick: () => {} },
];
export function Basic() {
  return <SgSplitButton label="Salvar" leftIcon={<Save size={15} />} onClick={() => {}} items={items} style={{ minWidth: 180 }} />;
}
export function Severities() {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <SgSplitButton label="Confirmar" severity="success" onClick={() => {}} items={items} />
      <SgSplitButton label="Remover" severity="danger" onClick={() => {}} items={items} />
    </div>
  );
}
