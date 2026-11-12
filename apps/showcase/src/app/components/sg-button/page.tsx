"use client";

import React from "react";
import Link from "next/link";
import { Check, X, Bookmark, Search, Users, Bell, Heart } from "lucide-react";
import { SgButton, SgGrid, SgWhistler, sgWhistle } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import ComponentAiPropsTable from "../ai/ComponentAiPropsTable";
import ComponentAiSummary from "../ai/ComponentAiSummary";
import SgCodeBlockBase from "../sgCodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import { loadAiManifestComponent, type AiManifestComponent } from "../../lib/ai-manifest";
import { t, useShowcaseI18n } from "../../../i18n";

const K = "showcase.component.button";

const SEVERITIES = ["primary", "secondary", "success", "info", "warning", "help", "danger"] as const;

const ICON_MAP = [
  { severity: "primary", icon: <Bookmark className="size-4" /> },
  { severity: "secondary", icon: <Search className="size-4" /> },
  { severity: "success", icon: <Users className="size-4" /> },
  { severity: "info", icon: <Bell className="size-4" /> },
  { severity: "help", icon: <Heart className="size-4" /> },
  { severity: "danger", icon: <X className="size-4" /> },
  { severity: "warning", icon: <Check className="size-4" /> },
] as const;

function useFakeProcess(durationMs: number) {
  const [loading, setLoading] = React.useState(false);
  const timerRef = React.useRef<number | null>(null);

  const run = React.useCallback(() => {
    if (timerRef.current) return;
    setLoading(true);
    timerRef.current = window.setTimeout(() => {
      setLoading(false);
      timerRef.current = null;
    }, durationMs);
  }, [durationMs]);

  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  return { loading, run };
}

function AutoLoadingExample() {
  const i18n = useShowcaseI18n();
  const [status, setStatus] = React.useState(() => t(i18n, `${K}.async.idle`));

  const save = async () => {
    setStatus(t(i18n, `${K}.async.saving`));
    await new Promise((resolve) => window.setTimeout(resolve, 1500));
    setStatus(t(i18n, `${K}.async.done`));
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <SgButton onClick={save}>{t(i18n, `${K}.async.submit`)}</SgButton>
      <span className="text-sm text-muted-foreground">{status}</span>
    </div>
  );
}

function SyncAsyncExample() {
  const i18n = useShowcaseI18n();
  const [panel, setPanel] = React.useState(() => t(i18n, `${K}.async.closed`));
  const [status, setStatus] = React.useState(() => t(i18n, `${K}.async.idle`));

  const toggle = () => setPanel(panel === t(i18n, `${K}.async.open`) ? t(i18n, `${K}.async.closed`) : t(i18n, `${K}.async.open`));

  const save = async () => {
    setStatus(t(i18n, `${K}.async.saving`));
    await new Promise((resolve) => window.setTimeout(resolve, 1500));
    setStatus(t(i18n, `${K}.async.saved`));
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <SgButton appearance="outline" onClick={toggle}>{t(i18n, `${K}.async.togglePanel`)}</SgButton>
      <span className="text-sm text-muted-foreground">{panel}</span>
      <SgButton onClick={save}>{t(i18n, `${K}.async.save`)}</SgButton>
      <span className="text-sm text-muted-foreground">{status}</span>
    </div>
  );
}

function AsyncErrorExample() {
  const i18n = useShowcaseI18n();
  const save = async () => {
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 1200));
      throw new Error("Network error");
    } catch {
      sgWhistle.error({
        title: t(i18n, `${K}.async.errorTitle`),
        message: t(i18n, `${K}.async.errorMessage`)
      });
    }
  };

  return (
    <div className="space-y-3">
      <SgButton severity="danger" onClick={save}>{t(i18n, `${K}.async.saveFails`)}</SgButton>
      <div className="rounded-xl border border-dashed border-border p-4">
        <SgWhistler />
      </div>
    </div>
  );
}

function Section(props: { id?: string; title: string; description?: string; children: React.ReactNode }) {
  return (
    <section
      id={props.id}
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 space-y-3">{props.children}</div>
    </section>
  );
}

function Row(props: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center gap-3">{props.children}</div>;
}

