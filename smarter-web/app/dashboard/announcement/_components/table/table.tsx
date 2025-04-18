"use client";

import useAnnouncementStore from "@/store/announcement-store";
import { useEffect } from "react";
import { Megaphone } from "lucide-react";
import { ShelterFilterTypes } from "@/types";
import { EmptyState } from "@/components/empty-state";
import { DataTable } from "@/components/ui/table/data-table";
import { columns } from "./columns";
import { DataTableSearch } from "@/components/ui/table/data-table-search";
import { DataTableFilterBox } from "@/components/ui/table/data-table-filter-box";
import { DataTableResetFilter } from "@/components/ui/table/data-table-reset-filter";
import {
  CATEGORY_OPTIONS,
  useAnnouncementTableFilters,
} from "../../_hooks/use-announcement-table-filters";

export function AnnouncementTable({
  filters,
}: {
  filters: ShelterFilterTypes;
}) {
  const { fetchAnnouncements, announcements, isLoading, totalData, cleanup } =
    useAnnouncementStore();

  useEffect(() => {
    fetchAnnouncements(filters);

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
  } = useAnnouncementTableFilters();

  return (
    <div className="space-y-4">
      {totalData > 0 && (
        <>
          <div className="flex flex-wrap items-center gap-4">
            <DataTableSearch
              searchKey="title"
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
            data={announcements ?? []}
            totalItems={totalData}
            isLoading={isLoading}
          />
        </>
      )}
      {totalData === 0 && !isLoading && (
        <EmptyState
          title="No Announcement"
          description="No announcement have been added yet"
          icon={Megaphone}
        />
      )}
    </div>
  );
}
