"use client";

import React from "react";
import type { Control, FieldValues, RegisterOptions } from "react-hook-form";
import { Controller } from "react-hook-form";
import type { ControllerFieldState, ControllerRenderProps } from "react-hook-form";
import { resolveFieldError } from "../rhf";
import { cn } from "../layout/sgDocking";
import { SgCombobox } from "./SgCombobox";
import { SgInputDate } from "./SgInputDate";
import type { SgAutocompleteItem } from "./SgAutocomplete";

/**
 * Presets temporais pre-definidos para filtros de relatorios/dashboards.
 * O valor de cada membro e igual ao seu nome (string) para trafegar bem em
 * fontes de dados, JSON e no id de item do SgCombobox.
 */
export enum PeriodPreset {
  ALL = "ALL",
  CUSTOM = "CUSTOM",
  TODAY = "TODAY",
  YESTERDAY = "YESTERDAY",
  TOMORROW = "TOMORROW",
  THIS_WEEK = "THIS_WEEK",
  THIS_QUINZENA = "THIS_QUINZENA",
  THIS_MONTH = "THIS_MONTH",
  THIS_QUARTER = "THIS_QUARTER",
  THIS_SEMESTER = "THIS_SEMESTER",
  THIS_YEAR = "THIS_YEAR",
  LAST_WEEK = "LAST_WEEK",
  LAST_QUINZENA = "LAST_QUINZENA",
  LAST_MONTH = "LAST_MONTH",
  LAST_QUARTER = "LAST_QUARTER",
  LAST_SEMESTER = "LAST_SEMESTER",
  LAST_YEAR = "LAST_YEAR",
  NEXT_WEEK = "NEXT_WEEK",
  NEXT_QUINZENA = "NEXT_QUINZENA",
  NEXT_MONTH = "NEXT_MONTH",
  NEXT_QUARTER = "NEXT_QUARTER",
  NEXT_SEMESTER = "NEXT_SEMESTER",
  NEXT_YEAR = "NEXT_YEAR"
}

/**
 * Intervalo resolvido de um preset.
 * - startDate: meia-noite local do primeiro dia (00:00:00.000).
 * - endDate: ultimo instante local do ultimo dia (23:59:59.999).
 * - ALL e CUSTOM (sem preenchimento da UI) retornam datas nulas.
 */
export type ResolvedPeriod = {
  preset: PeriodPreset;
  label: string;
  startDate: Date | null;
  endDate: Date | null;
};

export type ResolvePeriodOptions = {
  /** Nao permite que startDate seja anterior a esta data (clamp). */
  minDate?: Date;
  /** Nao permite que endDate seja posterior a esta data (clamp). */
  maxDate?: Date;
  /** Locale usado para o label textual. Default "pt-BR". */
  locale?: string;
};

export type SgPeriodSelectorProps = {
  id?: string;
  label?: string;
  value?: PeriodPreset;
  onChange?: (period: ResolvedPeriod) => void;
  /** Habilita o grupo de periodos passados (LAST_*). Default true. */
  permitPast?: boolean;
  /** Habilita o grupo de periodos atuais (THIS_*, TODAY, YESTERDAY). Default true. */
  permitCurrent?: boolean;
  /** Habilita o grupo de periodos futuros (TOMORROW, NEXT_*). Default true. */
  permitFuture?: boolean;
  /** Habilita a opcao "Todos" (sem limites de data). Default true. */
  permitAll?: boolean;
  /** Habilita a opcao "Periodo" (intervalo customizado). Default true. */
  allowCustomPeriod?: boolean;
  /** Locale para labels e formatacao. Default "pt-BR". */
  locale?: string;
  disabled?: boolean;
  required?: boolean;
  minDate?: Date;
  maxDate?: Date;
  /** Data de referencia para resolver os presets (default: agora). Util em testes. */
  referenceDate?: Date;
  className?: string;
  error?: string;
  /** Integracao react-hook-form (opcional). */
  control?: Control<FieldValues>;
  name?: string;
  rules?: RegisterOptions;
};

/* ------------------------------------------------------------------ */
/* i18n dos presets (ASCII puro, sem acentos — estilo da casa)         */
/* ------------------------------------------------------------------ */

type LocaleMap = Record<string, string>;

