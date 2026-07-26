"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface AnimationProps {
  className?: string;
  srcJson: string;
  fallbackSvg?: string;
  altText: string;
}

function GenericLottie({ srcJson, fallbackSvg, altText, className = "" }: AnimationProps) {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch(srcJson)
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error(`Failed to load Lottie ${srcJson}:`, err));
  }, [srcJson]);

  if (!animationData) {
    if (fallbackSvg) {
      return (
        <div className={`flex items-center justify-center min-h-[250px] ${className}`}>
          <img
            src={fallbackSvg}
            alt={altText}
            className="w-full h-auto object-contain max-h-[380px]"
          />
        </div>
      );
    }
    return <div className={`min-h-[250px] animate-pulse bg-surface-container-high/40 rounded-2xl ${className}`} />;
  }

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <Lottie animationData={animationData} loop={true} className="w-full h-auto max-h-[440px]" />
    </div>
  );
}

export function KidsLearningAnimation({ className = "" }: { className?: string }) {
  return (
    <GenericLottie
      srcJson="/Kids Learning From Home.json"
      altText="Kids learning animation"
      className={className}
    />
  );
}

export function FamilyAnimation({ className = "" }: { className?: string }) {
  return (
    <GenericLottie
      srcJson="/family.json"
      fallbackSvg="/family.svg"
      altText="Family bonding animation"
      className={className}
    />
  );
}

export function BabyCareAnimation({ className = "" }: { className?: string }) {
  return (
    <GenericLottie
      srcJson="/Baby care.json"
      fallbackSvg="/Baby care.svg"
      altText="Baby care animation"
      className={className}
    />
  );
}

export function DollClawAnimation({ className = "" }: { className?: string }) {
  return (
    <GenericLottie
      srcJson="/Doll Claw Machine.json"
      fallbackSvg="/Doll Claw Machine.svg"
      altText="Claw machine reward animation"
      className={className}
    />
  );
}
