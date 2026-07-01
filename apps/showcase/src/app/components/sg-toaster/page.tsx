"use client";

import React from "react";
import {
  SgButton,
  toast,
  type SgToastId,
  type SgToastType,
  type SgToastOptions,
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

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
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

function CodeBlock(props: { sampleFile: string }) {
  return <SgCodeBlockBase sampleFile={props.sampleFile} />;
}

const K = "showcase.component.toaster";

function emitToastByType(i18n: ShowcaseI18n, type: SgToastType, options?: SgToastOptions) {
  const title = t(i18n, `${K}.toastTitles.${type}`);
  if (type === "default") return toast.message(title, options);
  if (type === "success") return toast.success(title, options);
  if (type === "info") return toast.info(title, options);
  if (type === "warning") return toast.warning(title, options);
  if (type === "error") return toast.error(title, options);
  return toast.loading(title, {
    duration: options?.duration ?? 2500,
    ...options
  });
}

export default function SgToasterPage() {
  const i18n = useShowcaseI18n();
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors();
  const aiComponent = useAiManifestComponent("SgToaster");
  const [loadingId, setLoadingId] = React.useState<SgToastId | null>(null);

  const toasterProps: ShowcasePropRow[] = [
    {
      prop: "position",
      type: "\"top-right\" | \"top-left\" | \"top-center\" | \"bottom-right\" | \"bottom-left\" | \"bottom-center\"",
      defaultValue: "\"top-right\"",
      description: t(i18n, `${K}.props.position`)
    },
    { prop: "duration", type: "number", defaultValue: "4000", description: t(i18n, `${K}.props.duration`) },
    { prop: "visibleToasts", type: "number", defaultValue: "6", description: t(i18n, `${K}.props.visibleToasts`) },
    { prop: "closeButton", type: "boolean", defaultValue: "true", description: t(i18n, `${K}.props.closeButton`) },
    { prop: "richColors", type: "boolean", defaultValue: "true", description: t(i18n, `${K}.props.richColors`) },
    { prop: "transparency", type: "number (0-100)", defaultValue: "0", description: t(i18n, `${K}.props.transparency`) },
    {
      prop: "customColors",
      type: "Partial<Record<SgToastType, SgToasterTypeColors>>",
      defaultValue: "-",
      description: t(i18n, `${K}.props.customColors`)
    }
  ];

  const startLoading = React.useCallback(() => {
    const id = toast.loading(t(i18n, `${K}.msg.loading.start`), {
      description: t(i18n, `${K}.msg.loading.startDesc`)
    });
    setLoadingId(id);
  }, [i18n]);

  const finishLoadingSuccess = React.useCallback(() => {
    if (!loadingId) {
      toast.warning(t(i18n, `${K}.msg.loading.noActive`));
      return;
    }

    toast.success(t(i18n, `${K}.msg.loading.success`), {
      id: loadingId,
      description: t(i18n, `${K}.msg.loading.successDesc`)
    });
    setLoadingId(null);
  }, [loadingId, i18n]);

  const finishLoadingError = React.useCallback(() => {
    if (!loadingId) {
      toast.warning(t(i18n, `${K}.msg.loading.noActive`));
      return;
    }

    toast.error(t(i18n, `${K}.msg.loading.fail`), {
      id: loadingId,
      description: t(i18n, `${K}.msg.loading.failDesc`)
    });
    setLoadingId(null);
  }, [loadingId, i18n]);

  const runPromiseDemo = React.useCallback(async () => {
    const task = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      if (Math.random() < 0.35) {
        throw new Error("Random demo error");
      }
      return { id: "ORD-2026-001" };
    };

    try {
      await toast.promise(task, {
        loading: t(i18n, `${K}.msg.promise.loading`),
        success: (value) => t(i18n, `${K}.msg.promise.success`, { id: value.id }),
        error: (error) => t(i18n, `${K}.msg.promise.error`, { error: error instanceof Error ? error.message : "error" })
      });
    } catch {
      // error already handled by toast.promise
    }
  }, [i18n]);

  const runActionDemo = React.useCallback(() => {
    toast.warning(t(i18n, `${K}.msg.action.title`), {
      description: t(i18n, `${K}.msg.action.desc`),
      action: {
        label: t(i18n, `${K}.buttons.undo`),
        onClick: () =>
          toast.success(t(i18n, `${K}.msg.action.undoneTitle`), {
            description: t(i18n, `${K}.msg.action.undoneDesc`)
          })
      }
    });
  }, [i18n]);

  const runCustomDemo = React.useCallback(() => {
    toast.custom(
      (id) => (
        <div className="w-full max-w-[280px] rounded-md border border-[#c56a2d]/50 bg-[#fff7f1] p-3">
          <div className="text-sm font-semibold text-[#8f4b1f]">{t(i18n, `${K}.msg.custom.title`)}</div>
          <p className="mt-1 text-xs text-[#6b4b33]">{t(i18n, `${K}.msg.custom.body`)}</p>
          <div className="mt-2 flex gap-2">
            <SgButton size="sm" onClick={() => toast.dismiss(id)}>
              {t(i18n, `${K}.buttons.close`)}
            </SgButton>
          </div>
        </div>
      ),
      { duration: 8000, closeButton: false }
    );
  }, [i18n]);

  const runOptionsDemo = React.useCallback(() => {
    toast.info(t(i18n, `${K}.msg.options.title`), {
      description: t(i18n, `${K}.msg.options.desc`),
      duration: 10000,
      closeButton: false,
      className: "border-[#c56a2d]",
      style: {
        background: "#fff7f1",
        color: "#5b3b23"
      }
    });
  }, [i18n]);

  const transparencyLevel = 80;
  const transparencyOptions = React.useMemo<SgToastOptions>(
    () => ({
      style: {
        opacity: 1 - transparencyLevel / 100
      }
    }),
    [transparencyLevel]
  );

  const customColorStyles = React.useMemo<Record<SgToastType, React.CSSProperties>>(
    () => ({
      default: { backgroundColor: "#1f2937", color: "#f9fafb", borderColor: "#6b7280" },
      success: { backgroundColor: "#065f46", color: "#ecfeff", borderColor: "#10b981" },
      info: { backgroundColor: "#1e3a8a", color: "#dbeafe", borderColor: "#60a5fa" },
      warning: { backgroundColor: "#78350f", color: "#fef3c7", borderColor: "#f59e0b" },
      error: { backgroundColor: "#7f1d1d", color: "#fee2e2", borderColor: "#ef4444" },
      loading: { backgroundColor: "#312e81", color: "#e0e7ff", borderColor: "#818cf8" }
    }),
    []
  );

  const runTransparencyByType = React.useCallback((type: SgToastType) => {
    emitToastByType(i18n, type, transparencyOptions);
  }, [transparencyOptions, i18n]);

  const runCustomColorsByType = React.useCallback((type: SgToastType) => {
    emitToastByType(i18n, type, { style: customColorStyles[type] });
  }, [customColorStyles, i18n]);

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-5xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgToaster"
          subtitle={t(i18n, `${K}.subtitle`)}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

      <Section
        title={t(i18n, `${K}.sections.baseSetup.title`)}
        description={t(i18n, `${K}.sections.baseSetup.description`)}
      >
        <div className="flex flex-wrap gap-2">
          <SgButton onClick={() => toast.message(t(i18n, `${K}.msg.basic`))}>toast.message</SgButton>
          <SgButton severity="success" onClick={() => toast.success(t(i18n, `${K}.msg.types.success`))}>
            toast.success
          </SgButton>
          <SgButton appearance="outline" onClick={() => toast.dismiss()}>
            toast.dismiss (all)
          </SgButton>
        </div>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-toaster/samples/base-setup.tsx.sample" />
      </Section>

      <Section
        title={t(i18n, `${K}.sections.types.title`)}
        description={t(i18n, `${K}.sections.types.description`)}
      >
        <div className="flex flex-wrap gap-2">
          <SgButton onClick={() => toast.message(t(i18n, `${K}.msg.types.default`))}>default</SgButton>
          <SgButton severity="success" onClick={() => toast.success(t(i18n, `${K}.msg.types.success`))}>
            success
          </SgButton>
          <SgButton severity="info" onClick={() => toast.info(t(i18n, `${K}.msg.types.info`))}>
            info
          </SgButton>
          <SgButton severity="warning" onClick={() => toast.warning(t(i18n, `${K}.msg.types.warning`))}>
            warning
          </SgButton>
          <SgButton severity="danger" onClick={() => toast.error(t(i18n, `${K}.msg.types.error`))}>
            error
          </SgButton>
          <SgButton appearance="outline" onClick={() => toast.loading(t(i18n, `${K}.msg.types.loading`))}>
            loading
          </SgButton>
        </div>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-toaster/samples/toast-types.tsx.sample" />
      </Section>

      <Section
        title={t(i18n, `${K}.sections.loadingById.title`)}
        description={t(i18n, `${K}.sections.loadingById.description`)}
      >
        <div className="flex flex-wrap items-center gap-2">
          <SgButton onClick={startLoading}>{t(i18n, `${K}.buttons.startLoading`)}</SgButton>
          <SgButton severity="success" onClick={finishLoadingSuccess}>
            {t(i18n, `${K}.buttons.finishSuccess`)}
          </SgButton>
          <SgButton severity="danger" onClick={finishLoadingError}>
            {t(i18n, `${K}.buttons.finishError`)}
          </SgButton>
          <SgButton appearance="outline" onClick={() => toast.dismiss()}>
            {t(i18n, `${K}.buttons.clearAll`)}
          </SgButton>
          <span className="text-xs text-muted-foreground">
            loadingId: <code>{loadingId ?? "none"}</code>
          </span>
        </div>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-toaster/samples/loading-by-id-update-same-toast.tsx.sample" />
      </Section>

      <Section
        title={t(i18n, `${K}.sections.promise.title`)}
        description={t(i18n, `${K}.sections.promise.description`)}
      >
        <div className="flex flex-wrap gap-2">
          <SgButton onClick={runPromiseDemo}>{t(i18n, `${K}.buttons.runPromise`)}</SgButton>
        </div>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-toaster/samples/toast-promise.tsx.sample" />
      </Section>

      <Section
        title={t(i18n, `${K}.sections.actions.title`)}
        description={t(i18n, `${K}.sections.actions.description`)}
      >
        <div className="flex flex-wrap gap-2">
          <SgButton severity="warning" onClick={runActionDemo}>
            {t(i18n, `${K}.buttons.toastWithAction`)}
          </SgButton>
          <SgButton appearance="outline" onClick={runCustomDemo}>
            {t(i18n, `${K}.buttons.customToast`)}
          </SgButton>
        </div>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-toaster/samples/actions-and-custom-toast.tsx.sample" />
      </Section>

      <Section
        title={t(i18n, `${K}.sections.options.title`)}
        description={t(i18n, `${K}.sections.options.description`)}
      >
        <div className="flex flex-wrap gap-2">
          <SgButton onClick={runOptionsDemo}>{t(i18n, `${K}.buttons.triggerOptions`)}</SgButton>
        </div>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-toaster/samples/options-per-toast.tsx.sample" />
      </Section>

      <Section
        title={t(i18n, `${K}.sections.transparency.title`)}
        description={t(i18n, `${K}.sections.transparency.description`)}
      >
        <div className="flex flex-wrap gap-2">
          <SgButton onClick={() => runTransparencyByType("default")}>default</SgButton>
          <SgButton severity="success" onClick={() => runTransparencyByType("success")}>success</SgButton>
          <SgButton severity="info" onClick={() => runTransparencyByType("info")}>info</SgButton>
          <SgButton severity="warning" onClick={() => runTransparencyByType("warning")}>warning</SgButton>
          <SgButton severity="danger" onClick={() => runTransparencyByType("error")}>error</SgButton>
          <SgButton appearance="outline" onClick={() => runTransparencyByType("loading")}>loading</SgButton>
          <SgButton appearance="outline" onClick={() => toast.dismiss()}>{t(i18n, `${K}.buttons.dismissAll`)}</SgButton>
        </div>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-toaster/samples/transparency.tsx.sample" />
      </Section>

      <Section
        title={t(i18n, `${K}.sections.customColors.title`)}
        description={t(i18n, `${K}.sections.customColors.description`)}
      >
        <div className="flex flex-wrap gap-2">
          <SgButton onClick={() => runCustomColorsByType("default")}>default</SgButton>
          <SgButton severity="success" onClick={() => runCustomColorsByType("success")}>success</SgButton>
          <SgButton severity="info" onClick={() => runCustomColorsByType("info")}>info</SgButton>
          <SgButton severity="warning" onClick={() => runCustomColorsByType("warning")}>warning</SgButton>
          <SgButton severity="danger" onClick={() => runCustomColorsByType("error")}>error</SgButton>
          <SgButton appearance="outline" onClick={() => runCustomColorsByType("loading")}>loading</SgButton>
          <SgButton appearance="outline" onClick={() => toast.dismiss()}>{t(i18n, `${K}.buttons.dismissAll`)}</SgButton>
        </div>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-toaster/samples/custom-colors.tsx.sample" />
      </Section>

      <Section
        title={t(i18n, `${K}.sections.rounded.title`)}
        description={t(i18n, `${K}.sections.rounded.description`)}
      >
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-toaster/samples/rounded.tsx.sample" />
      </Section>

      <Section
        title={t(i18n, `${K}.sections.playground.title`)}
        description={t(i18n, `${K}.sections.playground.description`)}
      >
        <SgPlayground
          title="SgToaster Playground"
          interactive
          codeContract="appFile"
          playgroundFile="apps/showcase/src/app/components/sg-toaster/sg-toaster.tsx.playground"
          height={560}
          defaultOpen
        />
      </Section>

        <ShowcasePropsReference rows={toasterProps} />
        {aiComponent ? <ComponentAiPropsTable component={aiComponent} /> : null}
        {aiComponent ? <ComponentAiSummary component={aiComponent} /> : null}
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
