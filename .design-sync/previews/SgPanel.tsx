import React from "react";
import { SgPanel, SgStack } from "@seedgrid/fe-components";
export function Basic() {
  return (
    <SgPanel padding={16} style={{ width: 360, borderRadius: 12 }}>
      <SgStack gap={8}>
        <span style={{ fontWeight: 600 }}>Resumo</span>
        <span style={{ fontSize: 14, color: "hsl(var(--muted-foreground))" }}>
          Painel de conteúdo com borda e espaçamento padrão da biblioteca.
        </span>
      </SgStack>
    </SgPanel>
  );
}
export function BorderStyles() {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <SgPanel padding={12} borderStyle="solid" style={{ width: 150, borderRadius: 10 }}>Solid</SgPanel>
      <SgPanel padding={12} borderStyle="dashed" style={{ width: 150, borderRadius: 10 }}>Dashed</SgPanel>
      <SgPanel padding={12} borderStyle="none" style={{ width: 150, borderRadius: 10, background: "hsl(var(--muted))" }}>None</SgPanel>
    </div>
  );
}
