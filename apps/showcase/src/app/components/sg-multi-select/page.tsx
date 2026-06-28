"use client";

import React from "react";
import { SgButton, SgMultiSelect, type SgMultiSelectOptionValue } from "@seedgrid/fe-components";
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

const COMPANIES = [
  { label: "Empresa 1", value: "e1" },
  { label: "Empresa 2", value: "e2" },
  { label: "Empresa 3", value: "e3" },
  { label: "Empresa 4", value: "e4" },
  { label: "Empresa 5", value: "e5" },
  { label: "Empresa 6", value: "e6" }
];

type MultiSelectTexts = {
  headerSubtitle: string;
  section1Title: string;
  section1Description: string;
  section2Title: string;
  section2Description: string;
  section3Title: string;
  section3Description: string;
  section4Title: string;
  section4Description: string;
  propsTitle: string;
  propsDescription: string;
  propsColProp: string;
  propsColType: string;
  propsColDefault: string;
  propsColDescription: string;
  selectedLabel: string;
  noneLabel: string;
};

const MULTI_SELECT_TEXTS: Record<"pt-BR" | "pt-PT" | "en-US" | "es", MultiSelectTexts> = {
  "pt-BR": {
    headerSubtitle:
      "Selecao multipla estilo select. O trigger mostra um chevron que vira check ao abrir; o dropdown lista as opcoes com checkboxes e fica aberto enquanto voce marca/desmarca.",
    section1Title: "1) Basico (fechado / aberto, com e sem selecao)",
    section1Description: "Clique no campo para abrir. Marque varias opcoes; a lista continua aberta.",
    section2Title: "2) Com busca",
    section2Description: "searchable habilita um campo de busca no topo do dropdown.",
    section3Title: "3) Limpavel e com limite",
    section3Description: "clearable adiciona o botao de limpar; maxSelected restringe o numero de itens.",
    section4Title: "4) Desabilitado",
    section4Description: "Com enabled={false} o campo nao abre nem altera a selecao.",
    propsTitle: "Referencia de Props",
    propsDescription: "Propriedades publicas de SgMultiSelect.",
    propsColProp: "Prop",
    propsColType: "Tipo",
    propsColDefault: "Default",
    propsColDescription: "Descricao",
    selectedLabel: "Selecionadas",
    noneLabel: "(nenhuma)"
  },
  "pt-PT": {
    headerSubtitle:
      "Selecao multipla estilo select. O trigger mostra um chevron que vira check ao abrir; o dropdown lista as opcoes com checkboxes e fica aberto enquanto marca/desmarca.",
    section1Title: "1) Basico (fechado / aberto, com e sem selecao)",
    section1Description: "Clique no campo para abrir. Marque varias opcoes; a lista continua aberta.",
    section2Title: "2) Com pesquisa",
    section2Description: "searchable habilita um campo de pesquisa no topo do dropdown.",
    section3Title: "3) Limpavel e com limite",
    section3Description: "clearable adiciona o botao de limpar; maxSelected restringe o numero de itens.",
    section4Title: "4) Desativado",
    section4Description: "Com enabled={false} o campo nao abre nem altera a selecao.",
    propsTitle: "Referencia de Props",
    propsDescription: "Propriedades publicas de SgMultiSelect.",
    propsColProp: "Prop",
    propsColType: "Tipo",
    propsColDefault: "Default",
    propsColDescription: "Descricao",
    selectedLabel: "Selecionadas",
    noneLabel: "(nenhuma)"
  },
  "en-US": {
    headerSubtitle:
      "Select-style multi-select. The trigger shows a chevron that turns into a check when open; the dropdown lists options with checkboxes and stays open while you toggle.",
    section1Title: "1) Basic (closed / open, with and without selection)",
    section1Description: "Click the field to open. Toggle multiple options; the list stays open.",
    section2Title: "2) Searchable",
    section2Description: "searchable enables a search field at the top of the dropdown.",
    section3Title: "3) Clearable and capped",
    section3Description: "clearable adds the clear button; maxSelected caps the number of items.",
    section4Title: "4) Disabled",
    section4Description: "With enabled={false} the field neither opens nor changes the selection.",
    propsTitle: "Props Reference",
    propsDescription: "Public properties of SgMultiSelect.",
    propsColProp: "Prop",
    propsColType: "Type",
    propsColDefault: "Default",
    propsColDescription: "Description",
    selectedLabel: "Selected",
    noneLabel: "(none)"
  },
  es: {
    headerSubtitle:
      "Seleccion multiple estilo select. El trigger muestra un chevron que se vuelve check al abrir; el dropdown lista opciones con checkboxes y permanece abierto al marcar.",
    section1Title: "1) Basico (cerrado / abierto, con y sin seleccion)",
    section1Description: "Haz clic en el campo para abrir. Marca varias opciones; la lista sigue abierta.",
    section2Title: "2) Con busqueda",
    section2Description: "searchable habilita un campo de busqueda en la parte superior del dropdown.",
    section3Title: "3) Limpiable y con limite",
    section3Description: "clearable agrega el boton de limpiar; maxSelected limita la cantidad de items.",
    section4Title: "4) Deshabilitado",
    section4Description: "Con enabled={false} el campo no abre ni cambia la seleccion.",
    propsTitle: "Referencia de Props",
    propsDescription: "Propiedades publicas de SgMultiSelect.",
    propsColProp: "Prop",
    propsColType: "Tipo",
    propsColDefault: "Por defecto",
    propsColDescription: "Descripcion",
    selectedLabel: "Seleccionadas",
    noneLabel: "(ninguna)"
  }
};

