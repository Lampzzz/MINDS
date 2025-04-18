"use client";

import { Icons } from "@/components/icons";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface DashboardNavProps {
  items: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
  isMobileNav?: boolean;
}

export function DashboardNav({
  items,
  setOpen,
  isMobileNav = false,
}: DashboardNavProps) {
  const path = usePathname();
  const { isMinimized } = useSidebar();

  if (!items?.length) {
    return null;
  }

  return (
    <nav className="grid items-start gap-2">
      <TooltipProvider>
        {items.map((item, index) => {
          const Icon = item.icon ? Icons[item.icon] : Icons.logo;

          return item.children ? (
            <Accordion key={index} type="single" collapsible>
              <AccordionItem value={item.title} className="border-0">
                <AccordionTrigger
                  className={cn(
                    "flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground hover:no-underline no-underline"
                  )}
                >
                  <div className="flex justify-start items-center gap-2">
                    <Icon className={`ml-3 size-5 flex-none`} />
                    <span className="mr-2 truncate">{item.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-0">
                  <div className="ml-4 mt-2 flex flex-col gap-y-2">
                    {item.children.map((child, childIndex) => {
                      const ChildIcon = child.icon
                        ? Icons[child.icon]
                        : Icons.logo;

                      return (
                        <Tooltip key={childIndex}>
                          <TooltipTrigger asChild>
                            <Link
                              href={child.disabled ? "/" : child.href!}
                              className={cn(
                                "flex items-center gap-2 rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                                path === child.href
                                  ? "bg-accent"
                                  : "transparent",
                                child.disabled &&
                                  "cursor-not-allowed opacity-80"
                              )}
                              onClick={() => {
                                if (setOpen) setOpen(false);
                              }}
                            >
                              <ChildIcon className="ml-3 size-5 flex-none" />
                              {child.label}
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent
                            align="center"
                            side="right"
                            sideOffset={8}
                            className={!isMinimized ? "hidden" : "inline-block"}
                          >
                            {child.title}
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : item.href ? (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Link
                  href={item.disabled ? "/" : item.href}
                  className={cn(
                    "flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    path === item.href ? "bg-accent" : "transparent",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                  onClick={() => {
                    if (setOpen) setOpen(false);
                  }}
                >
                  <Icon className={`ml-3 size-5 flex-none`} />
                  {isMobileNav || (!isMinimized && !isMobileNav) ? (
                    <span className="mr-2 truncate">{item.title}</span>
                  ) : (
                    ""
                  )}
                </Link>
              </TooltipTrigger>
              <TooltipContent
                align="center"
                side="right"
                sideOffset={8}
                className={!isMinimized ? "hidden" : "inline-block"}
              >
                {item.title}
              </TooltipContent>
            </Tooltip>
          ) : null;
        })}
      </TooltipProvider>
    </nav>
  );
}
