"use client";

import React from "react";
import { SgInputTextSearch } from "@seedgrid/fe-components";
import I18NReady from "../I18NReady";
import ComponentAiPropsTable from "../ai/ComponentAiPropsTable";
import { useAiManifestComponent } from "../ai/useAiManifestComponent";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import SgCodeBlockBase from "../sgCodeBlockBase";
import { useShowcaseAnchors } from "../useShowcaseAnchors";
import { useShowcaseI18n, type ShowcaseLocale } from "../../../i18n";

function CodeBlock(props: { sampleFile: string }) {
  return <SgCodeBlockBase sampleFile={props.sampleFile} />;
}

function Section(props: { id?: string; title: string; description?: string; children: React.ReactNode; example?: boolean }) {
  return (
    <section
      id={props.id}
      data-showcase-example={props.example === false ? undefined : "true"}
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 flex flex-wrap gap-4">{props.children}</div>
    </section>
  );
}

type SearchTexts = {
  headerSubtitle: string;
  section1Title: string;
  section1Description: string;
  section2Title: string;
  section2Description: string;
  propsTitle: string;
  propsDescription: string;
  propsColProp: string;
  propsColType: string;
  propsColDefault: string;
  propsColDescription: string;
  immediateLabel: string;
  searchLabel: string;
  noneLabel: string;
};

const SEARCH_TEXTS: Record<"pt-BR" | "pt-PT" | "en-US" | "es", SearchTexts> = {
  "pt-BR": {
    headerSubtitle:
      "Campo de busca que embrulha o SgInputText com debounce sem dependencia externa. onChange dispara imediatamente; onSearchChange dispara apos o debounce, com o termo normalizado (trim + gate por minChars).",
    section1Title: "1) Basico (minChars 3, debounce 350ms)",
    section1Description: "Digite e observe: o valor imediato muda a cada tecla, o termo de busca so atualiza apos parar de digitar e com 3+ caracteres.",
    section2Title: "2) minChars 1 e debounce 800ms",
    section2Description: "Dispara com 1 caractere, mas com um debounce mais longo.",
    propsTitle: "Referencia de Props",
    propsDescription: "Propriedades publicas de SgInputTextSearch.",
    propsColProp: "Prop",
    propsColType: "Tipo",
    propsColDefault: "Default",
    propsColDescription: "Descricao",
    immediateLabel: "Valor imediato (onChange)",
    searchLabel: "Termo de busca (onSearchChange)",
    noneLabel: "(vazio)"
  },
  "pt-PT": {
    headerSubtitle:
      "Campo de pesquisa que embrulha o SgInputText com debounce sem dependencia externa. onChange dispara imediatamente; onSearchChange dispara apos o debounce, com o termo normalizado (trim + gate por minChars).",
    section1Title: "1) Basico (minChars 3, debounce 350ms)",
    section1Description: "Escreva e observe: o valor imediato muda a cada tecla, o termo de pesquisa so atualiza apos parar de escrever e com 3+ caracteres.",
    section2Title: "2) minChars 1 e debounce 800ms",
    section2Description: "Dispara com 1 caractere, mas com um debounce mais longo.",
    propsTitle: "Referencia de Props",
    propsDescription: "Propriedades publicas de SgInputTextSearch.",
    propsColProp: "Prop",
    propsColType: "Tipo",
    propsColDefault: "Default",
    propsColDescription: "Descricao",
    immediateLabel: "Valor imediato (onChange)",
    searchLabel: "Termo de pesquisa (onSearchChange)",
    noneLabel: "(vazio)"
  },
  "en-US": {
    headerSubtitle:
      "Search field wrapping SgInputText with a dependency-free debounce. onChange fires immediately; onSearchChange fires after the debounce with the normalized term (trim + minChars gate).",
    section1Title: "1) Basic (minChars 3, debounce 350ms)",
    section1Description: "Type and watch: the immediate value updates per keystroke, while the search term only updates after you stop typing and with 3+ chars.",
    section2Title: "2) minChars 1, debounce 800ms",
    section2Description: "Fires with a single character, but with a longer debounce.",
    propsTitle: "Props Reference",
    propsDescription: "Public properties of SgInputTextSearch.",
    propsColProp: "Prop",
    propsColType: "Type",
    propsColDefault: "Default",
    propsColDescription: "Description",
    immediateLabel: "Immediate value (onChange)",
    searchLabel: "Search term (onSearchChange)",
    noneLabel: "(empty)"
  },
  es: {
    headerSubtitle:
      "Campo de busqueda que envuelve SgInputText con un debounce sin dependencia externa. onChange dispara de inmediato; onSearchChange dispara tras el debounce con el termino normalizado (trim + gate por minChars).",
    section1Title: "1) Basico (minChars 3, debounce 350ms)",
    section1Description: "Escribe y observa: el valor inmediato cambia con cada tecla, mientras el termino de busqueda solo se actualiza al dejar de escribir y con 3+ caracteres.",
    section2Title: "2) minChars 1, debounce 800ms",
    section2Description: "Dispara con un solo caracter, pero con un debounce mas largo.",
    propsTitle: "Referencia de Props",
    propsDescription: "Propiedades publicas de SgInputTextSearch.",
    propsColProp: "Prop",
    propsColType: "Tipo",
    propsColDefault: "Por defecto",
    propsColDescription: "Descripcion",
    immediateLabel: "Valor inmediato (onChange)",
    searchLabel: "Termino de busqueda (onSearchChange)",
    noneLabel: "(vacio)"
  }
};

