import Settings from "./_components/settings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
};

export default function Page() {
  return <Settings />;
}
