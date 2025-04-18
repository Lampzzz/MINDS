import PageContainer from "@/components/layout/page-container";
import AddButton from "@/components/add-button";
import { Separator } from "@/components/ui/separator";
import { AnnouncementTable } from "./table/table";
import { searchParamsCache } from "@/lib/searchparams";
import { Header } from "./header";

export function Announcement() {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("q");
  const category = searchParamsCache.get("category");
  const pageLimit = searchParamsCache.get("limit");

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(category && { category: category }),
  };

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <div className="flex items-end justify-between">
          <Header />
          <AddButton
            href="/dashboard/announcement/new"
            label="Add Announcement"
          />
        </div>
        <Separator />
        <AnnouncementTable filters={filters} />
      </div>
    </PageContainer>
  );
}
