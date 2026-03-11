"use client";

import { SgClockShowcaseClient } from "./sg-clock-showcase-client";
import I18NReady from "../../I18NReady";
import { SgCard, SgEnvironmentProvider } from "@seedgrid/fe-components";

export default function SgClockPage() {
  const initialServerTime = new Date().toISOString();
  return (
    <I18NReady>
      <SgEnvironmentProvider
        value={{
          namespaceProvider: { getNamespace: () => "showcase" },
          persistence: { scope: "app:showcase", mode: "fallback", stateVersion: 1 }
        }}
      >
        <SgCard
          id="gadget-clock"
          title="Clock/Relógio"
          collapsible
          defaultOpen
          collapseToggleAlign="right"
          collapseIconSize={20}
          draggable
          dragPersistKey="gadget-clock"
          bgColor="#ffffff"
          bgColorTitle="#f3f4f6"
          headerClassName="sticky top-0 z-[70] bg-slate-100"
          className="shadow-sm"
          cardStyle="outlined"
        >
          <SgClockShowcaseClient initialServerTime={initialServerTime} />
        </SgCard>
      </SgEnvironmentProvider>
    </I18NReady>
  );
}
