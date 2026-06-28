"use client";

import React from "react";
import { SgButton, SgMultiSelectChips, type SgMultiSelectOptionValue } from "@seedgrid/fe-components";
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

type ChipsTexts = {
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

const CHIPS_TEXTS: Record<"pt-BR" | "pt-PT" | "en-US" | "es", ChipsTexts> = {
  "pt-BR": {
    headerSubtitle:
      "Variante do multi-select onde os itens selecionados viram chips removiveis no trigger. O dropdown com checkboxes e a busca sao iguais ao SgMultiSelect.",
    section1Title: "1) Basico (vazio / com chips)",
    section1Description: "Clique no campo para abrir. Cada item selecionado vira um chip com botao de remover.",
    section2Title: "2) Com busca",
    section2Description: "searchable habilita um campo de busca no topo do dropdown.",
    section3Title: "3) Limpavel e com limite",
    section3Description: "clearable adiciona o botao de limpar; maxSelected restringe o numero de itens.",
    section4Title: "4) Desabilitado",
    section4Description: "Com enabled={false} o campo nao abre, nem remove chips.",
    propsTitle: "Referencia de Props",
    propsDescription: "Propriedades publicas de SgMultiSelectChips.",
    propsColProp: "Prop",
    propsColType: "Tipo",
    propsColDefault: "Default",
    propsColDescription: "Descricao",
    selectedLabel: "Selecionadas",
    noneLabel: "(nenhuma)"
  },
  "pt-PT": {
    headerSubtitle:
      "Variante do multi-select onde os itens selecionados viram chips removiveis no trigger. O dropdown com checkboxes e a pesquisa sao iguais ao SgMultiSelect.",
    section1Title: "1) Basico (vazio / com chips)",
    section1Description: "Clique no campo para abrir. Cada item selecionado vira um chip com botao de remover.",
    section2Title: "2) Com pesquisa",
    section2Description: "searchable habilita um campo de pesquisa no topo do dropdown.",
    section3Title: "3) Limpavel e com limite",
    section3Description: "clearable adiciona o botao de limpar; maxSelected restringe o numero de itens.",
    section4Title: "4) Desativado",
    section4Description: "Com enabled={false} o campo nao abre, nem remove chips.",
    propsTitle: "Referencia de Props",
    propsDescription: "Propriedades publicas de SgMultiSelectChips.",
    propsColProp: "Prop",
    propsColType: "Tipo",
    propsColDefault: "Default",
    propsColDescription: "Descricao",
    selectedLabel: "Selecionadas",
    noneLabel: "(nenhuma)"
  },
  "en-US": {
    headerSubtitle:
      "Multi-select variant where selected items become removable chips in the trigger. The checkbox dropdown and search are the same as SgMultiSelect.",
    section1Title: "1) Basic (empty / with chips)",
    section1Description: "Click the field to open. Each selected item becomes a chip with a remove button.",
    section2Title: "2) Searchable",
    section2Description: "searchable enables a search field at the top of the dropdown.",
    section3Title: "3) Clearable and capped",
    section3Description: "clearable adds the clear button; maxSelected caps the number of items.",
    section4Title: "4) Disabled",
    section4Description: "With enabled={false} the field neither opens nor removes chips.",
    propsTitle: "Props Reference",
    propsDescription: "Public properties of SgMultiSelectChips.",
    propsColProp: "Prop",
    propsColType: "Type",
    propsColDefault: "Default",
    propsColDescription: "Description",
    selectedLabel: "Selected",
    noneLabel: "(none)"
  },
  es: {
    headerSubtitle:
      "Variante del multi-select donde los items seleccionados se vuelven chips removibles en el trigger. El dropdown con checkboxes y la busqueda son iguales a SgMultiSelect.",
    section1Title: "1) Basico (vacio / con chips)",
    section1Description: "Haz clic en el campo para abrir. Cada item seleccionado se vuelve un chip con boton de quitar.",
    section2Title: "2) Con busqueda",
    section2Description: "searchable habilita un campo de busqueda en la parte superior del dropdown.",
    section3Title: "3) Limpiable y con limite",
    section3Description: "clearable agrega el boton de limpiar; maxSelected limita la cantidad de items.",
    section4Title: "4) Deshabilitado",
    section4Description: "Con enabled={false} el campo no abre ni quita chips.",
    propsTitle: "Referencia de Props",
    propsDescription: "Propiedades publicas de SgMultiSelectChips.",
    propsColProp: "Prop",
    propsColType: "Tipo",
    propsColDefault: "Por defecto",
    propsColDescription: "Descripcion",
    selectedLabel: "Seleccionadas",
    noneLabel: "(ninguna)"
  }
};

type SupportedLocale = keyof typeof CHIPS_TEXTS;

function isSupported(locale: ShowcaseLocale): locale is SupportedLocale {
  return locale === "pt-BR" || locale === "pt-PT" || locale === "en-US" || locale === "es";
}

function getTexts(locale: ShowcaseLocale): ChipsTexts {
  return CHIPS_TEXTS[isSupported(locale) ? locale : "en-US"];
}

function Selected(props: { label: string; none: string; value: SgMultiSelectOptionValue[] }) {
  return (
    <div className="mt-2 w-full rounded border border-border bg-foreground/5 p-2 text-xs">
      <strong>{props.label}:</strong> {props.value.length ? props.value.join(", ") : props.none}
    </div>
  );
}

export default function SgMultiSelectChipsPage() {
  const i18n = useShowcaseI18n();
  const aiComponent = useAiManifestComponent("SgMultiSelectChips");
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
          title="SgMultiSelectChips"
          subtitle={texts.headerSubtitle}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section title={texts.section1Title} description={texts.section1Description}>
          <div className="w-96">
            <SgMultiSelectChips
              id="msc-empty"
              label="Empresas"
              placeholder="Selecione as empresas"
              options={COMPANIES}
              value={empty}
              onChange={setEmpty}
            />
            <Selected label={texts.selectedLabel} none={texts.noneLabel} value={empty} />
          </div>
          <div className="w-96">
            <SgMultiSelectChips
              id="msc-preselected"
              label="Empresas (com selecao)"
              placeholder="Selecione as empresas"
              options={COMPANIES}
              value={preselected}
              onChange={setPreselected}
            />
            <Selected label={texts.selectedLabel} none={texts.noneLabel} value={preselected} />
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-multi-select-chips/samples/basico.tsx.sample" />
        </Section>

        <Section title={texts.section2Title} description={texts.section2Description}>
          <div className="w-96">
            <SgMultiSelectChips
              id="msc-searchable"
              label="Empresas"
              placeholder="Selecione as empresas"
              options={COMPANIES}
              value={searchable}
              onChange={setSearchable}
              searchable
            />
            <Selected label={texts.selectedLabel} none={texts.noneLabel} value={searchable} />
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-multi-select-chips/samples/com-busca.tsx.sample" />
        </Section>

        <Section title={texts.section3Title} description={texts.section3Description}>
          <div className="w-96">
            <SgMultiSelectChips
              id="msc-capped"
              label="Empresas (max 3)"
              placeholder="Selecione ate 3 empresas"
              options={COMPANIES}
              value={capped}
              onChange={setCapped}
              clearable
              maxSelected={3}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              <SgButton size="sm" appearance="outline" onClick={() => setCapped([])}>
                Clear
              </SgButton>
            </div>
            <Selected label={texts.selectedLabel} none={texts.noneLabel} value={capped} />
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-multi-select-chips/samples/limpavel-e-com-limite.tsx.sample" />
        </Section>

        <Section title={texts.section4Title} description={texts.section4Description}>
          <div className="w-96">
            <SgMultiSelectChips
              id="msc-disabled"
              label="Empresas"
              placeholder="Selecione as empresas"
              options={COMPANIES}
              value={["e1", "e3"]}
              enabled={false}
            />
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-multi-select-chips/samples/desabilitado.tsx.sample" />
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
