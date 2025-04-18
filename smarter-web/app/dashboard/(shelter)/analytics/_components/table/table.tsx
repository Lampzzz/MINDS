"use client";

import { House } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { useEffect } from "react";
import { DataTable } from "@/components/ui/table/data-table";
import { columns } from "./columns";
import { DataTableSearch } from "@/components/ui/table/data-table-search";
import { DataTableResetFilter } from "@/components/ui/table/data-table-reset-filter";
import { useTableFilters } from "../../_hooks/use-table-filters";
import { ShelterFilterTypes } from "@/types";
import { useAnalyticsStore } from "@/store/analytics-store";
import { displayData } from "@/lib/utils";

const ShelterTable = ({ filters }: { filters: ShelterFilterTypes }) => {
  const { fetchSheltersAnalytics, analytics, isLoading, totalData, cleanup } =
    useAnalyticsStore();

  useEffect(() => {
    fetchSheltersAnalytics(filters);

    return () => cleanup();
  }, [filters]);

  const {
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery,
  } = useTableFilters();

  displayData(analytics);

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
            data={analytics ?? []}
            totalItems={totalData}
            isLoading={isLoading}
          />
        </>
      )}
      {totalData === 0 && !isLoading && (
        <EmptyState
          title="No Shelters"
          description="No shelter have been added yet"
          icon={House}
        />
      )}
    </div>
  );
};

export default ShelterTable;
