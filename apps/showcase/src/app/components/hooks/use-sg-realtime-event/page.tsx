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

const ROWS: ShowcasePropRow[] = [
  { prop: "channel", type: "string", defaultValue: "-", description: "Channel do aviso (ex.: \"backup\"). Precisa estar nos channels do SgRealtimeProvider." },
  { prop: "events", type: "string | string[]", defaultValue: "-", description: "Nome do evento, lista de nomes, \"prefixo.*\" ou \"*\"." },
  { prop: "handler", type: "(event: SgRealtimeEvent) => void", defaultValue: "-", description: "Chamado a cada aviso que casa. Sempre a versao mais recente (sem reassinar)." }
];

export default function UseSgRealtimeEventPage() {
  const i18n = useShowcaseI18n();
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors();
  const aiComponent = useAiManifestComponent("useSgRealtimeEvent");

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-4xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title={t(i18n, "showcase.component.useRealtimeEvent.title")}
          subtitle={t(i18n, "showcase.component.useRealtimeEvent.subtitle")}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section
          title={t(i18n, "showcase.component.useRealtimeEvent.sections.basic.title")}
          description={t(i18n, "showcase.component.useRealtimeEvent.sections.basic.description")}
        >
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/hooks/use-sg-realtime-event/samples/uso-basico.tsx.sample" />
        </Section>

        <Section
          title="Playground"
          description={t(i18n, "showcase.component.realtimeProvider.sections.playground.description")}
        >
          <SgPlayground
            title="useSgRealtimeEvent Playground"
            interactive
            codeContract="appFile"
            playgroundFile="apps/showcase/src/app/components/providers/sg-realtime-provider/sg-realtime-provider.tsx.playground"
            height={480}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={ROWS} />
        {aiComponent ? <ComponentAiPropsTable component={aiComponent} /> : null}
        {aiComponent ? <ComponentAiSummary component={aiComponent} /> : null}
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
