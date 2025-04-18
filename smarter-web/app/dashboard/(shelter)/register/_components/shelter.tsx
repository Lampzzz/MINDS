import PageContainer from "@/components/layout/page-container";
import AddButton from "@/components/add-button";
import { RegisterShelterTable } from "./table/table";
import { Separator } from "@/components/ui/separator";
import { searchParamsCache } from "@/lib/searchparams";
import { Header } from "./header";

export default async function Shelter() {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("q");
  const status = searchParamsCache.get("status");
  const location = searchParamsCache.get("location");
  const pageLimit = searchParamsCache.get("limit");

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(status && { status: status }),
    ...(location && { location: location }),
  };

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <div className="flex items-end justify-between">
          <Header />
          <AddButton href="/dashboard/register/new" label="Add Shelter" />
        </div>
        <Separator />
        <RegisterShelterTable filters={filters} />
      </div>
    </PageContainer>
  );
}
