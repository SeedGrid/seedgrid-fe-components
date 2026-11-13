"use client";

import * as React from "react";
import Link from "next/link";
import { useForm, type FieldValues } from "react-hook-form";
import { Flame, Heart, ThumbsUp } from "lucide-react";
import { SgButton, SgGrid, SgRating } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import SgCodeBlockBase from "../sgCodeBlockBase";
import I18NReady from "../I18NReady";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import ComponentAiPropsTable from "../ai/ComponentAiPropsTable";
import ComponentAiSummary from "../ai/ComponentAiSummary";
import { useAiManifestComponent } from "../ai/useAiManifestComponent";
import ShowcasePropsReference from "../ShowcasePropsReference";
import { t, useShowcaseI18n } from "../../../i18n";

const K = "showcase.component.rating";

function Section(props: {
  id?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={props.id}
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
      {props.description ? (
        <p className="mt-1 text-sm text-muted-foreground">{props.description}</p>
      ) : null}
      <div className="mt-4 space-y-4">{props.children}</div>
    </section>
  );
}

type PropRow = {
  prop: string;
  type: string;
  defaultValue: string;
  description: string;
};

const RATING_PROPS: PropRow[] = [
  { prop: "id", type: "string", defaultValue: "-", description: "Unique component identifier." },
  { prop: "label", type: "string", defaultValue: "-", description: "Label text displayed above the rating." },
  { prop: "value", type: "number", defaultValue: "0", description: "Current rating value." },
  { prop: "stars", type: "number", defaultValue: "5", description: "Quantidade total de estrelas." },
  { prop: "allowHalf", type: "boolean", defaultValue: "false", description: "Permite selecao de meia estrela." },
  { prop: "cancel", type: "boolean", defaultValue: "true", description: "Shows a button to clear the rating." },
  { prop: "enabled", type: "boolean", defaultValue: "true", description: "Desabilita a interacao com o componente." },
  { prop: "readOnly", type: "boolean", defaultValue: "false", description: "Mantem visualizacao sem permitir alteracao." },
  { prop: "size", type: "\"sm\" | \"md\" | \"lg\" | \"xl\"", defaultValue: "\"md\"", description: "Define o tamanho das estrelas." },
  { prop: "className", type: "string", defaultValue: "-", description: "Classe CSS customizada para o container." },
  { prop: "style", type: "React.CSSProperties", defaultValue: "-", description: "Inline style customizado para o container." },
  { prop: "onIcon", type: "ReactNode", defaultValue: "-", description: "Icone customizado para estado preenchido." },
  { prop: "offIcon", type: "ReactNode", defaultValue: "-", description: "Icone customizado para estado vazio." },
  { prop: "cancelIcon", type: "ReactNode", defaultValue: "-", description: "Icone customizado do botao de limpar." },
  { prop: "color", type: "string", defaultValue: "\"hsl(var(--primary))\"", description: "Color of the filled icon." },
  { prop: "emptyColor", type: "string", defaultValue: "\"hsl(var(--muted-foreground))\"", description: "Color of the empty icon." },
  { prop: "showTooltip", type: "boolean", defaultValue: "false", description: "Exibe tooltip com valor ao passar o mouse." },
  { prop: "onChange", type: "(value: number) => void", defaultValue: "-", description: "Callback disparado quando o valor muda." },
  { prop: "onHover", type: "(value: number | null) => void", defaultValue: "-", description: "Callback disparado no hover das estrelas." },
  { prop: "register", type: "UseFormRegister<FieldValues>", defaultValue: "-", description: "React Hook Form integration via register." },
  { prop: "name", type: "string", defaultValue: "-", description: "Nome do campo para integracao com formulario." },
  { prop: "control", type: "any", defaultValue: "-", description: "Control do React Hook Form." },
  { prop: "error", type: "string", defaultValue: "-", description: "Mensagem de erro externa." },
  { prop: "required", type: "boolean", defaultValue: "false", description: "Marks the field as required." },
  { prop: "requiredMessage", type: "string", defaultValue: "-", description: "Mensagem de validacao para required." }
];





