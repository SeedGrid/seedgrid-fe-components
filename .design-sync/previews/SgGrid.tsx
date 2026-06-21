import React from "react";
import { SgGrid } from "@seedgrid/fe-components";
const cell: React.CSSProperties = { background: "hsl(var(--secondary))", border: "1px solid hsl(var(--border))", borderRadius: 10, padding: 16, fontSize: 13, fontWeight: 600 };
export function Basic() {
  return (
    <SgGrid minItemWidth="10rem" gap={12} rowHeight={90} dense>
      {["Vendas", "Clientes", "Pedidos", "Estoque", "Faturas", "Relatórios"].map((t) => (
        <div key={t} style={cell}>{t}</div>
      ))}
    </SgGrid>
  );
}
