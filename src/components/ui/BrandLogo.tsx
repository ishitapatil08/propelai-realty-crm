"use client";

import Image from "next/image";
import { Building2, Sparkles } from "lucide-react";
import { useState } from "react";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  subtitle?: string;
  className?: string;
}

export function BrandLogo({
  size = "md",
  showText = true,
  subtitle = "Realty OS",
  className = "",
}: BrandLogoProps) {
  const [imageError, setImageError] = useState(false);

  const dimensionMap = {
    sm: { box: "w-8 h-8", icon: 18, text: "text-base", sub: "text-[10px]" },
    md: { box: "w-10 h-10", icon: 22, text: "text-lg", sub: "text-xs" },
    lg: { box: "w-12 h-12", icon: 26, text: "text-xl", sub: "text-xs" },
  };

  const dim = dimensionMap[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`relative ${dim.box} rounded-xl overflow-hidden bg-gradient-to-br from-amber-500/20 via-amber-400/10 to-transparent border border-amber-500/30 p-1 flex items-center justify-center shadow-sm shrink-0`}
      >
        {!imageError ? (
          <Image
            src="/logo.png"
            alt="PropelAI Logo"
            width={48}
            height={48}
            className="object-contain rounded-lg"
            onError={() => setImageError(true)}
            priority
          />
        ) : (
          <div className="relative flex items-center justify-center text-amber-500">
            <Building2 size={dim.icon} className="stroke-[2.2]" />
            <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-amber-400 animate-pulse" />
          </div>
        )}
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5 font-bold tracking-tight text-foreground">
            <span className={`${dim.text} bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 bg-clip-text text-transparent`}>
              PropelAI
            </span>
          </div>
          {subtitle && (
            <span className={`${dim.sub} font-semibold uppercase tracking-wider text-muted-foreground/80`}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
