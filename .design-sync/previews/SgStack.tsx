import React from "react";
import { SgStack, SgButton } from "@seedgrid/fe-components";
export function Vertical() {
  return (
    <SgStack gap={8} style={{ maxWidth: 200 }}>
      <SgButton>Salvar</SgButton>
      <SgButton appearance="outline">Cancelar</SgButton>
    </SgStack>
  );
}
export function Row() {
  return (
    <SgStack direction="row" justify="between" align="center" style={{ width: 320, border: "1px solid hsl(var(--border))", borderRadius: 10, padding: 12 }}>
      <span style={{ fontWeight: 600 }}>Configurações</span>
      <SgButton size="sm">Confirmar</SgButton>
    </SgStack>
  );
}
