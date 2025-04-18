import PageContainer from "@/components/layout/page-container";
import { ReleaseShelterTable } from "./table/table";
import { Separator } from "@/components/ui/separator";
import { searchParamsCache } from "@/lib/searchparams";
import { Header } from "./header";
import { NewReleaseShelterModalButton } from "./modal/new-release-shelter";

export async function ReleaseShelter() {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("q");
  const pageLimit = searchParamsCache.get("limit");

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
  };

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <div className="flex items-end justify-between">
          <Header />
          <NewReleaseShelterModalButton />
        </div>
        <Separator />
        <ReleaseShelterTable filters={filters} />
      </div>
    </PageContainer>
  );
}
