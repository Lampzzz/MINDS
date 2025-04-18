"use client";

import useShelterStore from "@/store/shelter-store";
import { EmptyState } from "@/components/empty-state";
import { ShelterFilterTypes } from "@/types";
import { House } from "lucide-react";
import { DataTable } from "@/components/ui/table/data-table";
import { useEffect } from "react";
import { columns } from "./columns";
import { DataTableSearch } from "@/components/ui/table/data-table-search";
import { DataTableFilterBox } from "@/components/ui/table/data-table-filter-box";
import { DataTableResetFilter } from "@/components/ui/table/data-table-reset-filter";
import {
  useShelterTableFilters,
  STATUS_OPTIONS,
  LOCATION_OPTIONS,
} from "../../_hooks/use-shelter-table-filters";

export function RegisterShelterTable({
  filters,
}: {
  filters: ShelterFilterTypes;
}) {
  const { fetchShelters, isLoading, shelters, totalData, cleanup } =
    useShelterStore();

  useEffect(() => {
    fetchShelters(filters);
    return () => cleanup();
  }, [filters]);

  const {
    locationFilter,
    setLocationFilter,
    statusFilter,
    setStatusFilter,
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery,
  } = useShelterTableFilters();

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
            <DataTableFilterBox
              filterKey="status"
              title="Status"
              options={STATUS_OPTIONS}
              setFilterValue={setStatusFilter}
              filterValue={statusFilter}
            />
            <DataTableFilterBox
              filterKey="location"
              title="Location"
              options={LOCATION_OPTIONS}
              setFilterValue={setLocationFilter}
              filterValue={locationFilter}
            />
            <DataTableResetFilter
              isFilterActive={isAnyFilterActive}
              onReset={resetFilters}
            />
          </div>
          <DataTable
            columns={columns}
            data={shelters ?? []}
            totalItems={totalData}
            isLoading={isLoading}
          />
        </>
      )}
      {totalData === 0 && !isLoading && (
        <EmptyState
          title="No Shelter"
          description="No shelter have been added yet"
          icon={House}
        />
      )}
    </div>
  );
}