function BasicExample() {
  const i18n = useShowcaseI18n();
  const [value, setValue] = React.useState(0);

  return (
    <div className="space-y-2">
      <SgRating
        value={value}
        onChange={setValue}
        style={{ border: "1px solid rgba(59, 130, 246, 0.25)", borderRadius: 12, padding: 12 }}
      />
      <p className="text-sm text-muted-foreground">
        {t(i18n, "showcase.common.labels.currentValueLabel")} <strong>{value}</strong>
      </p>
    </div>
  );
}

function HalfTooltipExample() {
  const i18n = useShowcaseI18n();
  const [value, setValue] = React.useState(2.5);
  const [hover, setHover] = React.useState<number | null>(null);

  return (
    <div className="space-y-2">
      <SgRating
        label={t(i18n, "showcase.component.rating.demo.halfLabel")}
        value={value}
        allowHalf
        showTooltip
        onChange={setValue}
        onHover={setHover}
      />
      <p className="text-sm text-muted-foreground">
        {t(i18n, `${K}.labels.selectedColon`)} <strong>{value}</strong> | {t(i18n, `${K}.labels.hoverColon`)} <strong>{hover ?? t(i18n, "showcase.common.labels.noneLower")}</strong>
      </p>
    </div>
  );
}

function ReadonlyDisabledExample() {
  const i18n = useShowcaseI18n();
  return (
    <SgGrid columns={{ base: 1, md: 2 }} gap={16}>
      <SgRating
        label={t(i18n, `${K}.labels.readOnly`)}
        value={3.5}
        allowHalf
        readOnly
      />

      <SgRating
        label={t(i18n, "showcase.common.labels.disabled")}
        value={2}
        enabled={false}
      />
    </SgGrid>
  );
}

function SizeStarsExample() {
  const i18n = useShowcaseI18n();
  const [smValue, setSmValue] = React.useState(3);
  const [lgValue, setLgValue] = React.useState(4);
  const [manyValue, setManyValue] = React.useState(7);

  return (
    <SgGrid columns={{ base: 1, md: 2 }} gap={16}>
      <SgRating
        label={t(i18n, "showcase.component.rating.demo.sizeSm")}
        size="sm"
        value={smValue}
        onChange={setSmValue}
      />

      <SgRating
        label={t(i18n, "showcase.component.rating.demo.sizeLg")}
        size="lg"
        value={lgValue}
        onChange={setLgValue}
      />

      <SgRating
        label={t(i18n, "showcase.component.rating.demo.stars10")}
        stars={10}
        size="sm"
        value={manyValue}
        onChange={setManyValue}
      />
    </SgGrid>
  );
}

function ColorsIconsExample() {
  const i18n = useShowcaseI18n();
  const [heartValue, setHeartValue] = React.useState(4);
  const [likeValue, setLikeValue] = React.useState(3);
  const [fireValue, setFireValue] = React.useState(5);

  return (
    <SgGrid columns={{ base: 1, md: 2 }} gap={16}>
      <SgRating
        label={t(i18n, `${K}.labels.heart`)}
        value={heartValue}
        color="#ec4899"
        emptyColor="#f9a8d4"
        onIcon={<Heart size={24} fill="currentColor" />}
        offIcon={<Heart size={24} />}
        onChange={setHeartValue}
      />

      <SgRating
        label={t(i18n, `${K}.labels.likes`)}
        value={likeValue}
        color="#2563eb"
        emptyColor="#93c5fd"
        onIcon={<ThumbsUp size={24} fill="currentColor" />}
        offIcon={<ThumbsUp size={24} />}
        onChange={setLikeValue}
      />

      <SgRating
        label={t(i18n, `${K}.labels.fire`)}
        value={fireValue}
        color="#f97316"
        emptyColor="#fdba74"
        onIcon={<Flame size={24} fill="currentColor" />}
        offIcon={<Flame size={24} />}
        onChange={setFireValue}
      />
    </SgGrid>
  );
}

