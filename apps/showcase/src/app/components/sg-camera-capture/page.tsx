"use client";

import React from "react";
import Link from "next/link";
import { SgGrid, SgCameraCapture, SgComponentsI18nProvider } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import SgCodeBlockBase from "../sgCodeBlockBase";
import I18NReady from "../I18NReady";
import ComponentAiPropsTable from "../ai/ComponentAiPropsTable";
import ComponentAiSummary from "../ai/ComponentAiSummary";
import { useAiManifestComponent } from "../ai/useAiManifestComponent";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import { t, useShowcaseI18n } from "../../../i18n";

function Section(props: { id?: string; title: string; description?: string; children: React.ReactNode }) {
  return (
    <section
      id={props.id}
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 flex flex-wrap gap-4">{props.children}</div>
    </section>
  );
}

function CodeBlock(props: { sampleFile: string }) {
  return <SgCodeBlockBase sampleFile={props.sampleFile} />;
}

export default function SgCameraCapturePage() {
  const i18n = useShowcaseI18n();
  const aiComponent = useAiManifestComponent("SgCameraCapture");
  const [photo, setPhoto] = React.useState<{ url: string; label: string } | null>(null);
  const [selfie, setSelfie] = React.useState<string | null>(null);
  const [cameraError, setCameraError] = React.useState<string | null>(null);
  // A foto capturada vira uma URL de objeto; ela e liberada ao trocar de foto e ao desmontar.
  React.useEffect(() => () => { if (photo) URL.revokeObjectURL(photo.url); }, [photo]);
  React.useEffect(() => () => { if (selfie) URL.revokeObjectURL(selfie); }, [selfie]);
  const stickyHeaderRef = React.useRef<HTMLDivElement | null>(null);
  const [anchorOffset, setAnchorOffset] = React.useState(320);

  React.useEffect(() => {
    const updateAnchorOffset = () => {
      const headerHeight = stickyHeaderRef.current?.getBoundingClientRect().height ?? 0;
      setAnchorOffset(Math.max(240, Math.ceil(headerHeight + 40)));
    };

    updateAnchorOffset();
    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateAnchorOffset) : null;
    if (resizeObserver && stickyHeaderRef.current) resizeObserver.observe(stickyHeaderRef.current);

    window.addEventListener("resize", updateAnchorOffset);
    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateAnchorOffset);
    };
  }, [i18n.locale]);

  const findScrollContainer = React.useCallback((element: HTMLElement | null): HTMLElement | Window => {
    let current = element?.parentElement ?? null;
    while (current) {
      const style = window.getComputedStyle(current);
      const overflowY = style.overflowY;
      if ((overflowY === "auto" || overflowY === "scroll") && current.scrollHeight > current.clientHeight) {
        return current;
      }
      current = current.parentElement;
    }
    return window;
  }, []);

  const navigateToAnchor = React.useCallback((anchorId: string) => {
    const target = document.getElementById(anchorId);
    if (!target) return;

    const scrollContainer = findScrollContainer(target);
    const extraTopGap = 12;
    const titleEl = (target.querySelector("[data-anchor-title='true']") as HTMLElement | null) ?? target;

    const correctIfNeeded = () => {
      const stickyBottomNow = stickyHeaderRef.current?.getBoundingClientRect().bottom ?? 0;
      const desiredTopNow = stickyBottomNow + extraTopGap;
      const currentTop = titleEl.getBoundingClientRect().top;
      const delta = currentTop - desiredTopNow;
      if (Math.abs(delta) <= 1) return;

      if (scrollContainer === window) {
        const next = Math.max(0, window.scrollY + delta);
        window.scrollTo({ top: next, behavior: "auto" });
        return;
      }

      const container = scrollContainer as HTMLElement;
      const next = Math.max(0, container.scrollTop + delta);
      container.scrollTo({ top: next, behavior: "auto" });
    };

    if (scrollContainer === window) {
      const stickyBottomNow = stickyHeaderRef.current?.getBoundingClientRect().bottom ?? 0;
      const desiredTopNow = stickyBottomNow + extraTopGap;
      const titleTop = window.scrollY + titleEl.getBoundingClientRect().top;
      window.scrollTo({ top: Math.max(0, titleTop - desiredTopNow), behavior: "auto" });
    } else {
      const container = scrollContainer as HTMLElement;
      const containerRect = container.getBoundingClientRect();
      const stickyBottomNow = stickyHeaderRef.current?.getBoundingClientRect().bottom ?? 0;
      const desiredTopInContainer = stickyBottomNow + extraTopGap - containerRect.top;
      const titleRect = titleEl.getBoundingClientRect();
      const titleTopInContainer = container.scrollTop + (titleRect.top - containerRect.top);
      container.scrollTo({ top: Math.max(0, titleTopInContainer - desiredTopInContainer), behavior: "auto" });
    }

    window.history.replaceState(null, "", `#${anchorId}`);
    requestAnimationFrame(() => {
      correctIfNeeded();
      requestAnimationFrame(correctIfNeeded);
    });
    window.setTimeout(correctIfNeeded, 120);
    window.setTimeout(correctIfNeeded, 260);
  }, [findScrollContainer]);

  const handleAnchorClick = React.useCallback((event: React.MouseEvent<HTMLAnchorElement>, anchorId: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    navigateToAnchor(anchorId);
  }, [navigateToAnchor]);

  const navigateToAnchorRef = React.useRef(navigateToAnchor);
  React.useEffect(() => {
    navigateToAnchorRef.current = navigateToAnchor;
  }, [navigateToAnchor]);

  React.useEffect(() => {
    const applyHashNavigation = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash) return;
      navigateToAnchorRef.current(hash);
    };

    const timer = window.setTimeout(applyHashNavigation, 0);
    window.addEventListener("hashchange", applyHashNavigation);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("hashchange", applyHashNavigation);
    };
  }, []);

  const exampleLinks = React.useMemo(
    () => [
      { id: "exemplo-1", label: `1) ${t(i18n, "showcase.component.cameraCapture.sections.basic.title")}` },
      { id: "exemplo-2", label: `2) ${t(i18n, "showcase.component.cameraCapture.sections.oval.title")}` },
      { id: "exemplo-3", label: `3) ${t(i18n, "showcase.component.cameraCapture.sections.rect.title")}` },
      { id: "exemplo-4", label: `4) ${t(i18n, "showcase.component.cameraCapture.sections.errors.title")}` },
      { id: "exemplo-5", label: `5) ${t(i18n, "showcase.common.sections.i18n.title")}` },
      { id: "exemplo-6", label: "6) Playground" }
    ],
    [i18n.locale]
  );
  const rows: ShowcasePropRow[] = [
    { prop: "id", type: "string", defaultValue: "-", description: t(i18n, "showcase.component.cameraCapture.props.rows.id") },
    { prop: "label", type: "string", defaultValue: "-", description: t(i18n, "showcase.component.cameraCapture.props.rows.label") },
    { prop: "facing", type: '"user" | "environment"', defaultValue: '"user"', description: t(i18n, "showcase.component.cameraCapture.props.rows.facing") },
    { prop: "guide", type: '"none" | "oval" | "rect"', defaultValue: '"none"', description: t(i18n, "showcase.component.cameraCapture.props.rows.guide") },
    { prop: "resolution", type: '"low" | "medium" | "high"', defaultValue: '"medium"', description: t(i18n, "showcase.component.cameraCapture.props.rows.resolution") },
    { prop: "onCapture", type: "(image: Blob) => void", defaultValue: "-", description: t(i18n, "showcase.component.cameraCapture.props.rows.onCapture") },
    { prop: "onError", type: '(code: "permission" | "noCamera" | "failed", message: string) => void', defaultValue: "-", description: t(i18n, "showcase.component.cameraCapture.props.rows.onError") },
    { prop: "allowSwitch", type: "boolean", defaultValue: "true", description: t(i18n, "showcase.component.cameraCapture.props.rows.allowSwitch") },
    { prop: "previewHeight", type: "number", defaultValue: "320", description: t(i18n, "showcase.component.cameraCapture.props.rows.previewHeight") },
    { prop: "hintText", type: "string", defaultValue: "-", description: t(i18n, "showcase.component.cameraCapture.props.rows.hintText") },
    { prop: "enabled", type: "boolean", defaultValue: "true", description: t(i18n, "showcase.component.cameraCapture.props.rows.disabled") }
  ];

  return (
    <I18NReady>
      <div
        className="max-w-4xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <div ref={stickyHeaderRef} className="sticky top-0 z-50 isolate max-h-[52vh] overflow-y-auto bg-background pb-2 pt-2 md:-top-8 md:max-h-none md:overflow-visible md:pb-2 md:pt-8">
          <div className="rounded-lg border border-border bg-background p-4 shadow-sm">
            <h1 className="text-3xl font-bold">{t(i18n, "showcase.component.cameraCapture.title")}</h1>
            <p className="mt-2 text-muted-foreground">{t(i18n, "showcase.component.cameraCapture.subtitle")}</p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t(i18n, "showcase.common.examples")}</p>
            <SgGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={8} className="mt-2">
              {exampleLinks.map((example) => (
                <Link
                  key={example.id}
                  href={`#${example.id}`}
                  onClick={(event) => handleAnchorClick(event, example.id)}
                  className="rounded-md border border-border px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-muted/40"
                >
                  {example.label}
                </Link>
              ))}
              <Link
                href="#props-reference"
                onClick={(event) => handleAnchorClick(event, "props-reference")}
                className="rounded-md border border-border px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-muted/40"
              >
                Props Reference
              </Link>
            </SgGrid>
          </div>
        </div>

        <Section
          id="exemplo-1"
          title={`1) ${t(i18n, "showcase.component.cameraCapture.sections.basic.title")}`}
          description={t(i18n, "showcase.component.cameraCapture.sections.basic.description")}
        >
          <div className="w-80">
            <SgCameraCapture
              id="demo-basic"
              label={t(i18n, "showcase.component.cameraCapture.labels.photo")}
              onCapture={(image) => setPhoto({ url: URL.createObjectURL(image), label: `${image.type} (${image.size} bytes)` })}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              {t(i18n, "showcase.common.labels.currentValue", { value: photo?.label ?? "-" })}
            </p>
            {photo ? (
              <img src={photo.url} alt={t(i18n, "showcase.component.cameraCapture.labels.captured")} className="mt-2 h-40 rounded-md border border-border" />
            ) : null}
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-camera-capture/samples/basico.tsx.sample" />
        </Section>

        <Section
          id="exemplo-2"
          title={`2) ${t(i18n, "showcase.component.cameraCapture.sections.oval.title")}`}
          description={t(i18n, "showcase.component.cameraCapture.sections.oval.description")}
        >
          <div className="w-80">
            <SgCameraCapture
              id="demo-oval"
              label={t(i18n, "showcase.component.cameraCapture.labels.selfie")}
              facing="user"
              guide="oval"
              onCapture={(image) => setSelfie(URL.createObjectURL(image))}
            />
            {selfie ? (
              <img src={selfie} alt={t(i18n, "showcase.component.cameraCapture.labels.captured")} className="mt-2 h-40 rounded-md border border-border" />
            ) : null}
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-camera-capture/samples/guia-oval.tsx.sample" />
        </Section>

        <Section
          id="exemplo-3"
          title={`3) ${t(i18n, "showcase.component.cameraCapture.sections.rect.title")}`}
          description={t(i18n, "showcase.component.cameraCapture.sections.rect.description")}
        >
          <div className="w-80">
            <SgCameraCapture
              id="demo-rect"
              label={t(i18n, "showcase.component.cameraCapture.labels.document")}
              facing="environment"
              guide="rect"
              resolution="high"
              previewHeight={240}
            />
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-camera-capture/samples/guia-retangular.tsx.sample" />
        </Section>

        <Section
          id="exemplo-4"
          title={`4) ${t(i18n, "showcase.component.cameraCapture.sections.errors.title")}`}
          description={t(i18n, "showcase.component.cameraCapture.sections.errors.description")}
        >
          <div className="w-80">
            <SgCameraCapture
              id="demo-errors"
              label={t(i18n, "showcase.component.cameraCapture.labels.photo")}
              onError={(code, message) => setCameraError(`${code}: ${message}`)}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              {t(i18n, "showcase.common.labels.currentValue", { value: cameraError ?? "-" })}
            </p>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-camera-capture/samples/erros.tsx.sample" />
        </Section>

        <Section
          id="exemplo-5"
          title={`5) ${t(i18n, "showcase.common.sections.i18n.title")}`}
          description={t(i18n, "showcase.common.sections.i18n.description", { keys: "components.inputs.camera.*" })}
        >
          <div className="w-80">
            <SgComponentsI18nProvider locale="fr" messages={{ "components.inputs.camera.capture": "Tirar foto agora" }}>
              <SgCameraCapture
                id="demo-i18n"
                label={t(i18n, "showcase.component.cameraCapture.labels.photo")}
              />
            </SgComponentsI18nProvider>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-camera-capture/samples/idioma.tsx.sample" />
        </Section>

        <Section id="exemplo-6" title="6) Playground" description={t(i18n, "showcase.common.playground.description")}>
          <SgPlayground
            title="SgCameraCapture Playground"
            interactive
            codeContract="appFile"
            playgroundFile="apps/showcase/src/app/components/sg-camera-capture/sg-camera-capture.tsx.playground"
            height={520}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={rows} />
        {aiComponent ? <ComponentAiPropsTable component={aiComponent} /> : null}
        {aiComponent ? <ComponentAiSummary component={aiComponent} /> : null}
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
