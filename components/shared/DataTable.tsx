import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DataTableProps {
  title: string;
  description?: string;
  toolbar?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function DataTable({ title, description, toolbar, children, className }: DataTableProps) {
  return (
    <Card className={cn("overflow-hidden p-0", className)}>
      <div className="flex flex-col gap-3 border-b border-border/70 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h2 className="font-display text-base font-semibold">{title}</h2>
          {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
        </div>
        {toolbar}
      </div>
      <div className="overflow-x-auto">{children}</div>
    </Card>
  );
}
