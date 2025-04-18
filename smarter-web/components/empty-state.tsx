import React from "react";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: any;
  title: string;
  description: string;
  className?: string;
}

export function EmptyState({
  icon: Icon = AlertTriangle,
  title,
  description,
  className,
}: EmptyStateProps) {
  return (
    <Card
      className={cn(
        "flex flex-col items-center justify-center min-h-[500px] px-4 border-0 shadow-none bg-transparent",
        className
      )}
    >
      {/* <div className="mb-6">
        {Icon && (
          <Icon
            className="w-20 h-20 text-muted-foreground/60"
            strokeWidth={1}
          />
        )}
      </div> */}
      <CardContent className="text-center space-y-2 p-0">
        {/* <h3 className="text-xl font-semibold text-foreground">{title}</h3> */}
        <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
      </CardContent>
    </Card>
  );
}
