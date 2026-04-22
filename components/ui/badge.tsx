import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]",
  {
    variants: {
      variant: {
        default: "bg-slate-900/8 text-slate-700 dark:bg-white/10 dark:text-white",
        success: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
        warning: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
        destructive: "bg-red-500/15 text-red-700 dark:text-red-300",
        info: "bg-sky-500/15 text-sky-700 dark:text-sky-300"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
