"use client";

import React from "react";
import {
  SgOrderList,
  type SgOrderListItem,
  type SgOrderListRef,
  SgButton,
  SgGrid,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import { Bell, Heart, Landmark, RefreshCw, Star } from "lucide-react";
import SgCodeBlockBase from "../sgCodeBlockBase";
import I18NReady from "../I18NReady";
import ComponentAiPropsTable from "../ai/ComponentAiPropsTable";
import ComponentAiSummary from "../ai/ComponentAiSummary";
import { useAiManifestComponent } from "../ai/useAiManifestComponent";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../useShowcaseAnchors";
import { t, useShowcaseI18n } from "../../../i18n";

const K = "showcase.component.orderList";

function Section(props: { title: string; description?: string; children: React.ReactNode; example?: boolean }) {
  return (
    <section
      data-showcase-example={props.example === false ? undefined : "true"}
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





type PropDescriptionKey =
  | "id"
  | "title"
  | "source"
  | "value"
  | "onChange"
  | "selectedValues"
  | "onSelectionChange"
  | "selectionMode"
  | "showControls"
  | "controlsPosition"
  | "draggable"
  | "disabled"
  | "readOnly"
  | "emptyMessage"
  | "itemTemplate"
  | "className"
  | "style"
  | "listClassName"
  | "itemClassName"
  | "groupBoxProps"
  | "ref";

type PropField = {
  prop: string;
  type: string;
  defaultValue: string;
  descriptionKey: PropDescriptionKey;
};

const ORDER_LIST_PROP_FIELDS: PropField[] = [
  { prop: "id", type: "string", defaultValue: "-", descriptionKey: "id" },
  { prop: "title", type: "string", defaultValue: "-", descriptionKey: "title" },
  { prop: "source", type: "SgOrderListItem[]", defaultValue: "-", descriptionKey: "source" },
  { prop: "value", type: "SgOrderListItem[]", defaultValue: "-", descriptionKey: "value" },
  { prop: "onChange", type: "(items) => void", defaultValue: "-", descriptionKey: "onChange" },
  { prop: "selectedValues", type: "(string | number)[]", defaultValue: "-", descriptionKey: "selectedValues" },
  { prop: "onSelectionChange", type: "(values) => void", defaultValue: "-", descriptionKey: "onSelectionChange" },
  { prop: "selectionMode", type: "\"single\" | \"multiple\"", defaultValue: "\"multiple\"", descriptionKey: "selectionMode" },
  { prop: "showControls", type: "boolean", defaultValue: "true", descriptionKey: "showControls" },
  { prop: "controlsPosition", type: "\"left\" | \"right\"", defaultValue: "\"left\"", descriptionKey: "controlsPosition" },
  { prop: "draggable", type: "boolean", defaultValue: "true", descriptionKey: "draggable" },
  { prop: "disabled", type: "boolean", defaultValue: "false", descriptionKey: "disabled" },
  { prop: "readOnly", type: "boolean", defaultValue: "false", descriptionKey: "readOnly" },
  { prop: "emptyMessage", type: "string", defaultValue: "i18n", descriptionKey: "emptyMessage" },
  { prop: "itemTemplate", type: "(item, state) => ReactNode", defaultValue: "-", descriptionKey: "itemTemplate" },
  { prop: "className", type: "string", defaultValue: "-", descriptionKey: "className" },
  { prop: "style", type: "React.CSSProperties", defaultValue: "-", descriptionKey: "style" },
  { prop: "listClassName", type: "string", defaultValue: "-", descriptionKey: "listClassName" },
  { prop: "itemClassName", type: "string", defaultValue: "-", descriptionKey: "itemClassName" },
  { prop: "groupBoxProps", type: "Partial<SgGroupBoxProps>", defaultValue: "-", descriptionKey: "groupBoxProps" },
  { prop: "ref", type: "SgOrderListRef", defaultValue: "-", descriptionKey: "ref" }
];





const PRODUCT_ITEMS: SgOrderListItem[] = [
  { label: "Notebook", value: "notebook", icon: <Landmark className="h-4 w-4" /> },
  { label: "Mouse", value: "mouse", icon: <RefreshCw className="h-4 w-4" /> },
  { label: "Teclado", value: "keyboard", icon: <Bell className="h-4 w-4" /> },
  { label: "Monitor", value: "monitor", icon: <Star className="h-4 w-4" /> },
  { label: "Webcam", value: "webcam", icon: <Heart className="h-4 w-4" /> }
];

const PIPELINE_STEPS: SgOrderListItem[] = [
  { label: "Prospeccao", value: "lead" },
  { label: "Qualificacao", value: "qualify" },
  { label: "Proposta", value: "proposal" },
  { label: "Negociacao", value: "negotiation" },
  { label: "Fechamento", value: "close" }
];

const TEAM_ITEMS: SgOrderListItem[] = [
  { label: "Ana - Produto", value: "ana" },
  { label: "Bruno - Design", value: "bruno" },
  { label: "Carla - Frontend", value: "carla" },
  { label: "Diego - Backend", value: "diego" },
  { label: "Elaine - QA", value: "elaine" }
];

const BACKLOG_ITEMS: SgOrderListItem[] = [
  { label: "Implementar filtros", value: "filtros", data: { effort: "M", priority: "Alta" } },
  { label: "Ajustar layout mobile", value: "mobile", data: { effort: "S", priority: "Media" } },
  { label: "Refatorar API de pedidos", value: "api", data: { effort: "L", priority: "Alta" } },
  { label: "Atualizar testes E2E", value: "e2e", data: { effort: "M", priority: "Baixa" }, disabled: true }
];

export default function SgOrderListShowcase() {
  const i18n = useShowcaseI18n();
  const texts = React.useMemo(() => ({
    subtitle: t(i18n, `${K}.subtitle`),
    sectionTitles: [
      t(i18n, `${K}.sectionTitles.0`),
      t(i18n, `${K}.sectionTitles.1`),
      t(i18n, `${K}.sectionTitles.2`),
      t(i18n, `${K}.sectionTitles.3`),
      t(i18n, `${K}.sectionTitles.4`),
      t(i18n, `${K}.sectionTitles.5`)
    ] as const,
    propsReferenceTitle: t(i18n, `${K}.propsReferenceTitle`)
  }), [i18n]);
  const propDescriptions = React.useMemo(() => ({
    id: t(i18n, `${K}.propDescriptions.id`),
    title: t(i18n, `${K}.propDescriptions.title`),
    source: t(i18n, `${K}.propDescriptions.source`),
    value: t(i18n, `${K}.propDescriptions.value`),
    onChange: t(i18n, `${K}.propDescriptions.onChange`),
    selectedValues: t(i18n, `${K}.propDescriptions.selectedValues`),
    onSelectionChange: t(i18n, `${K}.propDescriptions.onSelectionChange`),
    selectionMode: t(i18n, `${K}.propDescriptions.selectionMode`),
    showControls: t(i18n, `${K}.propDescriptions.showControls`),
    controlsPosition: t(i18n, `${K}.propDescriptions.controlsPosition`),
    draggable: t(i18n, `${K}.propDescriptions.draggable`),
    disabled: t(i18n, `${K}.propDescriptions.disabled`),
    readOnly: t(i18n, `${K}.propDescriptions.readOnly`),
    emptyMessage: t(i18n, `${K}.propDescriptions.emptyMessage`),
    itemTemplate: t(i18n, `${K}.propDescriptions.itemTemplate`),
    className: t(i18n, `${K}.propDescriptions.className`),
    style: t(i18n, `${K}.propDescriptions.style`),
    listClassName: t(i18n, `${K}.propDescriptions.listClassName`),
    itemClassName: t(i18n, `${K}.propDescriptions.itemClassName`),
    groupBoxProps: t(i18n, `${K}.propDescriptions.groupBoxProps`),
    ref: t(i18n, `${K}.propDescriptions.ref`)
  }), [i18n]);
  const aiComponent = useAiManifestComponent("SgOrderList");
  const orderListProps = React.useMemo<ShowcasePropRow[]>(
    () =>
      ORDER_LIST_PROP_FIELDS.map((field) => ({
        prop: field.prop,
        type: field.type,
        defaultValue: field.defaultValue,
        description: propDescriptions[field.descriptionKey]
      })),
    [propDescriptions]
  );

  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors({
    deps: [i18n.locale]
  });

  const [basicItems, setBasicItems] = React.useState<SgOrderListItem[]>(PRODUCT_ITEMS);
  const [pipelineItems, setPipelineItems] = React.useState<SgOrderListItem[]>(PIPELINE_STEPS);
  const [teamItems, setTeamItems] = React.useState<SgOrderListItem[]>(TEAM_ITEMS);
  const [backlogItems, setBacklogItems] = React.useState<SgOrderListItem[]>(BACKLOG_ITEMS);
  const [controlledItems, setControlledItems] = React.useState<SgOrderListItem[]>(PRODUCT_ITEMS);

  const pipelineRef = React.useRef<SgOrderListRef>(null);

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-6xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgOrderList"
          subtitle={texts.subtitle}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section title={texts.sectionTitles[0]}>
          <SgOrderList
            id="order-basic"
            title="Produtos"
            source={PRODUCT_ITEMS}
            value={basicItems}
            onChange={setBasicItems}
          />
          <p className="text-sm text-[rgb(var(--sg-muted))]">
            Ordem atual: <strong>{basicItems.map((item) => item.label).join(" > ")}</strong>
          </p>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-order-list/samples/basico-controles-internos.tsx.sample" />
        </Section>

        <Section title={texts.sectionTitles[1]}>
          <SgOrderList
            ref={pipelineRef}
            id="order-ref"
            title="Etapas do pipeline"
            source={PIPELINE_STEPS}
            value={pipelineItems}
            onChange={setPipelineItems}
            selectionMode="multiple"
            showControls={false}
          />
          <SgGrid columns={{ base: 2, md: 5 }} gap={8}>
            <SgButton onClick={() => pipelineRef.current?.moveTop()}>Move Top</SgButton>
            <SgButton onClick={() => pipelineRef.current?.moveUp()}>Move Up</SgButton>
            <SgButton onClick={() => pipelineRef.current?.moveDown()}>Move Down</SgButton>
            <SgButton onClick={() => pipelineRef.current?.moveBottom()}>Move Bottom</SgButton>
            <SgButton onClick={() => pipelineRef.current?.clearSelection()}>Clear Selection</SgButton>
          </SgGrid>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-order-list/samples/selecao-multipla-controles-externos-ref.tsx.sample" />
        </Section>

        <Section title={texts.sectionTitles[2]}>
          <SgOrderList
            id="order-drag"
            title="Time de atendimento"
            source={TEAM_ITEMS}
            value={teamItems}
            onChange={setTeamItems}
            showControls={false}
            draggable
          />
          <p className="text-xs text-muted-foreground">
            Dica: arraste os itens para reordenar, sem usar os botoes.
          </p>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-order-list/samples/drag-and-drop-sem-botoes.tsx.sample" />
        </Section>

        <Section title={texts.sectionTitles[3]}>
          <SgOrderList
            id="order-template"
            title="Backlog da sprint"
            source={BACKLOG_ITEMS}
            value={backlogItems}
            onChange={setBacklogItems}
            controlsPosition="right"
            itemTemplate={(item) => {
              const meta = item.data as { effort: string; priority: string } | undefined;
              return (
                <SgGrid columns={{ base: 1, sm: 2 }} gap={8} className="w-full">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-xs text-[rgb(var(--sg-muted))]">
                    {"Prioridade: " + (meta?.priority ?? "-") + " | Esforco: " + (meta?.effort ?? "-")}
                  </span>
                </SgGrid>
              );
            }}
          />
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-order-list/samples/item-template-customizado-e-item-desabilitado.tsx.sample" />
        </Section>

        <Section title={texts.sectionTitles[4]}>
          <SgGrid columns={{ base: 1, md: 3 }} gap={8}>
            <SgButton onClick={() => setControlledItems(PRODUCT_ITEMS)}>Reset</SgButton>
            <SgButton onClick={() => setControlledItems((prev) => [...prev].reverse())}>Reverse</SgButton>
            <SgButton onClick={() => setControlledItems((prev) => [...prev].sort((a, b) => a.label.localeCompare(b.label)))}>
              Sort A-Z
            </SgButton>
          </SgGrid>
          <SgOrderList
            id="order-controlled"
            title="Produtos (controlado)"
            source={PRODUCT_ITEMS}
            value={controlledItems}
            onChange={setControlledItems}
          />
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-order-list/samples/ordem-controlada-por-estado-externo.tsx.sample" />
        </Section>

        <Section title={texts.sectionTitles[5]}>
          <SgPlayground
            title="SgOrderList Playground"
            interactive
            codeContract="appFile"
            playgroundFile="apps/showcase/src/app/components/sg-order-list/sg-order-list.tsx.playground"
            height={650}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={orderListProps} title={texts.propsReferenceTitle} />
        {aiComponent ? <ComponentAiPropsTable component={aiComponent} /> : null}
      <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}