function CodeBlock(props: { sampleFile: string }) {
  return <SgCodeBlockBase sampleFile={props.sampleFile} />;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const BUTTON_EXAMPLE_IDS = [
  "exemplo-1",
  "exemplo-2",
  "exemplo-3",
  "exemplo-4",
  "exemplo-5",
  "exemplo-6",
  "exemplo-7",
  "exemplo-8",
  "exemplo-9",
  "exemplo-10",
  "exemplo-11",
  "exemplo-12",
  "exemplo-13",
  "exemplo-14",
  "exemplo-15",
  "exemplo-16",
  "exemplo-17",
  "exemplo-18",
] as const;






const BUTTON_PROPS: ShowcasePropRow[] = [
  {
    prop: "severity",
    type: "\"primary\" | \"secondary\" | \"success\" | \"info\" | \"warning\" | \"help\" | \"danger\"",
    defaultValue: "\"primary\"",
    description: "Varia o tema visual do botao."
  },
  {
    prop: "appearance",
    type: "\"solid\" | \"outline\" | \"ghost\"",
    defaultValue: "\"solid\"",
    description: "Define estilo de preenchimento."
  },
  {
    prop: "size",
    type: "\"sm\" | \"md\" | \"lg\"",
    defaultValue: "\"md\"",
    description: "Tamanho do componente."
  },
  {
    prop: "shape",
    type: "\"default\" | \"rounded\"",
    defaultValue: "\"default\"",
    description: "Formato das bordas."
  },
  {
    prop: "elevation",
    type: "\"none\" | \"sm\" | \"md\" | \"lg\"",
    defaultValue: "\"none\"",
    description: "Nivel de elevacao/sombra."
  },
  {
    prop: "leftIcon / rightIcon",
    type: "ReactNode",
    defaultValue: "-",
    description: "Icones antes/depois do texto."
  },
  {
    prop: "loading",
    type: "boolean",
    defaultValue: "false",
    description: "Exibe spinner e bloqueia o clique. Continua valendo e vence o loading automático do onClick: o loading efetivo é loading ou operação pendente (Promise/Future devolvida pelo onClick)."
  },
  {
    prop: "enabled",
    type: "boolean",
    defaultValue: "true",
    description: "Desabilita o botao."
  },
  {
    prop: "customColors",
    type: "object",
    defaultValue: "-",
    description: "Sobrescreve cores de fundo, texto, borda e foco."
  },
  {
    prop: "onClick",
    type: "(event) => unknown",
    defaultValue: "-",
    description: "Clique do botão; pode ser síncrono ou assíncrono. Síncrono (abrir modal, alternar): nada muda. Se DEVOLVER uma Promise/Future, como async () => { await salvar(); } ou () => salvar(), o botão entra em loading sozinho (spinner, desabilitado, aria-busy na web), ignora cliques até terminar (inclusive cliques seguidos antes de a tela atualizar) e volta ao normal ao terminar ou falhar. Protege contra duplo clique e reenvio e ajuda na idempotência da ação na tela (não substitui a chave de idempotência no servidor). Cuidado: a função precisa devolver a operação; com chaves e sem return (ou sem async), como () => { salvar(); } ou () { salvar(); }, não protege; já async () {...} sempre devolve. O erro não é engolido: o botão sai do loading e relança como rejeição não tratada; trate com try/catch dentro do onClick e avise o usuário (sgWhistle.error). Use async só quando a ação puder demorar ou falhar (salvar, enviar, pagar)."
  },
  {
    prop: "children",
    type: "ReactNode",
    defaultValue: "-",
    description: "Conteudo interno do botao."
  }
];

export default function SgButtonShowcase() {
  const submit = useFakeProcess(2000);
  const i18n = useShowcaseI18n();
  const texts = React.useMemo(() => ({
    headerSubtitle: t(i18n, `${K}.headerSubtitle`),
    examplesLabel: t(i18n, `${K}.examplesLabel`),
    propsLinkLabel: t(i18n, `${K}.propsLinkLabel`),
    sectionTitles: [
      t(i18n, `${K}.sectionTitles.0`),
      t(i18n, `${K}.sectionTitles.1`),
      t(i18n, `${K}.sectionTitles.2`),
      t(i18n, `${K}.sectionTitles.3`),
      t(i18n, `${K}.sectionTitles.4`),
      t(i18n, `${K}.sectionTitles.5`),
      t(i18n, `${K}.sectionTitles.6`),
      t(i18n, `${K}.sectionTitles.7`),
      t(i18n, `${K}.sectionTitles.8`),
      t(i18n, `${K}.sectionTitles.9`),
      t(i18n, `${K}.sectionTitles.10`),
      t(i18n, `${K}.sectionTitles.11`),
      t(i18n, `${K}.sectionTitles.12`),
      t(i18n, `${K}.sectionTitles.13`),
      t(i18n, `${K}.sectionTitles.14`),
      t(i18n, `${K}.sectionTitles.15`),
      t(i18n, `${K}.sectionTitles.16`),
      t(i18n, `${K}.sectionTitles.17`)
    ],
    sectionDescriptions: [
      t(i18n, `${K}.sectionDescriptions.0`),
      t(i18n, `${K}.sectionDescriptions.1`),
      t(i18n, `${K}.sectionDescriptions.2`),
      t(i18n, `${K}.sectionDescriptions.3`),
      t(i18n, `${K}.sectionDescriptions.4`),
      t(i18n, `${K}.sectionDescriptions.5`),
      t(i18n, `${K}.sectionDescriptions.6`),
      t(i18n, `${K}.sectionDescriptions.7`),
      t(i18n, `${K}.sectionDescriptions.8`),
      t(i18n, `${K}.sectionDescriptions.9`),
      t(i18n, `${K}.sectionDescriptions.10`),
      t(i18n, `${K}.sectionDescriptions.11`),
      t(i18n, `${K}.sectionDescriptions.12`),
      t(i18n, `${K}.sectionDescriptions.13`),
      t(i18n, `${K}.sectionDescriptions.14`),
      t(i18n, `${K}.sectionDescriptions.15`),
      t(i18n, `${K}.sectionDescriptions.16`),
      t(i18n, `${K}.sectionDescriptions.17`)
    ],
    iconsGroupElevated: t(i18n, `${K}.iconsGroupElevated`),
    iconsGroupRounded: t(i18n, `${K}.iconsGroupRounded`),
    iconsGroupGhost: t(i18n, `${K}.iconsGroupGhost`),
    iconsGroupOutlinedElevation: t(i18n, `${K}.iconsGroupOutlinedElevation`),
    iconsGroupOutlined: t(i18n, `${K}.iconsGroupOutlined`),
    propsTitle: t(i18n, `${K}.propsTitle`),
    propsColProp: t(i18n, `${K}.propsColProp`),
    propsColType: t(i18n, `${K}.propsColType`),
    propsColDefault: t(i18n, `${K}.propsColDefault`),
    propsColDescription: t(i18n, `${K}.propsColDescription`)
  }), [i18n]);
  const [aiComponent, setAiComponent] = React.useState<AiManifestComponent | null>(null);
  const stickyHeaderRef = React.useRef<HTMLDivElement | null>(null);
  const [anchorOffset, setAnchorOffset] = React.useState(320);

  const sectionTitle = React.useCallback((index: number) => texts.sectionTitles[index - 1] ?? "", [texts]);
  const sectionDescription = React.useCallback(
    (index: number) => texts.sectionDescriptions[index - 1] ?? "",
    [texts]
  );

  React.useEffect(() => {
    let active = true;

    const loadAiData = async () => {
      const component = await loadAiManifestComponent("SgButton");
      if (active) {
        setAiComponent(component);
      }
    };

    void loadAiData();

    return () => {
      active = false;
    };
  }, []);

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
  }, []);

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
    const titleEl =
      (target.querySelector("h1, h2, h3, [data-anchor-title='true']") as HTMLElement | null) ?? target;

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

  return (
    <I18NReady>
      <div
        className="max-w-4xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgButton"
          subtitle={texts.headerSubtitle}
          exampleLinks={BUTTON_EXAMPLE_IDS.map((id, index) => ({ id, label: sectionTitle(index + 1) }))}
          onAnchorClick={handleAnchorClick}
        />

      {/* â”€â”€ Basic â”€â”€ */}
      <Section id="exemplo-1" title={sectionTitle(1)} description={sectionDescription(1)}>
        <Row>
          <SgButton onClick={submit.run} loading={submit.loading}>
            Submit
          </SgButton>
          <SgButton enabled={false}>Disabled</SgButton>
        </Row>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-button/samples/basico.tsx.sample" />
      </Section>

      {/* â”€â”€ Icons â”€â”€ */}
      <Section id="exemplo-2" title={sectionTitle(2)} description={sectionDescription(2)}>
        <div className="space-y-4">
          <div>
            <div className="mb-2 text-sm font-medium text-muted-foreground">{texts.iconsGroupElevated}</div>
            <Row>
              {SEVERITIES.map((s) => (
                <SgButton key={`raised-${s}`} severity={s} appearance="solid" elevation="sm" leftIcon={<Check className="size-4" />}>
                  {capitalize(s)}
                </SgButton>
              ))}
            </Row>
          </div>

          <div>
            <div className="mb-2 text-sm font-medium text-muted-foreground">{texts.iconsGroupRounded}</div>
            <Row>
              {SEVERITIES.map((s) => (
                <SgButton key={`rounded-${s}`} severity={s} shape="rounded" leftIcon={<Check className="size-4" />}>
                  {capitalize(s)}
                </SgButton>
              ))}
            </Row>
          </div>

          <div>
            <div className="mb-2 text-sm font-medium text-muted-foreground">{texts.iconsGroupGhost}</div>
            <Row>
              {SEVERITIES.map((s) => (
                <SgButton key={`flat-${s}`} severity={s} appearance="ghost" leftIcon={<Check className="size-4" />}>
                  {capitalize(s)}
                </SgButton>
              ))}
            </Row>
          </div>

          <div>
            <div className="mb-2 text-sm font-medium text-muted-foreground">{texts.iconsGroupOutlinedElevation}</div>
            <Row>
              {SEVERITIES.map((s) => (
                <SgButton key={`raised-text-${s}`} severity={s} appearance="outline" elevation="sm" leftIcon={<Check className="size-4" />}>
                  {capitalize(s)}
                </SgButton>
              ))}
            </Row>
          </div>

          <div>
            <div className="mb-2 text-sm font-medium text-muted-foreground">{texts.iconsGroupOutlined}</div>
            <Row>
              {SEVERITIES.map((s) => (
                <SgButton key={`outline-${s}`} severity={s} appearance="outline" leftIcon={<Check className="size-4" />}>
                  {capitalize(s)}
                </SgButton>
              ))}
            </Row>
          </div>
        </div>

        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-button/samples/icones.tsx.sample" />
      </Section>
      <Section id="exemplo-3" title={sectionTitle(3)} description={sectionDescription(3)}>
        <Row>
          {SEVERITIES.map((s) => (
            <SgButton key={s} severity={s}>{capitalize(s)}</SgButton>
          ))}
        </Row>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-button/samples/severities.tsx.sample" />
      </Section>

      {/* â”€â”€ Raised Buttons â”€â”€ */}
      <Section id="exemplo-4" title={sectionTitle(4)} description={sectionDescription(4)}>
        <Row>
          {SEVERITIES.map((s) => (
            <SgButton key={s} severity={s} appearance="solid" elevation="sm">{capitalize(s)}</SgButton>
          ))}
        </Row>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-button/samples/elevated-buttons.tsx.sample" />
      </Section>

      {/* â”€â”€ Rounded Buttons â”€â”€ */}
      <Section id="exemplo-5" title={sectionTitle(5)} description={sectionDescription(5)}>
        <Row>
          {SEVERITIES.map((s) => (
            <SgButton key={s} severity={s} shape="rounded">{capitalize(s)}</SgButton>
          ))}
        </Row>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-button/samples/rounded-buttons.tsx.sample" />
      </Section>

      {/* â”€â”€ Flat Buttons (ghost) â”€â”€ */}
      <Section id="exemplo-6" title={sectionTitle(6)} description={sectionDescription(6)}>
        <Row>
          {SEVERITIES.map((s) => (
            <SgButton key={s} severity={s} appearance="ghost">{capitalize(s)}</SgButton>
          ))}
        </Row>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-button/samples/ghost-buttons-flat.tsx.sample" />
      </Section>

      {/* â”€â”€ Raised Text Buttons â”€â”€ */}
      <Section id="exemplo-7" title={sectionTitle(7)} description={sectionDescription(7)}>
        <Row>
          {SEVERITIES.map((s) => (
            <SgButton key={s} severity={s} appearance="outline" elevation="sm">{capitalize(s)}</SgButton>
          ))}
        </Row>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-button/samples/outlined-e-elevation.tsx.sample" />
      </Section>

      {/* â”€â”€ Outlined Buttons â”€â”€ */}
      <Section id="exemplo-8" title={sectionTitle(8)} description={sectionDescription(8)}>
        <Row>
          {SEVERITIES.map((s) => (
            <SgButton key={s} severity={s} appearance="outline">{capitalize(s)}</SgButton>
          ))}
        </Row>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-button/samples/outlined-buttons.tsx.sample" />
      </Section>

      {/* â”€â”€ Rounded Icon Buttons (solid) â”€â”€ */}
      <Section id="exemplo-9" title={sectionTitle(9)} description={sectionDescription(9)}>
        <Row>
          {ICON_MAP.map(({ severity, icon }) => (
            <SgButton key={severity} severity={severity} shape="rounded" leftIcon={icon} />
          ))}
        </Row>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-button/samples/rounded-icon-buttons.tsx.sample" />
      </Section>

      {/* â”€â”€ Rounded Text Icon Buttons (ghost) â”€â”€ */}
      <Section id="exemplo-10" title={sectionTitle(10)} description={sectionDescription(10)}>
        <Row>
          {ICON_MAP.map(({ severity, icon }) => (
            <SgButton key={severity} severity={severity} shape="rounded" appearance="ghost" leftIcon={icon} />
          ))}
        </Row>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-button/samples/rounded-text-icon-buttons.tsx.sample" />
      </Section>

      {/* â”€â”€ Rounded and Outlined Icon Buttons â”€â”€ */}
      <Section id="exemplo-11" title={sectionTitle(11)} description={sectionDescription(11)}>
        <Row>
          {ICON_MAP.map(({ severity, icon }) => (
            <SgButton key={severity} severity={severity} shape="rounded" appearance="outline" leftIcon={icon} />
          ))}
        </Row>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-button/samples/rounded-and-outlined-icon-buttons.tsx.sample" />
      </Section>

      {/* â”€â”€ Sizes â”€â”€ */}
      <Section id="exemplo-12" title={sectionTitle(12)} description={sectionDescription(12)}>
        <Row>
          <SgButton size="sm">Small</SgButton>
          <SgButton size="md">Medium</SgButton>
          <SgButton size="lg">Large</SgButton>
        </Row>
        <Row>
          <SgButton size="sm" shape="rounded" leftIcon={<Check className="size-4" />} />
          <SgButton size="md" shape="rounded" leftIcon={<Check className="size-4" />} />
          <SgButton size="lg" shape="rounded" leftIcon={<Check className="size-4" />} />
        </Row>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-button/samples/sizes.tsx.sample" />
      </Section>

      {/* â”€â”€ Loading â”€â”€ */}
      <Section id="exemplo-13" title={sectionTitle(13)} description={sectionDescription(13)}>
        <Row>
          <SgButton loading>Processing...</SgButton>
          <SgButton severity="success" loading>Saving...</SgButton>
          <SgButton severity="danger" loading leftIcon={<X className="size-4" />}>Deleting...</SgButton>
          <SgButton shape="rounded" loading leftIcon={<Check className="size-4" />} />
        </Row>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-button/samples/loading.tsx.sample" />
      </Section>

      {/* â”€â”€ Custom Colors â”€â”€ */}
      <Section id="exemplo-14" title={sectionTitle(14)} description={sectionDescription(14)}>
        <Row>
          <SgButton
            customColors={{
              bg: "#0f172a",
              fg: "#ffffff",
              hoverBg: "#020617",
              ring: "rgba(15,23,42,.35)"
            }}
          >
            Brand Dark
          </SgButton>
          <SgButton
            customColors={{
              bg: "#ec4899",
              fg: "#ffffff",
              border: "#db2777",
              hoverBg: "#db2777",
              ring: "rgba(236,72,153,.35)"
            }}
          >
            Pink
          </SgButton>
          <SgButton
            appearance="outline"
            customColors={{
              bg: "#8b5cf6",
              fg: "#8b5cf6",
              border: "#8b5cf6",
              ring: "rgba(139,92,246,.35)"
            }}
          >
            Violet Outline
          </SgButton>
        </Row>
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-button/samples/custom-colors.tsx.sample" />
      </Section>

      <Section id="exemplo-15" title={sectionTitle(15)} description={sectionDescription(15)}>
        <AutoLoadingExample />
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-button/samples/loading-automatico-com-future.tsx.sample" />
      </Section>

      <Section id="exemplo-16" title={sectionTitle(16)} description={sectionDescription(16)}>
        <SyncAsyncExample />
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-button/samples/onclick-sincrono-x-assincrono.tsx.sample" />
      </Section>

      <Section id="exemplo-17" title={sectionTitle(17)} description={sectionDescription(17)}>
        <AsyncErrorExample />
        <CodeBlock sampleFile="apps/showcase/src/app/components/sg-button/samples/tratando-erro-no-onclick-assincrono.tsx.sample" />
      </Section>

      <Section id="exemplo-18" title={sectionTitle(18)} description={sectionDescription(18)}>
        <SgPlayground
          title="SgButton Playground"
          interactive
          codeContract="appFile"
          playgroundFile="apps/showcase/src/app/components/sg-button/sg-button.tsx.playground"
          height={600}
          defaultOpen
        />
      </Section>

      <ShowcasePropsReference id="props-reference" title={texts.propsTitle} rows={BUTTON_PROPS} />
      {aiComponent ? <ComponentAiPropsTable component={aiComponent} /> : null}
      {aiComponent ? <ComponentAiSummary component={aiComponent} /> : null}
      <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}


