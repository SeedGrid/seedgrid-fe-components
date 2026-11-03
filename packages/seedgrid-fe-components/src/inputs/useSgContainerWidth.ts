"use client";

import React from "react";

const useIsomorphicLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

/**
 * Mede a largura (px) do elemento observado e acompanha o redimensionamento.
 *
 * - Devolve `null` enquanto a largura nao e conhecida (SSR, antes da primeira medicao,
 *   elemento oculto/sem layout). Quem consome deve tratar `null` como "nao estreito",
 *   para nunca trocar o layout no servidor nem piscar na hidratacao.
 * - Mede o CONTAINER (e nao a janela), como o `LayoutBuilder` do Flutter: a tabela dentro de
 *   um painel estreito num desktop tambem e considerada estreita.
 * - `enabled=false` nao observa nada (custo zero para quem nao usa).
 */
export function useSgContainerWidth(
  ref: React.RefObject<HTMLElement | null>,
  enabled = true
): number | null {
  const [width, setWidth] = React.useState<number | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (!enabled) {
      setWidth((prev) => (prev === null ? prev : null));
      return;
    }
    const element = ref.current;
    if (!element) return;

    const measure = () => {
      const next = element.getBoundingClientRect().width;
      const resolved = next > 0 ? Math.round(next) : null;
      setWidth((prev) => (prev === resolved ? prev : resolved));
    };

    measure();

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(measure);
      observer.observe(element);
      return () => observer.disconnect();
    }

    if (typeof window !== "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }
    return;
  }, [ref, enabled]);

  return width;
}
