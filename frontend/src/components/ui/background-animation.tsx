"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export function BackgroundAnimation() {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch("/Background.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => setAnimationData(data))
      .catch(() => {
        // Fallback gracefully to Background.svg
      });
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-60 dark:opacity-40 transition-opacity duration-500">
      {animationData ? (
        <Lottie
          animationData={animationData}
          loop={true}
          className="h-full w-full object-cover scale-105"
        />
      ) : (
        <img
          src="/Background.svg"
          alt="Background animation"
          className="h-full w-full object-cover scale-105"
        />
      )}
    </div>
  );
}
