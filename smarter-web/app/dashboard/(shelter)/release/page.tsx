import { SearchParams } from "nuqs/parsers";
import { searchParamsCache } from "@/lib/searchparams";
import { ReleaseShelter } from "./_components/release-shelter";

type PageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: "Release Shelter",
};

export default function Page({ searchParams }: PageProps) {
  searchParamsCache.parse(searchParams);

  return <ReleaseShelter />;
}
