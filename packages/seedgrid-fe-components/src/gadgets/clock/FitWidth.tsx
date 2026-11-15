"use client";

import * as React from "react";

/**
 * @internal Encolhe o conteudo (escala) quando ele e mais largo que o espaco disponivel, sem mexer quando cabe.
 * Usado pelos relogios digitais: digitos de largura fixa (flip, sete segmentos...) nao cortam nem deformam em tela estreita.
 * O conteudo mede sua largura natural (`width: max-content`); a escala e `disponivel / natural` (nunca > 1).
 */
export function SgFitWidth(props: { children: React.ReactNode }) {
  const outerRef = React.useRef<HTMLDivElement | null>(null);
  const innerRef = React.useRef<HTMLDivElement | null>(null);
  const [fit, setFit] = React.useState<{ scale: number; height: number }>({ scale: 1, height: 0 });

  React.useLayoutEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    const measure = () => {
      const available = outer.clientWidth;
      const natural = Math.max(inner.offsetWidth, inner.scrollWidth);
      const height = inner.offsetHeight;
      const scale = available > 0 && natural > available ? available / natural : 1;
      setFit((prev) =>
        Math.abs(prev.scale - scale) < 0.001 && prev.height === height ? prev : { scale, height }
      );
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(outer);
    observer.observe(inner);
    return () => observer.disconnect();
  }, []);

  const scaled = fit.scale < 1;
  return (
    <div
      ref={outerRef}
      data-sg-fit-width={scaled ? fit.scale.toFixed(3) : undefined}
      style={{ width: "100%", maxWidth: "100%", overflow: scaled ? "hidden" : undefined, height: scaled ? Math.ceil(fit.height * fit.scale) : undefined }}
    >
      <div
        ref={innerRef}
        style={{ width: "max-content", maxWidth: "none", transform: scaled ? `scale(${fit.scale})` : undefined, transformOrigin: "left top" }}
      >
        {props.children}
      </div>
    </div>
  );
}