const PERIOD_PRESET_LABELS: Record<PeriodPreset, LocaleMap> = {
  [PeriodPreset.ALL]: { "pt-BR": "Todos", "en-US": "All", es: "Todos", "pt-PT": "Todos", fr: "Tous" },
  [PeriodPreset.CUSTOM]: { "pt-BR": "Periodo", "en-US": "Custom period", es: "Periodo", "pt-PT": "Periodo", fr: "Periode" },
  [PeriodPreset.TODAY]: { "pt-BR": "Hoje", "en-US": "Today", es: "Hoy", "pt-PT": "Hoje", fr: "Aujourd'hui" },
  [PeriodPreset.YESTERDAY]: { "pt-BR": "Ontem", "en-US": "Yesterday", es: "Ayer", "pt-PT": "Ontem", fr: "Hier" },
  [PeriodPreset.TOMORROW]: { "pt-BR": "Amanha", "en-US": "Tomorrow", es: "Manana", "pt-PT": "Amanha", fr: "Demain" },
  [PeriodPreset.THIS_WEEK]: { "pt-BR": "Esta semana", "en-US": "This week", es: "Esta semana", "pt-PT": "Esta semana", fr: "Cette semaine" },
  [PeriodPreset.THIS_QUINZENA]: { "pt-BR": "Esta quinzena", "en-US": "This fortnight", es: "Esta quincena", "pt-PT": "Esta quinzena", fr: "Cette quinzaine" },
  [PeriodPreset.THIS_MONTH]: { "pt-BR": "Este mes", "en-US": "This month", es: "Este mes", "pt-PT": "Este mes", fr: "Ce mois" },
  [PeriodPreset.THIS_QUARTER]: { "pt-BR": "Este trimestre", "en-US": "This quarter", es: "Este trimestre", "pt-PT": "Este trimestre", fr: "Ce trimestre" },
  [PeriodPreset.THIS_SEMESTER]: { "pt-BR": "Este semestre", "en-US": "This semester", es: "Este semestre", "pt-PT": "Este semestre", fr: "Ce semestre" },
  [PeriodPreset.THIS_YEAR]: { "pt-BR": "Este ano", "en-US": "This year", es: "Este ano", "pt-PT": "Este ano", fr: "Cette annee" },
  [PeriodPreset.LAST_WEEK]: { "pt-BR": "Semana passada", "en-US": "Last week", es: "Semana pasada", "pt-PT": "Semana passada", fr: "Semaine derniere" },
  [PeriodPreset.LAST_QUINZENA]: { "pt-BR": "Quinzena passada", "en-US": "Last fortnight", es: "Quincena pasada", "pt-PT": "Quinzena passada", fr: "Quinzaine derniere" },
  [PeriodPreset.LAST_MONTH]: { "pt-BR": "Mes passado", "en-US": "Last month", es: "Mes pasado", "pt-PT": "Mes passado", fr: "Mois dernier" },
  [PeriodPreset.LAST_QUARTER]: { "pt-BR": "Trimestre passado", "en-US": "Last quarter", es: "Trimestre pasado", "pt-PT": "Trimestre passado", fr: "Trimestre dernier" },
  [PeriodPreset.LAST_SEMESTER]: { "pt-BR": "Semestre passado", "en-US": "Last semester", es: "Semestre pasado", "pt-PT": "Semestre passado", fr: "Semestre dernier" },
  [PeriodPreset.LAST_YEAR]: { "pt-BR": "Ano passado", "en-US": "Last year", es: "Ano pasado", "pt-PT": "Ano passado", fr: "Annee derniere" },
  [PeriodPreset.NEXT_WEEK]: { "pt-BR": "Proxima semana", "en-US": "Next week", es: "Proxima semana", "pt-PT": "Proxima semana", fr: "Semaine prochaine" },
  [PeriodPreset.NEXT_QUINZENA]: { "pt-BR": "Proxima quinzena", "en-US": "Next fortnight", es: "Proxima quincena", "pt-PT": "Proxima quinzena", fr: "Quinzaine prochaine" },
  [PeriodPreset.NEXT_MONTH]: { "pt-BR": "Proximo mes", "en-US": "Next month", es: "Proximo mes", "pt-PT": "Proximo mes", fr: "Mois prochain" },
  [PeriodPreset.NEXT_QUARTER]: { "pt-BR": "Proximo trimestre", "en-US": "Next quarter", es: "Proximo trimestre", "pt-PT": "Proximo trimestre", fr: "Trimestre prochain" },
  [PeriodPreset.NEXT_SEMESTER]: { "pt-BR": "Proximo semestre", "en-US": "Next semester", es: "Proximo semestre", "pt-PT": "Proximo semestre", fr: "Semestre prochain" },
  [PeriodPreset.NEXT_YEAR]: { "pt-BR": "Proximo ano", "en-US": "Next year", es: "Proximo ano", "pt-PT": "Proximo ano", fr: "Annee prochaine" }
};

