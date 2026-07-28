"use client";

import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import Image from "next/image";

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
    const svgFallback = animationPath.endsWith(".json")
      ? animationPath.replace(".json", ".svg")
      : animationPath;
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <Image
          src={svgFallback}
          alt="Money animation"
          width={110}
          height={110}
          className="object-contain animate-bounce"
        />
      </div>
    );
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
