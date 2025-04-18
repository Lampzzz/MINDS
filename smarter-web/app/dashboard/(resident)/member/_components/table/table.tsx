"use client";

import useMemberStore from "@/store/member-store";
import { useEffect } from "react";
import { Users } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { columns } from "./columns";
import { UserFilterTypes } from "@/types";
import { DataTable } from "@/components/ui/table/data-table";
import { DataTableFilterBox } from "@/components/ui/table/data-table-filter-box";
import { DataTableResetFilter } from "@/components/ui/table/data-table-reset-filter";
import { DataTableSearch } from "@/components/ui/table/data-table-search";
import {
  GENDER_OPTIONS,
  useResidentTableFilters,
} from "../../../_hooks/use-resident-table-filters";

export function MemberTable({ filters }: { filters: UserFilterTypes }) {
  const { fetchMembers, members, isLoading, totalData, cleanup } =
    useMemberStore();

  useEffect(() => {
    fetchMembers(filters);

    return () => cleanup();
  }, [filters, fetchMembers]);

  const {
    genderFilter,
    setGenderFilter,
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery,
  } = useResidentTableFilters();

  // console.log(JSON.stringify(members, null, 2));

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
            data={members!}
            totalItems={members?.length ?? 0}
            isLoading={isLoading}
          />
        </>
      )}
      {totalData === 0 && !isLoading && (
        <EmptyState
          title="No Member"
          description="No member have been added yet"
          icon={Users}
        />
      )}
    </div>
  );
}
