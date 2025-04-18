import { SearchParams } from "nuqs/parsers";
import { searchParamsCache } from "@/lib/searchparams";
import { ReturnShelter } from "./_components/return-shelter";

type PageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: "Return Shelter",
};

export default function Page({ searchParams }: PageProps) {
  searchParamsCache.parse(searchParams);

  return <ReturnShelter />;
}
