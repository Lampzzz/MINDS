"use client";

import useReturnShelterStore from "@/store/return-shelter-store";
import { House } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { useEffect } from "react";
import { DataTable } from "@/components/ui/table/data-table";
import { columns } from "./columns";
import { DataTableSearch } from "@/components/ui/table/data-table-search";
import { DataTableResetFilter } from "@/components/ui/table/data-table-reset-filter";
import { useReturnShelterTableFilters } from "../../_hooks/use-release-shelter-table-filters";
import { ShelterFilterTypes } from "@/types";
import { displayData } from "@/lib/utils";

const ShelterTable = ({ filters }: { filters: ShelterFilterTypes }) => {
  const { fetchReturnShelters, isLoading, returnShelters, totalData, cleanup } =
    useReturnShelterStore();

  useEffect(() => {
    fetchReturnShelters(filters);

    return () => cleanup();
  }, [filters]);

  const {
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery,
  } = useReturnShelterTableFilters();

  displayData(returnShelters);

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
            data={returnShelters ?? []}
            totalItems={totalData}
            isLoading={isLoading}
          />
        </>
      )}
      {totalData === 0 && !isLoading && (
        <EmptyState
          title="No Return Shelter"
          description="No return shelter have been added yet"
          icon={House}
        />
      )}
    </div>
  );
};

export default ShelterTable;
