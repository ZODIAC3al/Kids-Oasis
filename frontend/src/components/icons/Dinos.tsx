export function Brontosaurus({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" className={className} aria-hidden="true">
      <path
        d="M40 130c-14 0-24-10-24-22 0-10 7-18 16-21-4-9-2-20 6-27 9-8 22-8 30 1 6-14 20-24 36-24 24 0 44 18 47 41 10 2 17 11 17 21 0 12-10 22-23 22H40z"
        fill="currentColor"
        opacity="0.9"
      />
      <circle cx="150" cy="60" r="5" fill="white" />
    </svg>
  );
}

export function TRex({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" className={className} aria-hidden="true">
      <path
        d="M150 40c-6-14-20-24-36-22-2-10-11-18-22-18-13 0-24 10-25 23-12 2-21 13-21 26 0 4 1 8 2 11-9 3-15 11-15 21 0 12 10 22 22 22h96c14 0 25-11 25-25 0-16-11-29-26-31 1-3 1-5 0-7z"
        fill="currentColor"
        opacity="0.9"
      />
      <circle cx="60" cy="45" r="5" fill="white" />
    </svg>
  );
}

export function Triceratops({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" className={className} aria-hidden="true">
      <path
        d="M70 40c-4-12-16-20-28-18-3-8-11-13-19-11-11 3-17 15-13 26-8 4-13 13-13 22 0 14 12 26 27 26h116c14 0 25-11 25-25 0-13-10-24-23-25 2-16-9-31-25-33-14-2-27 7-31 20-5-1-11 1-16 4z"
        fill="currentColor"
        opacity="0.9"
      />
      <circle cx="150" cy="66" r="5" fill="white" />
    </svg>
  );
}

export function FootprintDoodle({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" fill="none" className={className} aria-hidden="true">
      <ellipse cx="30" cy="38" rx="14" ry="18" fill="currentColor" opacity="0.5" />
      <ellipse cx="14" cy="16" rx="5" ry="7" fill="currentColor" opacity="0.5" />
      <ellipse cx="28" cy="10" rx="5" ry="7" fill="currentColor" opacity="0.5" />
      <ellipse cx="42" cy="16" rx="5" ry="7" fill="currentColor" opacity="0.5" />
    </svg>
  );
}
