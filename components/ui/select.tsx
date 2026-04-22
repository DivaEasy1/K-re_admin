import * as React from "react";

import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "flex h-9 w-full rounded-xl border border-border bg-white/70 px-3 py-1.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 dark:bg-slate-950/40",
      className
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";

export { Select };
