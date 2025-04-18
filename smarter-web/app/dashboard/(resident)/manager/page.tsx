import { SearchParams } from "nuqs/parsers";
import { searchParamsCache } from "@/lib/searchparams";
import { Manager } from "./_components/manager";

type PageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: "Shelter Manager",
};

export default function Page({ searchParams }: PageProps) {
  searchParamsCache.parse(searchParams);

  return <Manager />;
}
