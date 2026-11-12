"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { SgButton, SgGrid, SgInputDateTime, SgComponentsI18nProvider } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import SgCodeBlockBase from "../sgCodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
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

export default function SgInputDateTimePage() {
  const i18n = useShowcaseI18n();
  const aiComponent = useAiManifestComponent("SgInputDateTime");
  const [instant, setInstant] = React.useState<string | null>(null);
  const [zoneInstant, setZoneInstant] = React.useState("2026-11-03T17:30:00.000Z");
  const [lastEvent, setLastEvent] = React.useState("-");
  const [submitted, setSubmitted] = React.useState("");
  const { control, handleSubmit } = useForm<{ appointment: string }>({ defaultValues: { appointment: "" } });
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
      { id: "exemplo-1", label: `1) ${t(i18n, "showcase.component.inputDateTime.sections.basic.title")}` },
      { id: "exemplo-2", label: `2) ${t(i18n, "showcase.component.inputDateTime.sections.zone.title")}` },
      { id: "exemplo-3", label: `3) ${t(i18n, "showcase.component.inputDateTime.sections.limits.title")}` },
      { id: "exemplo-4", label: `4) ${t(i18n, "showcase.component.inputDateTime.sections.seconds.title")}` },
      { id: "exemplo-5", label: `5) ${t(i18n, "showcase.component.inputDateTime.sections.events.title")}` },
      { id: "exemplo-6", label: `6) ${t(i18n, "showcase.component.inputDateTime.sections.form.title")}` },
      { id: "exemplo-7", label: `7) ${t(i18n, "showcase.common.sections.labelPosition.title")}` },
      { id: "exemplo-8", label: `8) ${t(i18n, "showcase.common.sections.i18n.title")}` },
      { id: "exemplo-9", label: "9) Playground" }
    ],
    [i18n.locale]
  );
  const rows: ShowcasePropRow[] = [
    { prop: "id", type: "string", defaultValue: "-", description: t(i18n, "showcase.component.inputDateTime.props.rows.id") },
    { prop: "label", type: "string", defaultValue: "-", description: t(i18n, "showcase.component.inputDateTime.props.rows.label") },
    { prop: "value / defaultValue", type: "string | Date | null", defaultValue: "-", description: t(i18n, "showcase.component.inputDateTime.props.rows.value") },
    { prop: "onChange", type: "(value: string | null, local: string) => void", defaultValue: "-", description: t(i18n, "showcase.component.inputDateTime.props.rows.onChange") },
    { prop: "timeZone", type: "string", defaultValue: '"local"', description: t(i18n, "showcase.component.inputDateTime.props.rows.timeZone") },
    { prop: "minDate / maxDate", type: "string | Date", defaultValue: "-", description: t(i18n, "showcase.component.inputDateTime.props.rows.minMax") },
    { prop: "minuteStep", type: "number", defaultValue: "-", description: t(i18n, "showcase.component.inputDateTime.props.rows.minuteStep") },
    { prop: "showSeconds", type: "boolean", defaultValue: "false", description: t(i18n, "showcase.component.inputDateTime.props.rows.showSeconds") },
    { prop: "required / requiredMessage", type: "boolean / string", defaultValue: "false / auto", description: t(i18n, "showcase.component.inputDateTime.props.rows.required") },
    { prop: "validation / onValidation", type: "callbacks", defaultValue: "-", description: t(i18n, "showcase.component.inputDateTime.props.rows.validation") },
    { prop: "labelPosition", type: '"float" | "top" | "left"', defaultValue: '"float"', description: t(i18n, "showcase.common.props.rows.labelPosition") },
    { prop: "labelWidth", type: "number | string", defaultValue: '"11rem"', description: t(i18n, "showcase.common.props.rows.labelWidth") },
    { prop: "labelAlign", type: '"start" | "center" | "end"', defaultValue: '"start"', description: t(i18n, "showcase.common.props.rows.labelAlign") },
    { prop: "elevation", type: '"none" | "sm" | "md" | "lg"', defaultValue: '"sm"', description: t(i18n, "showcase.common.props.rows.elevation") },
    { prop: "inputProps", type: "InputHTMLAttributes", defaultValue: "{}", description: t(i18n, "showcase.component.inputDateTime.props.rows.inputProps") }
  ];

  return (
    <I18NReady>
      <div
        className="max-w-4xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title={t(i18n, "showcase.component.inputDateTime.title")}
          subtitle={t(i18n, "showcase.component.inputDateTime.subtitle")}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section
          id="exemplo-1"
          title={`1) ${t(i18n, "showcase.component.inputDateTime.sections.basic.title")}`}
          description={t(i18n, "showcase.component.inputDateTime.sections.basic.description")}
        >
          <div className="w-80">
            <SgInputDateTime
              id="demo-basic"
              label={t(i18n, "showcase.component.inputDateTime.labels.when")}
              onChange={(value) => setInstant(value)}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              {t(i18n, "showcase.common.labels.currentValue", { value: instant ?? "-" })}
            </p>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-input-date-time/samples/basico.tsx.sample" />
        </Section>

        <Section
          id="exemplo-2"
          title={`2) ${t(i18n, "showcase.component.inputDateTime.sections.zone.title")}`}
          description={t(i18n, "showcase.component.inputDateTime.sections.zone.description")}
        >
          <div className="w-80 space-y-4">
            <SgInputDateTime
              id="demo-zone-utc"
              label="UTC"
              timeZone="UTC"
              value={zoneInstant}
              onChange={(value) => value !== null && setZoneInstant(value)}
            />
            <SgInputDateTime
              id="demo-zone-sp"
              label="-03:00"
              timeZone="-03:00"
              value={zoneInstant}
              onChange={(value) => value !== null && setZoneInstant(value)}
            />
            <SgInputDateTime
              id="demo-zone-in"
              label="+05:30"
              timeZone="+05:30"
              value={zoneInstant}
              onChange={(value) => value !== null && setZoneInstant(value)}
            />
            <p className="text-xs text-muted-foreground">
              {t(i18n, "showcase.common.labels.currentValue", { value: zoneInstant || "-" })}
            </p>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-input-date-time/samples/fuso.tsx.sample" />
        </Section>

        <Section
          id="exemplo-3"
          title={`3) ${t(i18n, "showcase.component.inputDateTime.sections.limits.title")}`}
          description={t(i18n, "showcase.component.inputDateTime.sections.limits.description")}
        >
          <div className="w-80">
            <SgInputDateTime
              id="demo-limits"
              label={t(i18n, "showcase.component.inputDateTime.labels.appointment")}
              timeZone="UTC"
              minDate="2026-11-01T08:00:00Z"
              maxDate="2026-11-30T18:00:00Z"
              minuteStep={15}
              required
            />
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-input-date-time/samples/limites.tsx.sample" />
        </Section>

        <Section
          id="exemplo-4"
          title={`4) ${t(i18n, "showcase.component.inputDateTime.sections.seconds.title")}`}
          description={t(i18n, "showcase.component.inputDateTime.sections.seconds.description")}
        >
          <div className="w-80">
            <SgInputDateTime
              id="demo-seconds"
              label={t(i18n, "showcase.component.inputDateTime.labels.event")}
              timeZone="UTC"
              defaultValue="2026-11-03T17:30:45Z"
              showSeconds
            />
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-input-date-time/samples/segundos.tsx.sample" />
        </Section>

        <Section
          id="exemplo-5"
          title={`5) ${t(i18n, "showcase.component.inputDateTime.sections.events.title")}`}
          description={t(i18n, "showcase.component.inputDateTime.sections.events.description")}
        >
          <div className="w-80">
            <SgInputDateTime
              id="demo-events"
              label={t(i18n, "showcase.component.inputDateTime.labels.when")}
              onChange={(value, local) => setLastEvent(`onChange: ${value ?? local}`)}
              onEnter={() => setLastEvent("onEnter")}
              onExit={() => setLastEvent("onExit")}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              {t(i18n, "showcase.component.inputDateTime.labels.lastEvent", { value: lastEvent })}
            </p>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-input-date-time/samples/eventos.tsx.sample" />
        </Section>

        <Section
          id="exemplo-6"
          title={`6) ${t(i18n, "showcase.component.inputDateTime.sections.form.title")}`}
          description={t(i18n, "showcase.component.inputDateTime.sections.form.description")}
        >
          <form className="w-80 space-y-3" onSubmit={handleSubmit((values) => setSubmitted(values.appointment))}>
            <SgInputDateTime
              id="demo-form"
              name="appointment"
              control={control}
              label={t(i18n, "showcase.component.inputDateTime.labels.appointment")}
              timeZone="-03:00"
              required
              requiredMessage={t(i18n, "showcase.component.inputDateTime.messages.required")}
            />
            <SgButton type="submit">{t(i18n, "showcase.component.inputDateTime.labels.send")}</SgButton>
            {submitted ? <p className="text-sm">{t(i18n, "showcase.component.inputDateTime.labels.sent", { value: submitted })}</p> : null}
          </form>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-input-date-time/samples/dentro-de-um-formulario.tsx.sample" />
        </Section>

        <Section
          id="exemplo-7"
          title={`7) ${t(i18n, "showcase.common.sections.labelPosition.title")}`}
          description={t(i18n, "showcase.common.sections.labelPosition.description")}
        >
          <SgGrid columns={{ base: 1, md: 3 }} gap={8} className="w-full">
            <SgInputDateTime
              id="sg-input-date-time-label-float"
              label={t(i18n, "showcase.common.labels.labelFloat")}
              labelPosition="float"
            />
            <SgInputDateTime
              id="sg-input-date-time-label-top"
              label={t(i18n, "showcase.common.labels.labelTop")}
              labelPosition="top"
            />
            <SgInputDateTime
              id="sg-input-date-time-label-left"
              label={t(i18n, "showcase.common.labels.labelLeft")}
              labelPosition="left"
              labelWidth={140}
              labelAlign="end"
            />
          </SgGrid>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-input-date-time/samples/posicao-do-rotulo.tsx.sample" />
        </Section>

        <Section
          id="exemplo-8"
          title={`8) ${t(i18n, "showcase.common.sections.i18n.title")}`}
          description={t(i18n, "showcase.common.sections.i18n.description", { keys: "components.inputs.datetime.*" })}
        >
          <div className="w-80">
            <SgComponentsI18nProvider locale="fr" messages={{ "components.inputs.datetime.min": t(i18n, "showcase.component.inputDateTime.messages.min") }}>
              <SgInputDateTime
                id="demo-i18n"
                label={t(i18n, "showcase.component.inputDateTime.labels.appointment")}
                timeZone="UTC"
                minDate="2026-11-01T08:00:00Z"
                defaultValue="2026-10-01T10:00:00Z"
                required
              />
            </SgComponentsI18nProvider>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-input-date-time/samples/idioma.tsx.sample" />
        </Section>

        <Section id="exemplo-9" title="9) Playground" description={t(i18n, "showcase.common.playground.description")}>
          <SgPlayground
            title="SgInputDateTime Playground"
            interactive
            codeContract="appFile"
            playgroundFile="apps/showcase/src/app/components/sg-input-date-time/sg-input-date-time.tsx.playground"
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
