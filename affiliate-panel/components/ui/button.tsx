import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white transition-colors rounded-lg bg-brand-500 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20",
  {
    variants: {
      variant: {
        default: "bg-brand-500 hover:bg-brand-600",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-4 py-2.5",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-5 sm:px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  spinnerClassName?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      loadingText,
      spinnerClassName = "mr-2 h-4 w-4",
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const disabledClass = props.disabled ? "cursor-not-allowed" : "";
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          disabledClass
        )}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("animate-spin", spinnerClassName)}
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        )}
        {isLoading && loadingText ? loadingText : children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
