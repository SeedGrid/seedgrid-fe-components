"use client";

import React from "react";
import { SgInputText, type SgInputTextProps } from "./SgInputText";
import { resolveFieldError } from "../rhf";
import { t, useComponentsI18n } from "../i18n";
import { useDarkFlag } from "../gadgets/clock/themes/useDarkFlag";
import {
  formatWallClock,
  instantToWallClock,
  snapMinutes,
  validateDateTime,
  wallClockToInstant
} from "./dateTimeLogic";

export type SgInputDateTimeProps = Omit<SgInputTextProps, "type" | "onChange"> & {
  /** Instante controlado: ISO 8601 (com offset ou "Z") ou `Date`. `null`/"" limpa o campo. */
  value?: string | Date | null;
  /** Instante inicial (campo nao controlado). */
  defaultValue?: string | Date | null;
  /**
   * Disparado a cada alteracao com o instante em ISO 8601 UTC (`2026-11-03T17:30:00.000Z`) ou `null` se o
   * campo ficou vazio/incompleto/invalido; `local` e o texto do campo (`2026-11-03T14:30`) no fuso do campo.
   */
  onChange?: (value: string | null, local: string) => void;
  /** Disparado ao receber foco — padrao seedgrid. */
  onEnter?: () => void;
  /** Disparado ao perder o foco (apos validacao) — padrao seedgrid. */
  onExit?: () => void;
  /** Menor instante permitido (ISO 8601 ou `Date`). */
  minDate?: string | Date;
  /** Maior instante permitido (ISO 8601 ou `Date`). */
  maxDate?: string | Date;
  /** Fuso em que o campo mostra e interpreta a hora: "local" (padrao), "UTC", "+03:00" ou nome IANA. */
  timeZone?: string;
  /** Mostra e aceita segundos. */
  showSeconds?: boolean;
  /** Passo dos minutos (1, 5, 10, 15, 30...). Ignorado com `showSeconds`. */
  minuteStep?: number;
  alwaysFloat?: boolean;
};

/** Teto do atributo HTML quando nao ha `maxDate` (o <input> aceitaria ano de 6 digitos). */
const WIDGET_MAX = "9999-12-31T23:59";

function localOf(value: string | Date | null | undefined, timeZone: string | undefined, showSeconds: boolean) {
  return instantToWallClock(value ?? undefined, timeZone, showSeconds);
}

