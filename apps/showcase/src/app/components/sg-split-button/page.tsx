"use client";

import React from "react";
import {
  Save,
  RefreshCw,
  Trash2,
  Home,
  Plus,
  Download,
  Upload,
  Copy,
  Printer,
  Share2,
  Mail,
  FileText
} from "lucide-react";
import { SgGrid, SgSplitButton } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import SgCodeBlockBase from "../sgCodeBlockBase";
import I18NReady from "../I18NReady";
import ComponentAiPropsTable from "../ai/ComponentAiPropsTable";
import ComponentAiSummary from "../ai/ComponentAiSummary";
import { useAiManifestComponent } from "../ai/useAiManifestComponent";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../useShowcaseAnchors";
import { t, useShowcaseI18n } from "../../../i18n";

const K = "showcase.component.splitButton";

const SEVERITIES = ["primary", "secondary", "success", "info", "warning", "help", "danger"] as const;

function Section(props: { id: string; title: string; description: string; children: React.ReactNode }) {
  return (
    <section
      id={props.id}
      data-showcase-example="true"
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{props.description}</p>
      <div className="mt-4 space-y-3">{props.children}</div>
    </section>
  );
}

function Row(props: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center gap-3">{props.children}</div>;
}

function CodeBlock(props: { sampleFile: string }) {
  return <SgCodeBlockBase sampleFile={props.sampleFile} />;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}




const SPLIT_BUTTON_PLAYGROUND_CODE = `import * as React from "react";
import {
  Save,
  RefreshCw,
  Trash2,
} from "lucide-react";
import {
  SgGrid,
  SgSplitButton,
  SgButton,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

const items = [
  { label: "Update", icon: <RefreshCw className="size-4" />, onClick: () => {} },
  { label: "Delete", icon: <Trash2 className="size-4" />, onClick: () => {} },
];

export default function App() {
  const [severity, setSeverity] = React.useState<"primary" | "success" | "danger">("primary");
  const [appearance, setAppearance] = React.useState<"solid" | "outline" | "ghost">("solid");
  const [size, setSize] = React.useState<"sm" | "md" | "lg">("md");
  const [loading, setLoading] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);

  return (
    <div className="space-y-4 p-2">
      <SgGrid columns={{ base: 1, sm: 2, md: 3 }} gap={8}>
        <SgButton size="sm" appearance="outline" onClick={() => setSeverity("primary")}>primary</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setSeverity("success")}>success</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setSeverity("danger")}>danger</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setAppearance("solid")}>solid</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setAppearance("outline")}>outline</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setAppearance("ghost")}>ghost</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setSize("sm")}>sm</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setSize("md")}>md</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setSize("lg")}>lg</SgButton>
        <SgButton size="sm" appearance={loading ? "solid" : "outline"} onClick={() => setLoading((prev) => !prev)}>
          loading: {String(loading)}
        </SgButton>
        <SgButton size="sm" appearance={disabled ? "solid" : "outline"} onClick={() => setDisabled((prev) => !prev)}>
          disabled: {String(disabled)}
        </SgButton>
      </SgGrid>

      <SgSplitButton
        label="Preview"
        leftIcon={<Save className="size-4" />}
        severity={severity}
        appearance={appearance}
        size={size}
        loading={loading}
        disabled={disabled}
        onClick={() => {}}
        items={items}
      />
    </div>
  );
}`;

