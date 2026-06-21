import React from "react";
import { SgCard } from "@seedgrid/fe-components";

const stat: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "space-between" };
const muted: React.CSSProperties = { color: "hsl(var(--muted-foreground))", fontSize: 13 };
const strong: React.CSSProperties = { fontWeight: 600 };

export function Basic() {
  return (
    <SgCard
      title="Resumo financeiro"
      description="Visão consolidada do dia"
      footer={
        <div style={{ ...stat, ...muted, fontSize: 12 }}>
          <span>Atualizado agora</span>
          <span>Última sincronização há 2 min</span>
        </div>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 14 }}>
        <div style={stat}>
          <span style={muted}>Receita</span>
          <span style={strong}>R$ 12.400,00</span>
        </div>
        <div style={stat}>
          <span style={muted}>Pedidos</span>
          <span style={strong}>83</span>
        </div>
        <div style={stat}>
          <span style={muted}>Ticket médio</span>
          <span style={strong}>R$ 149,40</span>
        </div>
      </div>
    </SgCard>
  );
}

export function Variants() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
      <SgCard cardStyle="outlined" title="Outlined" description="Borda visível" style={{ width: 220 }}>
        <p style={{ fontSize: 13, margin: 0 }}>Conteúdo do cartão com borda.</p>
      </SgCard>
      <SgCard cardStyle="elevated" title="Elevated" description="Com sombra" style={{ width: 220 }}>
        <p style={{ fontSize: 13, margin: 0 }}>Conteúdo do cartão elevado.</p>
      </SgCard>
    </div>
  );
}
