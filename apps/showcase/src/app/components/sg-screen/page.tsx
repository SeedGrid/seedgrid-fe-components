"use client";

import React from "react";
import { SgScreen, SgPanel, SgStack } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import ComponentAiPropsTable from "../ai/ComponentAiPropsTable";
import ComponentAiSummary from "../ai/ComponentAiSummary";
import { useAiManifestComponent } from "../ai/useAiManifestComponent";
import SgCodeBlockBase from "../sgCodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../useShowcaseAnchors";
import { t, useShowcaseI18n } from "../../../i18n";

const K = "showcase.component.screen";

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section
      data-showcase-example="true"
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)]"
    >
      <SgPanel borderStyle="solid" className="rounded-lg border-border p-6" padding={24}>
        <SgStack gap={16}>
          <SgStack gap={4}>
            <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
            {props.description ? <p className="text-sm text-muted-foreground">{props.description}</p> : null}
          </SgStack>
          {props.children}
        </SgStack>
      </SgPanel>
    </section>
  );
}

const fullExampleCode = `"use client";

import React from "react";
import { SgScreen, SgPanel, SgStack } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function ExampleSgScreenPage() {
  return (
    <SgPanel className="h-[420px] rounded-xl bg-muted/30" padding={12}>
      <SgScreen fullscreen={false} padding={10} className="rounded-lg bg-zinc-100">
        <SgPanel className="h-full w-full" contentPadding={8} contentGap={8}>
          <SgPanel align="top" height={12} padding={10} className="rounded-md">
            <SgStack direction="row" justify="between" align="center">
              <span className="text-sm font-medium">Header</span>
              <span className="text-xs text-muted-foreground">top + height=12%</span>
            </SgStack>
          </SgPanel>

          <SgPanel align="left" width={20} padding={10} className="rounded-md">
            <SgStack gap={6}>
              <span className="text-xs font-medium text-muted-foreground">MENU</span>
              <SgPanel borderStyle="none" className="rounded bg-muted/40" padding={6}>Dashboard</SgPanel>
              <SgPanel borderStyle="none" className="rounded bg-muted/40" padding={6}>Relatorios</SgPanel>
              <SgPanel borderStyle="none" className="rounded bg-muted/40" padding={6}>Clientes</SgPanel>
            </SgStack>
          </SgPanel>

          <SgPanel align="right" width="18%" padding={10} className="rounded-md">
            <SgStack gap={6}>
              <span className="text-xs font-medium text-muted-foreground">ACOES</span>
              <SgPanel borderStyle="none" className="rounded bg-muted/40" padding={6}>Filtrar</SgPanel>
              <SgPanel borderStyle="none" className="rounded bg-muted/40" padding={6}>Exportar</SgPanel>
            </SgStack>
          </SgPanel>

          <SgPanel align="bottom" height="10%" padding={10} className="rounded-md">
            <SgStack direction="row" justify="between" align="center">
              <span className="text-sm">Footer</span>
              <span className="text-xs text-muted-foreground">bottom + height=10%</span>
            </SgStack>
          </SgPanel>

          <SgPanel align="client" padding={10} className="rounded-md">
            <SgStack gap={8}>
              <span className="text-sm font-medium">Area client</span>
              <SgPanel borderStyle="solid" className="h-24 rounded bg-muted/20" />
              <span className="text-xs text-muted-foreground">
                Esta area ocupa todo o espaco restante.
              </span>
            </SgStack>
          </SgPanel>
        </SgPanel>
      </SgScreen>
    </SgPanel>
  );
}`;

const SCREEN_PLAYGROUND_CODE = `import * as React from "react";
import {
  SgScreen,
  SgPanel,
  SgStack,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function App() {
  return (
    <SgScreen fullscreen={false} height={360} padding={12} className="rounded-xl bg-zinc-100">
      <SgPanel className="h-full w-full" contentPadding={8} contentGap={8}>
        <SgPanel align="top" height={12} padding={10} className="rounded-md">Top</SgPanel>
        <SgPanel align="left" width={20} padding={10} className="rounded-md">Left</SgPanel>
        <SgPanel align="right" width={20} padding={10} className="rounded-md">Right</SgPanel>
        <SgPanel align="bottom" height={10} padding={10} className="rounded-md">Bottom</SgPanel>
        <SgPanel align="client" padding={10} className="rounded-md">
          <SgStack gap={6}>
            <span className="text-sm font-medium">Client</span>
            <SgPanel borderStyle="solid" className="h-20 rounded bg-muted/20" />
          </SgStack>
        </SgPanel>
      </SgPanel>
    </SgScreen>
  );
}`;

