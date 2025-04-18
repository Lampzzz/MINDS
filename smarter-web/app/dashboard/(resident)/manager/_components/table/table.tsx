"use client";

import useManagerStore from "@/store/manager-store";
import { UserCog } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { useEffect } from "react";
import { DataTable } from "@/components/ui/table/data-table";
import { DataTableFilterBox } from "@/components/ui/table/data-table-filter-box";
import { DataTableResetFilter } from "@/components/ui/table/data-table-reset-filter";
import { DataTableSearch } from "@/components/ui/table/data-table-search";
import { columns } from "./columns";
import { UserFilterTypes } from "@/types";
import {
  GENDER_OPTIONS,
  useResidentTableFilters,
} from "../../../_hooks/use-resident-table-filters";
import { displayData } from "@/lib/utils";

export function ManagerTable({ filters }: { filters: UserFilterTypes }) {
  const { fetchManagers, managers, isLoading, totalData, cleanup } =
    useManagerStore();

  useEffect(() => {
    fetchManagers(filters);

    return () => cleanup();
  }, [filters, fetchManagers]);

  const {
    genderFilter,
    setGenderFilter,
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery,
  } = useResidentTableFilters();

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
              filterKey="gender"
              title="Gender"
              options={GENDER_OPTIONS}
              setFilterValue={setGenderFilter}
              filterValue={genderFilter}
            />
            <DataTableResetFilter
              isFilterActive={isAnyFilterActive}
              onReset={resetFilters}
            />
          </div>
          <DataTable
            columns={columns}
            data={managers ?? []}
            totalItems={totalData}
            isLoading={isLoading}
          />
        </>
      )}
      {totalData === 0 && !isLoading && (
        <EmptyState
          title="No Manager"
          description="No manager have been added yet"
          icon={UserCog}
        />
      )}
    </div>
  );
}
