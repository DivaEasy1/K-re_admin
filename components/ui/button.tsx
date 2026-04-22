import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 rounded-xl text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-background",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-glow hover:-translate-y-0.5 hover:bg-ocean-600",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-slate-200 dark:hover:bg-slate-800",
        outline:
          "border border-border bg-background/70 backdrop-blur hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-secondary hover:text-foreground",
        destructive: "bg-destructive text-destructive-foreground hover:bg-red-700"
      },
      size: {
        default: "h-9 px-3.5 py-2",
        sm: "h-8 rounded-lg px-3",
        lg: "h-10 rounded-xl px-5",
        icon: "h-9 w-9 rounded-xl"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
