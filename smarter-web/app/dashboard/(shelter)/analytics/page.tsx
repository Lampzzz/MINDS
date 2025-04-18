import { SearchParams } from "nuqs/parsers";
import { searchParamsCache } from "@/lib/searchparams";
import { ShelterAnalytics } from "./_components/shelter-analytics";

type PageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: "Shelter Analytics",
};

export default function Page({ searchParams }: PageProps) {
  searchParamsCache.parse(searchParams);

  return <ShelterAnalytics />;
}