type SupportedLocale = keyof typeof SEARCH_TEXTS;

function isSupported(locale: ShowcaseLocale): locale is SupportedLocale {
  return locale === "pt-BR" || locale === "pt-PT" || locale === "en-US" || locale === "es";
}

function getTexts(locale: ShowcaseLocale): SearchTexts {
  return SEARCH_TEXTS[isSupported(locale) ? locale : "en-US"];
}

function Echo(props: { label: string; value: string; none: string }) {
  return (
    <div className="mt-2 w-full rounded border border-border bg-foreground/5 p-2 text-xs">
      <strong>{props.label}:</strong> {props.value ? props.value : props.none}
    </div>
  );
}

export default function SgInputTextSearchPage() {
  const i18n = useShowcaseI18n();
  const aiComponent = useAiManifestComponent("SgInputTextSearch");
  const texts = React.useMemo(() => getTexts(i18n.locale), [i18n.locale]);
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } =
    useShowcaseAnchors({ deps: [i18n.locale] });

  const [immediate, setImmediate] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");

  const [immediate2, setImmediate2] = React.useState("");
  const [searchTerm2, setSearchTerm2] = React.useState("");

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-5xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgInputTextSearch"
          subtitle={texts.headerSubtitle}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section title={texts.section1Title} description={texts.section1Description}>
          <div className="w-96">
            <SgInputTextSearch
              id="search-basic"
              label="Busca"
              placeholder="Digite para buscar"
              onChange={setImmediate}
              onSearchChange={setSearchTerm}
            />
            <Echo label={texts.immediateLabel} value={immediate} none={texts.noneLabel} />
            <Echo label={texts.searchLabel} value={searchTerm} none={texts.noneLabel} />
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-input-text-search/samples/basico.tsx.sample" />
        </Section>

        <Section title={texts.section2Title} description={texts.section2Description}>
          <div className="w-96">
            <SgInputTextSearch
              id="search-tuned"
              label="Busca"
              placeholder="Digite para buscar"
              minChars={1}
              debounceMs={800}
              onChange={setImmediate2}
              onSearchChange={setSearchTerm2}
            />
            <Echo label={texts.immediateLabel} value={immediate2} none={texts.noneLabel} />
            <Echo label={texts.searchLabel} value={searchTerm2} none={texts.noneLabel} />
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-input-text-search/samples/minchars-e-debounce.tsx.sample" />
        </Section>

        <section
          id="props-reference"
          className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
        >
          <h2 data-anchor-title="true" className="text-lg font-semibold">{texts.propsTitle}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{texts.propsDescription}</p>
          <div className="mt-4 w-full overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2 pr-4 font-semibold">{texts.propsColProp}</th>
                  <th className="pb-2 pr-4 font-semibold">{texts.propsColType}</th>
                  <th className="pb-2 pr-4 font-semibold">{texts.propsColDefault}</th>
                  <th className="pb-2 font-semibold">{texts.propsColDescription}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr><td className="py-2 pr-4 font-mono text-xs">minChars</td><td className="py-2 pr-4">number</td><td className="py-2 pr-4">3</td><td className="py-2">Minimum characters (after trim) before onSearchChange fires; 0 also fires (clearing).</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">debounceMs</td><td className="py-2 pr-4">number</td><td className="py-2 pr-4">350</td><td className="py-2">Debounce delay in milliseconds.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">onChange</td><td className="py-2 pr-4">(value: string) =&gt; void</td><td className="py-2 pr-4">-</td><td className="py-2">Immediate, fired on every keystroke with the raw value.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">onSearchChange</td><td className="py-2 pr-4">(value: string) =&gt; void</td><td className="py-2 pr-4">-</td><td className="py-2">Debounced, fired with the normalized term (required).</td></tr>
              </tbody>
            </table>
          </div>
        </section>
        {aiComponent ? <ComponentAiPropsTable component={aiComponent} /> : null}
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
