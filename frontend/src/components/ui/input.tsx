import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import type { InputHTMLAttributes } from "react";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-[var(--radius-control)] border border-outline-variant bg-surface-container-lowest px-3.5 text-sm text-on-surface placeholder:text-on-surface-variant/70",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition",
        className
      )}
      {...props}
    />
  );
}

export function SearchField({
  placeholder = "Search...",
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
      <input
        placeholder={placeholder}
        className="h-11 w-full rounded-[var(--radius-control)] border border-outline-variant bg-surface-container-lowest pl-10 pr-3.5 text-sm text-on-surface placeholder:text-on-surface-variant/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition"
        {...props}
      />
    </div>
  );
}
