"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

export function GoogleButton({ label }: { label: string }) {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  return (
    <Button className="w-full" variant="outline" type="button">
      <Icons.google className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}
