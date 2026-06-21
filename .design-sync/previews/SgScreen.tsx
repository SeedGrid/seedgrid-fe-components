import React from "react";
import { SgScreen, SgPanel, SgStack } from "@seedgrid/fe-components";

export function Basic() {
  return (
    <SgPanel className="rounded-xl" padding={12} style={{ height: 420 }}>
      <SgScreen fullscreen={false} padding={10} className="rounded-lg">
        <SgPanel className="h-full w-full" contentPadding={8} contentGap={8}>
          <SgPanel align="top" height={14} padding={10} className="rounded-md">
            <SgStack direction="row" justify="between" align="center">
              <span style={{ fontSize: 14, fontWeight: 500 }}>Painel administrativo</span>
              <span style={{ fontSize: 12, opacity: 0.6 }}>SeedGrid</span>
            </SgStack>
          </SgPanel>
          <SgPanel align="left" width={26} padding={10} className="rounded-md">
            <SgStack gap={6}>
              <span style={{ fontSize: 12, fontWeight: 500, opacity: 0.6 }}>MENU</span>
              <SgPanel borderStyle="none" padding={6} className="rounded">Dashboard</SgPanel>
              <SgPanel borderStyle="none" padding={6} className="rounded">Relatórios</SgPanel>
              <SgPanel borderStyle="none" padding={6} className="rounded">Clientes</SgPanel>
            </SgStack>
          </SgPanel>
          <SgPanel align="bottom" height={12} padding={10} className="rounded-md">
            <SgStack direction="row" justify="between" align="center">
              <span style={{ fontSize: 13 }}>Rodapé</span>
              <span style={{ fontSize: 12, opacity: 0.6 }}>v0.2.10</span>
            </SgStack>
          </SgPanel>
        </SgPanel>
      </SgScreen>
    </SgPanel>
  );
}
