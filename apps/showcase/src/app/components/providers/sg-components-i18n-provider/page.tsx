"use client";

import React from "react";
import {
  SgButton,
  SgComponentsI18nProvider,
  SgGrid,
  componentsMessagesEnUs,
  componentsMessagesEs,
  componentsMessagesFr,
  componentsMessagesPtBr,
  componentsMessagesPtPt,
  getComponentsI18n,
  setComponentsI18n,
  tComponents,
  useComponentsI18n
} from "@seedgrid/fe-components";
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

function CodeBlock(props: { sampleFile: string }) {
  return <SgCodeBlockBase sampleFile={props.sampleFile} />;
}

const LOCALES = {
  "pt-BR": componentsMessagesPtBr,
  "pt-PT": componentsMessagesPtPt,
  "en-US": componentsMessagesEnUs,
  es: componentsMessagesEs,
  fr: componentsMessagesFr
};

type LocaleId = keyof typeof LOCALES;

function Mensagens() {
  const i18n = useComponentsI18n();

  return (
    <SgGrid gap={4} className="rounded-lg border border-border bg-foreground/5 p-4 font-mono text-sm">
      <span>locale: {i18n.locale}</span>
      <span>components.actions.clear: {tComponents(i18n, "components.actions.clear")}</span>
      <span>components.password.show: {tComponents(i18n, "components.password.show")}</span>
      <span>components.inputs.required: {tComponents(i18n, "components.inputs.required")}</span>
    </SgGrid>
  );
}

function BasicDemo() {
  return (
    <SgComponentsI18nProvider locale="en-US" messages={componentsMessagesEnUs}>
      <Mensagens />
    </SgComponentsI18nProvider>
  );
}

function DynamicLocaleDemo() {
  const [locale, setLocale] = React.useState<LocaleId>("pt-BR");

  return (
    <SgGrid gap={12}>
      <div className="flex flex-wrap gap-2">
        {(Object.keys(LOCALES) as LocaleId[]).map((id) => (
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
      <SgComponentsI18nProvider locale={locale} messages={LOCALES[locale]}>
        <Mensagens />
      </SgComponentsI18nProvider>
    </SgGrid>
  );
}

function ImperativeDemo() {
  const [resultado, setResultado] = React.useState("");

  const aplicar = (locale: string) => {
    const anterior = getComponentsI18n();

    setComponentsI18n({ locale });
    const atual = getComponentsI18n();
    setResultado(`${atual.locale}: ${tComponents(atual, "components.actions.clear")}`);

    // Devolve o estado global anterior para nao afetar o restante da pagina.
    setComponentsI18n({ locale: anterior.locale, messages: anterior.messages });
  };

  return (
    <SgGrid gap={12}>
      <div className="flex flex-wrap gap-2">
        <SgButton size="sm" onClick={() => aplicar("es")}>
          es
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => aplicar("fr")}>
          fr
        </SgButton>
      </div>
      <span className="font-mono text-sm">{resultado || "-"}</span>
    </SgGrid>
  );
}

const meusTextos = {
  "components.actions.clear": "Reset",
  "components.password.show": "Reveal",
  "components.inputs.required": "Mandatory field."
};

function CustomMessagesDemo() {
  return (
    <SgComponentsI18nProvider
      locale="en-US"
      messages={{ ...componentsMessagesEnUs, ...meusTextos }}
    >
      <Mensagens />
    </SgComponentsI18nProvider>
  );
}

const I18N_PROVIDER_PROPS: ShowcasePropRow[] = [
  { prop: "locale", type: "string", defaultValue: '"en-US"', description: 'Codigo do locale (ex: "pt-BR", "pt-PT", "en-US", "es", "fr"). Afeta os textos internos dos componentes SeedGrid.' },
  { prop: "messages", type: "SgComponentsMessages | SgComponentsMessagesByNamespace", defaultValue: "built-in do locale", description: "Mapa de chaves para textos. Pode ser o objeto completo de um locale ou apenas as chaves que deseja sobrescrever." },
  { prop: "children", type: "ReactNode", defaultValue: "-", description: "Arvore que vai consumir o locale via useComponentsI18n." }
];

export default function SgComponentsI18nProviderPage() {
  const i18n = useShowcaseI18n();
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors();
  const aiComponent = useAiManifestComponent("SgComponentsI18nProvider");

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-4xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title={t(i18n, "showcase.component.componentsI18nProvider.title")}
          subtitle={t(i18n, "showcase.component.componentsI18nProvider.subtitle")}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section
          title={t(i18n, "showcase.component.componentsI18nProvider.sections.basic.title")}
          description={t(i18n, "showcase.component.componentsI18nProvider.sections.basic.description")}
        >
          <BasicDemo />
          <CodeBlock sampleFile="apps/showcase/src/app/components/providers/sg-components-i18n-provider/samples/uso-basico.tsx.sample" />
        </Section>

        <Section
          title={t(i18n, "showcase.component.componentsI18nProvider.sections.dynamic.title")}
          description={t(i18n, "showcase.component.componentsI18nProvider.sections.dynamic.description")}
        >
          <DynamicLocaleDemo />
          <CodeBlock sampleFile="apps/showcase/src/app/components/providers/sg-components-i18n-provider/samples/troca-dinamica-de-locale.tsx.sample" />
        </Section>

        <Section
          title={t(i18n, "showcase.component.componentsI18nProvider.sections.global.title")}
          description={t(i18n, "showcase.component.componentsI18nProvider.sections.global.description")}
        >
          <ImperativeDemo />
          <CodeBlock sampleFile="apps/showcase/src/app/components/providers/sg-components-i18n-provider/samples/api-imperativa-setcomponentsi18n.tsx.sample" />
        </Section>

        <Section
          title={t(i18n, "showcase.component.componentsI18nProvider.sections.custom.title")}
          description={t(i18n, "showcase.component.componentsI18nProvider.sections.custom.description")}
        >
          <CustomMessagesDemo />
          <CodeBlock sampleFile="apps/showcase/src/app/components/providers/sg-components-i18n-provider/samples/sobrescrita-de-mensagens.tsx.sample" />
        </Section>

        <Section
          title={t(i18n, "showcase.component.componentsI18nProvider.sections.playground.title")}
          description={t(i18n, "showcase.component.componentsI18nProvider.sections.playground.description")}
        >
          <SgPlayground
            title="SgComponentsI18nProvider Playground"
            interactive
            codeContract="appFile"
            playgroundFile="apps/showcase/src/app/components/providers/sg-components-i18n-provider/sg-components-i18n-provider.tsx.playground"
            height={540}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={I18N_PROVIDER_PROPS} />
        {aiComponent ? <ComponentAiPropsTable component={aiComponent} /> : null}
        {aiComponent ? <ComponentAiSummary component={aiComponent} /> : null}
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
