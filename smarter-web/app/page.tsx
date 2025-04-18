import { redirect } from "next/navigation";
import { isAuthenticated } from "@/firebase/auth";

export const dynamic = "force-dynamic";

export default async function Page() {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/login");

  return redirect("/dashboard/overview");
}
