"use client";

import React from "react";
import { SgToaster, SgToasterHostContext, type SgToasterProps } from "./SgToaster";
import {
  registerHost,
  unregisterHost,
  getActiveHostId,
  subscribeHostRegistry,
  nextHostId
} from "./sgToastHostRegistry";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export type SgToastHostProps = SgToasterProps;

/**
 * SgToastHost — marks the location where toasts will appear.
 *
 * Drop it anywhere in your tree. If multiple hosts exist simultaneously
 * (e.g. one in a layout and one inside the page), the one deeper in the
 * React tree (last to mount) takes priority. When that host unmounts the
 * next most-recently-mounted host becomes active automatically.
 *
 * When any SgToastHost is present, SgToaster automatically defers to it
 * and stops rendering, so both components can coexist without duplication.
 *
 * Accepts the same props as SgToaster (position, duration, richColors, etc.).
 */
export function SgToastHost(props: SgToastHostProps) {
  // Stable ID across re-renders, generated once per component instance.
  const idRef = React.useRef<string | null>(null);
  if (idRef.current === null) {
    idRef.current = nextHostId();
  }
  const id = idRef.current;

  // Start as inactive to avoid SSR hydration mismatches.
  const [isActive, setIsActive] = React.useState(false);

  // Register on mount, unregister on unmount.
  React.useEffect(() => {
    registerHost(id);
    setIsActive(getActiveHostId() === id);
    return () => {
      unregisterHost(id);
    };
  }, [id]);

  // React to other hosts registering / unregistering.
  React.useEffect(() => {
    return subscribeHostRegistry(() => {
      setIsActive(getActiveHostId() === id);
    });
  }, [id]);

  if (!isActive) return null;
  return (
    <SgToasterHostContext.Provider value={true}>
      <SgToaster {...props} />
    </SgToasterHostContext.Provider>
  );
}
