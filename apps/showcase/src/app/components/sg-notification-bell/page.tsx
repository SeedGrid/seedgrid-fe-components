"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, FileText } from "lucide-react";
import { SgButton, SgGrid, SgNotificationBell, SgRealtimeProvider } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import SgCodeBlockBase from "../sgCodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import ComponentAiPropsTable from "../ai/ComponentAiPropsTable";
import ComponentAiSummary from "../ai/ComponentAiSummary";
import { useAiManifestComponent } from "../ai/useAiManifestComponent";
import { createDemoFetcher, createDemoPulse, demoPulseToken } from "./demo-fetcher";
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

export default function SgNotificationBellPage() {
  const i18n = useShowcaseI18n();
  const aiComponent = useAiManifestComponent("SgNotificationBell");
  const demoBasic = React.useMemo(() => createDemoFetcher(), []);
  const pulseBasic = React.useMemo(() => createDemoPulse(), []);
  const demoTypes = React.useMemo(() => createDemoFetcher(), []);
  const demoToggle = React.useMemo(() => createDemoFetcher(), []);
  const demoNoToggle = React.useMemo(() => createDemoFetcher(), []);
  const [opened, setOpened] = React.useState("-");
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
      { id: "exemplo-1", label: `1) ${t(i18n, "showcase.component.notificationBell.sections.basic.title")}` },
      { id: "exemplo-2", label: `2) ${t(i18n, "showcase.component.notificationBell.sections.types.title")}` },
      { id: "exemplo-3", label: `3) ${t(i18n, "showcase.component.notificationBell.sections.toggle.title")}` },
      { id: "exemplo-4", label: `4) ${t(i18n, "showcase.component.notificationBell.sections.noToggle.title")}` },
      { id: "exemplo-5", label: "5) Playground" }
    ],
    [i18n.locale]
  );
  const row = (prop: string, type: string, defaultValue: string, key: string): ShowcasePropRow => ({
    prop,
    type,
    defaultValue,
    description: t(i18n, `showcase.component.notificationBell.props.rows.${key}`)
  });
  const rows: ShowcasePropRow[] = [
    row("apiUrl", "string", "/api/user-notifications", "apiUrl"),
    row("tokenEndpoint", "string", "/api/realtime/connect", "tokenEndpoint"),
    row("requestInit", "RequestInit", "-", "requestInit"),
    row("fetcher", "(input: string, init?: RequestInit) => Promise<Response>", "-", "fetcher"),
    row("types", "Record<string, SgNotificationTypeConfig>", "-", "types"),
    row("eventPattern", "string", "user-notification.*", "eventPattern"),
    row("pollIntervalMs", "number", "45000", "pollIntervalMs"),
    row("maxVisible", "number", "100", "maxVisible"),
    row("placement", '"auto" | "top" | "right" | "bottom" | "left"', "auto", "placement"),
    row("showUnreadToggle", "boolean", "true", "showUnreadToggle"),
    row("defaultUnreadOnly", "boolean", "true", "defaultUnreadOnly"),
    row("onNotification", "(notification: SgNotification) => void", "-", "onNotification"),
    row("onNotificationDelete", "(notification: SgNotification) => void", "-", "onNotificationDelete"),
    row("onOpen", "(notification: SgNotification) => void", "-", "onOpen"),
    row("onPollingTick", "(stats: SgPollingStats) => void", "-", "onPollingTick")
  ];

  return (
    <I18NReady>
      <div
        className="max-w-4xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title={t(i18n, "showcase.component.notificationBell.title")}
          subtitle={t(i18n, "showcase.component.notificationBell.subtitle")}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section
          id="exemplo-1"
          title={`1) ${t(i18n, "showcase.component.notificationBell.sections.basic.title")}`}
          description={t(i18n, "showcase.component.notificationBell.sections.basic.description")}
        >
          <div className="flex min-h-[26rem] w-full items-start gap-3">
            <SgRealtimeProvider channels={["user-notifications"]} fetchToken={demoPulseToken} connectOptions={{ webSocketImpl: pulseBasic.webSocketImpl }}>
              <SgNotificationBell fetcher={demoBasic} />
            </SgRealtimeProvider>
            <SgButton
              size="sm"
              appearance="outline"
              onClick={() => {
                const id = demoBasic.notify("report.ready", "Novo relatório", "Acabou de ficar pronto.");
                pulseBasic.publish("user-notification.created", { notificationPublicId: id, type: "report.ready" });
              }}
            >
              Simular notificação
            </SgButton>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-notification-bell/samples/basico.tsx.sample" />
        </Section>

        <Section
          id="exemplo-2"
          title={`2) ${t(i18n, "showcase.component.notificationBell.sections.types.title")}`}
          description={t(i18n, "showcase.component.notificationBell.sections.types.description")}
        >
          <div className="flex min-h-[26rem] w-full items-start gap-3">
            <SgNotificationBell
              fetcher={demoTypes}
              types={{
                "report.ready": { icon: <FileText className="size-4" />, onOpen: (n) => setOpened(`baixar relatório ${n.publicId}`) },
                "backup.finished": { icon: <CheckCircle2 className="size-4" />, onOpen: (n) => setOpened(`baixar backup ${n.publicId}`) }
              }}
              onOpen={(n) => setOpened((prev) => `${prev} (abriu: ${n.title})`)}
              onNotificationDelete={(n) => setOpened(`excluiu: ${n.title}`)}
            />
            <span className="text-xs text-muted-foreground">Último evento: {opened}</span>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-notification-bell/samples/tipos.tsx.sample" />
        </Section>

        <Section
          id="exemplo-3"
          title={`3) ${t(i18n, "showcase.component.notificationBell.sections.toggle.title")}`}
          description={t(i18n, "showcase.component.notificationBell.sections.toggle.description")}
        >
          <div className="flex min-h-[26rem] w-full items-start gap-3">
            <SgNotificationBell fetcher={demoToggle} defaultUnreadOnly={false} />
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-notification-bell/samples/interruptor.tsx.sample" />
        </Section>

        <Section
          id="exemplo-4"
          title={`4) ${t(i18n, "showcase.component.notificationBell.sections.noToggle.title")}`}
          description={t(i18n, "showcase.component.notificationBell.sections.noToggle.description")}
        >
          <div className="flex min-h-[26rem] w-full items-start gap-3">
            <SgNotificationBell fetcher={demoNoToggle} showUnreadToggle={false} />
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-notification-bell/samples/sem-interruptor.tsx.sample" />
        </Section>

        <section className="rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold">Uso real (não executa na demo)</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Na sua aplicação o sino conversa com as rotas da extension user-notifications e com o Pulse; esta página usa uma caixa simulada em memória.
          </p>
          <div className="mt-4">
            <CodeBlock sampleFile="apps/showcase/src/app/components/sg-notification-bell/samples/uso-real.tsx.sample" />
          </div>
        </section>

        <Section id="exemplo-5" title="5) Playground" description={t(i18n, "showcase.common.playground.description")}>
          <SgPlayground
            title="SgNotificationBell Playground"
            interactive
            codeContract="appFile"
            playgroundFile="apps/showcase/src/app/components/sg-notification-bell/sg-notification-bell.tsx.playground"
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
