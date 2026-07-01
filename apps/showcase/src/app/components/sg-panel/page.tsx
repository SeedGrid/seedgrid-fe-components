"use client";

import React from "react";
import { SgButton, SgGrid, SgPanel, SgScreen, SgStack } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import ComponentAiPropsTable from "../ai/ComponentAiPropsTable";
import ComponentAiSummary from "../ai/ComponentAiSummary";
import SgCodeBlockBase from "../sgCodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../useShowcaseAnchors";
import { loadAiManifestComponent, type AiManifestComponent } from "../../lib/ai-manifest";
import { t, useShowcaseI18n } from "../../../i18n";

const K = "showcase.component.panel";

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

const PANEL_PROPS: ShowcasePropRow[] = [
  { prop: "align", type: "\"top\" | \"left\" | \"right\" | \"bottom\" | \"client\"", defaultValue: "\"client\"", description: "Dock relativo ao pai logico, seja `SgPanel`, `SgScreen` ou `SgDockScreen`." },
  { prop: "width / height", type: "number | string", defaultValue: "-", description: "Dimensao percentual do painel dockado. Numero vira %." },
  { prop: "minWidthPx / minHeightPx", type: "number", defaultValue: "-", description: "Limites minimos em pixels para evitar corte de conteudo." },
  { prop: "span / rowSpan", type: "number", defaultValue: "-", description: "Span de colunas e linhas quando usado dentro de `SgGrid`." },
  { prop: "borderStyle", type: "\"none\" | \"solid\" | \"dashed\"", defaultValue: "dashed", description: "Estilo da borda do panel." },
  { prop: "padding", type: "number | string", defaultValue: "0", description: "Espacamento externo do panel em relacao ao slot recebido do pai." },
  { prop: "contentPadding", type: "number | string", defaultValue: "0", description: "Espacamento interno entre a borda do panel e seus filhos." },
  { prop: "contentDirection / contentGap / contentJustify / contentAlign / contentWrap", type: "layout props", defaultValue: "-", description: "Controlam a disposicao dos filhos dentro da area de conteudo." },
  { prop: "scrollable", type: "boolean | \"auto\" | \"x\" | \"y\"", defaultValue: "false", description: "Scroll so ocorre quando explicitamente solicitado." },
  { prop: "scrollbarGutter", type: "boolean", defaultValue: "false", description: "Reserva espaco para scrollbar." },
  { prop: "children", type: "ReactNode", defaultValue: "-", description: "Filhos livres ou paines dockados." },
  { prop: "className / style", type: "string / CSSProperties", defaultValue: "-", description: "Customizacao visual." }
];







