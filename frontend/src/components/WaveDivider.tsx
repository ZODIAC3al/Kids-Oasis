interface WaveDividerProps {
  color: string;
  flip?: boolean;
  className?: string;
}

/** A soft, hand-drawn-feeling wave used to stitch two colored sections together. */
export default function WaveDivider({ color, flip = false, className = '' }: WaveDividerProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 ${flip ? 'top-0 -translate-y-[1px] rotate-180' : 'bottom-0 translate-y-[1px]'} ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="h-16 w-full sm:h-24"
      >
        <path
          d="M0,32 C240,96 480,0 720,32 C960,64 1200,96 1440,40 L1440,120 L0,120 Z"
          fill={color}
        />
      </svg>
    </div>
  );
}
