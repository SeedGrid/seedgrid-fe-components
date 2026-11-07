"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { SgButton, SgGrid, SgInputOTP, type SgInputOTPRef } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import SgCodeBlockBase from "../sgCodeBlockBase";
import I18NReady from "../I18NReady";
import ComponentAiPropsTable from "../ai/ComponentAiPropsTable";
import ComponentAiSummary from "../ai/ComponentAiSummary";
import { useAiManifestComponent } from "../ai/useAiManifestComponent";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import { t, useShowcaseI18n, type ShowcaseLocale } from "../../../i18n";

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

function ValuePanel(props: { masked: string; raw: string; empty: string; completeValue?: string; waiting?: string }) {
  return (
    <div className="rounded border border-border bg-muted/40 p-3 text-xs">
      <div><strong>masked:</strong> {props.masked || props.empty}</div>
      <div><strong>raw:</strong> {props.raw || props.empty}</div>
      {props.completeValue !== undefined ? (
        <div><strong>onComplete:</strong> {props.completeValue || props.waiting}</div>
      ) : null}
    </div>
  );
}

type OtpTexts = {
  subtitle: string;
  examplesLabel: string;
  propsLinkLabel: string;
  propsTitle: string;
};

const OTP_TEXTS: Record<"pt-BR" | "pt-PT" | "en-US" | "es" | "fr", OtpTexts> = {
  "pt-BR": {
    subtitle: "Input OTP com dígitos separados, suporte a colagem e máscara configurável.",
    examplesLabel: "Exemplos",
    propsLinkLabel: "Referência de Props",
    propsTitle: "Referência de Props"
  },
  "pt-PT": {
    subtitle: "Input OTP com dígitos separados, suporte a colagem e máscara configurável.",
    examplesLabel: "Exemplos",
    propsLinkLabel: "Referência de Props",
    propsTitle: "Referência de Props"
  },
  "en-US": {
    subtitle: "OTP input with separated digits, paste support, and configurable mask.",
    examplesLabel: "Examples",
    propsLinkLabel: "Props Reference",
    propsTitle: "Props Reference"
  },
  es: {
    subtitle: "Input OTP con dígitos separados, soporte de pegado y máscara configurable.",
    examplesLabel: "Ejemplos",
    propsLinkLabel: "Referencia de Props",
    propsTitle: "Referencia de Props"
  },
  fr: {
    subtitle: "Champ OTP avec chiffres séparés, prise en charge du collage et masque configurable.",
    examplesLabel: "Exemples",
    propsLinkLabel: "Référence des props",
    propsTitle: "Référence des props"
  }
};

