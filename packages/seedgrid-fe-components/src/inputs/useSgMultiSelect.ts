"use client";

import React from "react";

export type SgMultiSelectOptionValue = string | number;

export type SgMultiSelectOption = {
  label: string;
  value: SgMultiSelectOptionValue;
  disabled?: boolean;
};

export function valueEquals(left: SgMultiSelectOptionValue, right: SgMultiSelectOptionValue) {
  return String(left) === String(right);
}

export type UseSgMultiSelectParams = {
  options: SgMultiSelectOption[];
  value?: SgMultiSelectOptionValue[];
  onChange?: (value: SgMultiSelectOptionValue[]) => void;
  searchable?: boolean;
  maxSelected?: number;
  isDisabled: boolean;
  borderRadius?: number | string;
};

/**
 * Logica compartilhada entre SgMultiSelect e SgMultiSelectChips: estado de
 * abertura, selecao, busca, posicionamento do dropdown via portal e navegacao
 * por teclado. Os componentes apenas renderizam o trigger e reaproveitam o
 * dropdown a partir do que este hook expoe.
 */
export function useSgMultiSelect(params: UseSgMultiSelectParams) {
  const { options, value, onChange, searchable = false, maxSelected, isDisabled, borderRadius } = params;

  const isControlled = value !== undefined;

  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const dropdownRef = React.useRef<HTMLDivElement | null>(null);
  const searchRef = React.useRef<HTMLInputElement | null>(null);
  const ignoreBlurRef = React.useRef(false);

  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState<SgMultiSelectOptionValue[]>([]);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [query, setQuery] = React.useState("");
  const [dropdownStyle, setDropdownStyle] = React.useState<React.CSSProperties>({});

  const resolvedBorderRadius = React.useMemo(() => {
    if (borderRadius === undefined) return undefined;
    return typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius;
  }, [borderRadius]);

  const resolvedValue = isControlled ? (value ?? []) : internalValue;

  const isSelected = React.useCallback(
    (optionValue: SgMultiSelectOptionValue) =>
      resolvedValue.some((entry) => valueEquals(entry, optionValue)),
    [resolvedValue]
  );

  const visibleOptions = React.useMemo(() => {
    if (!searchable || !query.trim()) return options;
    const normalized = query.trim().toLowerCase();
    return options.filter((option) => option.label.toLowerCase().includes(normalized));
  }, [options, query, searchable]);

  const selectedLabels = React.useMemo(() => {
    return resolvedValue
      .map((entry) => options.find((option) => valueEquals(option.value, entry))?.label)
      .filter((label): label is string => Boolean(label));
  }, [options, resolvedValue]);

  const selectedOptions = React.useMemo(() => {
    return resolvedValue
      .map((entry) => options.find((option) => valueEquals(option.value, entry)))
      .filter((option): option is SgMultiSelectOption => Boolean(option));
  }, [options, resolvedValue]);

  const setSelectedValue = React.useCallback(
    (nextValue: SgMultiSelectOptionValue[]) => {
      if (!isControlled) {
        setInternalValue(nextValue);
      }
      onChange?.(nextValue);
    },
    [isControlled, onChange]
  );

  const closeDropdown = React.useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
    setQuery("");
  }, []);

  const openDropdown = React.useCallback(() => {
    if (isDisabled) return;
    setOpen(true);
  }, [isDisabled]);

  const toggleOption = React.useCallback(
    (option: SgMultiSelectOption) => {
      if (option.disabled) return;
      const already = resolvedValue.some((entry) => valueEquals(entry, option.value));
      if (already) {
        setSelectedValue(resolvedValue.filter((entry) => !valueEquals(entry, option.value)));
        return;
      }
      if (maxSelected !== undefined && resolvedValue.length >= maxSelected) {
        return;
      }
      setSelectedValue([...resolvedValue, option.value]);
    },
    [maxSelected, resolvedValue, setSelectedValue]
  );

  const removeValue = React.useCallback(
    (optionValue: SgMultiSelectOptionValue) => {
      setSelectedValue(resolvedValue.filter((entry) => !valueEquals(entry, optionValue)));
    },
    [resolvedValue, setSelectedValue]
  );

  const clearSelection = React.useCallback(() => {
    setSelectedValue([]);
  }, [setSelectedValue]);

  const syncDropdownPosition = React.useCallback(() => {
    const anchor = wrapperRef.current?.querySelector("input") ?? inputRef.current ?? wrapperRef.current;
    if (!anchor) return;

    const rect = anchor.getBoundingClientRect();
    setDropdownStyle({
      position: "fixed",
      top: rect.bottom + 4,
      left: rect.left,
      minWidth: rect.width,
      width: rect.width,
      maxWidth: "min(32rem, calc(100vw - 24px))",
      borderRadius: resolvedBorderRadius
    });
  }, [resolvedBorderRadius]);

  React.useEffect(() => {
    if (!open) return;

    const handleOutside = (event: MouseEvent) => {
      if (wrapperRef.current?.contains(event.target as Node)) return;
      if (dropdownRef.current?.contains(event.target as Node)) return;
      closeDropdown();
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [closeDropdown, open]);

  React.useEffect(() => {
    if (!open) return;

    syncDropdownPosition();

    const handleLayoutChange = () => {
      syncDropdownPosition();
    };

    window.addEventListener("resize", handleLayoutChange);
    window.addEventListener("scroll", handleLayoutChange, true);

    return () => {
      window.removeEventListener("resize", handleLayoutChange);
      window.removeEventListener("scroll", handleLayoutChange, true);
    };
  }, [open, syncDropdownPosition]);

  React.useEffect(() => {
    if (!open) {
      return;
    }
    if (searchable && searchRef.current) {
      searchRef.current.focus();
    }
    setActiveIndex(visibleOptions.length > 0 ? 0 : -1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, searchable]);

  React.useEffect(() => {
    if (!open) return;
    if (activeIndex >= visibleOptions.length) {
      setActiveIndex(visibleOptions.length - 1);
    }
  }, [activeIndex, open, visibleOptions.length]);

  const handleListKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (isDisabled) return;

      if (event.key === "Escape") {
        event.preventDefault();
        closeDropdown();
        inputRef.current?.focus();
        return;
      }

      if (event.key === "Tab") {
        closeDropdown();
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, visibleOptions.length - 1));
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
        return;
      }

      if (event.key === "Enter" || event.key === " ") {
        if (activeIndex < 0) return;
        const option = visibleOptions[activeIndex];
        if (!option) return;
        event.preventDefault();
        toggleOption(option);
      }
    },
    [activeIndex, closeDropdown, isDisabled, toggleOption, visibleOptions]
  );

  return {
    // refs
    wrapperRef,
    inputRef,
    dropdownRef,
    searchRef,
    ignoreBlurRef,
    // state
    open,
    activeIndex,
    query,
    dropdownStyle,
    resolvedValue,
    selectedLabels,
    selectedOptions,
    visibleOptions,
    // setters / actions
    setQuery,
    setActiveIndex,
    isSelected,
    toggleOption,
    removeValue,
    clearSelection,
    closeDropdown,
    openDropdown,
    handleListKeyDown
  } as const;
}
