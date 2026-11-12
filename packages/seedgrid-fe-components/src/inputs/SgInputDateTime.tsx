"use client";

import React from "react";
import { Controller } from "react-hook-form";
import { SgInputText, type SgInputTextProps } from "./SgInputText";
import { mergeRequiredRule, resolveFieldError } from "../rhf";
import { t, useComponentsI18n } from "../i18n";
import { useDarkFlag } from "../gadgets/clock/themes/useDarkFlag";
import {
  formatDateTimeValue,
  formatWallClock,
  instantToWallClock,
  parseDateTimeValue,
  type DateTimeValueMode,
  snapMinutes,
  validateDateTime
} from "./dateTimeLogic";

export type SgInputDateTimeProps = Omit<SgInputTextProps, "type" | "onChange"> & {
  /**
   * Valor controlado, em qualquer formato: texto local sem fuso ("2026-01-15T10:30", ja no relogio do campo), ISO 8601 com
   * "Z" ou deslocamento ("2026-01-15T13:30:00Z", "2026-01-15T10:30:00-03:00") ou `Date`. `null`/"" limpa o campo.
   */
  value?: string | Date | null;
  /** Instante inicial (campo nao controlado). */
  defaultValue?: string | Date | null;
  /**
   * Disparado a cada alteracao com o valor no formato de `valueMode` (`local` "2026-11-03T14:30", `utc`
   * "2026-11-03T17:30:00Z" ou `offset` "2026-11-03T14:30:00-03:00") ou `null` se o campo ficou vazio/incompleto/invalido;
   * `local` e sempre o texto do campo (`2026-11-03T14:30`) no fuso do campo. O mesmo formato vai para o formulario (RHF).
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
  /** Fuso em que o campo mostra e interpreta a hora: "local" (padrao, o do dispositivo), "UTC", "+03:00" ou nome IANA. */
  timeZone?: string;
  /**
   * Formato do valor que sai (onChange e formulario) e que o formulario/`value` aceitam: `local` (padrao), `utc` ou `offset`.
   * Com `register`, `utc`/`offset` so convertem o que e digitado; para atribuir por codigo use `control`.
   */
  valueMode?: DateTimeValueMode;
  /** Mostra e aceita segundos. */
  showSeconds?: boolean;
  /** Passo dos minutos (1, 5, 10, 15, 30...). Ignorado com `showSeconds`. */
  minuteStep?: number;
  alwaysFloat?: boolean;
};

/** Teto do atributo HTML quando nao ha `maxDate` (o <input> aceitaria ano de 6 digitos). */
const WIDGET_MAX = "9999-12-31T23:59";

function localOf(value: string | Date | null | undefined, timeZone: string | undefined, showSeconds: boolean) {
  return parseDateTimeValue(value, timeZone, showSeconds);
}

/** Liga o campo ao react-hook-form: o formulario guarda o valor no formato de `valueMode`, aceita qualquer formato ao atribuir. */
export function SgInputDateTime(props: SgInputDateTimeProps) {
  const i18n = useComponentsI18n();
  const { control, name, register, rules, ...rest } = props;
  const mode = props.valueMode ?? "local";
  if (control && name) {
    return (
      <Controller
        name={name}
        control={control}
        rules={mergeRequiredRule(rules, props.required, props.requiredMessage ?? t(i18n, "components.inputs.required"))}
        render={({ field, fieldState }) => (
          <SgInputDateTimeBase
            {...rest}
            value={(field.value as string | Date | null | undefined) ?? ""}
            error={resolveFieldError(props.error, fieldState.error?.message)}
            onChange={(next, local) => {
              field.onChange(next ?? "");
              props.onChange?.(next, local);
            }}
            inputProps={{
              ...props.inputProps,
              name,
              ref: field.ref,
              onBlur: (event) => {
                field.onBlur();
                props.inputProps?.onBlur?.(event);
              }
            }}
          />
        )}
      />
    );
  }
  if (register && name && mode !== "local") {
    const withMode = { ...rules, setValueAs: (raw: string) => formatDateTimeValue(String(raw ?? ""), mode, props.timeZone) ?? "" };
    return <SgInputDateTimeBase {...rest} name={name} register={register} rules={withMode as typeof rules} />;
  }
  return <SgInputDateTimeBase {...rest} name={name} register={register} rules={rules} />;
}

function SgInputDateTimeBase(props: SgInputDateTimeProps) {
  const i18n = useComponentsI18n();
  const isDark = useDarkFlag();
  const {
    value,
    defaultValue,
    onChange,
    minDate,
    maxDate,
    timeZone,
    valueMode = "local",
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
  const controlled = value !== undefined;
  const [innerLocal, setInnerLocal] = React.useState(() => localOf(defaultValue, timeZone, showSeconds));
  const local = controlled ? localOf(value, timeZone, showSeconds) : innerLocal;
  const labelText = rest.labelText ?? rest.label ?? "";
  const [internalError, setInternalError] = React.useState<string | null>(null);
  const hasError = Boolean(error ?? internalError);
  const [hasInteracted, setHasInteracted] = React.useState(false);
  // Segmentos digitados pela metade: o <input type="datetime-local"> entrega "" (validity.badInput). Em modo controlado o
  // React devolveria o `value` antigo e o campo voltaria ao valor anterior; enquanto parcial, o DOM segue sem ser reescrito.
  const [partial, setPartial] = React.useState(false);
  React.useEffect(() => {
    setPartial(false);
  }, [local]);
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

  // A mensagem de erro e texto pronto: ao trocar o idioma ela e recalculada com o valor atual (sem esperar nova validacao).
  const lastLocaleRef = React.useRef(i18n.locale);
  const runValidationRef = React.useRef(runValidation);
  runValidationRef.current = runValidation;
  React.useEffect(() => {
    if (lastLocaleRef.current === i18n.locale) return;
    lastLocaleRef.current = i18n.locale;
    if (internalError !== null) runValidationRef.current(local);
  }, [i18n.locale, internalError, local]);

  const emit = (text: string) => {
    onChange?.(text ? formatDateTimeValue(text, valueMode, timeZone) : null, text);
  };

  const mergedInputProps: React.InputHTMLAttributes<HTMLInputElement> = {
    ...inputProps,
    placeholder: " ",
    min: minLocal,
    max: maxLocal ?? WIDGET_MAX,
    step: effectiveStep,
    value: partial ? "" : local,
    readOnly: inputProps?.readOnly,
    onChange: (event) => {
      const text = event.currentTarget.value;
      setPartial(text === "" && Boolean(event.currentTarget.validity?.badInput));
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
          setPartial(false);
          if (!controlled) setInnerLocal("");
          emit("");
          rest.onClear?.();
        }}
      />
    </div>
  );
}
