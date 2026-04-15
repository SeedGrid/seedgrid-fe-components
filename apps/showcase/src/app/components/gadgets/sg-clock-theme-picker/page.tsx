"use client";

import React from "react";
import {
  SgClock,
  SgClockThemePicker,
  SgClockThemeProvider,
  SgTimeProvider
} from "@seedgrid/fe-components";
import I18NReady from "../../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../../ShowcasePropsReference";
import ShowcaseStickyHeader from "../../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../../useShowcaseAnchors";
import ComponentAiPropsTable from "../../ai/ComponentAiPropsTable";
import ComponentAiSummary from "../../ai/ComponentAiSummary";
import { useAiManifestComponent } from "../../ai/useAiManifestComponent";

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

const CLOCK_THEME_PICKER_PROPS: ShowcasePropRow[] = [
  { prop: "value", type: "string", defaultValue: "-", description: "ID do tema atualmente selecionado." },
  { prop: "onChange", type: "(id: string) => void", defaultValue: "-", description: "Recebe o novo tema selecionado." },
  { prop: "label", type: "string", defaultValue: 'tema', description: "Rotulo opcional do seletor." },
  { prop: "placeholder", type: "string", defaultValue: "tema padrao", description: "Texto exibido quando nenhum tema foi resolvido." },
  { prop: "filter", type: "(theme) => boolean", defaultValue: "-", description: "Filtro aplicado sobre os temas disponiveis." },
  { prop: "previewSize", type: "number", defaultValue: "56", description: "Tamanho do preview de cada tema." },
  { prop: "searchable", type: "boolean", defaultValue: "true", description: "Ativa busca textual de temas." },
  { prop: "fallbackThemeId", type: "string", defaultValue: '"classic"', description: "Tema usado quando o valor atual nao existe." },
  { prop: "defaultOpen", type: "boolean", defaultValue: "false", description: "Abre a lista no render inicial." }
];

function LiveThemePicker() {
  const [themeId, setThemeId] = React.useState("classic");
  const now = new Date().toISOString();

  return (
    <SgTimeProvider initialServerTime={now}>
      <SgClockThemeProvider>
        <div className="flex flex-col items-center gap-4 rounded-lg border border-border p-4">
          <SgClock themeId={themeId} />
          <div className="w-full max-w-md">
            <SgClockThemePicker value={themeId} onChange={setThemeId} />
          </div>
        </div>
      </SgClockThemeProvider>
    </SgTimeProvider>
  );
}

export default function SgClockThemePickerPage() {
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors();
  const aiComponent = useAiManifestComponent("SgClockThemePicker");

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-4xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgClockThemePicker"
          subtitle="Seleciona temas de clock com preview visual e busca opcional."
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />
        {aiComponent ? <ComponentAiSummary component={aiComponent} /> : null}

        <Section
          title="1) Basic usage"
          description="Escolha de tema visual com preview imediato aplicado ao relogio."
        >
          <LiveThemePicker />
        </Section>

        <ShowcasePropsReference rows={CLOCK_THEME_PICKER_PROPS} />
        {aiComponent ? <ComponentAiPropsTable component={aiComponent} /> : null}
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
