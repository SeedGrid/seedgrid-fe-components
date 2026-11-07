"use client";

import React from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { SgButton, SgGrid, SgImageUpload, SgComponentsI18nProvider } from "@seedgrid/fe-components";
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

export default function SgImageUploadPage() {
  const i18n = useShowcaseI18n();
  const aiComponent = useAiManifestComponent("SgImageUpload");
  const [submitted, setSubmitted] = React.useState("");
  const { control, handleSubmit } = useForm<{ documento: Array<{ name: string }> }>({ defaultValues: { documento: [] } });
  const [fileInfo, setFileInfo] = React.useState<string | null>(null);
  const [galleryCount, setGalleryCount] = React.useState(0);
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
      { id: "exemplo-1", label: `1) ${t(i18n, "showcase.component.imageUpload.sections.basic.title")}` },
      { id: "exemplo-2", label: `2) ${t(i18n, "showcase.component.imageUpload.sections.many.title")}` },
      { id: "exemplo-3", label: `3) ${t(i18n, "showcase.component.imageUpload.sections.rules.title")}` },
      { id: "exemplo-4", label: `4) ${t(i18n, "showcase.component.imageUpload.sections.saved.title")}` },
      { id: "exemplo-5", label: `5) ${t(i18n, "showcase.component.imageUpload.sections.disabled.title")}` },
      { id: "exemplo-6", label: `6) ${t(i18n, "showcase.common.sections.i18n.title")}` },
      { id: "exemplo-7", label: `7) ${t(i18n, "showcase.component.imageUpload.sections.form.title")}` },
      { id: "exemplo-8", label: "8) Playground" }
    ],
    [i18n.locale]
  );
  const rows: ShowcasePropRow[] = [
    { prop: "id", type: "string", defaultValue: "-", description: t(i18n, "showcase.component.imageUpload.props.rows.id") },
    { prop: "label", type: "string", defaultValue: "-", description: t(i18n, "showcase.component.imageUpload.props.rows.label") },
    { prop: "value / defaultValue", type: "SgFileValue[]", defaultValue: "-", description: t(i18n, "showcase.component.imageUpload.props.rows.value") },
    { prop: "onChange", type: "(files: SgFileValue[]) => void", defaultValue: "-", description: t(i18n, "showcase.component.imageUpload.props.rows.onChange") },
    { prop: "onError", type: "(code: FileErrorCode, message: string, fileName: string) => void", defaultValue: "-", description: t(i18n, "showcase.component.imageUpload.props.rows.onError") },
    { prop: "accept", type: "string", defaultValue: "-", description: t(i18n, "showcase.component.imageUpload.props.rows.accept") },
    { prop: "maxFiles", type: "number", defaultValue: "1", description: t(i18n, "showcase.component.imageUpload.props.rows.maxFiles") },
    { prop: "maxSizePerFile", type: "number | string", defaultValue: "-", description: t(i18n, "showcase.component.imageUpload.props.rows.maxSizePerFile") },
    { prop: "maxSizeTotal", type: "number | string", defaultValue: "-", description: t(i18n, "showcase.component.imageUpload.props.rows.maxSizeTotal") },
    { prop: "minWidth / minHeight", type: "number", defaultValue: "-", description: t(i18n, "showcase.component.imageUpload.props.rows.minSize") },
    { prop: "aspect", type: "number", defaultValue: "-", description: t(i18n, "showcase.component.imageUpload.props.rows.aspect") },
    { prop: "previewHeight", type: "number", defaultValue: "160", description: t(i18n, "showcase.component.imageUpload.props.rows.previewHeight") },
    { prop: "required / requiredMessage", type: "boolean / string", defaultValue: "false / auto", description: t(i18n, "showcase.component.imageUpload.props.rows.required") },
    { prop: "enabled / readOnly", type: "boolean", defaultValue: "true / false", description: t(i18n, "showcase.component.imageUpload.props.rows.locked") },
    { prop: "hintText", type: "string", defaultValue: "-", description: t(i18n, "showcase.component.imageUpload.props.rows.hintText") },
    { prop: "name / control / rules", type: "react-hook-form", defaultValue: "-", description: t(i18n, "showcase.component.imageUpload.props.rows.rhf") }
  ];

  return (
    <I18NReady>
      <div
        className="max-w-4xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <div ref={stickyHeaderRef} className="sticky top-0 z-50 isolate max-h-[52vh] overflow-y-auto bg-background pb-2 pt-2 md:-top-8 md:max-h-none md:overflow-visible md:pb-2 md:pt-8">
          <div className="rounded-lg border border-border bg-background p-4 shadow-sm">
            <h1 className="text-3xl font-bold">{t(i18n, "showcase.component.imageUpload.title")}</h1>
            <p className="mt-2 text-muted-foreground">{t(i18n, "showcase.component.imageUpload.subtitle")}</p>
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
          title={`1) ${t(i18n, "showcase.component.imageUpload.sections.basic.title")}`}
          description={t(i18n, "showcase.component.imageUpload.sections.basic.description")}
        >
          <div className="w-80">
            <SgImageUpload
              id="demo-basic"
              label={t(i18n, "showcase.component.imageUpload.labels.photo")}
              onChange={(files) => setFileInfo(files.length > 0 ? `${files[0]?.name} (${files[0]?.size ?? 0} bytes)` : null)}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              {t(i18n, "showcase.common.labels.currentValue", { value: fileInfo ?? "-" })}
            </p>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-image-upload/samples/basico.tsx.sample" />
        </Section>

        <Section
          id="exemplo-2"
          title={`2) ${t(i18n, "showcase.component.imageUpload.sections.many.title")}`}
          description={t(i18n, "showcase.component.imageUpload.sections.many.description")}
        >
          <div className="w-80">
            <SgImageUpload
              id="demo-gallery"
              label={t(i18n, "showcase.component.imageUpload.labels.gallery")}
              maxFiles={4}
              maxSizePerFile="2MB"
              maxSizeTotal="6MB"
              hintText={t(i18n, "showcase.component.imageUpload.labels.galleryHint")}
              onChange={(files) => setGalleryCount(files.length)}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              {t(i18n, "showcase.component.imageUpload.labels.imagesCount", { count: String(galleryCount) })}
            </p>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-image-upload/samples/varias.tsx.sample" />
        </Section>

        <Section
          id="exemplo-3"
          title={`3) ${t(i18n, "showcase.component.imageUpload.sections.rules.title")}`}
          description={t(i18n, "showcase.component.imageUpload.sections.rules.description")}
        >
          <div className="w-80">
            <SgImageUpload
              id="demo-rules"
              label={t(i18n, "showcase.component.imageUpload.labels.avatar")}
              accept="image/png,image/jpeg"
              maxSizePerFile="2MB"
              minWidth={200}
              minHeight={200}
              aspect={1}
              hintText={t(i18n, "showcase.component.imageUpload.labels.rulesHint")}
            />
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-image-upload/samples/regras.tsx.sample" />
        </Section>

        <Section
          id="exemplo-4"
          title={`4) ${t(i18n, "showcase.component.imageUpload.sections.saved.title")}`}
          description={t(i18n, "showcase.component.imageUpload.sections.saved.description")}
        >
          <div className="w-80">
            <SgImageUpload
              id="demo-saved"
              label={t(i18n, "showcase.component.imageUpload.labels.logo")}
              defaultValue={[{ name: "logo.ico", url: "/favicon.ico" }]}
              previewHeight={96}
            />
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-image-upload/samples/valor-salvo.tsx.sample" />
        </Section>

        <Section
          id="exemplo-5"
          title={`5) ${t(i18n, "showcase.component.imageUpload.sections.disabled.title")}`}
          description={t(i18n, "showcase.component.imageUpload.sections.disabled.description")}
        >
          <div className="w-80">
            <SgImageUpload id="demo-disabled" label={t(i18n, "showcase.component.imageUpload.labels.photo")} enabled={false} />
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-image-upload/samples/desabilitado.tsx.sample" />
        </Section>

        <Section
          id="exemplo-6"
          title={`6) ${t(i18n, "showcase.common.sections.i18n.title")}`}
          description={t(i18n, "showcase.common.sections.i18n.description", { keys: "components.inputs.imageupload.*" })}
        >
          <div className="w-80">
            <SgComponentsI18nProvider locale="fr" messages={{ "components.inputs.imageupload.drop": "Arraste a foto aqui" }}>
              <SgImageUpload
                id="demo-i18n"
                label={t(i18n, "showcase.component.imageUpload.labels.photo")}
              />
            </SgComponentsI18nProvider>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-image-upload/samples/idioma.tsx.sample" />
        </Section>

        <Section
          id="exemplo-7"
          title={`7) ${t(i18n, "showcase.component.imageUpload.sections.form.title")}`}
          description={t(i18n, "showcase.component.imageUpload.sections.form.description")}
        >
          <form className="w-80 space-y-3" onSubmit={handleSubmit((values) => setSubmitted(values.documento[0]?.name ?? "-"))}>
            <SgImageUpload
              id="documento"
              name="documento"
              control={control}
              label={t(i18n, "showcase.component.imageUpload.labels.documentPhoto")}
              required
              requiredMessage={t(i18n, "showcase.component.imageUpload.labels.documentPhotoRequired")}
            />
            <SgButton type="submit">{t(i18n, "showcase.component.imageUpload.labels.send")}</SgButton>
            {submitted ? <p className="text-sm">{t(i18n, "showcase.component.imageUpload.labels.sent", { value: submitted })}</p> : null}
          </form>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-image-upload/samples/dentro-de-um-formulario.tsx.sample" />
        </Section>

        <Section id="exemplo-8" title="8) Playground" description={t(i18n, "showcase.common.playground.description")}>
          <SgPlayground
            title="SgImageUpload Playground"
            interactive
            codeContract="appFile"
            playgroundFile="apps/showcase/src/app/components/sg-image-upload/sg-image-upload.tsx.playground"
            height={560}
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
