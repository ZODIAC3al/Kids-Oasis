"use client";

import Lottie from "lottie-react";
import { useEffect, useState } from "react";

interface LottieAnimationProps {
  animationPath: string;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
}

export default function LottieAnimation({
  animationPath,
  className = "w-48 h-48",
  loop = true,
  autoplay = true,
}: LottieAnimationProps) {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch(animationPath)
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.warn("Lottie animation load fallback:", err));
  }, [animationPath]);

  if (!animationData) {
    return <div className={`animate-pulse bg-slate-100 dark:bg-slate-800 rounded-2xl ${className}`} />;
  }

  return (
    <Lottie
      animationData={animationData}
      loop={loop}
      autoplay={autoplay}
      className={className}
    />
  );
}
