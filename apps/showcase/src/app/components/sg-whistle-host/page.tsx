"use client";

import React from "react";
import {
  SgButton,
  SgWhistleHost,
  sgWhistle,
  type SgWhistleId,
  type SgWhistleSeverity
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import ComponentAiPropsTable from "../ai/ComponentAiPropsTable";
import ComponentAiSummary from "../ai/ComponentAiSummary";
import { useAiManifestComponent } from "../ai/useAiManifestComponent";
import SgCodeBlockBase from "../sgCodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../useShowcaseAnchors";
import { t, useShowcaseI18n, type ShowcaseI18n } from "../../../i18n";

function Section(props: Readonly<{ title: string; description?: string; children: React.ReactNode }>) {
  return (
    <section
      data-showcase-example="true"
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 space-y-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: Readonly<{ sampleFile: string }>) {
  return <SgCodeBlockBase sampleFile={props.sampleFile} />;
}

const WARM_COLORS = {
  default: { bg: "#fff7ed", fg: "#7c2d12", border: "#fdba74" },
  success: { bg: "#ecfdf5", fg: "#065f46", border: "#34d399" },
  info: { bg: "#eff6ff", fg: "#1d4ed8", border: "#60a5fa" },
  warning: { bg: "#fffbeb", fg: "#92400e", border: "#f59e0b" },
  error: { bg: "#fef2f2", fg: "#b91c1c", border: "#f87171" },
  loading: { bg: "#f5f3ff", fg: "#6d28d9", border: "#a78bfa" }
} satisfies Partial<Record<SgWhistleSeverity, { bg: string; fg: string; border: string }>>;

const K = "showcase.component.whistleHost";

function fireSeverity(i18n: ShowcaseI18n, severity: SgWhistleSeverity) {
  return sgWhistle.show({
    severity,
    title: t(i18n, `${K}.msg.severity.${severity}.title`),
    message: t(i18n, `${K}.msg.severity.${severity}.message`),
    duration: severity === "loading" ? 0 : 5000
  });
}

export default function SgWhistleHostPage() {
  const i18n = useShowcaseI18n();
  const aiComponent = useAiManifestComponent("SgWhistleHost");
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors();
  const [max, setMax] = React.useState(4);
  const [gap, setGap] = React.useState(12);
  const [newestOnTop, setNewestOnTop] = React.useState(false);
  const [warmPalette, setWarmPalette] = React.useState(false);
  const [activeId, setActiveId] = React.useState<SgWhistleId | null>(null);

  const whistleProps: ShowcasePropRow[] = [
    { prop: "max", type: "number", defaultValue: "4", description: t(i18n, `${K}.props.max`) },
    { prop: "newestOnTop", type: "boolean", defaultValue: "false", description: t(i18n, `${K}.props.newestOnTop`) },
    { prop: "gap", type: "number", defaultValue: "12", description: t(i18n, `${K}.props.gap`) },
    { prop: "className / style", type: "string / CSSProperties", defaultValue: "-", description: t(i18n, `${K}.props.classNameStyle`) },
    { prop: "customColors", type: "Partial<Record<SgWhistleSeverity, { bg; fg; border }>>", defaultValue: "-", description: t(i18n, `${K}.props.customColors`) }
  ];

  React.useEffect(() => {
    sgWhistle.dismiss();
    return () => {
      sgWhistle.dismiss();
    };
  }, []);

  const startLoading = React.useCallback(() => {
    const id = sgWhistle.loading({
      title: t(i18n, `${K}.msg.loading.title`),
      message: t(i18n, `${K}.msg.loading.message`),
      borderStyle: "left-accent",
      dismissible: false
    });
    setActiveId(id);
  }, [i18n]);

  const finishLoading = React.useCallback((severity: "success" | "error") => {
    if (!activeId) {
      sgWhistle.warning({
        title: t(i18n, `${K}.msg.noActive.title`),
        message: t(i18n, `${K}.msg.noActive.message`)
      });
      return;
    }

    sgWhistle.update(activeId, {
      severity,
      title: severity === "success" ? t(i18n, `${K}.msg.syncOk.title`) : t(i18n, `${K}.msg.syncFail.title`),
      message: severity === "success" ? t(i18n, `${K}.msg.syncOk.message`) : t(i18n, `${K}.msg.syncFail.message`),
      dismissible: true,
      duration: 5000
    });
    setActiveId(null);
  }, [activeId, i18n]);

  const runPromiseDemo = React.useCallback(async () => {
    try {
      await sgWhistle.promise(
        async () => {
          await new Promise((resolve) => setTimeout(resolve, 1200));
          if (Math.random() < 0.35) {
            throw new Error("simulated network error");
          }
          return { protocol: "SG-2026-031" };
        },
        {
          loading: {
            title: t(i18n, `${K}.msg.promise.loading.title`),
            message: t(i18n, `${K}.msg.promise.loading.message`)
          },
          success: (value) => ({
            title: t(i18n, `${K}.msg.promise.success.title`),
            message: t(i18n, `${K}.msg.promise.success.message`, { protocol: value.protocol }),
            borderStyle: "soft"
          }),
          error: (error) => ({
            title: t(i18n, `${K}.msg.promise.error.title`),
            message: error instanceof Error ? error.message : t(i18n, `${K}.msg.promise.error.message`),
            borderStyle: "full-accent"
          })
        }
      );
    } catch {
      // already represented by sgWhistle.promise
    }
  }, [i18n]);

  const runActionDemo = React.useCallback(() => {
    sgWhistle.warning({
      title: t(i18n, `${K}.msg.action.title`),
      message: t(i18n, `${K}.msg.action.message`),
      borderStyle: "left-accent",
      opacity: 0.96,
      action: {
        label: t(i18n, `${K}.buttons.undo`),
        onClick: () =>
          sgWhistle.success({
            title: t(i18n, `${K}.msg.undo.title`),
            message: t(i18n, `${K}.msg.undo.message`),
            borderStyle: "soft"
          })
      }
    });
  }, [i18n]);

  const runBorderDemo = React.useCallback((borderStyle: "solid" | "soft" | "left-accent" | "full-accent" | "none") => {
    sgWhistle.info({
      title: t(i18n, `${K}.msg.border.title`, { style: borderStyle }),
      message: t(i18n, `${K}.msg.border.message`),
      borderStyle,
      opacity: borderStyle === "none" ? 0.88 : 1
    });
  }, [i18n]);

  const runCustomDemo = React.useCallback(() => {
    sgWhistle.custom(
      (id) => (
        <div className="min-w-0 flex-1 space-y-2">
          <div className="text-sm font-semibold">{t(i18n, `${K}.msg.custom.title`)}</div>
          <p className="text-sm opacity-90">{t(i18n, `${K}.msg.custom.body`)}</p>
          <div className="flex flex-wrap gap-2">
            <SgButton size="sm" onClick={() => sgWhistle.dismiss(id)}>{t(i18n, `${K}.buttons.close`)}</SgButton>
            <SgButton
              size="sm"
              appearance="outline"
              onClick={() => {
                sgWhistle.dismiss(id);
                sgWhistle.success({
                  title: t(i18n, `${K}.msg.escalated.title`),
                  message: t(i18n, `${K}.msg.escalated.message`)
                });
              }}
            >
              {t(i18n, `${K}.buttons.escalate`)}
            </SgButton>
          </div>
        </div>
      ),
      {
        message: "custom",
        duration: 0,
        dismissible: false,
        borderStyle: "full-accent"
      }
    );
  }, [i18n]);

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-5xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgWhistleHost"
          subtitle={t(i18n, `${K}.subtitle`)}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <section className="rounded-xl border border-border bg-muted/20 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold">{t(i18n, `${K}.livePreview.title`)}</h2>
              <p className="text-sm text-muted-foreground">{t(i18n, `${K}.livePreview.description`)}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <SgButton size="sm" appearance="outline" onClick={() => setNewestOnTop((value) => !value)}>
                newestOnTop: {String(newestOnTop)}
              </SgButton>
              <SgButton size="sm" appearance="outline" onClick={() => setMax((value) => (value >= 6 ? 2 : value + 1))}>
                max: {max}
              </SgButton>
              <SgButton size="sm" appearance="outline" onClick={() => setGap((value) => (value >= 20 ? 8 : value + 4))}>
                gap: {gap}
              </SgButton>
              <SgButton size="sm" appearance="outline" onClick={() => setWarmPalette((value) => !value)}>
                palette: {warmPalette ? "warm" : "default"}
              </SgButton>
              <SgButton size="sm" appearance="ghost" onClick={() => sgWhistle.dismiss()}>
                {t(i18n, `${K}.buttons.clear`)}
              </SgButton>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-dashed border-border bg-background p-4">
            <SgWhistleHost
              max={max}
              newestOnTop={newestOnTop}
              gap={gap}
              customColors={warmPalette ? WARM_COLORS : undefined}
            />
          </div>
        </section>

        <Section
          title={t(i18n, `${K}.sections.baseSetup.title`)}
          description={t(i18n, `${K}.sections.baseSetup.description`)}
        >
          <div className="flex flex-wrap gap-2">
            <SgButton onClick={() => sgWhistle.show({ title: t(i18n, `${K}.msg.base.title`), message: t(i18n, `${K}.msg.base.message`) })}>
              sgWhistle.show
            </SgButton>
            <SgButton severity="success" onClick={() => sgWhistle.success({ title: t(i18n, `${K}.msg.saved.title`), message: t(i18n, `${K}.msg.saved.message`) })}>
              sgWhistle.success
            </SgButton>
            <SgButton appearance="outline" onClick={() => sgWhistle.dismiss()}>
              sgWhistle.dismiss
            </SgButton>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-whistle-host/samples/base-setup.tsx.sample" />
        </Section>

        <Section
          title={t(i18n, `${K}.sections.severities.title`)}
          description={t(i18n, `${K}.sections.severities.description`)}
        >
          <div className="flex flex-wrap gap-2">
            <SgButton onClick={() => fireSeverity(i18n, "default")}>default</SgButton>
            <SgButton severity="success" onClick={() => fireSeverity(i18n, "success")}>success</SgButton>
            <SgButton severity="info" onClick={() => fireSeverity(i18n, "info")}>info</SgButton>
            <SgButton severity="warning" onClick={() => fireSeverity(i18n, "warning")}>warning</SgButton>
            <SgButton severity="danger" onClick={() => fireSeverity(i18n, "error")}>error</SgButton>
            <SgButton appearance="outline" onClick={() => fireSeverity(i18n, "loading")}>loading</SgButton>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-whistle-host/samples/severities-and-stack.tsx.sample" />
        </Section>

        <Section
          title={t(i18n, `${K}.sections.actions.title`)}
          description={t(i18n, `${K}.sections.actions.description`)}
        >
          <div className="flex flex-wrap gap-2">
            <SgButton severity="warning" onClick={runActionDemo}>{t(i18n, `${K}.buttons.actionUndo`)}</SgButton>
            <SgButton appearance="outline" onClick={() => runBorderDemo("solid")}>solid</SgButton>
            <SgButton appearance="outline" onClick={() => runBorderDemo("soft")}>soft</SgButton>
            <SgButton appearance="outline" onClick={() => runBorderDemo("left-accent")}>left-accent</SgButton>
            <SgButton appearance="outline" onClick={() => runBorderDemo("full-accent")}>full-accent</SgButton>
            <SgButton appearance="outline" onClick={() => runBorderDemo("none")}>none</SgButton>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-whistle-host/samples/actions-border-opacity.tsx.sample" />
        </Section>

        <Section
          title={t(i18n, `${K}.sections.updateById.title`)}
          description={t(i18n, `${K}.sections.updateById.description`)}
        >
          <div className="flex flex-wrap items-center gap-2">
            <SgButton onClick={startLoading}>{t(i18n, `${K}.buttons.startLoading`)}</SgButton>
            <SgButton severity="success" onClick={() => finishLoading("success")}>{t(i18n, `${K}.buttons.finishSuccess`)}</SgButton>
            <SgButton severity="danger" onClick={() => finishLoading("error")}>{t(i18n, `${K}.buttons.finishError`)}</SgButton>
            <SgButton appearance="outline" onClick={() => activeId && sgWhistle.dismiss(activeId)}>
              {t(i18n, `${K}.buttons.dismissActive`)}
            </SgButton>
            <span className="text-xs text-muted-foreground">activeId: <code>{activeId ?? "none"}</code></span>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-whistle-host/samples/update-by-id.tsx.sample" />
        </Section>

        <Section
          title={t(i18n, `${K}.sections.promise.title`)}
          description={t(i18n, `${K}.sections.promise.description`)}
        >
          <div className="flex flex-wrap gap-2">
            <SgButton onClick={runPromiseDemo}>{t(i18n, `${K}.buttons.runPromise`)}</SgButton>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-whistle-host/samples/promise.tsx.sample" />
        </Section>

        <Section
          title={t(i18n, `${K}.sections.custom.title`)}
          description={t(i18n, `${K}.sections.custom.description`)}
        >
          <div className="flex flex-wrap gap-2">
            <SgButton onClick={runCustomDemo}>{t(i18n, `${K}.buttons.customWhistle`)}</SgButton>
            <SgButton appearance="outline" onClick={() => setWarmPalette((value) => !value)}>
              {t(i18n, `${K}.buttons.togglePalette`)}
            </SgButton>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-whistle-host/samples/custom-renderer-and-colors.tsx.sample" />
        </Section>

        <Section
          title={t(i18n, `${K}.sections.playground.title`)}
          description={t(i18n, `${K}.sections.playground.description`)}
        >
          <SgPlayground
            title="SgWhistleHost Playground"
            interactive
            codeContract="appFile"
            playgroundFile="apps/showcase/src/app/components/sg-whistle-host/sg-whistle-host.tsx.playground"
            height={640}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={whistleProps} />
        {aiComponent ? <ComponentAiPropsTable component={aiComponent} /> : null}
        {aiComponent ? <ComponentAiSummary component={aiComponent} /> : null}
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
