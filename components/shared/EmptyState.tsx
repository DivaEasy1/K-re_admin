import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: string;
}

export function EmptyState({ title, description, actionLabel, actionHref, icon = "..." }: EmptyStateProps) {
  return (
    <Card className="panel-grid border-dashed">
      <CardHeader className="items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-primary">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="max-w-md text-balance">{description}</CardDescription>
      </CardHeader>
      {actionLabel && actionHref ? (
        <CardContent className="flex justify-center">
          <Button asChild>
            <Link href={actionHref}>
              {actionLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      ) : null}
    </Card>
  );
}
