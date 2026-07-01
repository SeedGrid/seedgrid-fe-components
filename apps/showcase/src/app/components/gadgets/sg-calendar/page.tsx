"use client";

import * as React from "react";
import { SgButton, SgCalendar, SgEnvironmentProvider, SgGrid } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import ComponentAiPropsTable from "../../ai/ComponentAiPropsTable";
import ComponentAiSummary from "../../ai/ComponentAiSummary";
import { useAiManifestComponent } from "../../ai/useAiManifestComponent";
import SgCodeBlockBase from "../../sgCodeBlockBase";
import I18NReady from "../../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../../ShowcasePropsReference";
import ShowcaseStickyHeader from "../../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../../useShowcaseAnchors";
import { t, useShowcaseI18n } from "../../../../i18n";

const K = "showcase.component.calendar";

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section
      data-showcase-example="true"
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 space-y-4">{props.children}</div>
    </section>
  );
}








function BasicCalendarExample() {
  return (
    <SgCalendar
      locale="pt-BR"
      defaultValue="2026-03-10"
      defaultViewDate="2026-03-01"
      cardTitle="Calendario base"
      cardProps={{ id: "showcase-calendar-basic", dragPersistKey: "showcase-calendar-basic" }}
    />
  );
}

function ControlledCalendarExample() {
  const [selected, setSelected] = React.useState(new Date(2026, 2, 10));
  const selectedText = React.useMemo(
    () => selected.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }),
    [selected]
  );
  const minDate = React.useMemo(() => new Date(2026, 2, 5), []);
  const maxDate = React.useMemo(() => new Date(2026, 2, 25), []);

  return (
    <div className="space-y-2">
      <SgCalendar
        value={selected}
        onValueChange={setSelected}
        locale="pt-BR"
        minDate={minDate}
        maxDate={maxDate}
        isDateDisabled={(date) => date.getDay() === 0 || date.getDay() === 6}
        cardTitle="Agenda de visitas"
        cardProps={{ id: "showcase-calendar-range", dragPersistKey: "showcase-calendar-range" }}
      />
      <p className="text-sm text-muted-foreground">Selecionado: {selectedText}</p>
    </div>
  );
}

function LocaleCalendarExample() {
  const [locale, setLocale] = React.useState<"pt-BR" | "en-US" | "es">("pt-BR");
  const [weekStartsOn, setWeekStartsOn] = React.useState<0 | 1>(0);
  const [numberOfMonths, setNumberOfMonths] = React.useState(6);

  return (
    <div className="space-y-3">
      <SgGrid columns={{ base: 2, md: 5 }} gap={8}>
        <SgButton appearance={locale === "pt-BR" ? "solid" : "outline"} onClick={() => setLocale("pt-BR")}>pt-BR</SgButton>
        <SgButton appearance={locale === "en-US" ? "solid" : "outline"} onClick={() => setLocale("en-US")}>en-US</SgButton>
        <SgButton appearance={locale === "es" ? "solid" : "outline"} onClick={() => setLocale("es")}>es</SgButton>
        <SgButton appearance={weekStartsOn === 0 ? "solid" : "outline"} onClick={() => setWeekStartsOn(0)}>Sunday first</SgButton>
        <SgButton appearance={weekStartsOn === 1 ? "solid" : "outline"} onClick={() => setWeekStartsOn(1)}>Monday first</SgButton>
      </SgGrid>

      <SgGrid columns={{ base: 2, md: 4 }} gap={8}>
        <SgButton appearance={numberOfMonths === 1 ? "solid" : "outline"} onClick={() => setNumberOfMonths(1)}>1 month</SgButton>
        <SgButton appearance={numberOfMonths === 3 ? "solid" : "outline"} onClick={() => setNumberOfMonths(3)}>3 months</SgButton>
        <SgButton appearance={numberOfMonths === 6 ? "solid" : "outline"} onClick={() => setNumberOfMonths(6)}>6 months</SgButton>
        <SgButton appearance={numberOfMonths === 12 ? "solid" : "outline"} onClick={() => setNumberOfMonths(12)}>12 months</SgButton>
      </SgGrid>

      <SgCalendar
        locale={locale}
        weekStartsOn={weekStartsOn}
        numberOfMonths={numberOfMonths}
        monthsPerLine={3}
        defaultValue="2026-03-10"
        defaultViewDate="2026-03-01"
        cardTitle="Calendar i18n + multi month"
        cardProps={{ id: "showcase-calendar-i18n", dragPersistKey: "showcase-calendar-i18n" }}
      />
    </div>
  );
}

