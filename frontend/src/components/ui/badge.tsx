import { cn } from "@/lib/utils";

type Tone = "primary" | "success" | "warning" | "danger" | "info" | "neutral";

const tones: Record<Tone, string> = {
  primary: "bg-primary-container/15 text-primary",
  success: "bg-tertiary-container/15 text-tertiary",
  warning: "bg-amber-500/12 text-amber-600",
  danger: "bg-error-container text-on-error-container",
  info: "bg-secondary-container/20 text-secondary",
  neutral: "bg-surface-container-high text-on-surface-variant",
};

export function Badge({
  tone = "neutral",
  dot,
  className,
  children,
}: {
  tone?: Tone;
  dot?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        tones[tone],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            tone === "primary" && "bg-primary",
            tone === "success" && "bg-tertiary",
            tone === "warning" && "bg-amber-500",
            tone === "danger" && "bg-error",
            tone === "info" && "bg-secondary",
            tone === "neutral" && "bg-on-surface-variant"
          )}
        />
      )}
      {children}
    </span>
  );
}
