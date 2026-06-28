"use client";

import React from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { Controller } from "react-hook-form";
import type { ControllerFieldState, ControllerRenderProps, FieldValues } from "react-hook-form";
import { resolveFieldError, type RhfFieldProps } from "../rhf";
import { t, useComponentsI18n } from "../i18n";
import { SgMultiSelectDropdown } from "./SgMultiSelectDropdown";
import { useSgMultiSelect } from "./useSgMultiSelect";
import type { SgMultiSelectOption, SgMultiSelectOptionValue } from "./useSgMultiSelect";

export type { SgMultiSelectOption, SgMultiSelectOptionValue } from "./useSgMultiSelect";

export type SgMultiSelectChipsProps = RhfFieldProps & {
  id: string;
  label?: string;
  labelText?: string;
  className?: string;
  labelClassName?: string;
  width?: number | string;
  borderRadius?: number | string;
  enabled?: boolean;
  required?: boolean;
  options: SgMultiSelectOption[];
  value?: SgMultiSelectOptionValue[];
  onChange?: (value: SgMultiSelectOptionValue[]) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  clearable?: boolean;
  maxSelected?: number;
  emptyText?: string;
  placeholder?: string;
  onEnter?: () => void;
  onExit?: () => void;
};

function SgMultiSelectChipsBase(props: Readonly<SgMultiSelectChipsProps>) {
  const {
    id,
    label,
    labelText,
    className,
    labelClassName,
    width,
    borderRadius,
    enabled,
    required,
    options,
    value,
    onChange,
    searchable = false,
    searchPlaceholder,
    clearable = false,
    maxSelected,
    emptyText: emptyTextProp,
    placeholder,
    error,
    onEnter,
    onExit
  } = props;

  const i18n = useComponentsI18n();
  const emptyText = emptyTextProp ?? t(i18n, "components.autocomplete.empty");
  const resolvedPlaceholder = placeholder ?? t(i18n, "components.inputs.select.placeholder");
  const isDisabled = enabled === false;
  const resolvedLabel = labelText ?? label ?? "";

  const ms = useSgMultiSelect({
    options,
    value,
    onChange,
    searchable,
    maxSelected,
    isDisabled,
    borderRadius
  });

  const triggerRef = React.useRef<HTMLDivElement | null>(null);

  const hasError = Boolean(error);
  const resolvedBorderRadius =
    borderRadius === undefined
      ? undefined
      : typeof borderRadius === "number"
        ? `${borderRadius}px`
        : borderRadius;

  const borderClass = hasError
    ? "border border-[hsl(var(--destructive))]"
    : ms.open
      ? "border border-[hsl(var(--primary))] ring-2 ring-[hsl(var(--primary)/0.25)]"
      : "border border-border";

  const triggerClass = [
    "flex min-h-11 w-full flex-wrap items-center gap-1.5 rounded-md px-2 py-1.5 text-sm",
    "bg-[var(--sg-input-bg,hsl(var(--background)))] text-[var(--sg-input-fg,hsl(var(--foreground)))]",
    borderClass,
    isDisabled
      ? "cursor-not-allowed bg-[var(--sg-input-disabled-bg,hsl(var(--muted)))] text-[var(--sg-input-disabled-fg,hsl(var(--muted-foreground)))]"
      : "cursor-text",
    className ?? ""
  ].join(" ");

  const openOrClose = () => {
    if (isDisabled) return;
    if (ms.open) {
      ms.closeDropdown();
    } else {
      ms.openDropdown();
    }
  };

  return (
    <div style={{ width: width ?? "100%" }}>
      {resolvedLabel ? (
        <label
          htmlFor={id}
          className={[
            "mb-1 block text-sm font-medium",
            hasError ? "text-[hsl(var(--destructive))]" : "text-foreground/70",
            labelClassName ?? ""
          ].join(" ")}
        >
          <span>{resolvedLabel}</span>
          {required ? (
            <span className="ml-1 text-[hsl(var(--destructive))]" aria-hidden="true">
              *
            </span>
          ) : null}
        </label>
      ) : null}

      <div className={ms.open ? "relative z-[1100]" : "relative"} ref={ms.wrapperRef}>
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div
          ref={triggerRef}
          id={id}
          role="combobox"
          aria-expanded={ms.open}
          aria-haspopup="listbox"
          tabIndex={isDisabled ? -1 : 0}
          className={triggerClass}
          style={{ borderRadius: resolvedBorderRadius }}
          onMouseDown={(event) => {
            // Clicks on chip remove buttons handle their own logic.
            if ((event.target as HTMLElement).closest("[data-sg-chip-remove]")) return;
            event.preventDefault();
            ms.ignoreBlurRef.current = true;
            openOrClose();
            triggerRef.current?.focus();
          }}
          onFocus={() => {
            onEnter?.();
          }}
          onBlur={(event) => {
            if (event.relatedTarget && ms.wrapperRef.current?.contains(event.relatedTarget as Node)) {
              return;
            }
            if (event.relatedTarget && ms.dropdownRef.current?.contains(event.relatedTarget as Node)) {
              return;
            }
            if (ms.ignoreBlurRef.current) {
              setTimeout(() => {
                ms.ignoreBlurRef.current = false;
              }, 0);
              return;
            }
            onExit?.();
          }}
          onKeyDown={(event) => {
            if (isDisabled) return;
            if (event.key === "Escape") {
              event.preventDefault();
              ms.closeDropdown();
              return;
            }
            if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              if (!ms.open) {
                ms.openDropdown();
                return;
              }
              if (!searchable) {
                ms.handleListKeyDown(event);
              }
            }
          }}
        >
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
            {ms.selectedOptions.length === 0 ? (
              <span className="px-1 text-[var(--sg-input-placeholder,hsl(var(--muted-foreground)))]">
                {resolvedPlaceholder}
              </span>
            ) : (
              ms.selectedOptions.map((option) => (
                <span
                  key={String(option.value)}
                  className="inline-flex max-w-full items-center gap-1 rounded-full border border-border bg-muted/60 py-0.5 pl-2 pr-1 text-xs text-foreground"
                >
                  <span className="truncate">{option.label}</span>
                  {!isDisabled ? (
                    <button
                      type="button"
                      data-sg-chip-remove="true"
                      tabIndex={-1}
                      className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-foreground/60 hover:bg-foreground/10 hover:text-foreground"
                      onMouseDown={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        ms.ignoreBlurRef.current = true;
                      }}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        ms.removeValue(option.value);
                      }}
                      aria-label={t(i18n, "components.inputs.multiSelect.removeChip", { label: option.label })}
                    >
                      <X size={12} />
                    </button>
                  ) : null}
                </span>
              ))
            )}
          </div>

          <span className="ml-auto flex shrink-0 items-center gap-1 self-start pt-0.5">
            {clearable && ms.selectedOptions.length > 0 && !isDisabled ? (
              <button
                type="button"
                data-sg-chip-remove="true"
                tabIndex={-1}
                className="text-foreground/60 hover:text-foreground"
                onMouseDown={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  ms.ignoreBlurRef.current = true;
                }}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  ms.clearSelection();
                }}
                aria-label={t(i18n, "components.actions.clearSelection")}
              >
                <X size={16} />
              </button>
            ) : null}
            <span className="text-foreground/60" aria-hidden="true">
              {ms.open ? <Check size={16} /> : <ChevronDown size={16} />}
            </span>
          </span>
        </div>

        {error ? <p data-sg-error className="mt-1 text-xs text-red-600">{error}</p> : null}

        {ms.open && !isDisabled ? (
          <SgMultiSelectDropdown
            dropdownRef={ms.dropdownRef}
            searchRef={ms.searchRef}
            ignoreBlurRef={ms.ignoreBlurRef}
            dropdownStyle={ms.dropdownStyle}
            searchable={searchable}
            searchPlaceholder={searchPlaceholder}
            query={ms.query}
            setQuery={ms.setQuery}
            setActiveIndex={ms.setActiveIndex}
            activeIndex={ms.activeIndex}
            visibleOptions={ms.visibleOptions}
            emptyText={emptyText}
            isSelected={ms.isSelected}
            resolvedValueLength={ms.resolvedValue.length}
            maxSelected={maxSelected}
            toggleOption={ms.toggleOption}
            onKeyDown={ms.handleListKeyDown}
          />
        ) : null}
      </div>
    </div>
  );
}

export function SgMultiSelectChips(props: Readonly<SgMultiSelectChipsProps>) {
  const { control, name, rules, ...rest } = props;

  if (control && name) {
    return (
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }: { field: ControllerRenderProps<FieldValues, string>; fieldState: ControllerFieldState }) => (
          <SgMultiSelectChipsBase
            {...rest}
            error={resolveFieldError(rest.error, fieldState.error?.message)}
            value={(field.value as SgMultiSelectOptionValue[] | undefined) ?? []}
            onChange={(next) => field.onChange(next)}
          />
        )}
      />
    );
  }

  return <SgMultiSelectChipsBase {...rest} />;
}