const SCREEN_PROPS: ShowcasePropRow[] = [
  { prop: "fullscreen", type: "boolean", defaultValue: "true", description: "Define se ocupa toda a viewport." },
  { prop: "width / height", type: "number | string", defaultValue: "-", description: "Dimensoes explicitas do container (ex.: 960, 100%, 60vh)." },
  { prop: "padding", type: "number", defaultValue: "0", description: "Padding interno aplicado ao root da tela." },
  { prop: "children", type: "ReactNode", defaultValue: "-", description: "Main screen content." },
  { prop: "className / style", type: "string / CSSProperties", defaultValue: "-", description: "Customizacao visual do container." }
];







export default function SgScreenPage() {
  const i18n = useShowcaseI18n();
  const aiComponent = useAiManifestComponent("SgScreen");
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors({
    deps: [i18n.locale]
  });

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-6xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgScreen"
          subtitle={t(i18n, `${K}.subtitle`)}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section title={t(i18n, `${K}.section1Title`)} description={t(i18n, `${K}.section1Description`)}>
          <SgPanel className="h-[420px] rounded-xl bg-muted/30" padding={12}>
            <SgScreen fullscreen={false} padding={10} className="rounded-lg bg-zinc-100">
              <SgPanel className="h-full w-full" contentPadding={8} contentGap={8}>
                <SgPanel align="top" height={12} padding={10} className="rounded-md">
                  <SgStack direction="row" justify="between" align="center">
                    <span className="text-sm font-medium">Header</span>
                    <span className="text-xs text-muted-foreground">top + height=12%</span>
                  </SgStack>
                </SgPanel>

                <SgPanel align="left" width={20} padding={10} className="rounded-md">
                  <SgStack gap={6}>
                    <span className="text-xs font-medium text-muted-foreground">MENU</span>
                    <SgPanel borderStyle="none" className="rounded bg-muted/40" padding={6}>Dashboard</SgPanel>
                    <SgPanel borderStyle="none" className="rounded bg-muted/40" padding={6}>Relatorios</SgPanel>
                    <SgPanel borderStyle="none" className="rounded bg-muted/40" padding={6}>Clientes</SgPanel>
                  </SgStack>
                </SgPanel>

                <SgPanel align="right" width="18%" padding={10} className="rounded-md">
                  <SgStack gap={6}>
                    <span className="text-xs font-medium text-muted-foreground">ACOES</span>
                    <SgPanel borderStyle="none" className="rounded bg-muted/40" padding={6}>Filtrar</SgPanel>
                    <SgPanel borderStyle="none" className="rounded bg-muted/40" padding={6}>Exportar</SgPanel>
                  </SgStack>
                </SgPanel>

                <SgPanel align="bottom" height="10%" padding={10} className="rounded-md">
                  <SgStack direction="row" justify="between" align="center">
                    <span className="text-sm">Footer</span>
                    <span className="text-xs text-muted-foreground">bottom + height=10%</span>
                  </SgStack>
                </SgPanel>

                <SgPanel align="client" padding={10} className="rounded-md">
                  <SgStack gap={8}>
                    <span className="text-sm font-medium">Area client</span>
                    <SgPanel borderStyle="solid" className="h-24 rounded bg-muted/20" />
                    <span className="text-xs text-muted-foreground">
                      Esta area ocupa todo o espaco restante.
                    </span>
                  </SgStack>
                </SgPanel>
              </SgPanel>
            </SgScreen>
          </SgPanel>

          <SgStack className="mt-6">
            <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/sg-screen/samples/complete-example.tsx.sample" />
          </SgStack>
        </Section>

        <Section title={t(i18n, `${K}.section2Title`)} description={t(i18n, `${K}.section2Description`)}>
          <SgPlayground
            title={t(i18n, `${K}.playgroundTitle`)}
            interactive
            codeContract="appFile"
            playgroundFile="apps/showcase/src/app/components/sg-screen/sg-screen.tsx.playground"
            height={540}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={SCREEN_PROPS} />
        {aiComponent ? <ComponentAiPropsTable component={aiComponent} /> : null}
        {aiComponent ? <ComponentAiSummary component={aiComponent} /> : null}
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}


