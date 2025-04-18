import { SearchParams } from "nuqs/parsers";
import { searchParamsCache } from "@/lib/searchparams";
import Member from "./_components/member";

type PageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: "Shelter Member",
};

export default function Page({ searchParams }: PageProps) {
  searchParamsCache.parse(searchParams);

  return <Member />;
}
