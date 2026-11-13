"use client";

import React from "react";
import { SgAvatar, SgBadge, SgBadgeOverlay, SgButton } from "@seedgrid/fe-components";
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

const PLACEMENTS = ["top-left", "top-right", "bottom-left", "bottom-right", "left", "right", "top", "bottom"] as const;

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section
      data-showcase-example="true"
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 flex flex-wrap items-center gap-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { sampleFile: string }) {
  return <SgCodeBlockBase sampleFile={props.sampleFile} />;
}

const BADGE_OVERLAY_PLAYGROUND_CODE = `import * as React from "react";
import { SgBadge, SgBadgeOverlay } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function App() {
  const [placement, setPlacement] = React.useState<"top-left" | "top-right" | "bottom-left" | "bottom-right" | "left" | "right" | "top" | "bottom">("top-right");
  const [value, setValue] = React.useState(7);

  return (
    <div className="space-y-4 p-2">
      <div className="grid gap-2 sm:grid-cols-4">
        <button className="rounded border border-border bg-background px-2 py-1 text-xs" onClick={() => setPlacement("top-left")}>top-left</button>
        <button className="rounded border border-border bg-background px-2 py-1 text-xs" onClick={() => setPlacement("top-right")}>top-right</button>
        <button className="rounded border border-border bg-background px-2 py-1 text-xs" onClick={() => setPlacement("bottom-left")}>bottom-left</button>
        <button className="rounded border border-border bg-background px-2 py-1 text-xs" onClick={() => setPlacement("bottom-right")}>bottom-right</button>
      </div>

      <div className="flex items-center gap-2">
        <button className="rounded border border-border bg-background px-2 py-1 text-xs" onClick={() => setValue((prev) => prev + 1)}>+1</button>
        <button className="rounded border border-border bg-background px-2 py-1 text-xs" onClick={() => setValue(0)}>reset</button>
      </div>

      <SgBadgeOverlay placement={placement} badge={<SgBadge value={value} severity="danger" size="xs" />}>
        <span className="inline-flex size-14 items-center justify-center rounded-lg border border-border bg-background text-sm">Item</span>
      </SgBadgeOverlay>
    </div>
  );
}`;

const BADGE_OVERLAY_PROPS: ShowcasePropRow[] = [
  { prop: "children", type: "ReactNode", defaultValue: "-", description: "Elemento base que recebe o badge sobreposto." },
  { prop: "badge", type: "ReactNode", defaultValue: "-", description: "Conteudo do badge exibido na sobreposicao." },
  { prop: "placement", type: "SgBadgeOverlayPlacement", defaultValue: "top-right", description: "Posicionamento da sobreposicao." },
  { prop: "className", type: "string", defaultValue: "-", description: "Classes extras do wrapper." },
  { prop: "style", type: "React.CSSProperties", defaultValue: "-", description: "Inline style aplicado ao wrapper." }
];

export default function SgBadgeOverlayPage() {
  const i18n = useShowcaseI18n();
  const aiComponent = useAiManifestComponent("SgBadgeOverlay");
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors({
    deps: [i18n.locale]
  });

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-4xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title={t(i18n, "showcase.component.badgeOverlay.title")}
          subtitle={t(i18n, "showcase.component.badgeOverlay.subtitle")}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section
          title={`1) ${t(i18n, "showcase.component.badgeOverlay.sections.basic.title")}`}
          description={t(i18n, "showcase.component.badgeOverlay.sections.basic.description")}
        >
          <SgBadgeOverlay badge={<SgBadge value={7} severity="danger" size="xs" />} style={{ borderRadius: 12, padding: 2 }}>
            <span className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-background text-sm">{t(i18n, "showcase.component.badgeOverlay.labels.bell")}</span>
          </SgBadgeOverlay>
          <SgBadgeOverlay badge={<SgBadge dot severity="success" />}>
            <span className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-background text-sm">{t(i18n, "showcase.component.badgeOverlay.labels.check")}</span>
          </SgBadgeOverlay>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-badge-overlay/samples/basico.tsx.sample" />
        </Section>

        <Section
          title={`2) ${t(i18n, "showcase.component.badgeOverlay.sections.placements.title")}`}
          description={t(i18n, "showcase.component.badgeOverlay.sections.placements.description")}
        >
          {PLACEMENTS.map((placement) => (
            <SgBadgeOverlay key={placement} placement={placement} badge={<SgBadge value={placement} size="xs" />}>
              <span className="inline-flex h-10 w-16 items-center justify-center rounded-lg border border-border bg-background text-xs" />
            </SgBadgeOverlay>
          ))}
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-badge-overlay/samples/placements.tsx.sample" />
        </Section>

        <Section
          title={`3) ${t(i18n, "showcase.component.badgeOverlay.sections.avatar.title")}`}
          description={t(i18n, "showcase.component.badgeOverlay.sections.avatar.description")}
        >
          <SgBadgeOverlay badge={<SgBadge value={3} size="sm" severity="danger" />}>
            <SgAvatar label="Ana Lima" />
          </SgBadgeOverlay>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-badge-overlay/samples/avatar.tsx.sample" />
        </Section>

        <Section
          title={`4) ${t(i18n, "showcase.component.badgeOverlay.sections.status.title")}`}
          description={t(i18n, "showcase.component.badgeOverlay.sections.status.description")}
        >
          <SgBadgeOverlay placement="bottom-right" badge={<SgBadge dot severity="success" />}>
            <SgAvatar label="Bia Souza" severity="info" />
          </SgBadgeOverlay>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-badge-overlay/samples/status.tsx.sample" />
        </Section>

        <Section
          title={`5) ${t(i18n, "showcase.component.badgeOverlay.sections.button.title")}`}
          description={t(i18n, "showcase.component.badgeOverlay.sections.button.description")}
        >
          <SgBadgeOverlay badge={<SgBadge value={12} max={9} size="xs" severity="danger" />}>
            <SgButton appearance="outline">{t(i18n, "showcase.component.badgeOverlay.button.messages")}</SgButton>
          </SgBadgeOverlay>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-badge-overlay/samples/botao.tsx.sample" />
        </Section>

        <Section
          title={`6) ${t(i18n, "showcase.component.badgeOverlay.sections.playground.title")}`}
          description={t(i18n, "showcase.component.badgeOverlay.sections.playground.description")}
        >
          <SgPlayground
            title="SgBadgeOverlay Playground"
            interactive
            codeContract="appFile"
            playgroundFile="apps/showcase/src/app/components/sg-badge-overlay/sg-badge-overlay.tsx.playground"
            height={480}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={BADGE_OVERLAY_PROPS} />
        {aiComponent ? <ComponentAiPropsTable component={aiComponent} /> : null}
        {aiComponent ? <ComponentAiSummary component={aiComponent} /> : null}
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}



