"use client";

// Origem: admin-web/app/components/SgInputTextSearch.tsx (movido para o DS).
// A versao original usava rxjs (Subject + debounceTime/distinctUntilChanged/map).
// Aqui o debounce e feito com useEffect + setTimeout, sem dependencia externa,
// preservando o mesmo comportamento: trim, gate por minChars, debounceMs e
// "distinct" (nao redispara onSearchChange quando o valor normalizado nao muda).

import React from "react";
import { SgInputText, type SgInputTextProps } from "./SgInputText";

export type SgInputTextSearchProps = Omit<SgInputTextProps, "onChange"> & {
  minChars?: number;
  debounceMs?: number;
  /** Disparado imediatamente a cada digitacao, com o valor cru. */
  onChange?: (value: string) => void;
  /** Disparado apos o debounce, com o valor normalizado (trim + gate por minChars). */
  onSearchChange: (value: string) => void;
};

export function SgInputTextSearch({
  minChars = 3,
  debounceMs = 350,
  onChange,
  onSearchChange,
  ...props
}: Readonly<SgInputTextSearchProps>) {
  const [value, setValue] = React.useState("");

  // Mantem o callback mais recente em ref para que o efeito de debounce abaixo
  // dependa apenas de `value`/`debounceMs`/`minChars`. Assim uma nova identidade
  // de `onSearchChange` (re-render do pai) nao reinicia o timer em andamento.
  const onSearchChangeRef = React.useRef(onSearchChange);
  onSearchChangeRef.current = onSearchChange;

  // Guarda o ultimo valor normalizado JA emitido para implementar o "distinct".
  const lastEmittedRef = React.useRef<string | null>(null);

  // So dispara onSearchChange DEPOIS da 1a digitacao. Igual ao rxjs (o Subject so
  // emite quando ha um .next), nao dispara no MOUNT com a query vazia.
  const hasInteractedRef = React.useRef(false);

  React.useEffect(() => {
    if (!hasInteractedRef.current) return;
    const timer = window.setTimeout(() => {
      const normalized = value.trim();
      const passesGate = normalized.length === 0 || normalized.length >= minChars;
      if (!passesGate) return;
      if (lastEmittedRef.current === normalized) return;
      lastEmittedRef.current = normalized;
      onSearchChangeRef.current(normalized);
    }, Math.max(0, debounceMs));

    return () => {
      window.clearTimeout(timer);
    };
  }, [value, debounceMs, minChars]);

  return (
    <SgInputText
      {...props}
      onChange={(nextValue) => {
        hasInteractedRef.current = true;
        setValue(nextValue);
        onChange?.(nextValue);
      }}
      inputProps={{
        ...(props.inputProps ?? {}),
        value
      }}
    />
  );
}