const SPLIT_BUTTON_PROPS: ShowcasePropRow[] = [
  { prop: "label", type: "string", defaultValue: "-", description: "Main action button label." },
  { prop: "items", type: "SplitButtonItem[]", defaultValue: "-", description: "Dropdown menu items." },
  { prop: "onClick", type: "() => void", defaultValue: "-", description: "Main action callback." },
  { prop: "severity", type: '"primary" | "secondary" | "success" | "info" | "warning" | "help" | "danger"', defaultValue: '"primary"', description: "Visual severity theme." },
  { prop: "appearance", type: '"solid" | "outline" | "ghost"', defaultValue: '"solid"', description: "Visual appearance style." },
  { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: '"md"', description: "Component size." },
  { prop: "leftIcon", type: "ReactNode", defaultValue: "-", description: "Icon in the main button." },
  { prop: "elevation", type: '"none" | "sm" | "md" | "lg"', defaultValue: '"none"', description: "Shadow elevation level." },
  { prop: "disabled", type: "boolean", defaultValue: "false", description: "Disables main action and menu." },
  { prop: "loading", type: "boolean", defaultValue: "false", description: "Shows loading spinner in main action." },
  { prop: "className / style", type: "string / React.CSSProperties", defaultValue: "-", description: "Visual customization of the split button container." }
];

