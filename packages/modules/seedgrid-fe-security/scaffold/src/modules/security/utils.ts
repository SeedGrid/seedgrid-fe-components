import { sgWhistle } from "@seedgrid/fe-components";

import { securityConfig } from "./config";
import type { PickListOption, PagedResult } from "./types";

export function normalizeSearchTerm(value: string) {
  return value.trim();
}

export function isSearchReady(value: string) {
  const normalized = normalizeSearchTerm(value);

  return (
    normalized.length === 0 ||
    normalized.length >= securityConfig.search.minLength
  );
}

export function hasActiveSearch(value: string) {
  return normalizeSearchTerm(value).length >= securityConfig.search.minLength;
}

export function formatDateTime(
  value: string | null | undefined,
  locale: string
) {
  if (!value) {
    return "-";
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsedDate);
}

export function ensureArray<T>(value: T[] | null | undefined) {
  return Array.isArray(value) ? value : [];
}

export function createPagedResult<T>(
  items: T[],
  total: number,
  page: number,
  size: number,
  fallback = false
): PagedResult<T> {
  return {
    items,
    total,
    page,
    size,
    fallback,
  };
}

export function paginateItems<T>(items: T[], page: number, size: number) {
  const safePage = Math.max(0, page);
  const safeSize = Math.max(1, size);
  const start = safePage * safeSize;

  return createPagedResult(
    items.slice(start, start + safeSize),
    items.length,
    safePage,
    safeSize,
    true
  );
}

export function toPickListOption(
  value: string | number,
  label: string,
  data?: unknown
): PickListOption {
  return {
    value,
    label,
    data,
  };
}

export function resolveNumericId(
  entity: { id?: unknown; publicId?: unknown } | null | undefined
) {
  if (!entity) {
    return null;
  }

  if (typeof entity.id === "number" && Number.isFinite(entity.id)) {
    return entity.id;
  }

  if (typeof entity.id === "string" && /^\d+$/.test(entity.id.trim())) {
    return Number(entity.id);
  }

  if (
    typeof entity.publicId === "string" &&
    /^\d+$/.test(entity.publicId.trim())
  ) {
    return Number(entity.publicId);
  }

  return null;
}

export function extractSelectionValues(
  items: Array<{ id?: unknown; publicId?: unknown }> | null | undefined
) {
  return ensureArray(items)
    .map((item) => {
      const numericId = resolveNumericId(item);

      if (numericId !== null) {
        return numericId;
      }

      return typeof item.publicId === "string" ? item.publicId : null;
    })
    .filter((value): value is string | number => value !== null);
}

export function pickBySelection<T extends { id?: unknown; publicId?: unknown }>(
  items: T[],
  selectedValue: string | number
) {
  return items.find((item) => {
    if (resolveNumericId(item) === selectedValue) {
      return true;
    }

    return item.publicId === selectedValue;
  });
}

export function resolveSelectedNumericIds<
  T extends { id?: unknown; publicId?: unknown }
>(items: T[], selectedValues: Array<string | number>) {
  const numericIds = selectedValues.map((selectedValue) => {
    const item = pickBySelection(items, selectedValue);
    return resolveNumericId(item);
  });

  return numericIds.every((value): value is number => value !== null)
    ? numericIds
    : null;
}

export function extractFirstFormErrorMessage(error: unknown): string | null {
  if (!error) {
    return null;
  }

  if (typeof error === "string" && error.trim()) {
    return error.trim();
  }

  if (typeof error !== "object") {
    return null;
  }

  const record = error as Record<string, unknown>;

  if (typeof record.message === "string" && record.message.trim()) {
    return record.message.trim();
  }

  for (const value of Object.values(record)) {
    const nestedMessage = extractFirstFormErrorMessage(value);

    if (nestedMessage) {
      return nestedMessage;
    }
  }

  return null;
}

export function showFormValidationWhistle(id: string, message: string) {
  sgWhistle.show({
    id,
    severity: "error",
    message,
    duration: 5000,
    dismissible: true,
    borderStyle: "soft",
  });
}
