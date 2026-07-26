"use client";

import Image from "next/image";

interface CatLoaderProps {
  size?: number;
  label?: string;
  className?: string;
}

export function CatLoader({ size = 72, label = "Loading...", className = "" }: CatLoaderProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className="relative animate-bounce" style={{ width: size, height: size }}>
        <Image
          src="/Cat feeling love emotionsexpression. Emojisticker animation.svg"
          alt="Loading cat"
          width={size}
          height={size}
          priority
          className="object-contain drop-shadow-md"
        />
      </div>
      {label && (
        <p className="font-display text-xs font-semibold tracking-wide text-primary animate-pulse">
          {label}
        </p>
      )}
    </div>
  );
}
