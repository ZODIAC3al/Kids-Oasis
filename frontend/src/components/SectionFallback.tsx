export default function SectionFallback({ height = 'h-64' }: { height?: string }) {
  return (
    <div className={`${height} w-full animate-pulse bg-cream-dark/60`} aria-hidden="true" />
  );
}
