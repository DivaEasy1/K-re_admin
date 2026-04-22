import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[104px] w-full rounded-xl border border-border bg-white/70 px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10 dark:bg-slate-950/40",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export { Textarea };
