import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg" | "icon";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  href?: string;
  className?: string;
}

type Props = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
    children: React.ReactNode;
  };

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-on-primary shadow-elevation-1 hover:brightness-110 active:brightness-95 disabled:opacity-50",
  secondary:
    "bg-secondary-container text-on-secondary-container hover:brightness-105 disabled:opacity-50",
  outline:
    "border border-outline-variant text-on-surface bg-transparent hover:bg-surface-container-low disabled:opacity-50",
  ghost:
    "bg-transparent text-on-surface hover:bg-surface-container-low disabled:opacity-50",
  danger:
    "bg-error text-on-error hover:brightness-110 disabled:opacity-50",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px] gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-[15px] gap-2",
  icon: "h-10 w-10 p-0 justify-center",
};

export function Button({
  variant = "primary",
  size = "md",
  loading,
  href,
  className,
  children,
  disabled,
  ...props
}: Props) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-[var(--radius-control)] font-medium transition-all duration-150 select-none whitespace-nowrap",
    "focus-visible:outline-2 focus-visible:outline-primary",
    variants[variant],
    sizes[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {loading && (
          <img
            src="/Cat feeling love emotionsexpression. Emojisticker animation.svg"
            alt="Loading"
            className="h-4 w-4 animate-bounce"
          />
        )}
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading && (
        <img
          src="/Cat feeling love emotionsexpression. Emojisticker animation.svg"
          alt="Loading"
          className="h-4 w-4 animate-bounce"
        />
      )}
      {children}
    </button>
  );
}