export default function SgSplitButtonShowcase() {
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
      t(i18n, `${K}.sectionTitles.6`),
      t(i18n, `${K}.sectionTitles.7`),
      t(i18n, `${K}.sectionTitles.8`),
      t(i18n, `${K}.sectionTitles.9`),
      t(i18n, `${K}.sectionTitles.10`),
      t(i18n, `${K}.sectionTitles.11`)
    ],
    sectionDescriptions: [
      t(i18n, `${K}.sectionDescriptions.0`),
      t(i18n, `${K}.sectionDescriptions.1`),
      t(i18n, `${K}.sectionDescriptions.2`),
      t(i18n, `${K}.sectionDescriptions.3`),
      t(i18n, `${K}.sectionDescriptions.4`),
      t(i18n, `${K}.sectionDescriptions.5`),
      t(i18n, `${K}.sectionDescriptions.6`),
      t(i18n, `${K}.sectionDescriptions.7`),
      t(i18n, `${K}.sectionDescriptions.8`),
      t(i18n, `${K}.sectionDescriptions.9`),
      t(i18n, `${K}.sectionDescriptions.10`),
      t(i18n, `${K}.sectionDescriptions.11`)
    ],
    labels: {
      save: t(i18n, `${K}.labels.save`),
      update: t(i18n, `${K}.labels.update`),
      delete: t(i18n, `${K}.labels.delete`),
      homepage: t(i18n, `${K}.labels.homepage`),
      file: t(i18n, `${K}.labels.file`),
      copy: t(i18n, `${K}.labels.copy`),
      print: t(i18n, `${K}.labels.print`),
      exportPdf: t(i18n, `${K}.labels.exportPdf`),
      shareEmail: t(i18n, `${K}.labels.shareEmail`),
      disabledOutline: t(i18n, `${K}.labels.disabledOutline`),
      saving: t(i18n, `${K}.labels.saving`),
      processing: t(i18n, `${K}.labels.processing`),
      actions: t(i18n, `${K}.labels.actions`),
      deleteDisabled: t(i18n, `${K}.labels.deleteDisabled`),
      newAction: t(i18n, `${K}.labels.newAction`),
      import: t(i18n, `${K}.labels.import`),
      downloadTemplate: t(i18n, `${K}.labels.downloadTemplate`),
      share: t(i18n, `${K}.labels.share`),
      small: t(i18n, `${K}.labels.small`),
      medium: t(i18n, `${K}.labels.medium`),
      large: t(i18n, `${K}.labels.large`),
      propsTitle: t(i18n, `${K}.labels.propsTitle`),
      playgroundTitle: t(i18n, `${K}.labels.playgroundTitle`)
    }
  }), [i18n]);
  const aiComponent = useAiManifestComponent("SgSplitButton");
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors({
    deps: [i18n.locale]
  });

  const basicItems = React.useMemo(() => ([
    { label: texts.labels.update, icon: <RefreshCw className="size-4" />, onClick: () => console.log(texts.labels.update) },
    { label: texts.labels.delete, icon: <Trash2 className="size-4" />, onClick: () => console.log(texts.labels.delete) },
    { label: texts.labels.homepage, icon: <Home className="size-4" />, onClick: () => console.log(texts.labels.homepage) }
  ]), [texts]);

  const fileItems = React.useMemo(() => ([
    { label: texts.labels.copy, icon: <Copy className="size-4" />, onClick: () => console.log(texts.labels.copy) },
    { label: texts.labels.print, icon: <Printer className="size-4" />, onClick: () => console.log(texts.labels.print) },
    { separator: true, label: texts.labels.exportPdf, icon: <FileText className="size-4" />, onClick: () => console.log(texts.labels.exportPdf) },
    { label: texts.labels.shareEmail, icon: <Mail className="size-4" />, onClick: () => console.log(texts.labels.shareEmail) }
  ]), [texts]);

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-4xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgSplitButton"
          subtitle={texts.subtitle}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section id="exemplo-1" title={texts.sectionTitles[0] ?? ""} description={texts.sectionDescriptions[0] ?? ""}>
          <Row>
            <SgSplitButton
              label={texts.labels.save}
              leftIcon={<Save className="size-4" />}
              onClick={() => console.log(texts.labels.save)}
              items={basicItems}
              style={{ minWidth: 180 }}
            />
          </Row>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-split-button/samples/basico.tsx.sample" />
        </Section>

        <Section id="exemplo-2" title={texts.sectionTitles[1] ?? ""} description={texts.sectionDescriptions[1] ?? ""}>
          <Row>
            {SEVERITIES.map((s) => (
              <SgSplitButton key={s} label={capitalize(s)} severity={s} onClick={() => console.log(s)} items={basicItems} />
            ))}
          </Row>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-split-button/samples/severidades.tsx.sample" />
        </Section>

        <Section id="exemplo-3" title={texts.sectionTitles[2] ?? ""} description={texts.sectionDescriptions[2] ?? ""}>
          <Row>
            {SEVERITIES.map((s) => (
              <SgSplitButton key={s} label={capitalize(s)} severity={s} appearance="outline" onClick={() => console.log(s)} items={basicItems} />
            ))}
          </Row>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-split-button/samples/outlined.tsx.sample" />
        </Section>

        <Section id="exemplo-4" title={texts.sectionTitles[3] ?? ""} description={texts.sectionDescriptions[3] ?? ""}>
          <Row>
            {SEVERITIES.map((s) => (
              <SgSplitButton key={s} label={capitalize(s)} severity={s} appearance="ghost" onClick={() => console.log(s)} items={basicItems} />
            ))}
          </Row>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-split-button/samples/ghost.tsx.sample" />
        </Section>

        <Section id="exemplo-5" title={texts.sectionTitles[4] ?? ""} description={texts.sectionDescriptions[4] ?? ""}>
          <Row>
            {SEVERITIES.map((s) => (
              <SgSplitButton key={s} label={capitalize(s)} severity={s} appearance="solid" elevation="sm" onClick={() => console.log(s)} items={basicItems} />
            ))}
          </Row>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-split-button/samples/elevated.tsx.sample" />
        </Section>

        <Section id="exemplo-6" title={texts.sectionTitles[5] ?? ""} description={texts.sectionDescriptions[5] ?? ""}>
          <Row>
            <SgSplitButton label={texts.labels.small} size="sm" leftIcon={<Save className="size-4" />} onClick={() => console.log("sm")} items={basicItems} />
            <SgSplitButton label={texts.labels.medium} size="md" leftIcon={<Save className="size-4" />} onClick={() => console.log("md")} items={basicItems} />
            <SgSplitButton label={texts.labels.large} size="lg" leftIcon={<Save className="size-4" />} onClick={() => console.log("lg")} items={basicItems} />
          </Row>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-split-button/samples/tamanhos.tsx.sample" />
        </Section>

        <Section id="exemplo-7" title={texts.sectionTitles[6] ?? ""} description={texts.sectionDescriptions[6] ?? ""}>
          <Row>
            <SgSplitButton label={texts.labels.save} leftIcon={<Save className="size-4" />} severity="primary" onClick={() => console.log(texts.labels.save)} items={basicItems} />
            <SgSplitButton
              label={texts.labels.newAction}
              leftIcon={<Plus className="size-4" />}
              severity="success"
              onClick={() => console.log(texts.labels.newAction)}
              items={[
                { label: texts.labels.import, icon: <Upload className="size-4" />, onClick: () => console.log(texts.labels.import) },
                { label: texts.labels.downloadTemplate, icon: <Download className="size-4" />, onClick: () => console.log(texts.labels.downloadTemplate) }
              ]}
            />
            <SgSplitButton label={texts.labels.share} leftIcon={<Share2 className="size-4" />} severity="info" onClick={() => console.log(texts.labels.share)} items={fileItems} />
          </Row>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-split-button/samples/com-icones.tsx.sample" />
        </Section>

        <Section id="exemplo-8" title={texts.sectionTitles[7] ?? ""} description={texts.sectionDescriptions[7] ?? ""}>
          <Row>
            <SgSplitButton label={texts.labels.file} leftIcon={<FileText className="size-4" />} severity="secondary" onClick={() => console.log(texts.labels.file)} items={fileItems} />
          </Row>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-split-button/samples/separadores-de-menu.tsx.sample" />
        </Section>

        <Section id="exemplo-9" title={texts.sectionTitles[8] ?? ""} description={texts.sectionDescriptions[8] ?? ""}>
          <Row>
            <SgSplitButton label={texts.labels.save} leftIcon={<Save className="size-4" />} disabled onClick={() => {}} items={basicItems} />
            <SgSplitButton label={texts.labels.disabledOutline} severity="danger" appearance="outline" disabled onClick={() => {}} items={basicItems} />
          </Row>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-split-button/samples/disabled.tsx.sample" />
        </Section>

        <Section id="exemplo-10" title={texts.sectionTitles[9] ?? ""} description={texts.sectionDescriptions[9] ?? ""}>
          <Row>
            <SgSplitButton label={texts.labels.saving} leftIcon={<Save className="size-4" />} loading onClick={() => {}} items={basicItems} />
            <SgSplitButton label={texts.labels.processing} severity="success" loading onClick={() => {}} items={basicItems} />
          </Row>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-split-button/samples/loading.tsx.sample" />
        </Section>

        <Section id="exemplo-11" title={texts.sectionTitles[10] ?? ""} description={texts.sectionDescriptions[10] ?? ""}>
          <Row>
            <SgSplitButton
              label={texts.labels.actions}
              severity="primary"
              onClick={() => console.log(texts.labels.actions)}
              items={[
                { label: texts.labels.update, icon: <RefreshCw className="size-4" />, onClick: () => console.log(texts.labels.update) },
                { label: texts.labels.deleteDisabled, icon: <Trash2 className="size-4" />, onClick: () => console.log(texts.labels.delete), disabled: true },
                { label: texts.labels.homepage, icon: <Home className="size-4" />, onClick: () => console.log(texts.labels.homepage) }
              ]}
            />
          </Row>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-split-button/samples/itens-desabilitados.tsx.sample" />
        </Section>

        <Section id="exemplo-12" title={texts.sectionTitles[11] ?? ""} description={texts.sectionDescriptions[11] ?? ""}>
          <SgPlayground
            title={texts.labels.playgroundTitle}
            interactive
            codeContract="appFile"
            playgroundFile="apps/showcase/src/app/components/sg-split-button/sg-split-button.tsx.playground"
            height={620}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference id="props-reference" title={texts.labels.propsTitle} rows={SPLIT_BUTTON_PROPS} />
        {aiComponent ? <ComponentAiPropsTable component={aiComponent} /> : null}
        {aiComponent ? <ComponentAiSummary component={aiComponent} /> : null}
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}


