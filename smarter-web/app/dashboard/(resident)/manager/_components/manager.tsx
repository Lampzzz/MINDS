import PageContainer from "@/components/layout/page-container";
import AddButton from "@/components/add-button";
import { ManagerTable } from "./table/table";
import { Header } from "./header";
import { Separator } from "@/components/ui/separator";
import { searchParamsCache } from "@/lib/searchparams";

export async function Manager() {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("q");
  const pageLimit = searchParamsCache.get("limit");
  const gender = searchParamsCache.get("gender");

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(gender && { genders: gender }),
  };

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <div className="flex items-end justify-between">
          <Header />
          <AddButton href="/dashboard/manager/new" label="Add Manager" />
        </div>
        <Separator />
        <ManagerTable filters={filters} />
      </div>
    </PageContainer>
  );
}
