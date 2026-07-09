"use client";

import { useDebouncedValue } from "@/modules/core";

import { securityConfig } from "../config";
import { normalizeSearchTerm } from "../utils";

export function useDebouncedSearch(
  value: string,
  delayMs = securityConfig.search.debounceMs
) {
  return useDebouncedValue(value, delayMs, normalizeSearchTerm);
}
