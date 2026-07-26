"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export function ProgressBar({
  value,
  className,
  tone = "primary",
}: {
  value: number;
  className?: string;
  tone?: "primary" | "tertiary" | "secondary";
}) {
  const bar = {
    primary: "bg-primary",
    tertiary: "bg-tertiary",
    secondary: "bg-secondary",
  }[tone];
  return (
    <div
      className={cn(
        "h-1.5 w-full overflow-hidden rounded-full bg-surface-container-high",
        className
      )}
    >
      <div
        className={cn("h-full rounded-full transition-all", bar)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-[var(--radius-control)] border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition",
        className
      )}
    >
      {!mounted ? (
        <Sun className="h-4 w-4 opacity-0" />
      ) : theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}