function CallbackExample() {
  const i18n = useShowcaseI18n();
  const [value, setValue] = React.useState(3);
  const [hover, setHover] = React.useState<number | null>(null);
  const [logs, setLogs] = React.useState<string[]>([]);

  const pushLog = React.useCallback((msg: string) => {
    setLogs((prev) => [msg, ...prev].slice(0, 8));
  }, []);

  return (
    <div className="space-y-3">
      <SgRating
        label="Callbacks"
        value={value}
        allowHalf
        onChange={(next) => {
          setValue(next);
          pushLog("onChange -> " + String(next));
        }}
        onHover={setHover}
      />

      <SgGrid columns={{ base: 2, md: 4 }} gap={8}>
        <SgButton size="sm" appearance="outline" onClick={() => setValue(0)}>
          {t(i18n, "showcase.common.labels.resetAction")}
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setValue(5)}>
          {t(i18n, `${K}.labels.max`)}
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setLogs([])}>
          {t(i18n, `${K}.labels.clearLog`)}
        </SgButton>
      </SgGrid>

      <p className="text-sm text-muted-foreground">
        {t(i18n, `${K}.labels.selectedColon`)} <strong>{value}</strong> | {t(i18n, `${K}.labels.hoverColon`)} <strong>{hover ?? t(i18n, "showcase.common.labels.noneLower")}</strong>
      </p>

      <div className="h-28 overflow-y-auto rounded border border-border bg-foreground/5 p-2 font-mono text-xs">
        {logs.length === 0 ? t(i18n, `${K}.labels.noEvents`) : logs.map((entry, index) => <div key={index}>{entry}</div>)}
      </div>
    </div>
  );
}

function RhfExample() {
  const i18n = useShowcaseI18n();
  const [submitResult, setSubmitResult] = React.useState("-");
  const { control, handleSubmit, watch } = useForm<FieldValues>({
    defaultValues: {
      productRating: 4,
      movieRating: 2.5
    }
  });

  return (
    <form onSubmit={handleSubmit((data) => setSubmitResult(JSON.stringify(data)))} className="space-y-4">
      <SgRating
        label={t(i18n, "showcase.component.rating.demo.rateProduct")}
        name="productRating"
        control={control}
      />

      <SgRating
        label={t(i18n, "showcase.component.rating.demo.rateMovie")}
        name="movieRating"
        control={control}
        allowHalf
      />

      <SgButton type="submit" size="sm">
        {t(i18n, "showcase.component.rating.demo.submit")}
      </SgButton>

      <p className="text-xs text-muted-foreground">
        watch.productRating: <strong>{String(watch("productRating"))}</strong>
        {" | "}
        watch.movieRating: <strong>{String(watch("movieRating"))}</strong>
      </p>
      <p className="text-xs text-muted-foreground">{t(i18n, "showcase.component.rating.demo.lastSubmit")}: {submitResult}</p>
    </form>
  );
}

function RequiredExample() {
  const i18n = useShowcaseI18n();
  const [value, setValue] = React.useState(0);

  return (
    <div className="space-y-3">
      <SgRating
        label={t(i18n, `${K}.labels.requiredRating`)}
        value={value}
        required
        requiredMessage={t(i18n, `${K}.labels.requiredMessage`)}
        onChange={setValue}
      />

      <SgGrid columns={{ base: 2, md: 4 }} gap={8}>
        <SgButton size="sm" appearance="outline" onClick={() => setValue(0)}>
          {t(i18n, "showcase.common.labels.clear")}
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setValue(1)}>
          {t(i18n, `${K}.labels.rate1`)}
        </SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setValue(5)}>
          {t(i18n, `${K}.labels.rate5`)}
        </SgButton>
      </SgGrid>

      <p className="text-sm text-muted-foreground">
        {t(i18n, "showcase.common.labels.currentValueLabel")} <strong>{value}</strong>
      </p>
    </div>
  );
}