export default function SgCalendarPage() {
  const i18n = useShowcaseI18n();
  const aiComponent = useAiManifestComponent("SgCalendar");
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors();

  const calendarProps: ShowcasePropRow[] = React.useMemo(
    () => [
      { prop: "value / defaultValue / onValueChange", type: "Date | string / Date | string / callback", defaultValue: "today / today / -", description: t(i18n, `${K}.propsValue`) },
      { prop: "viewDate / defaultViewDate / onViewDateChange", type: "Date | string / Date | string / callback", defaultValue: "selected month / selected month / -", description: t(i18n, `${K}.propsView`) },
      { prop: "locale", type: "string", defaultValue: '"pt-BR"', description: t(i18n, `${K}.propsLocale`) },
      { prop: "weekStartsOn", type: "0 | 1 | 2 | 3 | 4 | 5 | 6", defaultValue: "0", description: t(i18n, `${K}.propsWeekStart`) },
      { prop: "weekdayFormat", type: '"narrow" | "short" | "long"', defaultValue: '"narrow"', description: t(i18n, `${K}.propsWeekdayFormat`) },
      { prop: "numberOfMonths", type: "number", defaultValue: "1", description: t(i18n, `${K}.propsNumberOfMonths`) },
      { prop: "monthsPerLine", type: "number", defaultValue: "3", description: t(i18n, `${K}.propsMonthsPerLine`) },
      { prop: "monthMinWidth", type: "number | string", defaultValue: "auto", description: t(i18n, `${K}.propsMonthMinWidth`) },
      { prop: "showAdjacentMonths", type: "boolean", defaultValue: "true", description: t(i18n, `${K}.propsAdjacent`) },
      { prop: "minDate / maxDate", type: "Date | string", defaultValue: "-", description: t(i18n, `${K}.propsMinMax`) },
      { prop: "isDateDisabled", type: "(date: Date) => boolean", defaultValue: "-", description: t(i18n, `${K}.propsDisabled`) },
      { prop: "showTodayShortcut", type: "boolean", defaultValue: "true", description: t(i18n, `${K}.propsTodayShortcut`) },
      { prop: "className / style", type: "string / CSSProperties", defaultValue: "-", description: t(i18n, `${K}.propsClassStyle`) },
      { prop: "cardTitle / cardProps", type: 'ReactNode / Omit<SgCardProps, "children" | "title">', defaultValue: '"Calendar/Calendario" / -', description: t(i18n, `${K}.propsCard`) }
    ],
    [i18n]
  );

  return (
    <I18NReady>
      <SgEnvironmentProvider
        value={{
          namespaceProvider: { getNamespace: () => "showcase" },
          persistence: { scope: "app:showcase", mode: "fallback", stateVersion: 1 }
        }}
      >
        <div
          ref={pageRef}
          className="max-w-5xl space-y-8"
          style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
        >
          <ShowcaseStickyHeader
            stickyHeaderRef={stickyHeaderRef}
            title="SgCalendar"
            subtitle={t(i18n, `${K}.subtitle`)}
            exampleLinks={exampleLinks}
            onAnchorClick={handleAnchorClick}
          />

          <Section title={t(i18n, `${K}.section1Title`)} description={t(i18n, `${K}.section1Description`)}>
            <BasicCalendarExample />
            <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/gadgets/sg-calendar/samples/basico-mes-atual.tsx.sample" />
          </Section>

          <Section title={t(i18n, `${K}.section2Title`)} description={t(i18n, `${K}.section2Description`)}>
            <ControlledCalendarExample />
            <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/gadgets/sg-calendar/samples/selecionado-controlado-limite-de-datas.tsx.sample" />
          </Section>

          <Section title={t(i18n, `${K}.section3Title`)} description={t(i18n, `${K}.section3Description`)}>
            <LocaleCalendarExample />
            <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/gadgets/sg-calendar/samples/locale-multiplos-meses.tsx.sample" />
          </Section>

          <Section title={t(i18n, `${K}.section4Title`)} description={t(i18n, `${K}.section4Description`)}>
            <SgPlayground
              title={t(i18n, `${K}.playgroundTitle`)}
              interactive
              codeContract="appFile"
              playgroundFile="apps/showcase/src/app/components/gadgets/sg-calendar/sg-calendar.tsx.playground"
              height={640}
              defaultOpen
            />
          </Section>

          <ShowcasePropsReference rows={calendarProps} />
          {aiComponent ? <ComponentAiPropsTable component={aiComponent} /> : null}
          {aiComponent ? <ComponentAiSummary component={aiComponent} /> : null}
          <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
        </div>
      </SgEnvironmentProvider>
    </I18NReady>
  );
}

