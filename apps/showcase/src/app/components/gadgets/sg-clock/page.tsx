"use client";

import { SgClockShowcaseClient } from "./sg-clock-showcase-client";
import I18NReady from "../../I18NReady";
import { SgEnvironmentProvider } from "@seedgrid/fe-components";

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
        <SgClockShowcaseClient initialServerTime={initialServerTime} />
      </SgEnvironmentProvider>
    </I18NReady>
  );
}