function isSupportedOtpLocale(locale: ShowcaseLocale): locale is keyof typeof OTP_TEXTS {
  return locale === "pt-BR" || locale === "pt-PT" || locale === "en-US" || locale === "es" || locale === "fr";
}
export default function SgInputOTPPage() {
  const i18n = useShowcaseI18n();
  const aiComponent = useAiManifestComponent("SgInputOTP");
  const locale: keyof typeof OTP_TEXTS = isSupportedOtpLocale(i18n.locale) ? i18n.locale : "en-US";
  const texts = OTP_TEXTS[locale];
  const otpRef = React.useRef<SgInputOTPRef | null>(null);
  const [basicMasked, setBasicMasked] = React.useState("");
  const [basicRaw, setBasicRaw] = React.useState("");
  const [maskMasked, setMaskMasked] = React.useState("");
  const [maskRaw, setMaskRaw] = React.useState("");
  const [pasteMasked, setPasteMasked] = React.useState("");
  const [pasteRaw, setPasteRaw] = React.useState("");
  const [completeValue, setCompleteValue] = React.useState("");
  const [refReadout, setRefReadout] = React.useState(t(i18n, "showcase.component.inputOtp.labels.readHint"));
  const [confirmed, setConfirmed] = React.useState("");
  const { control, handleSubmit } = useForm<{ code: string }>({ defaultValues: { code: "" } });
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
    const titleEl = (target.querySelector("[data-anchor-title='true']") as HTMLElement | null) ?? target;

    const correctIfNeeded = () => {
      const stickyBottomNow = stickyHeaderRef.current?.getBoundingClientRect().bottom ?? 0;
      const desiredTopNow = stickyBottomNow + extraTopGap;
      const currentTop = titleEl.getBoundingClientRect().top;
      const delta = currentTop - desiredTopNow;
      if (Math.abs(delta) <= 1) return;

      if (scrollContainer === window) {
        window.scrollTo({ top: Math.max(0, window.scrollY + delta), behavior: "auto" });
        return;
      }

      const container = scrollContainer as HTMLElement;
      container.scrollTo({ top: Math.max(0, container.scrollTop + delta), behavior: "auto" });
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
      { id: "exemplo-1", label: `1) ${t(i18n, "showcase.component.inputOtp.sections.basic.title")}` },
      { id: "exemplo-2", label: `2) ${t(i18n, "showcase.component.inputOtp.sections.mask.title")}` },
      { id: "exemplo-3", label: `3) ${t(i18n, "showcase.component.inputOtp.sections.paste.title")}` },
      { id: "exemplo-4", label: `4) ${t(i18n, "showcase.component.inputOtp.sections.ref.title")}` },
      { id: "exemplo-5", label: `5) ${t(i18n, "showcase.component.inputOtp.sections.validation.title")}` },
      { id: "exemplo-6", label: `6) ${t(i18n, "showcase.component.inputOtp.sections.form.title")}` },
      { id: "exemplo-7", label: `7) ${t(i18n, "showcase.component.inputOtp.sections.states.title")}` },
      { id: "exemplo-8", label: "8) Playground" }
    ],
    [i18n.locale]
  );
  const inputOtpPropsRows: ShowcasePropRow[] = [
    { prop: "id", type: "string", defaultValue: "-", description: t(i18n, "showcase.component.inputOtp.props.rows.id") },
    { prop: "label / hintText", type: "string", defaultValue: "-", description: t(i18n, "showcase.component.inputOtp.props.rows.labelHintText") },
    { prop: "mask", type: "string", defaultValue: "\"999999\"", description: t(i18n, "showcase.component.inputOtp.props.rows.mask") },
    { prop: "value / defaultValue", type: "string", defaultValue: "-", description: t(i18n, "showcase.component.inputOtp.props.rows.valueDefault") },
    { prop: "required / requiredMessage", type: "boolean / string", defaultValue: "false / auto", description: t(i18n, "showcase.component.inputOtp.props.rows.required") },
    { prop: "onChange / onRawChange / onComplete", type: "callbacks", defaultValue: "-", description: t(i18n, "showcase.component.inputOtp.props.rows.callbacks") },
    { prop: "enabled / readOnly", type: "boolean", defaultValue: "true / false", description: t(i18n, "showcase.component.inputOtp.props.rows.enabledReadOnly") },
    { prop: "className / groupClassName / slotClassName / separatorClassName", type: "string", defaultValue: "-", description: t(i18n, "showcase.component.inputOtp.props.rows.classNames") },
    { prop: "register / control / name", type: "react-hook-form", defaultValue: "-", description: t(i18n, "showcase.component.inputOtp.props.rows.rhf") },
    { prop: "ref API", type: "SgInputOTPRef", defaultValue: "-", description: t(i18n, "showcase.component.inputOtp.props.rows.refApi") }
  ];

  return (
    <I18NReady>
      <div
        className="max-w-5xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <div ref={stickyHeaderRef} className="sticky top-0 z-50 isolate max-h-[52vh] overflow-y-auto bg-background pb-2 pt-2 md:-top-8 md:max-h-none md:overflow-visible md:pb-2 md:pt-8">
          <div className="rounded-lg border border-border bg-background p-4 shadow-sm">
            <h1 className="text-3xl font-bold">SgInputOTP</h1>
            <p className="mt-2 text-muted-foreground">{texts.subtitle}</p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{texts.examplesLabel}</p>
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
              >{texts.propsLinkLabel}</Link>
            </SgGrid>
          </div>
        </div>

        <Section
          id="exemplo-1"
          title={`1) ${t(i18n, "showcase.component.inputOtp.sections.basic.title")}`}
          description={t(i18n, "showcase.component.inputOtp.sections.basic.description")}
        >
          <div className="w-full max-w-md space-y-3">
            <SgInputOTP
              id="otp-basic"
              label={t(i18n, "showcase.component.inputOtp.labels.code")}
              hintText={t(i18n, "showcase.component.inputOtp.labels.codeHint")}
              onChange={setBasicMasked}
              onRawChange={setBasicRaw}
            />
            <ValuePanel masked={basicMasked} raw={basicRaw} empty={t(i18n, "showcase.component.inputOtp.labels.empty")} />
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-input-otp/samples/basico.tsx.sample" />
        </Section>

        <Section
          id="exemplo-2"
          title={`2) ${t(i18n, "showcase.component.inputOtp.sections.mask.title")}`}
          description={t(i18n, "showcase.component.inputOtp.sections.mask.description")}
        >
          <div className="w-full max-w-md space-y-3">
            <SgInputOTP
              id="otp-mask"
              label={t(i18n, "showcase.component.inputOtp.labels.accessToken")}
              hintText={t(i18n, "showcase.component.inputOtp.labels.accessTokenHint")}
              mask="###-###-99"
              onChange={setMaskMasked}
              onRawChange={setMaskRaw}
            />
            <ValuePanel masked={maskMasked} raw={maskRaw} empty={t(i18n, "showcase.component.inputOtp.labels.empty")} />
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-input-otp/samples/mascara-customizada.tsx.sample" />
        </Section>

        <Section
          id="exemplo-3"
          title={`3) ${t(i18n, "showcase.component.inputOtp.sections.paste.title")}`}
          description={t(i18n, "showcase.component.inputOtp.sections.paste.description")}
        >
          <div className="w-full max-w-md space-y-3">
            <SgInputOTP
              id="otp-paste"
              label={t(i18n, "showcase.component.inputOtp.labels.pasteCode")}
              hintText={t(i18n, "showcase.component.inputOtp.labels.pasteHint")}
              mask="###-###-99"
              onChange={setPasteMasked}
              onRawChange={setPasteRaw}
              onComplete={(value) => setCompleteValue(value)}
            />
            <ValuePanel
              masked={pasteMasked}
              raw={pasteRaw}
              empty={t(i18n, "showcase.component.inputOtp.labels.empty")}
              completeValue={completeValue}
              waiting={t(i18n, "showcase.component.inputOtp.labels.waiting")}
            />
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-input-otp/samples/colagem-on-complete.tsx.sample" />
        </Section>

        <Section
          id="exemplo-4"
          title={`4) ${t(i18n, "showcase.component.inputOtp.sections.ref.title")}`}
          description={t(i18n, "showcase.component.inputOtp.sections.ref.description")}
        >
          <div className="w-full max-w-md space-y-3">
            <SgInputOTP
              id="otp-ref"
              ref={otpRef}
              label={t(i18n, "showcase.component.inputOtp.labels.refLabel")}
              hintText={t(i18n, "showcase.component.inputOtp.labels.refHint")}
              mask="###-###-99"
            />
            <SgGrid columns={{ base: 1, sm: 3 }} gap={8}>
              <SgButton size="sm" appearance="outline" onClick={() => otpRef.current?.focus()}>
                {t(i18n, "showcase.component.inputOtp.labels.focus")}
              </SgButton>
              <SgButton size="sm" appearance="outline" onClick={() => otpRef.current?.clear()}>
                {t(i18n, "showcase.component.inputOtp.labels.clear")}
              </SgButton>
              <SgButton
                size="sm"
                appearance="outline"
                onClick={() => {
                  const masked = otpRef.current?.getMaskedValue() ?? "";
                  const raw = otpRef.current?.getRawValue() ?? "";
                  const empty = t(i18n, "showcase.component.inputOtp.labels.empty");
                  setRefReadout(`masked="${masked || empty}" | raw="${raw || empty}"`);
                }}
              >
                {t(i18n, "showcase.component.inputOtp.labels.read")}
              </SgButton>
            </SgGrid>
            <div className="rounded border border-border bg-muted/40 p-3 text-xs">
              <strong>{t(i18n, "showcase.component.inputOtp.labels.output")}:</strong> {refReadout}
            </div>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-input-otp/samples/acesso-por-ref.tsx.sample" />
        </Section>

        <Section
          id="exemplo-5"
          title={`5) ${t(i18n, "showcase.component.inputOtp.sections.validation.title")}`}
          description={t(i18n, "showcase.component.inputOtp.sections.validation.description")}
        >
          <div className="w-full max-w-md">
            <SgInputOTP
              id="otp-validation"
              label={t(i18n, "showcase.component.inputOtp.labels.inviteCode")}
              mask="99-99"
              required
              requiredMessage={t(i18n, "showcase.component.inputOtp.messages.required")}
              validation={(raw) => (raw.length < 4 ? t(i18n, "showcase.component.inputOtp.messages.length") : null)}
            />
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-input-otp/samples/validacao.tsx.sample" />
        </Section>

        <Section
          id="exemplo-6"
          title={`6) ${t(i18n, "showcase.component.inputOtp.sections.form.title")}`}
          description={t(i18n, "showcase.component.inputOtp.sections.form.description")}
        >
          <form className="w-full max-w-md space-y-3" onSubmit={handleSubmit((values) => setConfirmed(values.code))}>
            <SgInputOTP
              id="otp-form"
              name="code"
              control={control}
              label={t(i18n, "showcase.component.inputOtp.labels.codeField")}
              mask="9999"
              required
              requiredMessage={t(i18n, "showcase.component.inputOtp.messages.required")}
            />
            <SgButton type="submit">{t(i18n, "showcase.component.inputOtp.labels.confirm")}</SgButton>
            {confirmed ? <p className="text-sm">{t(i18n, "showcase.component.inputOtp.labels.confirmed", { value: confirmed })}</p> : null}
          </form>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-input-otp/samples/dentro-de-um-formulario.tsx.sample" />
        </Section>

        <Section
          id="exemplo-7"
          title={`7) ${t(i18n, "showcase.component.inputOtp.sections.states.title")}`}
          description={t(i18n, "showcase.component.inputOtp.sections.states.description")}
        >
          <div className="w-full max-w-md space-y-4">
            <SgInputOTP
              id="otp-error"
              label={t(i18n, "showcase.component.inputOtp.labels.withError")}
              mask="9999"
              defaultValue="1234"
              error={t(i18n, "showcase.component.inputOtp.messages.expired")}
            />
            <SgInputOTP id="otp-disabled" label={t(i18n, "showcase.component.inputOtp.labels.disabled")} mask="9999" defaultValue="12" enabled={false} />
            <SgInputOTP id="otp-readonly" label={t(i18n, "showcase.component.inputOtp.labels.readOnly")} mask="9999" defaultValue="9876" readOnly />
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-input-otp/samples/estados.tsx.sample" />
        </Section>

        <Section id="exemplo-8" title="8) Playground" description={t(i18n, "showcase.common.playground.description")}>
          <SgPlayground
            title="SgInputOTP Playground"
            interactive
            codeContract="appFile"
            playgroundFile="apps/showcase/src/app/components/sg-input-otp/sg-input-otp.tsx.playground"
            height={620}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={inputOtpPropsRows} title={texts.propsTitle} />
        {aiComponent ? <ComponentAiPropsTable component={aiComponent} /> : null}
        {aiComponent ? <ComponentAiSummary component={aiComponent} /> : null}
      <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}