type SupportedLocale = keyof typeof MULTI_SELECT_TEXTS;

function isSupported(locale: ShowcaseLocale): locale is SupportedLocale {
  return locale === "pt-BR" || locale === "pt-PT" || locale === "en-US" || locale === "es";
}

function getTexts(locale: ShowcaseLocale): MultiSelectTexts {
  return MULTI_SELECT_TEXTS[isSupported(locale) ? locale : "en-US"];
}

function Selected(props: { label: string; none: string; value: SgMultiSelectOptionValue[] }) {
  return (
    <div className="mt-2 w-full rounded border border-border bg-foreground/5 p-2 text-xs">
      <strong>{props.label}:</strong> {props.value.length ? props.value.join(", ") : props.none}
    </div>
  );
}

export default function SgMultiSelectPage() {
  const i18n = useShowcaseI18n();
  const aiComponent = useAiManifestComponent("SgMultiSelect");
  const texts = React.useMemo(() => getTexts(i18n.locale), [i18n.locale]);
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } =
    useShowcaseAnchors({ deps: [i18n.locale] });

  const [empty, setEmpty] = React.useState<SgMultiSelectOptionValue[]>([]);
  const [preselected, setPreselected] = React.useState<SgMultiSelectOptionValue[]>(["e1", "e2", "e4"]);
  const [searchable, setSearchable] = React.useState<SgMultiSelectOptionValue[]>(["e1"]);
  const [capped, setCapped] = React.useState<SgMultiSelectOptionValue[]>([]);

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-5xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgMultiSelect"
          subtitle={texts.headerSubtitle}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section title={texts.section1Title} description={texts.section1Description}>
          <div className="w-96">
            <SgMultiSelect
              id="ms-empty"
              label="Empresas"
              placeholder="Selecione as empresas"
              options={COMPANIES}
              value={empty}
              onChange={setEmpty}
            />
            <Selected label={texts.selectedLabel} none={texts.noneLabel} value={empty} />
          </div>
          <div className="w-96">
            <SgMultiSelect
              id="ms-preselected"
              label="Empresas (com selecao)"
              placeholder="Selecione as empresas"
              options={COMPANIES}
              value={preselected}
              onChange={setPreselected}
            />
            <Selected label={texts.selectedLabel} none={texts.noneLabel} value={preselected} />
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-multi-select/samples/basico.tsx.sample" />
        </Section>

        <Section title={texts.section2Title} description={texts.section2Description}>
          <div className="w-96">
            <SgMultiSelect
              id="ms-searchable"
              label="Empresas"
              placeholder="Selecione as empresas"
              options={COMPANIES}
              value={searchable}
              onChange={setSearchable}
              searchable
            />
            <Selected label={texts.selectedLabel} none={texts.noneLabel} value={searchable} />
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-multi-select/samples/com-busca.tsx.sample" />
        </Section>

        <Section title={texts.section3Title} description={texts.section3Description}>
          <div className="w-96">
            <SgMultiSelect
              id="ms-capped"
              label="Empresas (max 2)"
              placeholder="Selecione ate 2 empresas"
              options={COMPANIES}
              value={capped}
              onChange={setCapped}
              clearable
              maxSelected={2}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              <SgButton size="sm" appearance="outline" onClick={() => setCapped([])}>
                Clear
              </SgButton>
            </div>
            <Selected label={texts.selectedLabel} none={texts.noneLabel} value={capped} />
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-multi-select/samples/limpavel-e-com-limite.tsx.sample" />
        </Section>

        <Section title={texts.section4Title} description={texts.section4Description}>
          <div className="w-96">
            <SgMultiSelect
              id="ms-disabled"
              label="Empresas"
              placeholder="Selecione as empresas"
              options={COMPANIES}
              value={["e1", "e3"]}
              enabled={false}
            />
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-multi-select/samples/desabilitado.tsx.sample" />
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
                <tr><td className="py-2 pr-4 font-mono text-xs">options</td><td className="py-2 pr-4">{`{ label, value, disabled? }[]`}</td><td className="py-2 pr-4">-</td><td className="py-2">Available options.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">value</td><td className="py-2 pr-4">(string | number)[]</td><td className="py-2 pr-4">[]</td><td className="py-2">Selected values (controlled).</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">onChange</td><td className="py-2 pr-4">(value[]) =&gt; void</td><td className="py-2 pr-4">-</td><td className="py-2">Fired with the updated array.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">searchable</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">false</td><td className="py-2">Shows a search field in the dropdown.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">clearable</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">false</td><td className="py-2">Shows a clear-all button.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">maxSelected</td><td className="py-2 pr-4">number</td><td className="py-2 pr-4">-</td><td className="py-2">Maximum number of selectable items.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">summaryThreshold</td><td className="py-2 pr-4">number</td><td className="py-2 pr-4">2</td><td className="py-2">Labels shown before the "N selected" summary.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">placeholder</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">i18n</td><td className="py-2">Text shown when nothing is selected.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">onEnter / onExit</td><td className="py-2 pr-4">() =&gt; void</td><td className="py-2 pr-4">-</td><td className="py-2">Focus / blur callbacks.</td></tr>
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
