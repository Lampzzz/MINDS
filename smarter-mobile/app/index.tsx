import { Redirect } from "expo-router";
import { Loading } from "@/components/ui/Loading";
import { useAuthStore } from "@/store/auth-store";

const Page = () => {
  const { isLoading, currentUser } = useAuthStore();

  if (isLoading) return <Loading />;
  if (currentUser) return <Redirect href="/home" />;

  return <Redirect href="/login" />;
};

export default Page;
