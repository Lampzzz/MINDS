"use client";

import useReleaseShelterStore from "@/store/release-shelter-store";
import { House } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { useEffect } from "react";
import { DataTable } from "@/components/ui/table/data-table";
import { columns } from "./columns";
import { DataTableSearch } from "@/components/ui/table/data-table-search";
import { DataTableResetFilter } from "@/components/ui/table/data-table-reset-filter";
import { useReleaseShelterTableFilters } from "../../_hooks/use-release-shelter-table-filters";
import { ShelterFilterTypes } from "@/types";
import { displayData } from "@/lib/utils";

export function ReleaseShelterTable({
  filters,
}: {
  filters: ShelterFilterTypes;
}) {
  const {
    fetchReleaseShelters,
    isLoading,
    releaseShelters,
    totalData,
    cleanup,
  } = useReleaseShelterStore();

  useEffect(() => {
    fetchReleaseShelters(filters);
    return () => cleanup();
  }, [filters]);

  const {
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery,
  } = useReleaseShelterTableFilters();

  displayData(releaseShelters);

  return (
    <div className="space-y-4">
      {totalData > 0 && (
        <>
          <div className="flex flex-wrap items-center gap-4">
            <DataTableSearch
              searchKey="name"
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setPage={setPage}
            />
            <DataTableResetFilter
              isFilterActive={isAnyFilterActive}
              onReset={resetFilters}
            />
          </div>
          <DataTable
            columns={columns}
            data={releaseShelters ?? []}
            totalItems={totalData}
            isLoading={isLoading}
          />
        </>
      )}

      {totalData === 0 && !isLoading && (
        <EmptyState
          title="No Release Shelter"
          description="No release shelter have been added yet"
          icon={House}
        />
      )}
    </div>
  );
}
