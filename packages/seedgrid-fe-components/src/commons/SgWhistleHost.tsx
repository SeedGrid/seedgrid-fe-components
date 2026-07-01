"use client";

import React from "react";
import { SgWhistler, SgWhistlerHostContext, type SgWhistlerProps } from "./SgWhistler";
import {
  registerWhistleHost,
  unregisterWhistleHost,
  getActiveWhistleHostId,
  subscribeWhistleHostRegistry,
  nextWhistleHostId
} from "./sgWhistleHostRegistry";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export type SgWhistleHostProps = SgWhistlerProps;

/**
 * SgWhistleHost — marca o local onde os whistles vao aparecer.
 *
 * Monte em qualquer ponto da arvore. Se existirem varios hosts ao mesmo tempo
 * (ex.: um no topo e outro embaixo do layout), o mais profundo na arvore React
 * (ultimo a montar) tem prioridade. Quando ele desmonta, o host montado mais
 * recentemente antes dele volta a ficar ativo automaticamente.
 *
 * Quando qualquer SgWhistleHost esta presente, o SgWhistler "solto" cede a vez
 * e para de renderizar, para os dois coexistirem sem duplicar.
 *
 * Aceita os mesmos props do SgWhistler (max, newestOnTop, gap, roundBorder, etc.).
 */
export function SgWhistleHost(props: SgWhistleHostProps) {
  // ID estavel entre re-renders, gerado uma vez por instancia.
  const idRef = React.useRef<string | null>(null);
  if (idRef.current === null) {
    idRef.current = nextWhistleHostId();
  }
  const id = idRef.current;

  // Comeca inativo para evitar mismatch de hidratacao no SSR.
  const [isActive, setIsActive] = React.useState(false);

  // Registra no mount, desregistra no unmount.
  React.useEffect(() => {
    registerWhistleHost(id);
    setIsActive(getActiveWhistleHostId() === id);
    return () => {
      unregisterWhistleHost(id);
    };
  }, [id]);

  // Reage a outros hosts registrando / desregistrando.
  React.useEffect(() => {
    return subscribeWhistleHostRegistry(() => {
      setIsActive(getActiveWhistleHostId() === id);
    });
  }, [id]);

  if (!isActive) return null;
  return (
    <SgWhistlerHostContext.Provider value={true}>
      <SgWhistler {...props} />
    </SgWhistlerHostContext.Provider>
  );
}
