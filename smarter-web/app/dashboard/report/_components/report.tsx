import PageContainer from "@/components/layout/page-container";
import { Separator } from "@/components/ui/separator";
import { searchParamsCache } from "@/lib/searchparams";
import { Header } from "./header";
import { ReportTable } from "./table/table";

export async function Report() {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("q");
  const status = searchParamsCache.get("status");
  const pageLimit = searchParamsCache.get("limit");

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(status && { status: status }),
  };

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <div className="flex items-end justify-between">
          <Header />
        </div>
        <Separator />
        <ReportTable filters={filters} />
      </div>
    </PageContainer>
  );
}
