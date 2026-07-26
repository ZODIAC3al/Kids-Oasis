import { cn } from "@/lib/utils";

const palette = [
  "bg-primary-container/20 text-primary",
  "bg-secondary-container/25 text-secondary",
  "bg-tertiary-container/20 text-tertiary",
  "bg-amber-500/15 text-amber-600",
];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function Avatar({
  name,
  size = 36,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const tone = palette[hash(name) % palette.length];

  return (
    <span
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold",
        tone,
        className
      )}
    >
      {initials}
    </span>
  );
}
