"use client";

import React from "react";
import {
  SgPickList,
  type SgPickListItem,
  type SgPickListRef,
  SgButton,
  SgGrid,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import { Bell, Landmark, RefreshCw, Star } from "lucide-react";
import SgCodeBlockBase from "../sgCodeBlockBase";
import I18NReady from "../I18NReady";
import ComponentAiPropsTable from "../ai/ComponentAiPropsTable";
import ComponentAiSummary from "../ai/ComponentAiSummary";
import { useAiManifestComponent } from "../ai/useAiManifestComponent";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../useShowcaseAnchors";
import { t, useShowcaseI18n } from "../../../i18n";

const K = "showcase.component.pickList";

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
  | "target"
  | "value"
  | "onChange"
  | "sourceSelection"
  | "targetSelection"
  | "onSourceSelectionChange"
  | "onTargetSelectionChange"
  | "selectionMode"
  | "sourceHeader"
  | "targetHeader"
  | "showTransferControls"
  | "showSourceControls"
  | "showTargetControls"
  | "showSourceFilter"
  | "showTargetFilter"
  | "sourceFilterPlaceholder"
  | "targetFilterPlaceholder"
  | "filterMatchMode"
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

const PICK_LIST_PROP_FIELDS: PropField[] = [
  { prop: "id", type: "string", defaultValue: "-", descriptionKey: "id" },
  { prop: "title", type: "string", defaultValue: "-", descriptionKey: "title" },
  { prop: "source", type: "SgPickListItem[]", defaultValue: "-", descriptionKey: "source" },
  { prop: "target", type: "SgPickListItem[]", defaultValue: "-", descriptionKey: "target" },
  { prop: "value", type: "SgPickListValue", defaultValue: "-", descriptionKey: "value" },
  { prop: "onChange", type: "(event) => void", defaultValue: "-", descriptionKey: "onChange" },
  { prop: "sourceSelection", type: "(string | number)[]", defaultValue: "-", descriptionKey: "sourceSelection" },
  { prop: "targetSelection", type: "(string | number)[]", defaultValue: "-", descriptionKey: "targetSelection" },
  { prop: "onSourceSelectionChange", type: "(values) => void", defaultValue: "-", descriptionKey: "onSourceSelectionChange" },
  { prop: "onTargetSelectionChange", type: "(values) => void", defaultValue: "-", descriptionKey: "onTargetSelectionChange" },
  { prop: "selectionMode", type: "\"single\" | \"multiple\"", defaultValue: "\"multiple\"", descriptionKey: "selectionMode" },
  { prop: "sourceHeader", type: "string", defaultValue: "i18n", descriptionKey: "sourceHeader" },
  { prop: "targetHeader", type: "string", defaultValue: "i18n", descriptionKey: "targetHeader" },
  { prop: "showTransferControls", type: "boolean", defaultValue: "true", descriptionKey: "showTransferControls" },
  { prop: "showSourceControls", type: "boolean", defaultValue: "true", descriptionKey: "showSourceControls" },
  { prop: "showTargetControls", type: "boolean", defaultValue: "true", descriptionKey: "showTargetControls" },
  { prop: "showSourceFilter", type: "boolean", defaultValue: "false", descriptionKey: "showSourceFilter" },
  { prop: "showTargetFilter", type: "boolean", defaultValue: "false", descriptionKey: "showTargetFilter" },
  { prop: "sourceFilterPlaceholder", type: "string", defaultValue: "i18n", descriptionKey: "sourceFilterPlaceholder" },
  { prop: "targetFilterPlaceholder", type: "string", defaultValue: "i18n", descriptionKey: "targetFilterPlaceholder" },
  { prop: "filterMatchMode", type: "\"contains\" | \"startsWith\" | \"endsWith\"", defaultValue: "\"contains\"", descriptionKey: "filterMatchMode" },
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
  { prop: "ref", type: "SgPickListRef", defaultValue: "-", descriptionKey: "ref" }
];





const ROADMAP_SOURCE: SgPickListItem[] = [
  { label: "Authentication", value: "auth" },
  { label: "Dashboard", value: "dashboard" },
  { label: "Notifications", value: "notifications" },
  { label: "Audit logs", value: "audit" },
  { label: "Billing", value: "billing" }
];

export default function SgPickListShowcase() {
  const i18n = useShowcaseI18n();
  const texts = React.useMemo(() => ({
    subtitle: t(i18n, `${K}.subtitle`),
    sectionTitles: [
      t(i18n, `${K}.sectionTitles.0`),
      t(i18n, `${K}.sectionTitles.1`),
      t(i18n, `${K}.sectionTitles.2`),
      t(i18n, `${K}.sectionTitles.3`),
      t(i18n, `${K}.sectionTitles.4`),
      t(i18n, `${K}.sectionTitles.5`),
      t(i18n, `${K}.sectionTitles.6`)
    ] as const,
    propsTitle: t(i18n, `${K}.propsTitle`),
    currentStateLabel: t(i18n, `${K}.currentStateLabel`),
    transferOnlyHint: t(i18n, `${K}.transferOnlyHint`),
    dragHint: t(i18n, `${K}.dragHint`)
  }), [i18n]);
  const propDescriptions = React.useMemo(() => ({
    id: t(i18n, `${K}.propDescriptions.id`),
    title: t(i18n, `${K}.propDescriptions.title`),
    source: t(i18n, `${K}.propDescriptions.source`),
    target: t(i18n, `${K}.propDescriptions.target`),
    value: t(i18n, `${K}.propDescriptions.value`),
    onChange: t(i18n, `${K}.propDescriptions.onChange`),
    sourceSelection: t(i18n, `${K}.propDescriptions.sourceSelection`),
    targetSelection: t(i18n, `${K}.propDescriptions.targetSelection`),
    onSourceSelectionChange: t(i18n, `${K}.propDescriptions.onSourceSelectionChange`),
    onTargetSelectionChange: t(i18n, `${K}.propDescriptions.onTargetSelectionChange`),
    selectionMode: t(i18n, `${K}.propDescriptions.selectionMode`),
    sourceHeader: t(i18n, `${K}.propDescriptions.sourceHeader`),
    targetHeader: t(i18n, `${K}.propDescriptions.targetHeader`),
    showTransferControls: t(i18n, `${K}.propDescriptions.showTransferControls`),
    showSourceControls: t(i18n, `${K}.propDescriptions.showSourceControls`),
    showTargetControls: t(i18n, `${K}.propDescriptions.showTargetControls`),
    showSourceFilter: t(i18n, `${K}.propDescriptions.showSourceFilter`),
    showTargetFilter: t(i18n, `${K}.propDescriptions.showTargetFilter`),
    sourceFilterPlaceholder: t(i18n, `${K}.propDescriptions.sourceFilterPlaceholder`),
    targetFilterPlaceholder: t(i18n, `${K}.propDescriptions.targetFilterPlaceholder`),
    filterMatchMode: t(i18n, `${K}.propDescriptions.filterMatchMode`),
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
  const aiComponent = useAiManifestComponent("SgPickList");
  const propRows = React.useMemo<ShowcasePropRow[]>(
    () =>
      PICK_LIST_PROP_FIELDS.map((field) => ({
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

  const [basicValue, setBasicValue] = React.useState({ source: ROADMAP_SOURCE, target: [] as SgPickListItem[] });
  const [filterValue, setFilterValue] = React.useState({
    source: [
      { label: "Berlin", value: "berlin" },
      { label: "Boston", value: "boston" },
      { label: "Lisbon", value: "lisbon" },
      { label: "Madrid", value: "madrid" },
      { label: "Sao Paulo", value: "sao-paulo" }
    ] as SgPickListItem[],
    target: [] as SgPickListItem[]
  });
  const [transferOnlyValue, setTransferOnlyValue] = React.useState({
    source: [
      { label: "Backlog", value: "backlog", icon: <Landmark className="h-4 w-4" /> },
      { label: "In progress", value: "in-progress", icon: <RefreshCw className="h-4 w-4" /> },
      { label: "Review", value: "review", icon: <Bell className="h-4 w-4" /> }
    ] as SgPickListItem[],
    target: [
      { label: "Done", value: "done", icon: <Star className="h-4 w-4" /> }
    ] as SgPickListItem[]
  });
  const [reorderValue, setReorderValue] = React.useState({
    source: [
      { label: "Task A", value: "task-a" },
      { label: "Task B", value: "task-b" },
      { label: "Task C", value: "task-c" }
    ] as SgPickListItem[],
    target: [
      { label: "Done X", value: "done-x" },
      { label: "Done Y", value: "done-y" }
    ] as SgPickListItem[]
  });
  const [templateValue, setTemplateValue] = React.useState({
    source: [
      { label: "Frontend", value: "frontend", data: { owner: "Ana", effort: "M" } },
      { label: "Backend", value: "backend", data: { owner: "Bruno", effort: "L" } },
      { label: "QA", value: "qa", data: { owner: "Carla", effort: "S" }, disabled: true }
    ] as SgPickListItem[],
    target: [] as SgPickListItem[]
  });
  const [externalValue, setExternalValue] = React.useState({
    source: [
      { label: "Email", value: "email" },
      { label: "SMS", value: "sms" },
      { label: "Push", value: "push" }
    ] as SgPickListItem[],
    target: [] as SgPickListItem[]
  });

  const pickListRef = React.useRef<SgPickListRef>(null);

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-6xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgPickList"
          subtitle={texts.subtitle}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section title={texts.sectionTitles[0]}>
          <SgPickList
            id="pick-basic"
            title="Roadmap planning"
            source={ROADMAP_SOURCE}
            target={[]}
            value={basicValue}
            onChange={(event) => setBasicValue({ source: event.source, target: event.target })}
          />
          <p className="text-sm text-[rgb(var(--sg-muted))]">
            {texts.currentStateLabel}: source [{basicValue.source.length}] | target [{basicValue.target.length}]
          </p>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-pick-list/samples/basico.tsx.sample" />
        </Section>

        <Section title={texts.sectionTitles[1]}>
          <SgPickList
            id="pick-filter"
            title="Cities"
            source={filterValue.source}
            target={filterValue.target}
            value={filterValue}
            onChange={(event) => setFilterValue({ source: event.source, target: event.target })}
            showSourceFilter
            showTargetFilter
            sourceHeader="Available"
            targetHeader="Selected"
          />
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-pick-list/samples/com-filtros.tsx.sample" />
        </Section>

        <Section title={texts.sectionTitles[2]}>
          <SgPickList
            id="pick-transfer-only"
            title="Transfer only"
            source={transferOnlyValue.source}
            target={transferOnlyValue.target}
            value={transferOnlyValue}
            onChange={(event) => setTransferOnlyValue({ source: event.source, target: event.target })}
            showSourceControls={false}
            showTargetControls={false}
            draggable={false}
          />
          <p className="text-xs text-muted-foreground">
            {texts.transferOnlyHint}
          </p>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-pick-list/samples/somente-transferencia-sem-ordenacao.tsx.sample" />
        </Section>

        <Section title={texts.sectionTitles[3]}>
          <p className="text-sm text-muted-foreground">{texts.dragHint}</p>
          <SgPickList
            id="pick-reorder"
            title="Sprint board"
            source={reorderValue.source}
            target={reorderValue.target}
            value={reorderValue}
            onChange={(event) => setReorderValue({ source: event.source, target: event.target })}
            showSourceControls
            showTargetControls
            draggable
          />
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-pick-list/samples/reordenacao-com-controles-de-lista.tsx.sample" />
        </Section>

        <Section title={texts.sectionTitles[4]}>
          <SgPickList
            ref={pickListRef}
            id="pick-ref"
            title="Channels"
            source={externalValue.source}
            target={externalValue.target}
            value={externalValue}
            onChange={(event) => setExternalValue({ source: event.source, target: event.target })}
            showTransferControls={false}
            selectionMode="multiple"
          />
          <SgGrid columns={{ base: 2, md: 4 }} gap={8}>
            <SgButton onClick={() => pickListRef.current?.moveToTarget()}>Move &gt;</SgButton>
            <SgButton onClick={() => pickListRef.current?.moveAllToTarget()}>Move &gt;&gt;</SgButton>
            <SgButton onClick={() => pickListRef.current?.moveToSource()}>Move &lt;</SgButton>
            <SgButton onClick={() => pickListRef.current?.moveAllToSource()}>Move &lt;&lt;</SgButton>
          </SgGrid>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-pick-list/samples/controles-externos-por-ref.tsx.sample" />
        </Section>

        <Section title={texts.sectionTitles[5]}>
          <SgPickList
            id="pick-template"
            title="Team capacity"
            source={templateValue.source}
            target={templateValue.target}
            value={templateValue}
            onChange={(event) => setTemplateValue({ source: event.source, target: event.target })}
            itemTemplate={(item) => {
              const meta = item.data as { owner: string; effort: string } | undefined;
              return (
                <SgGrid columns={{ base: 1, sm: 2 }} gap={8} className="w-full">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-xs text-[rgb(var(--sg-muted))]">
                    {"Owner: " + (meta?.owner ?? "-") + " | Effort: " + (meta?.effort ?? "-")}
                  </span>
                </SgGrid>
              );
            }}
          />
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-pick-list/samples/item-template-customizado.tsx.sample" />
        </Section>

        <Section title={texts.sectionTitles[6]}>
          <SgPlayground
            title="SgPickList Playground"
            interactive
            codeContract="appFile"
            playgroundFile="apps/showcase/src/app/components/sg-pick-list/sg-pick-list.tsx.playground"
            height={700}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={propRows} title={texts.propsTitle} />
        {aiComponent ? <ComponentAiPropsTable component={aiComponent} /> : null}
      <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}

