import { SearchParams } from "nuqs/parsers";
import { searchParamsCache } from "@/lib/searchparams";
import { Announcement } from "./_components/announcement";

type PageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: "Announcement",
};

export default function Shelter({ searchParams }: PageProps) {
  searchParamsCache.parse(searchParams);

  return <Announcement />;
}
