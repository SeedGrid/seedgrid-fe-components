"use client";

import React from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { SgButton, SgFileUpload, SgGrid, SgComponentsI18nProvider } from "@seedgrid/fe-components";
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

export default function SgFileUploadPage() {
  const i18n = useShowcaseI18n();
  const aiComponent = useAiManifestComponent("SgFileUpload");
  const [submitted, setSubmitted] = React.useState("");
  const { control, handleSubmit } = useForm<{ comprovantes: Array<{ name: string }> }>({ defaultValues: { comprovantes: [] } });
  const [names, setNames] = React.useState<string[]>([]);
  const [count, setCount] = React.useState(0);
  const [lastError, setLastError] = React.useState("-");
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
      { id: "exemplo-1", label: `1) ${t(i18n, "showcase.component.fileUpload.sections.basic.title")}` },
      { id: "exemplo-2", label: `2) ${t(i18n, "showcase.component.fileUpload.sections.many.title")}` },
      { id: "exemplo-3", label: `3) ${t(i18n, "showcase.component.fileUpload.sections.types.title")}` },
      { id: "exemplo-4", label: `4) ${t(i18n, "showcase.component.fileUpload.sections.limits.title")}` },
      { id: "exemplo-5", label: `5) ${t(i18n, "showcase.component.fileUpload.sections.disabled.title")}` },
      { id: "exemplo-6", label: `6) ${t(i18n, "showcase.common.sections.i18n.title")}` },
      { id: "exemplo-7", label: `7) ${t(i18n, "showcase.component.fileUpload.sections.form.title")}` },
      { id: "exemplo-8", label: "8) Playground" }
    ],
    [i18n.locale]
  );
  const rows: ShowcasePropRow[] = [
    { prop: "id", type: "string", defaultValue: "-", description: t(i18n, "showcase.component.fileUpload.props.rows.id") },
    { prop: "label", type: "string", defaultValue: "-", description: t(i18n, "showcase.component.fileUpload.props.rows.label") },
    { prop: "value / defaultValue", type: "SgFileValue[]", defaultValue: "-", description: t(i18n, "showcase.component.fileUpload.props.rows.value") },
    { prop: "onChange", type: "(files: SgFileValue[]) => void", defaultValue: "-", description: t(i18n, "showcase.component.fileUpload.props.rows.onChange") },
    { prop: "onError", type: "(code: FileErrorCode, message: string, fileName: string) => void", defaultValue: "-", description: t(i18n, "showcase.component.fileUpload.props.rows.onError") },
    { prop: "mediaType", type: "SgMediaType[]", defaultValue: "-", description: t(i18n, "showcase.component.fileUpload.props.rows.mediaType") },
    { prop: "accept", type: "string", defaultValue: "-", description: t(i18n, "showcase.component.fileUpload.props.rows.accept") },
    { prop: "maxFiles", type: "number", defaultValue: "1", description: t(i18n, "showcase.component.fileUpload.props.rows.maxFiles") },
    { prop: "maxSizePerFile", type: "number | string", defaultValue: "-", description: t(i18n, "showcase.component.fileUpload.props.rows.maxSizePerFile") },
    { prop: "maxSizeTotal", type: "number | string", defaultValue: "-", description: t(i18n, "showcase.component.fileUpload.props.rows.maxSizeTotal") },
    { prop: "required / requiredMessage", type: "boolean / string", defaultValue: "false / auto", description: t(i18n, "showcase.component.fileUpload.props.rows.required") },
    { prop: "enabled / readOnly", type: "boolean", defaultValue: "true / false", description: t(i18n, "showcase.component.fileUpload.props.rows.locked") },
    { prop: "hintText", type: "string", defaultValue: "-", description: t(i18n, "showcase.component.fileUpload.props.rows.hintText") },
    { prop: "extraCheck", type: "(file: File, info: { mime: string }) => Promise<SgFileRejection | null>", defaultValue: "-", description: t(i18n, "showcase.component.fileUpload.props.rows.extraCheck") },
    { prop: "thumbnailBuilder / thumbnailSize", type: "(file, size) => ReactNode / number", defaultValue: "- / 96", description: t(i18n, "showcase.component.fileUpload.props.rows.thumbnail") },
    { prop: "name / control / rules", type: "react-hook-form", defaultValue: "-", description: t(i18n, "showcase.component.fileUpload.props.rows.rhf") }
  ];

  return (
    <I18NReady>
      <div
        className="max-w-4xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <div ref={stickyHeaderRef} className="sticky top-0 z-50 isolate max-h-[52vh] overflow-y-auto bg-background pb-2 pt-2 md:-top-8 md:max-h-none md:overflow-visible md:pb-2 md:pt-8">
          <div className="rounded-lg border border-border bg-background p-4 shadow-sm">
            <h1 className="text-3xl font-bold">{t(i18n, "showcase.component.fileUpload.title")}</h1>
            <p className="mt-2 text-muted-foreground">{t(i18n, "showcase.component.fileUpload.subtitle")}</p>
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
          title={`1) ${t(i18n, "showcase.component.fileUpload.sections.basic.title")}`}
          description={t(i18n, "showcase.component.fileUpload.sections.basic.description")}
        >
          <div className="w-80">
            <SgFileUpload
              id="demo-basic"
              label={t(i18n, "showcase.component.fileUpload.labels.attachment")}
              onChange={(files) => setNames(files.map((file) => file.name))}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              {t(i18n, "showcase.common.labels.currentValue", { value: names.length > 0 ? names.join(", ") : "-" })}
            </p>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-file-upload/samples/basico.tsx.sample" />
        </Section>

        <Section
          id="exemplo-2"
          title={`2) ${t(i18n, "showcase.component.fileUpload.sections.many.title")}`}
          description={t(i18n, "showcase.component.fileUpload.sections.many.description")}
        >
          <div className="w-80">
            <SgFileUpload
              id="demo-many"
              label={t(i18n, "showcase.component.fileUpload.labels.attachments")}
              maxFiles={3}
              hintText={t(i18n, "showcase.component.fileUpload.labels.manyHint")}
              onChange={(files) => setCount(files.length)}
              onError={(code, _message, fileName) => setLastError(`${fileName}: ${code}`)}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              {t(i18n, "showcase.component.fileUpload.labels.filesCount", { count: String(count) })}
            </p>
            <p className="text-xs text-muted-foreground">
              {t(i18n, "showcase.component.fileUpload.labels.lastRejection", { value: lastError })}
            </p>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-file-upload/samples/varios.tsx.sample" />
        </Section>

        <Section
          id="exemplo-3"
          title={`3) ${t(i18n, "showcase.component.fileUpload.sections.types.title")}`}
          description={t(i18n, "showcase.component.fileUpload.sections.types.description")}
        >
          <div className="w-80">
            <SgFileUpload
              id="demo-types"
              label={t(i18n, "showcase.component.fileUpload.labels.sheetOrPdf")}
              mediaType={["pdf", "xls", "xlsx"]}
              maxFiles={2}
            />
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-file-upload/samples/tipos.tsx.sample" />
        </Section>

        <Section
          id="exemplo-4"
          title={`4) ${t(i18n, "showcase.component.fileUpload.sections.limits.title")}`}
          description={t(i18n, "showcase.component.fileUpload.sections.limits.description")}
        >
          <div className="w-80">
            <SgFileUpload
              id="demo-limits"
              label={t(i18n, "showcase.component.fileUpload.labels.documents")}
              maxFiles={5}
              maxSizePerFile="2MB"
              maxSizeTotal="5MB"
              hintText={t(i18n, "showcase.component.fileUpload.labels.limitsHint")}
            />
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-file-upload/samples/limites.tsx.sample" />
        </Section>

        <Section
          id="exemplo-5"
          title={`5) ${t(i18n, "showcase.component.fileUpload.sections.disabled.title")}`}
          description={t(i18n, "showcase.component.fileUpload.sections.disabled.description")}
        >
          <div className="w-80">
            <SgFileUpload
              id="demo-disabled"
              label={t(i18n, "showcase.component.fileUpload.labels.attachment")}
              enabled={false}
              defaultValue={[{ name: "contrato.pdf", url: "/contrato.pdf", size: 482304 }]}
            />
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-file-upload/samples/desabilitado.tsx.sample" />
        </Section>

        <Section
          id="exemplo-6"
          title={`6) ${t(i18n, "showcase.common.sections.i18n.title")}`}
          description={t(i18n, "showcase.common.sections.i18n.description", { keys: "components.inputs.fileupload.*" })}
        >
          <div className="w-80">
            <SgComponentsI18nProvider locale="fr" messages={{ "components.inputs.fileupload.drop": "Arraste o contrato aqui" }}>
              <SgFileUpload
                id="demo-i18n"
                label={t(i18n, "showcase.component.fileUpload.labels.attachment")}
              />
            </SgComponentsI18nProvider>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-file-upload/samples/idioma.tsx.sample" />
        </Section>

        <Section
          id="exemplo-7"
          title={`7) ${t(i18n, "showcase.component.fileUpload.sections.form.title")}`}
          description={t(i18n, "showcase.component.fileUpload.sections.form.description")}
        >
          <form className="w-80 space-y-3" onSubmit={handleSubmit((values) => setSubmitted(t(i18n, "showcase.component.fileUpload.form.filesCount", { count: values.comprovantes.length })))}>
            <SgFileUpload
              id="comprovantes"
              name="comprovantes"
              control={control}
              label={t(i18n, "showcase.component.fileUpload.labels.receipts")}
              maxFiles={3}
              required
              requiredMessage={t(i18n, "showcase.component.fileUpload.labels.receiptsRequired")}
            />
            <SgButton type="submit">{t(i18n, "showcase.component.fileUpload.labels.send")}</SgButton>
            {submitted ? <p className="text-sm">{t(i18n, "showcase.component.fileUpload.labels.sent", { value: submitted })}</p> : null}
          </form>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-file-upload/samples/dentro-de-um-formulario.tsx.sample" />
        </Section>

        <Section id="exemplo-8" title="8) Playground" description={t(i18n, "showcase.common.playground.description")}>
          <SgPlayground
            title="SgFileUpload Playground"
            interactive
            codeContract="appFile"
            playgroundFile="apps/showcase/src/app/components/sg-file-upload/sg-file-upload.tsx.playground"
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