export default function SgPanelPage() {
  const i18n = useShowcaseI18n();
  const [aiComponent, setAiComponent] = React.useState<AiManifestComponent | null>(null);
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors({
    deps: [i18n.locale]
  });

  React.useEffect(() => {
    let active = true;

    const loadAiData = async () => {
      const component = await loadAiManifestComponent("SgPanel");
      if (active) {
        setAiComponent(component);
      }
    };

    void loadAiData();

    return () => {
      active = false;
    };
  }, []);

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-6xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgPanel"
          subtitle={t(i18n, `${K}.subtitle`)}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section title={t(i18n, `${K}.section1Title`)} description={t(i18n, `${K}.section1Description`)}>
          <SgPanel className="h-[430px] rounded-xl bg-muted/30" padding={12}>
            <SgPanel className="h-full w-full rounded-lg bg-background" contentPadding={12} contentGap={8}>
              <SgPanel align="top" height={12} contentPadding={10} className="rounded-md">
                <SgStack direction="row" justify="between" align="center">
                  <span className="text-sm font-medium">Header</span>
                  <span className="rounded border border-border px-2 py-0.5 text-xs text-muted-foreground">
                    top + height=12%
                  </span>
                </SgStack>
              </SgPanel>

              <SgPanel align="left" width={20} contentPadding={10} className="rounded-md">
                <SgStack gap={6}>
                  <span className="text-xs font-medium text-muted-foreground">MENU</span>
                  <SgPanel borderStyle="none" className="rounded bg-muted/40" contentPadding={6}>Dashboard</SgPanel>
                  <SgPanel borderStyle="none" className="rounded bg-muted/40" contentPadding={6}>Relatorios</SgPanel>
                  <SgPanel borderStyle="none" className="rounded bg-muted/40" contentPadding={6}>Clientes</SgPanel>
                  <span className="pt-1 text-[11px] text-muted-foreground">left + width=20%</span>
                </SgStack>
              </SgPanel>

              <SgPanel align="right" width="18%" contentPadding={10} className="rounded-md">
                <SgStack gap={6}>
                  <span className="text-xs font-medium text-muted-foreground">ACOES</span>
                  <SgPanel borderStyle="none" className="rounded bg-muted/40" contentPadding={6}>Filtrar</SgPanel>
                  <SgPanel borderStyle="none" className="rounded bg-muted/40" contentPadding={6}>Exportar</SgPanel>
                  <span className="pt-1 text-[11px] text-muted-foreground">right + width=18%</span>
                </SgStack>
              </SgPanel>

              <SgPanel align="bottom" height={10} contentPadding={10} className="rounded-md">
                <SgStack direction="row" justify="between" align="center">
                  <span className="text-sm">Footer</span>
                  <span className="rounded border border-border px-2 py-0.5 text-xs text-muted-foreground">
                    bottom + height=10%
                  </span>
                </SgStack>
              </SgPanel>

              <SgPanel align="client" contentPadding={10} className="rounded-md">
                <SgStack gap={8}>
                  <span className="text-sm font-medium">Area client</span>
                  <SgPanel borderStyle="solid" className="h-24 rounded bg-muted/20" />
                  <span className="text-xs text-muted-foreground">client ocupa o restante automaticamente.</span>
                </SgStack>
              </SgPanel>
            </SgPanel>
          </SgPanel>

          <SgStack className="mt-6">
            <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/sg-panel/samples/align-width-height.tsx.sample" />
          </SgStack>
        </Section>

        <Section title={t(i18n, `${K}.section2Title`)} description={t(i18n, `${K}.section2Description`)}>
          <SgPanel className="h-[420px] rounded-xl bg-muted/30" padding={12}>
            <SgScreen fullscreen={false} className="rounded-lg bg-background">
              <SgPanel align="top" height={5} contentPadding={8} minHeightPx={100}>
                <SgPanel
                  align="right"
                  contentDirection="row"
                  contentPadding={8}
                  contentAlign="center"
                >
                  <SgButton label="TESTE" />
                  <SgButton label="TESTE" />
                  <SgButton label="TESTE" />
                </SgPanel>
              </SgPanel>

              <SgPanel align="left" width={10} contentPadding={8}>
                <SgButton label="TESTE" />
                <SgButton label="TESTE" />
                <SgButton label="TESTE" />
              </SgPanel>

              <SgPanel align="client" contentPadding={12}>
                client
              </SgPanel>

              <SgPanel align="bottom" height={5} contentPadding={8} minHeightPx={100}>
                <SgPanel align="left" contentDirection="row" contentPadding={8}>
                  <SgButton label="TESTE" />
                  <SgButton label="TESTE" />
                  <SgButton label="TESTE" />
                </SgPanel>
              </SgPanel>
            </SgScreen>
          </SgPanel>

          <SgStack className="mt-6">
            <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/sg-panel/samples/dock-screen-composition.tsx.sample" />
          </SgStack>
        </Section>

        <Section title={t(i18n, `${K}.section3Title`)} description={t(i18n, `${K}.section3Description`)}>
          <SgGrid columns={{ base: 1, md: 4 }} gap={8} rowHeight={90} dense>
            <SgPanel contentPadding={10} className="rounded-md">Item 1</SgPanel>
            <SgPanel span={2} contentPadding={10} className="rounded-md">span=2</SgPanel>
            <SgPanel rowSpan={2} contentPadding={10} className="rounded-md">rowSpan=2</SgPanel>
            <SgPanel contentPadding={10} className="rounded-md">Item 4</SgPanel>
            <SgPanel contentPadding={10} className="rounded-md">Item 5</SgPanel>
            <SgPanel span={2} rowSpan={2} contentPadding={10} className="rounded-md">span=2 + rowSpan=2</SgPanel>
          </SgGrid>

          <SgStack className="mt-6">
            <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/sg-panel/samples/span-rowspan.tsx.sample" />
          </SgStack>
        </Section>

        <Section title={t(i18n, `${K}.section4Title`)} description={t(i18n, `${K}.section4Description`)}>
          <SgGrid columns={{ base: 1, md: 3 }} gap={4}>
            <SgPanel borderStyle="none" contentPadding={12} className="rounded-lg bg-muted/50">
              contentPadding + borderStyle="none"
            </SgPanel>
            <SgPanel borderStyle="solid" contentPadding={12} className="rounded-lg">
              contentPadding + borderStyle="solid"
            </SgPanel>
            <SgPanel borderStyle="dashed" padding={12} contentPadding={12} className="rounded-lg">
              padding + contentPadding + dashed
            </SgPanel>
          </SgGrid>

          <SgStack className="mt-6">
            <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/sg-panel/samples/borderstyle-padding-children.tsx.sample" />
          </SgStack>
        </Section>

        <Section title={t(i18n, `${K}.section5Title`)} description={t(i18n, `${K}.section5Description`)}>
          <SgGrid columns={{ base: 1, md: 2 }} gap={4}>
            <SgPanel scrollable contentPadding={10} className="h-48 rounded-lg">
              <SgStack gap={6}>
                {Array.from({ length: 10 }).map((_, i) => (
                  <SgPanel key={i} borderStyle="solid" className="rounded bg-muted/30" contentPadding={8}>
                    scrollable=true - linha {i + 1}
                  </SgPanel>
                ))}
              </SgStack>
            </SgPanel>

            <SgPanel scrollable="auto" contentPadding={10} className="h-48 rounded-lg">
              <SgStack gap={6}>
                {Array.from({ length: 10 }).map((_, i) => (
                  <SgPanel key={i} borderStyle="solid" className="rounded bg-muted/30" contentPadding={8}>
                    scrollable="auto" - linha {i + 1}
                  </SgPanel>
                ))}
              </SgStack>
            </SgPanel>

            <SgPanel scrollable="y" contentPadding={10} className="h-48 rounded-lg">
              <SgStack gap={6}>
                {Array.from({ length: 15 }).map((_, i) => (
                  <SgPanel key={i} borderStyle="solid" className="rounded bg-muted/30" contentPadding={8}>
                    Item vertical {i + 1}
                  </SgPanel>
                ))}
              </SgStack>
            </SgPanel>

            <SgPanel scrollable="x" scrollbarGutter contentPadding={10} className="h-48 rounded-lg">
              <SgStack direction="row" gap={8} className="w-[960px]">
                {Array.from({ length: 12 }).map((_, i) => (
                  <SgPanel
                    key={i}
                    borderStyle="solid"
                    className="h-24 w-24 rounded bg-muted/30"
                  >
                    <SgStack className="h-full" justify="center" align="center">Box {i + 1}</SgStack>
                  </SgPanel>
                ))}
              </SgStack>
            </SgPanel>
          </SgGrid>

          <SgStack className="mt-6">
            <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/sg-panel/samples/scrollable-scrollbargutter.tsx.sample" />
          </SgStack>
        </Section>

        <Section title={t(i18n, `${K}.section6Title`)} description={t(i18n, `${K}.section6Description`)}>
          <SgStack gap={10}>
            <SgPanel className="h-[260px] rounded-xl bg-muted/30" padding={10}>
              <SgPanel className="h-full rounded-lg bg-background" contentPadding={8} contentGap={8}>
                <SgPanel align="top" height={10} minHeightPx={56} borderStyle="solid" contentPadding={12}>
                  header
                </SgPanel>
                <SgPanel align="left" width={18} minWidthPx={120} borderStyle="dashed" contentPadding={8} scrollable="y">
                  menu
                </SgPanel>
                <SgPanel align="client" borderStyle="none" contentPadding={10} scrollable="auto" scrollbarGutter>
                  conteudo
                </SgPanel>
              </SgPanel>
            </SgPanel>

            <SgGrid columns={{ base: 1, md: 3 }} gap={8}>
              <SgPanel span={2} contentPadding={12}>span=2</SgPanel>
              <SgPanel rowSpan={2} contentPadding={12}>rowSpan=2</SgPanel>
            </SgGrid>
          </SgStack>

          <SgStack className="mt-6">
            <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/sg-panel/samples/combined-example.tsx.sample" />
          </SgStack>
        </Section>

        <Section title={t(i18n, `${K}.section7Title`)} description={t(i18n, `${K}.section7Description`)}>
          <SgPlayground
            title={t(i18n, `${K}.playgroundTitle`)}
            interactive
            codeContract="appFile"
            playgroundFile="apps/showcase/src/app/components/sg-panel/sg-panel.tsx.playground"
            height={560}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={PANEL_PROPS} />
        {aiComponent ? <ComponentAiPropsTable component={aiComponent} /> : null}
        {aiComponent ? <ComponentAiSummary component={aiComponent} /> : null}
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
