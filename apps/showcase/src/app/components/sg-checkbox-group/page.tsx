"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import {
  SgCheckboxGroup,
  type SgCheckboxGroupOption,
  type SgCheckboxGroupRef,
  SgButton,
  SgGrid,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import {
  Heart,
  Star,
  ThumbsUp,
  Circle,
  Square,
  Triangle,
  Sun,
  Moon,
  Cloud,
  Mail,
  Phone,
  Home,
  Landmark,
  Bell,
  RefreshCw
} from "lucide-react";
import SgCodeBlockBase from "../sgCodeBlockBase";
import I18NReady from "../I18NReady";
import ComponentAiPropsTable from "../ai/ComponentAiPropsTable";
import ComponentAiSummary from "../ai/ComponentAiSummary";
import { useAiManifestComponent } from "../ai/useAiManifestComponent";
import { t, useShowcaseI18n } from "../../../i18n";

const K = "showcase.component.checkboxGroup";

function Section(props: { id?: string; title: string; description?: string; children: React.ReactNode }) {
  return (
    <section
      id={props.id}
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

type ShowcaseI18nValue = ReturnType<typeof useShowcaseI18n>;

function getBasicOptions(i18n: ShowcaseI18nValue): SgCheckboxGroupOption[] {
  return [
    { label: t(i18n, `${K}.optOption1`), value: "option1" },
    { label: t(i18n, `${K}.optOption2`), value: "option2" },
    { label: t(i18n, `${K}.optOption3`), value: "option3" }
  ];
}

function getFruitOptions(i18n: ShowcaseI18nValue): SgCheckboxGroupOption[] {
  return [
    { label: t(i18n, `${K}.optApple`), value: "apple" },
    { label: t(i18n, `${K}.optBanana`), value: "banana" },
    { label: t(i18n, `${K}.optOrange`), value: "orange" },
    { label: t(i18n, `${K}.optGrape`), value: "grape" }
  ];
}

function getOptionsWithIcons(i18n: ShowcaseI18nValue): SgCheckboxGroupOption[] {
  return [
    { label: t(i18n, `${K}.optFavorite`), value: "favorite", icon: <Heart className="w-4 h-4" /> },
    { label: t(i18n, `${K}.optImportant`), value: "important", icon: <Star className="w-4 h-4" /> },
    { label: t(i18n, `${K}.optLike`), value: "like", icon: <ThumbsUp className="w-4 h-4" /> }
  ];
}

function getShapeOptions(i18n: ShowcaseI18nValue): SgCheckboxGroupOption[] {
  return [
    { label: t(i18n, `${K}.optCircle`), value: "circle", icon: <Circle className="w-5 h-5" /> },
    { label: t(i18n, `${K}.optSquare`), value: "square", icon: <Square className="w-5 h-5" /> },
    { label: t(i18n, `${K}.optTriangle`), value: "triangle", icon: <Triangle className="w-5 h-5" /> }
  ];
}

function getWeatherOptions(i18n: ShowcaseI18nValue): SgCheckboxGroupOption[] {
  return [
    { label: t(i18n, `${K}.optSun`), value: "sun", icon: <Sun className="w-5 h-5 text-yellow-500" /> },
    { label: t(i18n, `${K}.optMoon`), value: "moon", icon: <Moon className="w-5 h-5 text-blue-500" /> },
    { label: t(i18n, `${K}.optCloud`), value: "cloud", icon: <Cloud className="w-5 h-5 text-gray-500" /> }
  ];
}

function getListHighlightOptions(i18n: ShowcaseI18nValue): SgCheckboxGroupOption[] {
  return [
    { label: t(i18n, `${K}.optReserve`), value: "reserve", icon: <Landmark className="w-4 h-4 text-indigo-600" /> },
    { label: t(i18n, `${K}.optAlert`), value: "alert", icon: <Bell className="w-4 h-4 text-rose-600" /> },
    { label: t(i18n, `${K}.optRefresh`), value: "refresh", icon: <RefreshCw className="w-4 h-4 text-emerald-600" /> }
  ];
}

function getContactOptions(i18n: ShowcaseI18nValue): SgCheckboxGroupOption[] {
  return [
    { label: t(i18n, `${K}.optEmail`), value: "email", icon: <Mail className="w-4 h-4" /> },
    { label: t(i18n, `${K}.optPhone`), value: "phone", icon: <Phone className="w-4 h-4" /> },
    { label: t(i18n, `${K}.optInPerson`), value: "in-person", icon: <Home className="w-4 h-4" /> }
  ];
}

function getPriorityOptions(i18n: ShowcaseI18nValue): SgCheckboxGroupOption[] {
  return [
    { label: t(i18n, `${K}.optLow`), value: "low" },
    { label: t(i18n, `${K}.optMedium`), value: "medium" },
    { label: t(i18n, `${K}.optHigh`), value: "high" },
    { label: t(i18n, `${K}.optUrgent`), value: "urgent", disabled: true }
  ];
}

function getSectionTitles(i18n: ShowcaseI18nValue): string[] {
  return [
    t(i18n, `${K}.section1Title`),
    t(i18n, `${K}.section2Title`),
    t(i18n, `${K}.section3Title`),
    t(i18n, `${K}.section4Title`),
    t(i18n, `${K}.section5Title`),
    t(i18n, `${K}.section6Title`),
    t(i18n, `${K}.section7Title`),
    t(i18n, `${K}.section8Title`),
    t(i18n, `${K}.section9Title`),
    t(i18n, `${K}.section10Title`),
    t(i18n, `${K}.section11Title`),
    t(i18n, `${K}.section12Title`),
    t(i18n, `${K}.section13Title`),
    t(i18n, `${K}.section14Title`),
    t(i18n, `${K}.section15Title`),
    t(i18n, `${K}.section16Title`),
    t(i18n, `${K}.section17Title`),
    t(i18n, `${K}.section18Title`)
  ];
}

const PLAYGROUND_APP_FILE = `import * as React from "react";
import * as SeedGrid from "@seedgrid/fe-components";
import {
  Heart,
  Star,
  ThumbsUp,
} from "lucide-react";

const SgCheckboxGroupFromLib = (SeedGrid as Record<string, unknown>).SgCheckboxGroup as
  | React.ComponentType<any>
  | undefined;

const OPTIONS = [
  { label: "Favorito", value: "favorite", icon: <Heart className="h-4 w-4" /> },
  { label: "Importante", value: "important", icon: <Star className="h-4 w-4" /> },
  { label: "Curtir", value: "like", icon: <ThumbsUp className="h-4 w-4" /> }
];

export default function App() {
  const hasComponent = typeof SgCheckboxGroupFromLib === "function";
  const [title, setTitle] = React.useState("Choose options");
  const [orientation, setOrientation] = React.useState<"vertical" | "horizontal">("vertical");
  const [iconOnly, setIconOnly] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  const [readOnly, setReadOnly] = React.useState(false);
  const [required, setRequired] = React.useState(false);
  const [showCheckAll, setShowCheckAll] = React.useState(false);
  const [value, setValue] = React.useState<(string | number)[]>(["favorite"]);

  return (
    <div className="space-y-4 p-2">
      {!hasComponent ? (
        <div className="rounded border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800">
          SgCheckboxGroup is not available in the published Sandpack version. Showing fallback.
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs">
          <span className="mb-1 block font-medium">Title</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded border border-border px-2 py-1"
          />
        </label>
        <label className="text-xs">
          <span className="mb-1 block font-medium">Orientation</span>
          <select
            value={orientation}
            onChange={(event) => setOrientation(event.target.value as "vertical" | "horizontal")}
            className="w-full rounded border border-border px-2 py-1"
          >
            <option value="vertical">vertical</option>
            <option value="horizontal">horizontal</option>
          </select>
        </label>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-xs">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={iconOnly} onChange={(event) => setIconOnly(event.target.checked)} />
          iconOnly
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={disabled} onChange={(event) => setDisabled(event.target.checked)} />
          disabled
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={readOnly} onChange={(event) => setReadOnly(event.target.checked)} />
          readOnly
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={required} onChange={(event) => setRequired(event.target.checked)} />
          required
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={showCheckAll} onChange={(event) => setShowCheckAll(event.target.checked)} />
          showCheckAll
        </label>
      </div>

      <div className="rounded border border-border p-4">
        {hasComponent ? (
          <SgCheckboxGroupFromLib
            id="checkbox-playground"
            title={title}
            source={OPTIONS}
            orientation={orientation}
            iconOnly={iconOnly}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            showCheckAll={showCheckAll}
            value={value}
            onChange={(next: (string | number)[]) => setValue(next)}
          />
        ) : (
          <div className="space-y-2">
            {OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={value.includes(opt.value)}
                  disabled={disabled || readOnly}
                  onChange={() =>
                    setValue((prev) =>
                      prev.includes(opt.value)
                        ? prev.filter((v) => v !== opt.value)
                        : [...prev, opt.value]
                    )
                  }
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="rounded border border-border bg-muted/30 px-3 py-2 text-xs">
        value: [{value.join(", ")}]
      </div>
    </div>
  );
}
`;

export default function SgCheckboxGroupShowcase() {
  const i18n = useShowcaseI18n();
  const aiComponent = useAiManifestComponent("SgCheckboxGroup");
  const sectionTitles = React.useMemo(() => getSectionTitles(i18n), [i18n]);
  const basicOptions = React.useMemo(() => getBasicOptions(i18n), [i18n]);
  const fruitOptions = React.useMemo(() => getFruitOptions(i18n), [i18n]);
  const optionsWithIcons = React.useMemo(() => getOptionsWithIcons(i18n), [i18n]);
  const shapeOptions = React.useMemo(() => getShapeOptions(i18n), [i18n]);
  const weatherOptions = React.useMemo(() => getWeatherOptions(i18n), [i18n]);
  const listHighlightOptions = React.useMemo(() => getListHighlightOptions(i18n), [i18n]);
  const contactOptions = React.useMemo(() => getContactOptions(i18n), [i18n]);
  const priorityOptions = React.useMemo(() => getPriorityOptions(i18n), [i18n]);
  const [selectedBasic, setSelectedBasic] = React.useState<(string | number)[]>(["option1"]);
  const [selectedFruit, setSelectedFruit] = React.useState<(string | number)[]>([]);
  const [selectedControlled, setSelectedControlled] = React.useState<(string | number)[]>(["option2"]);
  const [externalValue, setExternalValue] = React.useState<(string | number)[]>(["banana"]);
  const [selectedHighlightStyle, setSelectedHighlightStyle] = React.useState<(string | number)[]>(["reserve"]);

  const checkboxRef = React.useRef<SgCheckboxGroupRef>(null);
  const [refOutput, setRefOutput] = React.useState<string>("");

  const { register, control, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data);
    alert(`${t(i18n, `${K}.formData`)}: ${JSON.stringify(data, null, 2)}`);
  };

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

  const handleAnchorClick = React.useCallback((event: React.MouseEvent<HTMLAnchorElement>, anchorId: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    navigateToAnchor(anchorId);
  }, [navigateToAnchor]);

  const navigateToAnchorRef2 = React.useRef(navigateToAnchor);
  React.useEffect(() => {
    navigateToAnchorRef2.current = navigateToAnchor;
  }, [navigateToAnchor]);

  return (
    <I18NReady>
      <div
        className="max-w-6xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <div ref={stickyHeaderRef} className="sticky top-0 z-50 isolate max-h-[52vh] overflow-y-auto bg-background pb-2 pt-2 md:-top-8 md:max-h-none md:overflow-visible md:pb-2 md:pt-8">
          <div className="rounded-lg border border-border bg-background p-4 shadow-sm">
            <h1 className="text-3xl font-bold">SgCheckboxGroup</h1>
            <p className="mt-2 text-muted-foreground">{t(i18n, `${K}.subtitle`)}</p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t(i18n, `${K}.examplesLabel`)}</p>
            <SgGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={8} className="mt-2">
              {sectionTitles.map((label, index) => ({ id: `exemplo-${index + 1}`, label })).map((example) => (
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
              >{t(i18n, `${K}.propsReference`)}</Link>
            </SgGrid>
          </div>
        </div>

        {/* 1 - Basico */}
        <Section id="exemplo-1" title={sectionTitles[0]!}>
          <SgCheckboxGroup
            id="basic"
            title={t(i18n, `${K}.title1`)}
            source={basicOptions}
            value={selectedBasic}
            onChange={setSelectedBasic}
            style={{ border: "1px solid rgba(59, 130, 246, 0.25)", borderRadius: 12, padding: 12 }}
          />
          <p className="mt-2 text-sm text-[rgb(var(--sg-muted))]">
            {t(i18n, `${K}.selectedValues`)}: <strong>[{selectedBasic.join(", ")}]</strong>
          </p>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-checkbox-group/samples/basico.tsx.sample" />
        </Section>

        {/* 2 - Orientation Horizontal */}
        <Section id="exemplo-2" title={sectionTitles[1]!}>
          <SgCheckboxGroup
            id="horizontal"
            title={t(i18n, `${K}.title2`)}
            source={fruitOptions}
            orientation="horizontal"
            value={selectedFruit}
            onChange={setSelectedFruit}
          />
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-checkbox-group/samples/orientation-horizontal.tsx.sample" />
        </Section>

        {/* 3 - Com Icones */}
        <Section id="exemplo-3" title={sectionTitles[2]!}>
          <SgCheckboxGroup
            id="with-icons"
            title={t(i18n, `${K}.title3`)}
            source={optionsWithIcons}
          />
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-checkbox-group/samples/com-icones.tsx.sample" />
        </Section>

        {/* 4 - Apenas Icones */}
        <Section id="exemplo-4" title={sectionTitles[3]!}>
          <SgCheckboxGroup
            id="icon-only"
            title={t(i18n, `${K}.title4`)}
            source={shapeOptions}
            iconOnly
          />
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-checkbox-group/samples/apenas-icones.tsx.sample" />
        </Section>

        {/* 5 - Selecao Controlada */}
        <Section id="exemplo-5" title={sectionTitles[4]!}>
          <SgCheckboxGroup
            id="controlled-selection"
            title={t(i18n, `${K}.title5`)}
            source={basicOptions}
            value={selectedControlled}
            onChange={setSelectedControlled}
          />
          <p className="mt-2 text-sm text-[rgb(var(--sg-muted))]">
            {t(i18n, `${K}.valueLabel`)}: [{selectedControlled.join(", ")}]
          </p>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-checkbox-group/samples/selecao-controlada.tsx.sample" />
        </Section>

        {/* 6 - Controle Externo */}
        <Section id="exemplo-6" title={sectionTitles[5]!}>
          <div className="space-y-4">
            <SgCheckboxGroup
              id="external-control"
              title={t(i18n, `${K}.title6`)}
              source={fruitOptions}
              value={externalValue}
              onChange={setExternalValue}
            />
            <SgGrid columns={{ base: 2, md: 4 }} gap={8}>
              <SgButton onClick={() => setExternalValue(["apple"])}>{t(i18n, `${K}.btnSetApple`)}</SgButton>
              <SgButton onClick={() => setExternalValue(["banana", "grape"])}>{t(i18n, `${K}.btnBananaGrape`)}</SgButton>
              <SgButton onClick={() => setExternalValue(fruitOptions.map((o) => o.value))}>{t(i18n, `${K}.btnSelectAll`)}</SgButton>
              <SgButton onClick={() => setExternalValue([])}>{t(i18n, `${K}.btnClear`)}</SgButton>
            </SgGrid>
            <p className="text-sm text-[rgb(var(--sg-muted))]">
              {t(i18n, `${K}.currentValue`)}: <strong>[{externalValue.join(", ")}]</strong>
            </p>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-checkbox-group/samples/controle-externo-setvalue-getvalue.tsx.sample" />
        </Section>

        {/* 7 - Com Opcao Desabilitada */}
        <Section id="exemplo-7" title={sectionTitles[6]!}>
          <SgCheckboxGroup
            id="with-disabled-option"
            title={t(i18n, `${K}.title7`)}
            source={priorityOptions}
          />
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-checkbox-group/samples/com-opcao-desabilitada.tsx.sample" />
        </Section>

        {/* 8 - Grupo Disabled */}
        <Section id="exemplo-8" title={sectionTitles[7]!}>
          <SgCheckboxGroup
            id="disabled-group"
            title={t(i18n, `${K}.title8`)}
            source={basicOptions}
            value={["option2"]}
            disabled
          />
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-checkbox-group/samples/grupo-disabled.tsx.sample" />
        </Section>

        {/* 9 - Read-only */}
        <Section id="exemplo-9" title={sectionTitles[8]!}>
          <SgCheckboxGroup
            id="readonly"
            title={t(i18n, `${K}.title9`)}
            source={fruitOptions}
            value={["banana", "grape"]}
            readOnly
          />
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-checkbox-group/samples/read-only.tsx.sample" />
        </Section>

        {/* 10 - Obrigatorio com Validacao */}
        <Section id="exemplo-10" title={sectionTitles[9]!}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <SgCheckboxGroup
              name="preference"
              title={t(i18n, `${K}.title10`)}
              source={contactOptions}
              control={control}
              required
            />
            <SgButton type="submit">{t(i18n, `${K}.btnSubmit`)}</SgButton>
          </form>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-checkbox-group/samples/obrigatorio-com-validacao.tsx.sample" />
        </Section>

        {/* 11 - Horizontal com Icones Coloridos */}
        <Section id="exemplo-11" title={sectionTitles[10]!}>
          <SgCheckboxGroup
            id="horizontal-colored"
            title={t(i18n, `${K}.title11`)}
            source={weatherOptions}
            orientation="horizontal"
          />
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-checkbox-group/samples/horizontal-com-icones-coloridos.tsx.sample" />
        </Section>

        {/* 12 - Selection Style Highlight */}
        <Section id="exemplo-12" title={sectionTitles[11]!}>
          <SgCheckboxGroup
            id="highlight-list"
            title={t(i18n, `${K}.title12`)}
            source={listHighlightOptions}
            value={selectedHighlightStyle}
            onChange={setSelectedHighlightStyle}
            selectionStyle="highlight"
            className="max-w-xs"
          />
          <p className="mt-2 text-sm text-[rgb(var(--sg-muted))]">
            {t(i18n, `${K}.valueLabel`)}: <strong>[{selectedHighlightStyle.join(", ")}]</strong>
          </p>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-checkbox-group/samples/selection-style-highlight-lista.tsx.sample" />
        </Section>

        {/* 13 - Com GroupBox Customizado */}
        <Section id="exemplo-13" title={sectionTitles[12]!}>
          <SgCheckboxGroup
            id="custom-groupbox"
            title={t(i18n, `${K}.title13`)}
            source={optionsWithIcons}
            groupBoxProps={{
              title: t(i18n, `${K}.groupBoxTitle`),
              className: "border-2 border-[rgb(var(--sg-primary-500))]"
            }}
          />
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-checkbox-group/samples/com-groupbox-customizado.tsx.sample" />
        </Section>

        {/* 14 - React Hook Form - Register */}
        <Section id="exemplo-14" title={sectionTitles[13]!}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <SgCheckboxGroup
              name="fruits"
              title={t(i18n, `${K}.title14`)}
              source={fruitOptions}
              register={register}
            />
            <SgButton type="submit">{t(i18n, `${K}.btnSubmit`)}</SgButton>
          </form>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-checkbox-group/samples/react-hook-form-register.tsx.sample" />
        </Section>

        {/* 15 - Playground */}
        <Section id="exemplo-15" title={sectionTitles[14]!}>
          <SgPlayground
            title={t(i18n, `${K}.playgroundTitle`)}
            interactive
            codeContract="appFile"
            playgroundFile="apps/showcase/src/app/components/sg-checkbox-group/sg-checkbox-group.tsx.playground"
            height={650}
            defaultOpen
          />
        </Section>

        {/* 16 - Check All */}
        <Section id="exemplo-16" title={sectionTitles[15]!} description={t(i18n, `${K}.section16Description`)}>
          <div className="space-y-6">
            <div>
              <p className="mb-2 text-xs text-muted-foreground">{t(i18n, `${K}.checkAllNoLabel`)}</p>
              <SgCheckboxGroup
                id="check-all"
                title={t(i18n, `${K}.title16a`)}
                source={basicOptions}
                showCheckAll
              />
            </div>
            <div>
              <p className="mb-2 text-xs text-muted-foreground">{t(i18n, `${K}.checkAllWithLabel`)}</p>
              <SgCheckboxGroup
                id="check-all-custom"
                title={t(i18n, `${K}.title16b`)}
                source={basicOptions}
                showCheckAll
                checkAllLabel={t(i18n, `${K}.checkAllLabelValue`)}
                checkAllIcon={<Star className="w-4 h-4 text-yellow-500" />}
              />
            </div>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-checkbox-group/samples/check-all-showcheckall.tsx.sample" />
        </Section>

        {/* 17 - Checked inicial no source */}
        <Section id="exemplo-17" title={sectionTitles[16]!} description={t(i18n, `${K}.section17Description`)}>
          <SgCheckboxGroup
            id="source-checked"
            title={t(i18n, `${K}.title17`)}
            source={[
              { label: t(i18n, `${K}.optApple`), value: "apple" },
              { label: t(i18n, `${K}.optBanana`), value: "banana", checked: true },
              { label: t(i18n, `${K}.optOrange`), value: "orange" },
              { label: t(i18n, `${K}.optGrape`), value: "grape", checked: true }
            ]}
          />
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-checkbox-group/samples/checked-inicial-no-source.tsx.sample" />
        </Section>

        {/* 18 - Ref imperativo */}
        <Section id="exemplo-18" title={sectionTitles[17]!} description={t(i18n, `${K}.section18Description`)}>
          <SgCheckboxGroup
            ref={checkboxRef}
            id="ref-example"
            title={t(i18n, `${K}.title18`)}
            source={basicOptions}
            showCheckAll
          />
          <SgGrid columns={{ base: 2, md: 4 }} gap={8}>
            <SgButton onClick={() => setRefOutput(JSON.stringify(checkboxRef.current?.getChecked()))}>
              getChecked()
            </SgButton>
            <SgButton onClick={() => { checkboxRef.current?.checkAll(); setRefOutput("checkAll()"); }}>
              checkAll()
            </SgButton>
            <SgButton onClick={() => { checkboxRef.current?.clearAll(); setRefOutput("clearAll()"); }}>
              clearAll()
            </SgButton>
            <SgButton onClick={() => { checkboxRef.current?.setChecked(["option2"]); setRefOutput('setChecked(["option2"])'); }}>
              setChecked
            </SgButton>
          </SgGrid>
          {refOutput && (
            <p className="text-sm text-[rgb(var(--sg-muted))]">
              {t(i18n, `${K}.outputLabel`)}: <strong>{refOutput}</strong>
            </p>
          )}
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-checkbox-group/samples/ref-imperativo.tsx.sample" />
        </Section>

        {/* Props reference */}
        <section
          id="props-reference"
          className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
        >
          <h2 data-anchor-title="true" className="text-lg font-semibold">{t(i18n, `${K}.propsReference`)}</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2 pr-4 font-semibold">{t(i18n, `${K}.colProp`)}</th>
                  <th className="pb-2 pr-4 font-semibold">{t(i18n, `${K}.colType`)}</th>
                  <th className="pb-2 pr-4 font-semibold">{t(i18n, `${K}.colDefault`)}</th>
                  <th className="pb-2 font-semibold">{t(i18n, `${K}.colDescription`)}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  ["id", "string", "-", t(i18n, `${K}.descId`)],
                  ["title", "string", "-", t(i18n, `${K}.descTitle`)],
                  ["source", "SgCheckboxGroupOption[]", "-", t(i18n, `${K}.descSource`)],
                  ["value", "(string | number)[]", "-", t(i18n, `${K}.descValue`)],
                  ["orientation", '"horizontal" | "vertical"', '"vertical"', t(i18n, `${K}.descOrientation`)],
                  ["selectionStyle", '"checkbox" | "highlight"', '"checkbox"', t(i18n, `${K}.descSelectionStyle`)],
                  ["iconOnly", "boolean", "false", t(i18n, `${K}.descIconOnly`)],
                  ["disabled", "boolean", "false", t(i18n, `${K}.descDisabled`)],
                  ["readOnly", "boolean", "false", t(i18n, `${K}.descReadOnly`)],
                  ["required", "boolean", "false", t(i18n, `${K}.descRequired`)],
                  ["onChange", "(value: (string | number)[]) => void", "-", t(i18n, `${K}.descOnChange`)],
                  ["showCheckAll", "boolean", "false", t(i18n, `${K}.descShowCheckAll`)],
                  ["checkAllLabel", "string", '"Selecionar todos"', t(i18n, `${K}.descCheckAllLabel`)],
                  ["name", "string", "-", t(i18n, `${K}.descName`)],
                  ["control", "Control", "-", t(i18n, `${K}.descControl`)],
                  ["register", "UseFormRegister", "-", t(i18n, `${K}.descRegister`)],
                  ["error", "string", "-", t(i18n, `${K}.descError`)],
                  ["className", "string", "-", t(i18n, `${K}.descClassName`)],
                  ["style", "React.CSSProperties", "-", t(i18n, `${K}.descStyle`)],
                  ["optionClassName", "string", "-", t(i18n, `${K}.descOptionClassName`)],
                  ["groupBoxProps", "object", "-", t(i18n, `${K}.descGroupBoxProps`)],
                  ["ref", "SgCheckboxGroupRef", "-", t(i18n, `${K}.descRef`)],
                ].map(([prop, type, def, desc]) => (
                  <tr key={prop}>
                    <td className="py-2 pr-4 font-mono text-xs">{prop}</td>
                    <td className="py-2 pr-4">{type}</td>
                    <td className="py-2 pr-4">{def}</td>
                    <td className="py-2">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {aiComponent ? <ComponentAiPropsTable component={aiComponent} /> : null}
        {aiComponent ? <ComponentAiSummary component={aiComponent} /> : null}
      <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}

