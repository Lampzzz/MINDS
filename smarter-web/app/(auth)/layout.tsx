import { Suspense } from "react";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/firebase/auth";
import Loading from "@/components/loader";

export const dynamic = "force-dynamic";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const isUserAuthenticated = await isAuthenticated();
  if (isUserAuthenticated) redirect("/dashboard/overview");

  return <Suspense fallback={<Loading />}>{children}</Suspense>;
}
