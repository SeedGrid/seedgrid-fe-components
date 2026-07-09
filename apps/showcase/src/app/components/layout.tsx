"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";

// gtag.js e carregado no root layout (src/app/layout.tsx) via next/script
// afterInteractive (id G-4DSCTMD8MV). Aqui so disparamos o evento.
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Rastreia a visualizacao de cada pagina de componente automaticamente, derivando o
// nome do proprio pathname (ultimo segmento = slug do componente). Roda em useEffect
// para garantir que o gtag ja hidratou, e re-dispara a cada navegacao client (o
// gtag config nao envia page_view sozinho em SPA do App Router).
//
// Passo manual pendente no painel do GA4 (nao da pra fazer por codigo):
//   Admin -> Definicoes personalizadas -> Criar dimensao personalizada
//   Nome: component | Escopo: Evento | Parametro do evento: component
// Sem isso, o parametro aparece em Realtime/DebugView mas NAO nos relatorios normais.
export default function ComponentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.gtag !== "function") {
      return;
    }

    const component = pathname.split("/").filter(Boolean).pop();
    // Ignora a raiz /components (indice) — so paginas de componente contam.
    if (!component || component === "components") {
      return;
    }

    window.gtag("event", "component_view", { component });
  }, [pathname]);

  return <>{children}</>;
}
