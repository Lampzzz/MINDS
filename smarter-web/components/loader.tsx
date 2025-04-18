import { LoaderCircle } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex h-screen w-full items-center justify-center gap-5 flex-col">
      <LoaderCircle className="w-10 h-10 animate-spin" />
    </div>
  );
}