export function SgInputDateTime(props: SgInputDateTimeProps) {
  const i18n = useComponentsI18n();
  const isDark = useDarkFlag();
  const {
    value,
    defaultValue,
    onChange,
    minDate,
    maxDate,
    timeZone,
    showSeconds = false,
    minuteStep,
    inputProps,
    alwaysFloat,
    required,
    requiredMessage,
    validateOnBlur,
    validation,
    onValidation,
    error,
    ...rest
  } = props;
  const rhfManaged = Boolean((rest as { control?: unknown }).control && rest.name);
  const controlled = value !== undefined;
  const [innerLocal, setInnerLocal] = React.useState(() => localOf(defaultValue, timeZone, showSeconds));
  const local = controlled ? localOf(value, timeZone, showSeconds) : innerLocal;
  const labelText = rest.labelText ?? rest.label ?? "";
  const [internalError, setInternalError] = React.useState<string | null>(null);
  const hasError = Boolean(error ?? internalError);
  const [hasInteracted, setHasInteracted] = React.useState(false);
  const minLocal = minDate ? instantToWallClock(minDate, timeZone, showSeconds) : undefined;
  const maxLocal = maxDate ? instantToWallClock(maxDate, timeZone, showSeconds) : undefined;
  const effectiveStep = showSeconds ? 1 : minuteStep && minuteStep > 1 ? minuteStep * 60 : undefined;

  const runValidation = React.useCallback(
    (text: string) => {
      const report = (message: string | null) => {
        setInternalError(message);
        onValidation?.(message);
      };
      if (!text && required) return report(requiredMessage ?? t(i18n, "components.inputs.required"));
      if (!text) return report(null);
      const custom = validation?.(text) ?? null;
      if (custom) return report(custom);
      const code = validateDateTime(text, { required, min: minDate, max: maxDate, timeZone });
      if (code === "invalid") return report(t(i18n, "components.inputs.datetime.invalid"));
      if (code === "min" || code === "max" || code === "range") {
        const min = minLocal ? formatWallClock(minLocal, i18n.locale, showSeconds) : "";
        const max = maxLocal ? formatWallClock(maxLocal, i18n.locale, showSeconds) : "";
        return report(
          code === "range"
            ? t(i18n, "components.inputs.datetime.range", { min, max })
            : code === "min"
              ? t(i18n, "components.inputs.datetime.min", { min })
              : t(i18n, "components.inputs.datetime.max", { max })
        );
      }
      return report(null);
    },
    [i18n, maxDate, maxLocal, minDate, minLocal, onValidation, required, requiredMessage, showSeconds, timeZone, validation]
  );

  const emit = (text: string) => {
    onChange?.(text ? wallClockToInstant(text, timeZone) : null, text);
  };

  const mergedInputProps: React.InputHTMLAttributes<HTMLInputElement> = {
    ...inputProps,
    placeholder: " ",
    min: minLocal,
    max: maxLocal ?? WIDGET_MAX,
    step: effectiveStep,
    ...(rhfManaged ? {} : { value: local }),
    readOnly: inputProps?.readOnly,
    onChange: (event) => {
      const text = event.currentTarget.value;
      setHasInteracted(true);
      if (!controlled) setInnerLocal(text);
      if (validateOnBlur === false || internalError) runValidation(text);
      emit(text);
      inputProps?.onChange?.(event);
    },
    onBlur: (event) => {
      let text = event.currentTarget.value;
      const snapped = snapMinutes(text, showSeconds ? undefined : minuteStep);
      if (snapped !== text) {
        text = snapped;
        if (!controlled) setInnerLocal(text);
        emit(text);
      }
      if ((validateOnBlur ?? true) || hasInteracted) runValidation(text);
      inputProps?.onBlur?.(event);
    }
  };

  const inputClassName = (() => {
    if (mergedInputProps.className) return mergedInputProps.className;
    const elevationClass =
      props.elevation === "none" ? "" : props.elevation === "md" ? "shadow-md" : props.elevation === "lg" ? "shadow-lg" : "shadow-sm";
    const baseClass =
      "peer h-11 w-full rounded-md bg-[var(--sg-input-bg,hsl(var(--background)))] text-[var(--sg-input-fg,hsl(var(--foreground)))] caret-[var(--sg-input-fg,hsl(var(--foreground)))] pl-3 pr-7 py-2.5 text-sm placeholder-transparent focus:outline-none";
    const borderClass = hasError
      ? "border border-[hsl(var(--destructive))] focus:border-[hsl(var(--destructive))] focus:ring-2 focus:ring-[hsl(var(--destructive)/0.25)]"
      : "border border-border focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--primary)/0.25)]";
    return [baseClass, borderClass, elevationClass].filter(Boolean).join(" ");
  })();

  const wrapperClassName = ["relative", isDark ? "sg-datetime-dark" : "sg-datetime-light"].join(" ");

  return (
    <div className={wrapperClassName}>
      <style>{`
        input[type="datetime-local"]::-webkit-calendar-picker-indicator {
          cursor: pointer;
        }
        .sg-datetime-dark input[type="datetime-local"] {
          color-scheme: dark;
        }
        .sg-datetime-light input[type="datetime-local"] {
          color-scheme: light;
        }
      `}</style>
      {labelText ? (
        <label
          htmlFor={rest.id}
          className={[
            "pointer-events-none absolute left-3 top-0 z-10 -translate-y-1/2 bg-[var(--sg-input-bg,hsl(var(--background)))] px-1 text-[11px] font-medium leading-none",
            hasError ? "text-[hsl(var(--destructive))]" : "text-foreground/70"
          ].join(" ")}
        >
          {labelText}
        </label>
      ) : null}
      <SgInputText
        {...rest}
        type="datetime-local"
        error={resolveFieldError(error, internalError ?? undefined)}
        inputProps={mergedInputProps}
        className={inputClassName}
        labelClassName="sr-only"
        onClear={() => {
          setInternalError(null);
          onValidation?.(null);
          if (!controlled) setInnerLocal("");
          emit("");
          rest.onClear?.();
        }}
      />
    </div>
  );
}
