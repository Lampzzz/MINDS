"use client";

import useReportStore from "@/store/report-store";
import { useEffect } from "react";
import { Siren } from "lucide-react";
import { ShelterFilterTypes } from "@/types";
import { EmptyState } from "@/components/empty-state";
import { DataTable } from "@/components/ui/table/data-table";
import { columns } from "./columns";
import { DataTableSearch } from "@/components/ui/table/data-table-search";
import { DataTableFilterBox } from "@/components/ui/table/data-table-filter-box";
import { DataTableResetFilter } from "@/components/ui/table/data-table-reset-filter";
import {
  useReportFilters,
  CATEGORY_OPTIONS,
} from "../../_hooks/use-report-table-filters";

export function ReportTable({ filters }: { filters: ShelterFilterTypes }) {
  const { fetchReports, cleanup, totalData, reports, isLoading } =
    useReportStore();

  useEffect(() => {
    fetchReports(filters);

    return () => cleanup();
  }, [filters]);

  const {
    categoryFilter,
    setCategoryFilter,
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery,
  } = useReportFilters();

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
              filterKey="category"
              title="Category"
              options={CATEGORY_OPTIONS}
              setFilterValue={setCategoryFilter}
              filterValue={categoryFilter}
            />
            <DataTableResetFilter
              isFilterActive={isAnyFilterActive}
              onReset={resetFilters}
            />
          </div>
          <DataTable
            columns={columns}
            data={reports ?? []}
            totalItems={totalData}
            isLoading={isLoading}
          />
        </>
      )}
      {totalData === 0 && !isLoading && (
        <EmptyState
          title="No Report"
          description="No report have been added yet"
          icon={Siren}
        />
      )}
    </div>
  );
}
