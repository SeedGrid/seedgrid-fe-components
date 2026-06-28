"use client";

import React from "react";
import { createPortal } from "react-dom";
import { Check } from "lucide-react";
import { t, useComponentsI18n } from "../i18n";
import type { SgMultiSelectOption, SgMultiSelectOptionValue } from "./useSgMultiSelect";

export type SgMultiSelectDropdownProps = {
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  searchRef: React.RefObject<HTMLInputElement | null>;
  ignoreBlurRef: React.MutableRefObject<boolean>;
  dropdownStyle: React.CSSProperties;
  searchable: boolean;
  searchPlaceholder?: string;
  query: string;
  setQuery: (value: string) => void;
  setActiveIndex: (index: number) => void;
  activeIndex: number;
  visibleOptions: SgMultiSelectOption[];
  emptyText: string;
  isSelected: (value: SgMultiSelectOptionValue) => boolean;
  resolvedValueLength: number;
  maxSelected?: number;
  toggleOption: (option: SgMultiSelectOption) => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
};

/**
 * Dropdown compartilhado por SgMultiSelect e SgMultiSelectChips: lista de
 * opcoes com checkbox, busca opcional, scroll e marcacao. Mantem a lista
 * aberta enquanto o usuario marca/desmarca.
 */
export function SgMultiSelectDropdown(props: Readonly<SgMultiSelectDropdownProps>) {
  const i18n = useComponentsI18n();

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={props.dropdownRef}
      className="z-[1100] overflow-hidden rounded-md border border-border bg-[rgb(var(--sg-surface,var(--sg-bg)))] text-[rgb(var(--sg-text,var(--sg-fg)))] shadow-lg"
      style={props.dropdownStyle}
      role="listbox"
      aria-multiselectable="true"
      onKeyDown={props.onKeyDown}
    >
      {props.searchable ? (
        <div className="border-b border-border p-2">
          <input
            ref={props.searchRef}
            type="text"
            value={props.query}
            placeholder={props.searchPlaceholder ?? t(i18n, "components.actions.search")}
            className="h-8 w-full rounded border border-border bg-[var(--sg-input-bg,hsl(var(--background)))] px-2 text-sm text-[var(--sg-input-fg,hsl(var(--foreground)))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.25)]"
            onChange={(event) => {
              props.setQuery(event.currentTarget.value);
              props.setActiveIndex(0);
            }}
            onMouseDown={() => {
              props.ignoreBlurRef.current = true;
            }}
          />
        </div>
      ) : null}
      <div className="max-h-64 overflow-auto py-1">
        {props.visibleOptions.length === 0 ? (
          <div className="px-3 py-2 text-sm text-muted-foreground">{props.emptyText}</div>
        ) : (
          props.visibleOptions.map((option, index) => {
            const checked = props.isSelected(option.value);
            const isActive = props.activeIndex === index;
            const reachedMax =
              !checked &&
              props.maxSelected !== undefined &&
              props.resolvedValueLength >= props.maxSelected;
            const optionDisabled = option.disabled || reachedMax;
            return (
              <div
                key={String(option.value)}
                role="option"
                aria-selected={checked}
                className={[
                  "flex cursor-pointer items-center gap-2 px-3 py-2 text-sm",
                  isActive ? "bg-muted/60" : "",
                  optionDisabled ? "cursor-not-allowed opacity-50" : "hover:bg-muted/40"
                ].join(" ")}
                onMouseEnter={() => props.setActiveIndex(index)}
                onMouseDown={(event) => {
                  event.preventDefault();
                  props.ignoreBlurRef.current = true;
                }}
                onClick={() => props.toggleOption(option)}
              >
                <span
                  aria-hidden="true"
                  className={[
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                    checked
                      ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                      : "border-border bg-[var(--sg-input-bg,hsl(var(--background)))]"
                  ].join(" ")}
                >
                  {checked ? <Check size={12} strokeWidth={3} /> : null}
                </span>
                <span className="truncate">{option.label}</span>
              </div>
            );
          })
        )}
      </div>
    </div>,
    document.body
  );
}
