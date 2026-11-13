"use client";

import * as React from "react";

/** Largura (px) a partir da qual o arraste automatico fica ligado. Mantida igual no Flutter (`kSgAutoDragMinWidth`). */
export const SG_AUTO_DRAG_MIN_WIDTH = 640;

/**
 * @internal Resolve `draggable` de componentes que arrastam por padrao (SgClock, SgCalendar):
 * `true` = sempre arrasta; `false` = nunca; `undefined` = automatico (arrasta em largura >= 640px, desligado abaixo).
 */
export function useSgAutoDraggable(draggable: boolean | undefined): boolean {
  const [narrow, setNarrow] = React.useState(false);
  React.useEffect(() => {
    if (draggable !== undefined) return;
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia(`(max-width: ${SG_AUTO_DRAG_MIN_WIDTH - 1}px)`);
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener?.("change", sync);
    return () => mq.removeEventListener?.("change", sync);
  }, [draggable]);
  return draggable ?? !narrow;
}
