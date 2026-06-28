"use client";

import React from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { Controller } from "react-hook-form";
import type { ControllerFieldState, ControllerRenderProps, FieldValues } from "react-hook-form";
import { resolveFieldError } from "../rhf";
import { SgInputText, type SgInputTextProps } from "./SgInputText";
import { t, useComponentsI18n } from "../i18n";
import { SgMultiSelectDropdown } from "./SgMultiSelectDropdown";
import { useSgMultiSelect } from "./useSgMultiSelect";
import type { SgMultiSelectOption, SgMultiSelectOptionValue } from "./useSgMultiSelect";

export type { SgMultiSelectOption, SgMultiSelectOptionValue } from "./useSgMultiSelect";

type SgMultiSelectBaseHostProps = Omit<
  SgInputTextProps,
  | "onChange"
  | "clearButton"
  | "iconButtons"
  | "inputProps"
  | "readOnly"
  | "value"
  | "type"
  | "showCharCounter"
  | "maxLength"
  | "minLength"
>;

export type SgMultiSelectProps = SgMultiSelectBaseHostProps & {
  options: SgMultiSelectOption[];
  value?: SgMultiSelectOptionValue[];
  onChange?: (value: SgMultiSelectOptionValue[]) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  clearable?: boolean;
  maxSelected?: number;
  emptyText?: string;
  /**
   * Quantos rotulos exibir antes de cair no resumo "N selecionadas".
   * @default 2
   */
  summaryThreshold?: number;
  onEnter?: () => void;
  onExit?: () => void;
};

function SgMultiSelectBase(props: Readonly<SgMultiSelectProps>) {
  const {
    options,
    value,
    onChange,
    searchable = false,
    searchPlaceholder,
    clearable = false,
    maxSelected,
    emptyText: emptyTextProp,
    summaryThreshold = 2,
    placeholder,
    enabled,
    borderRadius,
    onEnter,
    onExit,
    ...rest
  } = props;

  const i18n = useComponentsI18n();
  const emptyText = emptyTextProp ?? t(i18n, "components.autocomplete.empty");
  const resolvedPlaceholder = placeholder ?? t(i18n, "components.inputs.select.placeholder");
  const isDisabled = enabled === false;

  const ms = useSgMultiSelect({
    options,
    value,
    onChange,
    searchable,
    maxSelected,
    isDisabled,
    borderRadius
  });

  const displayedValue = React.useMemo(() => {
    if (ms.selectedLabels.length === 0) return "";
    if (ms.selectedLabels.length <= summaryThreshold) return ms.selectedLabels.join(", ");
    return t(i18n, "components.inputs.multiSelect.summary", { count: ms.selectedLabels.length });
  }, [i18n, ms.selectedLabels, summaryThreshold]);

  const triggerIcon = (
    <button
      type="button"
      className="text-foreground/60 hover:text-foreground"
      tabIndex={-1}
      onMouseDown={(event) => {
        event.preventDefault();
        ms.ignoreBlurRef.current = true;
      }}
      onClick={() => {
        if (ms.open) {
          ms.closeDropdown();
          return;
        }
        ms.openDropdown();
      }}
      aria-label={t(i18n, "components.actions.openList")}
    >
      {ms.open ? <Check size={16} /> : <ChevronDown size={16} />}
    </button>
  );

  const iconButtons: React.ReactNode[] = [];
  if (clearable && ms.selectedLabels.length > 0 && !isDisabled) {
    iconButtons.push(
      <button
        key="clear"
        type="button"
        className="text-foreground/60 hover:text-foreground"
        tabIndex={-1}
        onMouseDown={(event) => {
          event.preventDefault();
          ms.ignoreBlurRef.current = true;
        }}
        onClick={() => {
          ms.clearSelection();
        }}
        aria-label={t(i18n, "components.actions.clearSelection")}
      >
        <X size={16} />
      </button>
    );
  }
  iconButtons.push(<span key="trigger">{triggerIcon}</span>);

  return (
    <div className={ms.open ? "relative z-[1100]" : "relative"} ref={ms.wrapperRef}>
      <SgInputText
        {...rest}
        placeholder={resolvedPlaceholder}
        enabled={enabled}
        borderRadius={borderRadius}
        clearButton={false}
        readOnly
        iconButtons={iconButtons}
        inputProps={{
          ref: ms.inputRef,
          value: displayedValue,
          role: "combobox",
          "aria-expanded": ms.open,
          "aria-haspopup": "listbox",
          onMouseDown: (event) => {
            if (isDisabled) return;
            event.preventDefault();
            if (ms.open) {
              ms.closeDropdown();
            } else {
              ms.openDropdown();
            }
          },
          onFocus: () => {
            onEnter?.();
          },
          onBlur: (event) => {
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
          },
          onKeyDown: (event) => {
            if (event.defaultPrevented) return;
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
          }
        }}
      />

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
  );
}

export function SgMultiSelect(props: Readonly<SgMultiSelectProps>) {
  const { control, name, rules, ...rest } = props;

  if (control && name) {
    return (
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }: { field: ControllerRenderProps<FieldValues, string>; fieldState: ControllerFieldState }) => (
          <SgMultiSelectBase
            {...rest}
            error={resolveFieldError(rest.error, fieldState.error?.message)}
            value={(field.value as SgMultiSelectOptionValue[] | undefined) ?? []}
            onChange={(next) => field.onChange(next)}
          />
        )}
      />
    );
  }

  return <SgMultiSelectBase {...rest} />;
}
