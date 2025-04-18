"use client";

import { searchParams } from "@/lib/searchparams";
import { useQueryState } from "nuqs";
import { useCallback, useMemo } from "react";

export const STATUS_OPTIONS = [
  { value: "occupied", label: "Occupied" },
  { value: "available", label: "Available" },
  { value: "under maintenance", label: "Under Maintenance" },
  { value: "defective", label: "Defective" },
];

export const LOCATION_OPTIONS = [
  { value: "paulino court", label: "Paulino Court" },
  { value: "gremma covered court", label: "Gremma Covered Court" },
];

export function useShelterTableFilters() {
  const [searchQuery, setSearchQuery] = useQueryState(
    "q",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault("")
  );

  const [statusFilter, setStatusFilter] = useQueryState(
    "status",
    searchParams.status.withOptions({ shallow: false }).withDefault("")
  );

  const [locationFilter, setLocationFilter] = useQueryState(
    "location",
    searchParams.status.withOptions({ shallow: false }).withDefault("")
  );

  const [page, setPage] = useQueryState(
    "page",
    searchParams.page.withDefault(1)
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setStatusFilter(null);
    setLocationFilter(null);
    setPage(1);
  }, [setSearchQuery, setStatusFilter, setLocationFilter, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!statusFilter || !!locationFilter;
  }, [searchQuery, statusFilter, locationFilter]);

  return {
    locationFilter,
    setLocationFilter,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
  };
}
