import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const button = cva(
  "inline-flex items-center justify-center gap-2 rounded-pill font-display font-semibold leading-none transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:opacity-60 disabled:pointer-events-none active:scale-[0.97]",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-white shadow-[0_12px_28px_rgba(180,140,224,0.32)] hover:bg-accent-deep hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(180,140,224,0.42)]",
        ghost:
          "bg-white/70 text-ink ring-1 ring-inset ring-[rgba(122,112,138,0.16)] backdrop-blur-sm hover:bg-white hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(180,140,224,0.18)]",
        soft: "bg-pink-soft text-ink hover:bg-pink hover:-translate-y-0.5",
      },
      size: {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-[15px]",
        lg: "px-8 py-4 text-base",
      },
      full: { true: "w-full", false: "" },
    },
    defaultVariants: { variant: "primary", size: "md", full: false },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, full, ...props }, ref) => (
    <button ref={ref} className={cn(button({ variant, size, full }), className)} {...props} />
  ),
);
Button.displayName = "Button";
