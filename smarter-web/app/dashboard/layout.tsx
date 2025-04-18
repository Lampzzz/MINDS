import { ReactNode, Suspense } from "react";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/firebase/auth";
import AppSidebar from "@/components/layout/app-sidebar";
import Loading from "@/components/loader";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/login");

  return (
    <AppSidebar>
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </AppSidebar>
  );
}
