"use client";

import React from "react";
import { SgPlayground } from "@seedgrid/fe-playground";
import SgCodeBlockBase from "../sgCodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../useShowcaseAnchors";
import { t, useShowcaseI18n } from "../../../i18n";

const K = "showcase.component.playground";

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section
      data-showcase-example="true"
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4">{props.children}</div>
    </section>
  );
}

function ExampleCodeCard(props: { sampleFile: string }) {
  return (
    <div className="mt-4">
      <SgCodeBlockBase sampleFile={props.sampleFile} />
    </div>
  );
}

const READONLY_CODE = `<SgButton severity="primary">Save</SgButton>
<SgButton appearance="outline">Cancel</SgButton>`;

const RENDER_BODY_CODE = `<SgStack gap={12}>
  <SgInputText id="name" label="Name" />
  <SgStack direction="row" gap={8}>
    <SgButton severity="primary">Save</SgButton>
    <SgButton appearance="outline">Cancel</SgButton>
  </SgStack>
</SgStack>`;

const APP_FILE_CODE = `import * as React from "react";
import { SgPlayground } from "@seedgrid/fe-playground";
import {
  SgCard,
  SgStack,
  SgInputText,
  SgButton,
} from "@seedgrid/fe-components";

export default function App() {
  const [name, setName] = React.useState("");

  return (
    <SgCard title="Quick Form" description="appFile mode example">
      <SgStack gap={12}>
        <SgInputText
          id="name"
          label="Name"
          value={name}
          onChange={setName}
        />
        <SgButton severity="primary" onClick={() => alert("Saved: " + name)}>
          Save
        </SgButton>
      </SgStack>
    </SgCard>
  );
}`;

function getPlaygroundProps(i18n: ReturnType<typeof useShowcaseI18n>): ShowcasePropRow[] {
  return [
    { prop: "title / description", type: "string", defaultValue: "- / -", description: t(i18n, `${K}.propHeaderDesc`) },
    { prop: "interactive", type: "boolean", defaultValue: "false", description: t(i18n, `${K}.propInteractiveDesc`) },
    { prop: "code", type: "string", defaultValue: "-", description: t(i18n, `${K}.propCodeDesc`) },
    { prop: "codeContract", type: "\"renderBody\" | \"appFile\"", defaultValue: "\"renderBody\"", description: t(i18n, `${K}.propCodeContractDesc`) },
    { prop: "defaultImports", type: "string", defaultValue: "-", description: t(i18n, `${K}.propDefaultImportsDesc`) },
    { prop: "defaultOpen", type: "boolean", defaultValue: "false", description: t(i18n, `${K}.propDefaultOpenDesc`) },
    { prop: "height", type: "number", defaultValue: "420", description: t(i18n, `${K}.propHeightDesc`) },
    { prop: "withCard", type: "boolean", defaultValue: "true", description: t(i18n, `${K}.propWithCardDesc`) },
    { prop: "className / style", type: "string / React.CSSProperties", defaultValue: "-", description: t(i18n, `${K}.propClassNameStyleDesc`) },
    { prop: "expandable / resizable", type: "boolean / boolean", defaultValue: "true / true", description: t(i18n, `${K}.propExpandableResizableDesc`) },
    { prop: "previewPadding", type: "number", defaultValue: "24", description: t(i18n, `${K}.propPreviewPaddingDesc`) }
  ];
}

export default function SgPlaygroundPage() {
  const i18n = useShowcaseI18n();
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors({
    deps: [i18n.locale]
  });
  const sgPlaygroundProps = React.useMemo(() => getPlaygroundProps(i18n), [i18n]);

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-5xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgPlayground"
          subtitle={t(i18n, `${K}.subtitle`)}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

      <Section
        title={t(i18n, `${K}.section1Title`)}
        description={t(i18n, `${K}.section1Description`)}
      >
        <div className="space-y-4">
          <SgPlayground
            title={t(i18n, `${K}.example1Title`)}
            description={t(i18n, `${K}.example1Description`)}
            code={READONLY_CODE}
            defaultOpen={false}
            style={{ border: "1px solid rgba(59, 130, 246, 0.25)" }}
          />
          <ExampleCodeCard sampleFile="apps/showcase/src/app/components/sg-playground/samples/read-only-mode.tsx.sample" />
        </div>
      </Section>

      <Section
        title={t(i18n, `${K}.section2Title`)}
        description={t(i18n, `${K}.section2Description`)}
      >
        <div className="space-y-4">
          <SgPlayground
            title={t(i18n, `${K}.example2Title`)}
            description={t(i18n, `${K}.example2Description`)}
            interactive
            code={RENDER_BODY_CODE}
            defaultImports={`import { SgButton, SgInputText, SgStack } from "@seedgrid/fe-components";`}
            height={380}
          />
          <ExampleCodeCard sampleFile="apps/showcase/src/app/components/sg-playground/samples/interactive-render-body.tsx.sample" />
        </div>
      </Section>

      <Section
        title={t(i18n, `${K}.section3Title`)}
        description={t(i18n, `${K}.section3Description`)}
      >
        <div className="space-y-4">
          <SgPlayground
            title={t(i18n, `${K}.example3Title`)}
            interactive
            codeContract="appFile"
            code={APP_FILE_CODE}
            height={420}
          />
          <ExampleCodeCard sampleFile="apps/showcase/src/app/components/sg-playground/samples/app-file-mode.tsx.sample" />
        </div>
      </Section>

      <Section
        title={t(i18n, `${K}.section4Title`)}
        description={t(i18n, `${K}.section4Description`)}
      >
        <div className="space-y-4">
          <SgPlayground
            interactive
            code={RENDER_BODY_CODE}
            defaultImports={`import { SgButton, SgInputText, SgStack } from "@seedgrid/fe-components";`}
            withCard={false}
            expandable={false}
            resizable={false}
            height={300}
            previewPadding={16}
          />
          <ExampleCodeCard sampleFile="apps/showcase/src/app/components/sg-playground/samples/visual-variations.tsx.sample" />
        </div>
      </Section>

      <ShowcasePropsReference rows={sgPlaygroundProps} />
      <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
    </div>
  </I18NReady>
  );
}
