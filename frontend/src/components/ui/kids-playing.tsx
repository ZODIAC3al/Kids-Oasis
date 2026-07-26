"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export function KidsPlayingAnimation({ className = "" }: { className?: string }) {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch("/kids playing - kidcare.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Failed to load kids playing animation:", err));
  }, []);

  if (!animationData) {
    return (
      <div className={`flex items-center justify-center min-h-[300px] ${className}`}>
        <img
          src="/kids playing - kidcare.svg"
          alt="Kids playing animation"
          className="w-full h-auto object-contain max-h-[420px]"
        />
      </div>
    );
  }

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <Lottie animationData={animationData} loop={true} className="w-full h-auto max-h-[480px]" />
    </div>
  );
}
