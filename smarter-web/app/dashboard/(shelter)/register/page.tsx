import { SearchParams } from "nuqs/parsers";
import { searchParamsCache } from "@/lib/searchparams";
import Shelter from "./_components/shelter";

interface PageProps {
  searchParams: SearchParams;
}

export const metadata = {
  title: "Register Shelter",
};

export default function Page({ searchParams }: PageProps) {
  searchParamsCache.parse(searchParams);

  return <Shelter />;
}