const GROUP_LABELS = {
  current: { "pt-BR": "Atuais", "en-US": "Current", es: "Actuales", "pt-PT": "Atuais", fr: "Actuels" } as LocaleMap,
  future: { "pt-BR": "Futuros", "en-US": "Future", es: "Futuros", "pt-PT": "Futuros", fr: "Futurs" } as LocaleMap,
  past: { "pt-BR": "Passados", "en-US": "Past", es: "Pasados", "pt-PT": "Passados", fr: "Passes" } as LocaleMap
};

function pickLocale(map: LocaleMap, locale: string): string {
  return map[locale] ?? map["pt-BR"] ?? Object.values(map)[0] ?? "";
}

export function periodPresetLabel(preset: PeriodPreset, locale = "pt-BR"): string {
  return pickLocale(PERIOD_PRESET_LABELS[preset], locale);
}

/* ------------------------------------------------------------------ */
/* PeriodResolver — logica pura, sem React                             */
/* ------------------------------------------------------------------ */

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

function endOfDay(d: Date): Date {
  // Fim = ultimo instante do dia (23:59:59.999), inclusivo.
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}

function lastDayOfMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

type Bounds = { start: Date; end: Date };

function dayBounds(ref: Date): Bounds {
  return { start: startOfDay(ref), end: endOfDay(ref) };
}

/** Semana de calendario com inicio na SEGUNDA-FEIRA (documentado). */
function weekBounds(ref: Date): Bounds {
  const day = ref.getDay(); // 0=domingo .. 6=sabado
  const daysSinceMonday = (day + 6) % 7;
  const start = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate() - daysSinceMonday);
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
  return { start: startOfDay(start), end: endOfDay(end) };
}

/**
 * Quinzena de CALENDARIO (nao 15 dias corridos):
 * dia 1..15 (primeira quinzena) e dia 16..ultimo dia do mes (segunda quinzena).
 */
function quinzenaBounds(ref: Date): Bounds {
  const year = ref.getFullYear();
  const month = ref.getMonth();
  if (ref.getDate() <= 15) {
    return { start: startOfDay(new Date(year, month, 1)), end: endOfDay(new Date(year, month, 15)) };
  }
  return {
    start: startOfDay(new Date(year, month, 16)),
    end: endOfDay(new Date(year, month, lastDayOfMonth(year, month)))
  };
}

/** Desloca `ref` por `delta` quinzenas de calendario, podendo cruzar meses. */
function shiftQuinzena(ref: Date, delta: number): Date {
  const half = ref.getDate() <= 15 ? 0 : 1;
  const monthIndex = ref.getFullYear() * 12 + ref.getMonth();
  const absHalf = monthIndex * 2 + half + delta;
  const newMonthIndex = Math.floor(absHalf / 2);
  const newHalf = absHalf - newMonthIndex * 2;
  const newYear = Math.floor(newMonthIndex / 12);
  const newMonth = newMonthIndex - newYear * 12;
  // Dia representativo dentro da quinzena alvo (5 -> 1a metade, 20 -> 2a metade).
  return new Date(newYear, newMonth, newHalf === 0 ? 5 : 20);
}

function monthBounds(ref: Date): Bounds {
  const year = ref.getFullYear();
  const month = ref.getMonth();
  return {
    start: startOfDay(new Date(year, month, 1)),
    end: endOfDay(new Date(year, month, lastDayOfMonth(year, month)))
  };
}

