"use client";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-xs uppercase tracking-[0.2em] transition-all duration-500 disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-burgundy text-ivory hover:bg-ink",
        gallery: "bg-burgundy text-ivory px-10 py-4 hover:bg-ink",
        galleryOutline:
          "border border-burgundy text-burgundy hover:bg-burgundy hover:text-ivory px-10 py-4",
        ivory: "bg-ivory text-burgundy hover:bg-gold hover:text-ink px-10 py-4",
        ghost: "hover:bg-burgundy/10",
      },
      size: {
        default: "h-10 px-5 py-2",
        lg: "h-12 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, children, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size }), className);
    if (asChild && React.isValidElement<{ className?: string }>(children)) {
      return React.cloneElement(children, {
        className: cn(classes, children.props.className),
      });
    }
    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
