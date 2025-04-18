import { SearchParams } from "nuqs/parsers";
import { searchParamsCache } from "@/lib/searchparams";
import { Report } from "./_components/report";

type PageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: "Report",
};

export default function Page({ searchParams }: PageProps) {
  searchParamsCache.parse(searchParams);

  return <Report />;
}
