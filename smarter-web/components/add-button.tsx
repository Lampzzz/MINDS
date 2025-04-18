"use client";

import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

const AddButton = ({ href, label }: { href: string; label: string }) => {
  const router = useRouter();

  const onClick = async () => {
    router.push(href);
  };

  return (
    <Button
      onClick={onClick}
      className={cn(buttonVariants({ variant: "default" }))}
    >
      <Plus className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
};

export default AddButton;
