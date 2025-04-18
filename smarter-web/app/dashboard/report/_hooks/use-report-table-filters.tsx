"use client";

import { searchParams } from "@/lib/searchparams";
import { useQueryState } from "nuqs";
import { useCallback, useMemo } from "react";

export const CATEGORY_OPTIONS = [
  { value: "shelter damage", label: "Shelter Damage" },
  { value: "medical", label: "Medical" },
  { value: "security", label: "Security" },
  { value: "other issues", label: "Other Issues" },
];

export function useReportFilters() {
  const [searchQuery, setSearchQuery] = useQueryState(
    "q",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault("")
  );

  const [categoryFilter, setCategoryFilter] = useQueryState(
    "category",
    searchParams.category.withOptions({ shallow: false }).withDefault("")
  );

  const [page, setPage] = useQueryState(
    "page",
    searchParams.page.withDefault(1)
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setCategoryFilter(null);
    setPage(1);
  }, [setSearchQuery, setCategoryFilter, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!categoryFilter;
  }, [searchQuery, categoryFilter]);

  return {
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
  };
}
