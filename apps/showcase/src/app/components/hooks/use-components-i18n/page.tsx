"use client";

import React from "react";
import {
  SgButton,
  SgComponentsI18nProvider,
  SgGrid,
  tComponents,
  useComponentsI18n
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import SgCodeBlockBase from "../../sgCodeBlockBase";
import I18NReady from "../../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../../ShowcasePropsReference";
import ShowcaseStickyHeader from "../../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../../useShowcaseAnchors";
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

function CodeBlock(props: { sampleFile: string }) {
  return <SgCodeBlockBase sampleFile={props.sampleFile} />;
}

const LOCALES = ["pt-BR", "pt-PT", "en-US", "es", "fr"];

function Consumidor() {
  const i18n = useComponentsI18n();

  return (
    <SgGrid gap={4} className="rounded-lg border border-border bg-foreground/5 p-4 font-mono text-sm">
      <span>locale: {i18n.locale}</span>
      <span>messages: {Object.keys(i18n.messages).length}</span>
      <span>components.actions.clear: {tComponents(i18n, "components.actions.clear")}</span>
      <span>components.password.show: {tComponents(i18n, "components.password.show")}</span>
      <span>components.inputs.required: {tComponents(i18n, "components.inputs.required")}</span>
    </SgGrid>
  );
}

function BasicDemo() {
  const [locale, setLocale] = React.useState("pt-BR");

  return (
    <SgGrid gap={12}>
      <div className="flex flex-wrap gap-2">
        {LOCALES.map((id) => (
          <SgButton
            key={id}
            size="sm"
            appearance={id === locale ? "solid" : "outline"}
            onClick={() => setLocale(id)}
          >
            {id}
          </SgButton>
        ))}
      </div>
      <SgComponentsI18nProvider locale={locale}>
        <Consumidor />
      </SgComponentsI18nProvider>
    </SgGrid>
  );
}

function BotaoLimpar({ onClear }: { onClear: () => void }) {
  const i18n = useComponentsI18n();

  return (
    <SgButton
      size="sm"
      appearance="outline"
      aria-label={tComponents(i18n, "components.actions.clear")}
      onClick={onClear}
    >
      {tComponents(i18n, "components.actions.clear")}
    </SgButton>
  );
}

function LocaleAwareDemo() {
  const [limpezas, setLimpezas] = React.useState(0);

  return (
    <SgComponentsI18nProvider locale="es">
      <SgGrid gap={8}>
        <BotaoLimpar onClear={() => setLimpezas((n) => n + 1)} />
        <span className="font-mono text-sm">onClear: {limpezas}</span>
      </SgGrid>
    </SgComponentsI18nProvider>
  );
}

const HOOK_RETURN: ShowcasePropRow[] = [
  { prop: "locale", type: "string", defaultValue: '"en-US"', description: "Locale atual dos componentes. Vem do SgComponentsI18nProvider mais proximo ou, sem provider, do estado global." },
  { prop: "messages", type: "Record<string, string>", defaultValue: "built-in do locale", description: "Mapa de todas as chaves de traducao disponiveis para o locale atual, ja mescladas com as sobrescritas." }
];

export default function UseComponentsI18nPage() {
  const i18n = useShowcaseI18n();
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors();

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-4xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title={t(i18n, "showcase.hook.componentsI18n.title")}
          subtitle={t(i18n, "showcase.hook.componentsI18n.subtitle")}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section
          title={t(i18n, "showcase.hook.componentsI18n.sections.basic.title")}
          description={t(i18n, "showcase.hook.componentsI18n.sections.basic.description")}
        >
          <BasicDemo />
          <CodeBlock sampleFile="apps/showcase/src/app/components/hooks/use-components-i18n/samples/uso-basico.tsx.sample" />
        </Section>

        <Section
          title={t(i18n, "showcase.hook.componentsI18n.sections.custom.title")}
          description={t(i18n, "showcase.hook.componentsI18n.sections.custom.description")}
        >
          <LocaleAwareDemo />
          <CodeBlock sampleFile="apps/showcase/src/app/components/hooks/use-components-i18n/samples/componentes-conscientes-do-locale.tsx.sample" />
        </Section>

        <Section
          title={t(i18n, "showcase.hook.componentsI18n.sections.playground.title")}
          description={t(i18n, "showcase.hook.componentsI18n.sections.playground.description")}
        >
          <SgPlayground
            title="useComponentsI18n Playground"
            interactive
            codeContract="appFile"
            playgroundFile="apps/showcase/src/app/components/hooks/use-components-i18n/use-components-i18n.tsx.playground"
            height={540}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={HOOK_RETURN} />
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