/** Trimestre de calendario: Jan-Mar, Abr-Jun, Jul-Set, Out-Dez. */
function quarterBounds(ref: Date): Bounds {
  const year = ref.getFullYear();
  const startMonth = Math.floor(ref.getMonth() / 3) * 3;
  const endMonth = startMonth + 2;
  return {
    start: startOfDay(new Date(year, startMonth, 1)),
    end: endOfDay(new Date(year, endMonth, lastDayOfMonth(year, endMonth)))
  };
}

/** Semestre de calendario: Jan-Jun ou Jul-Dez. */
function semesterBounds(ref: Date): Bounds {
  const year = ref.getFullYear();
  const startMonth = ref.getMonth() < 6 ? 0 : 6;
  const endMonth = startMonth + 5;
  return {
    start: startOfDay(new Date(year, startMonth, 1)),
    end: endOfDay(new Date(year, endMonth, lastDayOfMonth(year, endMonth)))
  };
}

function yearBounds(ref: Date): Bounds {
  const year = ref.getFullYear();
  return { start: startOfDay(new Date(year, 0, 1)), end: endOfDay(new Date(year, 11, 31)) };
}

function addDays(ref: Date, days: number): Date {
  return new Date(ref.getFullYear(), ref.getMonth(), ref.getDate() + days);
}

function addMonths(ref: Date, months: number): Date {
  // Usa dia 15 para evitar overflow (ex.: 31 -> mes sem dia 31).
  return new Date(ref.getFullYear(), ref.getMonth() + months, 15);
}

function boundsFor(preset: PeriodPreset, ref: Date): Bounds | null {
  switch (preset) {
    case PeriodPreset.ALL:
    case PeriodPreset.CUSTOM:
      return null;
    case PeriodPreset.TODAY:
      return dayBounds(ref);
    case PeriodPreset.YESTERDAY:
      return dayBounds(addDays(ref, -1));
    case PeriodPreset.TOMORROW:
      return dayBounds(addDays(ref, 1));
    case PeriodPreset.THIS_WEEK:
      return weekBounds(ref);
    case PeriodPreset.LAST_WEEK:
      return weekBounds(addDays(ref, -7));
    case PeriodPreset.NEXT_WEEK:
      return weekBounds(addDays(ref, 7));
    case PeriodPreset.THIS_QUINZENA:
      return quinzenaBounds(ref);
    case PeriodPreset.LAST_QUINZENA:
      return quinzenaBounds(shiftQuinzena(ref, -1));
    case PeriodPreset.NEXT_QUINZENA:
      return quinzenaBounds(shiftQuinzena(ref, 1));
    case PeriodPreset.THIS_MONTH:
      return monthBounds(ref);
    case PeriodPreset.LAST_MONTH:
      return monthBounds(addMonths(ref, -1));
    case PeriodPreset.NEXT_MONTH:
      return monthBounds(addMonths(ref, 1));
    case PeriodPreset.THIS_QUARTER:
      return quarterBounds(ref);
    case PeriodPreset.LAST_QUARTER:
      return quarterBounds(addMonths(ref, -3));
    case PeriodPreset.NEXT_QUARTER:
      return quarterBounds(addMonths(ref, 3));
    case PeriodPreset.THIS_SEMESTER:
      return semesterBounds(ref);
    case PeriodPreset.LAST_SEMESTER:
      return semesterBounds(addMonths(ref, -6));
    case PeriodPreset.NEXT_SEMESTER:
      return semesterBounds(addMonths(ref, 6));
    case PeriodPreset.THIS_YEAR:
      return yearBounds(ref);
    case PeriodPreset.LAST_YEAR:
      return yearBounds(new Date(ref.getFullYear() - 1, ref.getMonth(), 15));
    case PeriodPreset.NEXT_YEAR:
      return yearBounds(new Date(ref.getFullYear() + 1, ref.getMonth(), 15));
    default:
      return null;
  }
}

/**
 * Resolve um preset temporal para um intervalo real de datas.
 *
 * Convencoes:
 * - Semana inicia na SEGUNDA-FEIRA.
 * - Quinzena e de calendario (dia 1..15 e 16..fim do mes), nao 15 dias corridos.
 * - startDate = 00:00:00.000 local; endDate = 23:59:59.999 local (inclusivo).
 * - ALL/CUSTOM retornam datas nulas.
 * - minDate/maxDate (options) fazem clamp do intervalo resolvido.
 */
