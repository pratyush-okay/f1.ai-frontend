"use client";

import Image from "next/image";
import { useState } from "react";
import { getDriverImagePath, getTeamGradient, hasLocalDriverImage } from "@/utils/driver-images";
import { getCountryFlag, getDriverAge } from "@/utils/driver-data";

interface DriverImageProps {
  src: string;
  alt: string;
  number: number;
  driverName: string;
  teamColor?: string;
  countryCode?: string;
}

export function DriverImage({ src, alt, number, driverName, teamColor, countryCode }: DriverImageProps) {
  const [imageError, setImageError] = useState(false);
  
  // Prefer local images over API images
  const useLocalImage = hasLocalDriverImage(driverName);
  const imageSrc = useLocalImage ? getDriverImagePath(driverName) : src;
  const backgroundGradient = getTeamGradient(teamColor || '');
  const countryFlag = getCountryFlag(number); // Use driver number instead of countryCode
  const driverAge = getDriverAge(driverName);
  
  // Debug logging to see what data we're getting
  console.log('Driver data:', { driverName, number, countryCode, teamColor, countryFlag, driverAge });

  return (
    <div 
      className="relative h-64 w-full overflow-hidden will-change-transform"
      style={{ 
        background: backgroundGradient
      }}
    >
      {/* Optimized background racing number */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div 
          className="text-[12rem] font-black select-none transform -rotate-12 opacity-15 transition-all duration-300 ease-out group-hover:opacity-40 group-hover:scale-105"
          style={{
            background: `linear-gradient(45deg, #${teamColor || 'FF1E1E'}, #${teamColor || 'FF1E1E'}cc)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            willChange: 'transform, opacity'
          }}
        >
          {number}
        </div>
      </div>

      {/* Simplified decorative overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent group-hover:from-black/40 transition-all duration-300 ease-out" />
      
      {/* Simplified geometric patterns */}
      <div 
        className="absolute top-0 right-0 w-32 h-32 opacity-20 rounded-full transition-all duration-300 ease-out group-hover:opacity-30 group-hover:scale-110"
        style={{ 
          backgroundColor: `#${teamColor || 'FF1E1E'}40`,
          filter: 'blur(40px)',
          willChange: 'transform, opacity'
        }}
      />
      <div 
        className="absolute bottom-4 left-4 w-16 h-16 opacity-25 rounded-full transition-all duration-300 ease-out group-hover:opacity-40 group-hover:scale-110"
        style={{ 
          backgroundColor: `#${teamColor || 'FF1E1E'}60`,
          filter: 'blur(20px)',
          willChange: 'transform, opacity'
        }}
      />
      
      {!imageError && (
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={imageSrc}
            alt={alt}
            fill
            className={useLocalImage ? "object-cover" : "object-cover"}
            style={useLocalImage ? {
              objectPosition: 'center top',
              // Scale up 4x and translate to show only the top 25% (headshot area)
              transform: 'scale(1)', 
            } : {}}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImageError(true)}
            priority={useLocalImage}
          />
        </div>
      )}
      
      {/* Optimized country flag */}
      <div className="absolute top-4 left-4 text-2xl bg-black/30 rounded-full p-2 border border-white/20 transition-transform duration-200 ease-out hover:scale-110">
        {countryFlag}
      </div>

      {/* Optimized racing number badge */}
      <div 
        className="absolute top-4 right-4 text-white px-4 py-2 rounded-xl font-black text-lg transition-transform duration-200 ease-out hover:scale-105"
        style={{
          background: `linear-gradient(135deg, #${teamColor || 'FF1E1E'}dd, #${teamColor || 'FF1E1E'}aa)`,
          boxShadow: `0 4px 12px #${teamColor || 'FF1E1E'}30`
        }}
      >
        #{number}
      </div>
      
      {/* Fallback content when image fails */}
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-4xl">
          <div className="text-center">
            <div className="text-6xl mb-2">🏎️</div>
            <div className="text-lg font-medium opacity-80">#{number}</div>
          </div>
        </div>
      )}
      
      {/* Team accent line */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{ backgroundColor: teamColor ? `#${teamColor}` : '#FF1E1E' }}
      />


    </div>
  );
} 