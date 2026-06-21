import React from "react";
import { SgExpandablePanel, SgStack } from "@seedgrid/fe-components";
export function Inline() {
  return (
    <div style={{ width: 360, border: "1px solid hsl(var(--border))", borderRadius: 12, overflow: "hidden" }}>
      <SgExpandablePanel
        mode="inline"
        expandTo="bottom"
        defaultOpen
        header={<span style={{ fontWeight: 600 }}>Detalhes do pedido</span>}
      >
        <SgStack gap={6} style={{ padding: 12, fontSize: 14 }}>
          <span>Pedido #10482</span>
          <span>Total: R$ 1.249,90</span>
          <span>Entrega: 3 dias úteis</span>
        </SgStack>
      </SgExpandablePanel>
    </div>
  );
}