export function resolvePeriod(
  preset: PeriodPreset,
  ref: Date = new Date(),
  options: ResolvePeriodOptions = {}
): ResolvedPeriod {
  const locale = options.locale ?? "pt-BR";
  const label = periodPresetLabel(preset, locale);
  const bounds = boundsFor(preset, ref);

  if (!bounds) {
    return { preset, label, startDate: null, endDate: null };
  }

  let { start, end } = bounds;
  if (options.minDate && start.getTime() < options.minDate.getTime()) {
    start = new Date(options.minDate.getTime());
  }
  if (options.maxDate && end.getTime() > options.maxDate.getTime()) {
    end = new Date(options.maxDate.getTime());
  }

  return { preset, label, startDate: start, endDate: end };
}

/* ------------------------------------------------------------------ */
/* Montagem das opcoes da UI a partir dos flags permit*                */
/* ------------------------------------------------------------------ */

const CURRENT_PRESETS: PeriodPreset[] = [
  PeriodPreset.THIS_YEAR,
  PeriodPreset.THIS_SEMESTER,
  PeriodPreset.THIS_QUARTER,
  PeriodPreset.THIS_MONTH,
  PeriodPreset.THIS_QUINZENA,
  PeriodPreset.THIS_WEEK,
  PeriodPreset.TODAY,
  PeriodPreset.YESTERDAY
];

const FUTURE_PRESETS: PeriodPreset[] = [
  PeriodPreset.TOMORROW,
  PeriodPreset.NEXT_WEEK,
  PeriodPreset.NEXT_QUINZENA,
  PeriodPreset.NEXT_MONTH,
  PeriodPreset.NEXT_QUARTER,
  PeriodPreset.NEXT_SEMESTER,
  PeriodPreset.NEXT_YEAR
];

const PAST_PRESETS: PeriodPreset[] = [
  PeriodPreset.LAST_WEEK,
  PeriodPreset.LAST_QUINZENA,
  PeriodPreset.LAST_MONTH,
  PeriodPreset.LAST_QUARTER,
  PeriodPreset.LAST_SEMESTER,
  PeriodPreset.LAST_YEAR
];

export function buildPeriodOptions(
  config: {
    permitAll?: boolean;
    allowCustomPeriod?: boolean;
    permitCurrent?: boolean;
    permitFuture?: boolean;
    permitPast?: boolean;
  },
  locale = "pt-BR"
): SgAutocompleteItem[] {
  const options: SgAutocompleteItem[] = [];

  const push = (preset: PeriodPreset, group: string) => {
    options.push({ id: preset, label: periodPresetLabel(preset, locale), group });
  };

  if (config.permitAll) push(PeriodPreset.ALL, "");
  if (config.allowCustomPeriod) push(PeriodPreset.CUSTOM, "");
  if (config.permitCurrent) {
    const g = pickLocale(GROUP_LABELS.current, locale);
    CURRENT_PRESETS.forEach((p) => push(p, g));
  }
  if (config.permitFuture) {
    const g = pickLocale(GROUP_LABELS.future, locale);
    FUTURE_PRESETS.forEach((p) => push(p, g));
  }
  if (config.permitPast) {
    const g = pickLocale(GROUP_LABELS.past, locale);
    PAST_PRESETS.forEach((p) => push(p, g));
  }

  return options;
}

/* ------------------------------------------------------------------ */
/* Componente                                                          */
/* ------------------------------------------------------------------ */