export default function SgRatingPage() {
  const i18n = useShowcaseI18n();
  const texts = React.useMemo(() => ({
    subtitle: t(i18n, `${K}.subtitle`),
    examplesLabel: t(i18n, `${K}.examplesLabel`),
    propsLinkLabel: t(i18n, `${K}.propsLinkLabel`),
    propsTitle: t(i18n, `${K}.propsTitle`),
    propsColProp: t(i18n, `${K}.propsColProp`),
    propsColType: t(i18n, `${K}.propsColType`),
    propsColDefault: t(i18n, `${K}.propsColDefault`),
    propsColDescription: t(i18n, `${K}.propsColDescription`),
    sectionTitles: [
      t(i18n, `${K}.sectionTitles.0`),
      t(i18n, `${K}.sectionTitles.1`),
      t(i18n, `${K}.sectionTitles.2`),
      t(i18n, `${K}.sectionTitles.3`),
      t(i18n, `${K}.sectionTitles.4`),
      t(i18n, `${K}.sectionTitles.5`),
      t(i18n, `${K}.sectionTitles.6`),
      t(i18n, `${K}.sectionTitles.7`),
      t(i18n, `${K}.sectionTitles.8`)
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
      t(i18n, `${K}.sectionDescriptions.8`)
    ],
    playgroundTitle: t(i18n, `${K}.playgroundTitle`)
  }), [i18n]);
  const aiComponent = useAiManifestComponent("SgRating");
  const exampleLinks = React.useMemo(() => texts.sectionTitles.map((label, index) => ({ id: `exemplo-${index + 1}`, label })), [texts]);
  const stickyHeaderRef = React.useRef<HTMLDivElement | null>(null);
  const [anchorOffset, setAnchorOffset] = React.useState(320);

  React.useEffect(() => {
    const updateAnchorOffset = () => {
      const headerHeight = stickyHeaderRef.current?.getBoundingClientRect().height ?? 0;
      setAnchorOffset(Math.max(240, Math.ceil(headerHeight + 40)));
    };

    updateAnchorOffset();
    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateAnchorOffset) : null;
    if (resizeObserver && stickyHeaderRef.current) {
      resizeObserver.observe(stickyHeaderRef.current);
    }

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
        className="max-w-6xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgRating"
          subtitle={texts.subtitle}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section id="exemplo-1" title={texts.sectionTitles[0] ?? ""} description={texts.sectionDescriptions[0] ?? ""}>
          <BasicExample />
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/sg-rating/samples/basico.tsx.sample" />
        </Section>

        <Section id="exemplo-2" title={texts.sectionTitles[1] ?? ""} description={texts.sectionDescriptions[1] ?? ""}>
          <HalfTooltipExample />
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/sg-rating/samples/meia-estrela-tooltip.tsx.sample" />
        </Section>

        <Section id="exemplo-3" title={texts.sectionTitles[2] ?? ""} description={texts.sectionDescriptions[2] ?? ""}>
          <ReadonlyDisabledExample />
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/sg-rating/samples/read-only-e-desabilitado.tsx.sample" />
        </Section>

        <Section id="exemplo-4" title={texts.sectionTitles[3] ?? ""} description={texts.sectionDescriptions[3] ?? ""}>
          <SizeStarsExample />
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/sg-rating/samples/tamanhos-e-quantidade-de-estrelas.tsx.sample" />
        </Section>

        <Section id="exemplo-5" title={texts.sectionTitles[4] ?? ""} description={texts.sectionDescriptions[4] ?? ""}>
          <ColorsIconsExample />
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/sg-rating/samples/cores-e-icones-customizados.tsx.sample" />
        </Section>

        <Section id="exemplo-6" title={texts.sectionTitles[5] ?? ""} description={texts.sectionDescriptions[5] ?? ""}>
          <CallbackExample />
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/sg-rating/samples/callbacks.tsx.sample" />
        </Section>

        <Section id="exemplo-7" title={texts.sectionTitles[6] ?? ""} description={texts.sectionDescriptions[6] ?? ""}>
          <RhfExample />
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/sg-rating/samples/react-hook-form.tsx.sample" />
        </Section>

        <Section id="exemplo-8" title={texts.sectionTitles[7] ?? ""} description={texts.sectionDescriptions[7] ?? ""}>
          <RequiredExample />
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/sg-rating/samples/campo-obrigatorio.tsx.sample" />
        </Section>

        <Section id="exemplo-9" title={texts.sectionTitles[8] ?? ""} description={texts.sectionDescriptions[8] ?? ""}>
          <SgPlayground
            title={texts.playgroundTitle}
            interactive
            codeContract="appFile"
            playgroundFile="apps/showcase/src/app/components/sg-rating/sg-rating.tsx.playground"
            height={660}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference id="props-reference" title={texts.propsTitle} rows={RATING_PROPS} />
        {aiComponent ? <ComponentAiPropsTable component={aiComponent} /> : null}
        {aiComponent ? <ComponentAiSummary component={aiComponent} /> : null}
      <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}







