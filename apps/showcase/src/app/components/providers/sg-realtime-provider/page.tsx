"use client";

import React from "react";
import { SgPlayground } from "@seedgrid/fe-playground";
import SgCodeBlockBase from "../../sgCodeBlockBase";
import I18NReady from "../../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../../ShowcasePropsReference";
import ShowcaseStickyHeader from "../../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../../useShowcaseAnchors";
import ComponentAiPropsTable from "../../ai/ComponentAiPropsTable";
import ComponentAiSummary from "../../ai/ComponentAiSummary";
import { useAiManifestComponent } from "../../ai/useAiManifestComponent";
import { t, useShowcaseI18n } from "../../../../i18n";
import RealtimeSimulator from "./RealtimeSimulator";

const BASE = "apps/showcase/src/app/components/providers/sg-realtime-provider";

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section
      data-showcase-example="true"
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 space-y-4">{props.children}</div>
    </section>
  );
}

const REALTIME_PROVIDER_PROPS: ShowcasePropRow[] = [
  { prop: "channels", type: "string[]", defaultValue: "-", description: "Channels que a aplicacao quer ouvir (ex.: [\"backup\"])." },
  { prop: "tokenEndpoint", type: "string", defaultValue: "\"/api/realtime/connect\"", description: "Rota que entrega o token de conexao do usuario logado (a BFF, na mesma origem)." },
  { prop: "tokenRequestInit", type: "RequestInit", defaultValue: "-", description: "Opcoes do fetch do token (ex.: header Authorization quando nao ha cookie)." },
  { prop: "fetchToken", type: "() => Promise<SgRealtimeConnectResponse>", defaultValue: "-", description: "Substitui o pedido de token (apps sem BFF, testes)." },
  { prop: "pulseUrl", type: "string", defaultValue: "-", description: "Endereco do Pulse quando o token nao traz connectUrl." },
  { prop: "enabled", type: "boolean", defaultValue: "true", description: "Liga/desliga (ex.: false enquanto nao ha usuario logado)." },
  { prop: "connectOptions", type: "Omit<ConnectInput, \"getToken\" | \"accountKey\" | \"baseUrl\">", defaultValue: "-", description: "Opcoes avancadas do cliente do Pulse (reconexao, webSocketImpl em testes)." },
  { prop: "children", type: "ReactNode", defaultValue: "-", description: "Arvore que ouve os avisos com useSgRealtimeEvent." }
];

export default function SgRealtimeProviderPage() {
  const i18n = useShowcaseI18n();
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors();
  const aiComponent = useAiManifestComponent("SgRealtimeProvider");

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-4xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title={t(i18n, "showcase.component.realtimeProvider.title")}
          subtitle={t(i18n, "showcase.component.realtimeProvider.subtitle")}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section
          title={t(i18n, "showcase.component.realtimeProvider.sections.simulator.title")}
          description={t(i18n, "showcase.component.realtimeProvider.sections.simulator.description")}
        >
          <RealtimeSimulator />
          <SgCodeBlockBase sampleFile={`${BASE}/samples/simulador.tsx.sample`} />
        </Section>

        <Section
          title={t(i18n, "showcase.component.realtimeProvider.sections.layout.title")}
          description={t(i18n, "showcase.component.realtimeProvider.sections.layout.description")}
        >
          <SgCodeBlockBase sampleFile={`${BASE}/samples/layout-com-bff.tsx.sample`} />
        </Section>

        <Section
          title={t(i18n, "showcase.component.realtimeProvider.sections.polling.title")}
          description={t(i18n, "showcase.component.realtimeProvider.sections.polling.description")}
        >
          <SgCodeBlockBase sampleFile={`${BASE}/samples/polling-de-reserva.tsx.sample`} />
        </Section>

        <Section
          title="Playground"
          description={t(i18n, "showcase.component.realtimeProvider.sections.playground.description")}
        >
          <SgPlayground
            title="SgRealtimeProvider Playground"
            interactive
            codeContract="appFile"
            playgroundFile={`${BASE}/sg-realtime-provider.tsx.playground`}
            height={480}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={REALTIME_PROVIDER_PROPS} />
        {aiComponent ? <ComponentAiPropsTable component={aiComponent} /> : null}
        {aiComponent ? <ComponentAiSummary component={aiComponent} /> : null}
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
