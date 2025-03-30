import { forwardRef } from "react";
import type { ComponentProps } from "react"; // Importação type-only
import type { VariantProps } from "class-variance-authority"; // Importação type-only
import { cva } from "class-variance-authority";
import { cn } from "~/src/lib/utils";

const labelVariants = cva(
  "font-medium transition-colors duration-200 ease-in-out",
  {
    variants: {
      variant: {
        default: "text-gray-900 hover:text-gray-700",
        primary: "text-blue-600 hover:text-blue-500",
        danger: "text-red-600 hover:text-red-500",
        success: "text-green-600 hover:text-green-500",
        warning: "text-amber-600 hover:text-amber-500",
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
      },
      effect: {
        none: "",
        underline: "underline-offset-4 hover:underline",
        highlight: "px-1 py-0.5 rounded-md bg-opacity-10 hover:bg-opacity-20",
        border: "border-b-2 border-transparent hover:border-current",
      },
    },
    compoundVariants: [
      {
        variant: "default",
        effect: "highlight",
        className: "bg-gray-900",
      },
      {
        variant: "primary",
        effect: "highlight",
        className: "bg-blue-600",
      },
      {
        variant: "danger",
        effect: "highlight",
        className: "bg-red-600",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "md",
      effect: "none",
    },
  }
);

interface LabelProps
  extends ComponentProps<"label">,
    VariantProps<typeof labelVariants> {
  required?: boolean;
  disabled?: boolean;
}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  (
    {
      className,
      variant,
      size,
      effect,
      required = false,
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <label
        ref={ref}
        className={cn(
          labelVariants({ variant, size, effect, className }),
          disabled && "opacity-50 cursor-not-allowed",
          "flex items-center gap-1"
        )}
        {...props}
      >
        {children}
        {required && (
          <span className="text-red-500 font-bold" aria-hidden="true">
            *
          </span>
        )}
      </label>
    );
  }
);

Label.displayName = "Label";

export { Label, labelVariants };