function toIsoDate(d: Date | null): string {
  if (!d) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseIsoDate(value: string): Date | null {
  if (!value) return null;
  const [y, m, d] = value.split("-").map((part) => Number(part));
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

type SgPeriodSelectorBaseProps = Omit<SgPeriodSelectorProps, "control" | "name" | "rules"> & {
  onChange?: (period: ResolvedPeriod) => void;
};

function SgPeriodSelectorBase(props: Readonly<SgPeriodSelectorBaseProps>) {
  const {
    id = "sg-period-selector",
    label,
    value,
    onChange,
    permitPast = true,
    permitCurrent = true,
    permitFuture = true,
    permitAll = true,
    allowCustomPeriod = true,
    locale = "pt-BR",
    disabled,
    required,
    minDate,
    maxDate,
    referenceDate,
    className,
    error
  } = props;

  const isControlled = value !== undefined;
  const [internalPreset, setInternalPreset] = React.useState<PeriodPreset | null>(value ?? null);
  const selectedPreset = isControlled ? value ?? null : internalPreset;

  const [customStart, setCustomStart] = React.useState<Date | null>(null);
  const [customEnd, setCustomEnd] = React.useState<Date | null>(null);

  const options = React.useMemo(
    () =>
      buildPeriodOptions(
        { permitAll, allowCustomPeriod, permitCurrent, permitFuture, permitPast },
        locale
      ),
    [permitAll, allowCustomPeriod, permitCurrent, permitFuture, permitPast, locale]
  );

  const resolveOptions = React.useMemo<ResolvePeriodOptions>(
    () => ({ minDate, maxDate, locale }),
    [minDate, maxDate, locale]
  );

  const emitCustom = React.useCallback(
    (start: Date | null, end: Date | null) => {
      onChange?.({
        preset: PeriodPreset.CUSTOM,
        label: periodPresetLabel(PeriodPreset.CUSTOM, locale),
        startDate: start ? new Date(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0, 0) : null,
        endDate: end ? new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999) : null
      });
    },
    [locale, onChange]
  );

  const handleValueChange = React.useCallback(
    (raw: string | number | null) => {
      if (raw == null || raw === "") {
        if (!isControlled) setInternalPreset(null);
        return;
      }
      const preset = String(raw) as PeriodPreset;
      if (!isControlled) setInternalPreset(preset);

      if (preset === PeriodPreset.CUSTOM) {
        // Emite CUSTOM com o que houver preenchido no mini range (pode ser nulo).
        emitCustom(customStart, customEnd);
        return;
      }
      onChange?.(resolvePeriod(preset, referenceDate ?? new Date(), resolveOptions));
    },
    [customEnd, customStart, emitCustom, isControlled, onChange, referenceDate, resolveOptions]
  );

  const showCustomRange = allowCustomPeriod && selectedPreset === PeriodPreset.CUSTOM;

  return (
    <div className={cn("w-full max-w-[18rem]", className)}>
      <SgCombobox<SgAutocompleteItem>
        id={id}
        label={label}
        source={options}
        value={selectedPreset ?? null}
        grouped
        openOnFocus
        enabled={disabled ? false : undefined}
        required={required}
        error={error}
        renderGroupHeader={(group) =>
          group ? (
            <div className="mt-2 border-b border-border pb-1.5 text-center text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              {group}
            </div>
          ) : null
        }
        onValueChange={handleValueChange}
      />

      {showCustomRange ? (
        <div className="mt-2 grid grid-cols-1 gap-2">
          <SgInputDate
            id={`${id}-custom-start`}
            inputProps={{ value: toIsoDate(customStart) }}
            minDate={minDate}
            maxDate={maxDate}
            enabled={disabled ? false : undefined}
            onChange={(next: string) => {
              const parsed = parseIsoDate(next);
              setCustomStart(parsed);
              emitCustom(parsed, customEnd);
            }}
          />
          <SgInputDate
            id={`${id}-custom-end`}
            inputProps={{ value: toIsoDate(customEnd) }}
            minDate={minDate}
            maxDate={maxDate}
            enabled={disabled ? false : undefined}
            onChange={(next: string) => {
              const parsed = parseIsoDate(next);
              setCustomEnd(parsed);
              emitCustom(customStart, parsed);
            }}
          />
        </div>
      ) : null}
    </div>
  );
}

export function SgPeriodSelector(props: Readonly<SgPeriodSelectorProps>) {
  const { control, name, rules, ...rest } = props;

  if (control && name) {
    return (
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({
          field,
          fieldState
        }: {
          field: ControllerRenderProps<FieldValues, string>;
          fieldState: ControllerFieldState;
        }) => (
          <SgPeriodSelectorBase
            {...rest}
            error={resolveFieldError(rest.error, fieldState.error?.message)}
            value={(field.value as PeriodPreset | undefined) ?? undefined}
            onChange={(period) => {
              field.onChange(period.preset);
              rest.onChange?.(period);
            }}
          />
        )}
      />
    );
  }

  return <SgPeriodSelectorBase {...rest} />;
}
