"use client";

import React from "react";
import Link from "next/link";
import { SgGrid } from "@seedgrid/fe-components";
import { useSgTheme } from "@seedgrid/fe-theme";
import type { ShowcaseExampleLink } from "./useShowcaseAnchors";
import { useShowcaseI18n, type ShowcaseLocale } from "../../i18n";

type ShowcaseStickyHeaderProps = {
  stickyHeaderRef: React.RefObject<HTMLDivElement | null>;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  exampleLinks: ShowcaseExampleLink[];
  onAnchorClick: (event: React.MouseEvent<HTMLAnchorElement>, anchorId: string) => void;
};

type StickyHeaderTexts = {
  examplesLabel: string;
  propsReferenceLabel: string;
};

const STICKY_HEADER_TEXTS: Record<"pt-BR" | "pt-PT" | "en-US" | "es" | "fr", StickyHeaderTexts> = {
  "pt-BR": {
    examplesLabel: "Exemplos",
    propsReferenceLabel: "Referência de Props"
  },
  "pt-PT": {
    examplesLabel: "Exemplos",
    propsReferenceLabel: "Referência de Props"
  },
  "en-US": {
    examplesLabel: "Examples",
    propsReferenceLabel: "Props Reference"
  },
  es: {
    examplesLabel: "Ejemplos",
    propsReferenceLabel: "Referencia de Props"
  },
  fr: {
    examplesLabel: "Exemples",
    propsReferenceLabel: "Référence des props"
  }
};

function isSupportedLocale(locale: ShowcaseLocale): locale is keyof typeof STICKY_HEADER_TEXTS {
  return locale === "pt-BR" || locale === "pt-PT" || locale === "en-US" || locale === "es" || locale === "fr";
}

export default function ShowcaseStickyHeader(props: Readonly<ShowcaseStickyHeaderProps>) {
  const i18n = useShowcaseI18n();
  const locale: keyof typeof STICKY_HEADER_TEXTS = isSupportedLocale(i18n.locale) ? i18n.locale : "en-US";
  const texts = STICKY_HEADER_TEXTS[locale];
  const { currentMode } = useSgTheme();
  // Tema claro: o primario (500) sobre o fundo claro tem ~1.6:1; escurece o mesmo matiz (50% com preto = ~5.7:1).
  // Tema escuro: mantem o primario original (ja tem ~10:1).
  const linkColorClass =
    currentMode === "light" ? "text-[color-mix(in_srgb,rgb(var(--sg-primary-500))_50%,black)]" : "text-primary";

  return (
    <div ref={props.stickyHeaderRef} className="sticky -top-2 z-50 isolate bg-background pb-2 pt-4 md:-top-8 md:pb-2 md:pt-8">
      {/* Celular (<768 px): UMA linha rolavel na horizontal (nome + links de ancora), sem descricao. */}
      <div className="rounded-lg border border-border bg-background p-2 shadow-sm md:p-4">
       <div className="flex items-center gap-2 overflow-x-auto md:block md:overflow-visible">
        <h1 className="sticky left-0 z-10 shrink-0 whitespace-nowrap bg-background pr-2 text-base font-bold md:static md:whitespace-normal md:pr-0 md:text-3xl">{props.title}</h1>
        {props.subtitle ? <p className="mt-2 hidden text-muted-foreground md:block">{props.subtitle}</p> : null}
        <p className="mt-3 hidden text-xs font-semibold uppercase tracking-wide text-muted-foreground md:block">{texts.examplesLabel}</p>
        <div className="contents md:hidden">
          {props.exampleLinks.map((example) => (
            <Link
              key={example.id}
              href={`#${example.id}`}
              onClick={(event) => props.onAnchorClick(event, example.id)}
              className={`shrink-0 whitespace-nowrap rounded-md border border-border px-2 py-1 text-xs font-medium ${linkColorClass} transition-colors hover:bg-muted/40`}
            >
              {example.label}
            </Link>
          ))}
          <Link
            href="#props-reference"
            onClick={(event) => props.onAnchorClick(event, "props-reference")}
            className={`shrink-0 whitespace-nowrap rounded-md border border-border px-2 py-1 text-xs font-medium ${linkColorClass} transition-colors hover:bg-muted/40`}
          >
            {texts.propsReferenceLabel}
          </Link>
        </div>
        <SgGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={8} className="mt-2 hidden md:grid">
          {props.exampleLinks.map((example) => (
            <Link
              key={example.id}
              href={`#${example.id}`}
              onClick={(event) => props.onAnchorClick(event, example.id)}
              className={`rounded-md border border-border px-2 py-1 text-xs font-medium ${linkColorClass} transition-colors hover:bg-muted/40`}
            >
              {example.label}
            </Link>
          ))}
          <Link
            href="#props-reference"
            onClick={(event) => props.onAnchorClick(event, "props-reference")}
            className={`rounded-md border border-border px-2 py-1 text-xs font-medium ${linkColorClass} transition-colors hover:bg-muted/40`}
          >
            {texts.propsReferenceLabel}
          </Link>
        </SgGrid>
       </div>
      </div>
    </div>
  );
}


