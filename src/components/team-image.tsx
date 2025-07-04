"use client";

import Image from "next/image";
import { useState } from "react";
import { getTeamGradient, getDriverImagePath, hasLocalDriverImage } from "@/utils/driver-images";

interface TeamImageProps {
  teamName: string;
  teamColor?: string;
  position?: number;
  drivers?: string[];
}

export function TeamImage({ teamName, teamColor, position, drivers = [] }: TeamImageProps) {
  const [imageError, setImageError] = useState(false);
  const [driverImageErrors, setDriverImageErrors] = useState<Record<string, boolean>>({});
  
  // Get car image path based on team name
  const getCarImagePath = (name: string): string => {
    const carImages: Record<string, string> = {
      'Red Bull Racing': 'Red Bull Racing Car 2025.avif',
      'Mercedes Formula 1 Team': 'Mercedes F1 Car Right 2025.avif',
      'Mercedes': 'Mercedes F1 Car Right 2025.avif',
      'Scuderia Ferrari': 'Ferrari Car 2025.avif',
      'Ferrari': 'Ferrari Car 2025.avif',
      'McLaren Formula 1 Team': 'McLaren Car Right 2025.avif',
      'McLaren': 'McLaren Car Right 2025.avif',
      'Aston Martin F1 Team': 'Aston Martin Car Right 2025.avif',
      'Aston Martin': 'Aston Martin Car Right 2025.avif',
      'Alpine F1 Team': 'Alpine Car Right 2025.avif',
      'Alpine': 'Alpine Car Right 2025.avif',
      'Williams Racing': 'Williams F1 Car 2025.avif',
      'Williams': 'Williams F1 Car 2025.avif',
      'RB F1 Team': 'Racing Bulls Car Right.avif',
      'RB': 'Racing Bulls Car Right.avif',
      'Haas F1 Team': 'Haas F1 Ocon Bearman.avif',
      'Haas': 'Haas F1 Ocon Bearman.avif',
      'Sauber F1 Team': 'Sauber Kick 2025.avif',
      'Kick Sauber': 'Sauber Kick 2025.avif',
      'Sauber': 'Sauber Kick 2025.avif',
      'Racing Bulls': 'Racing Bulls Car Right.avif',
    };

    return `/cars/${carImages[name] || carImages['Red Bull Racing']}`;
  };

  const backgroundGradient = getTeamGradient(teamColor || '');
  const carImagePath = getCarImagePath(teamName);

  const getPositionStyle = () => {
    return 'bg-gray-800/50 text-gray-400';
  };

  // Handle driver image error
  const handleDriverImageError = (driverName: string) => {
    setDriverImageErrors(prev => ({
      ...prev,
      [driverName]: true
    }));
  };

  // Get driver last names for fallback display
  const getDriverDisplayNames = (drivers: string[]): string[] => {
    return drivers.map(driver => {
      const nameParts = driver.split(' ');
      return nameParts[nameParts.length - 1]; // Get last name
    });
  };

  const driverDisplayNames = getDriverDisplayNames(drivers);

  return (
    <div 
      className="relative h-64 w-full overflow-hidden will-change-transform"
      style={{ 
        background: backgroundGradient
      }}
    >
      {/* Background driver images */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex items-center justify-center gap-4">
          {drivers.map((driverName, index) => {
            const useLocalImage = hasLocalDriverImage(driverName);
            const driverImageSrc = useLocalImage ? getDriverImagePath(driverName) : '';
            const hasError = driverImageErrors[driverName];
            
            return (
              <div 
                key={index}
                className="relative opacity-20 transition-all duration-300 ease-out group-hover:opacity-40 group-hover:scale-105"
                style={{
                  width: '80px',
                  height: '80px',
                  filter: `drop-shadow(0 0 20px rgba(${parseInt(teamColor?.slice(0,2) || 'FF', 16)}, ${parseInt(teamColor?.slice(2,4) || '1E', 16)}, ${parseInt(teamColor?.slice(4,6) || '1E', 16)}, 0.5))`,
                  willChange: 'transform, opacity'
                }}
              >
                {useLocalImage && !hasError ? (
                  <Image
                    src={driverImageSrc}
                    alt={driverName}
                    fill
                    className="object-cover rounded-full border-2 border-white/30"
                    style={{
                      objectPosition: 'center top',
                    }}
                    sizes="80px"
                    onError={() => handleDriverImageError(driverName)}
                  />
                ) : (
                  // Fallback to driver name if image not available
                  <div 
                    className="w-full h-full flex items-center justify-center text-white font-black text-sm rounded-full border-2 border-white/30"
                    style={{
                      backgroundColor: `rgba(${parseInt(teamColor?.slice(0,2) || 'FF', 16)}, ${parseInt(teamColor?.slice(2,4) || '1E', 16)}, ${parseInt(teamColor?.slice(4,6) || '1E', 16)}, 0.3)`,
                      textShadow: `0 0 10px rgba(0, 0, 0, 0.8)`
                    }}
                  >
                    {driverDisplayNames[index]}
                  </div>
                )}
              </div>
            );
          })}
          
          {/* Fallback to team name if no drivers */}
          {drivers.length === 0 && (
            <div 
              className="text-4xl font-black select-none transform -rotate-12 opacity-30 transition-all duration-300 ease-out group-hover:opacity-50 group-hover:scale-105"
              style={{
                color: `rgba(255, 255, 255, 0.6)`,
                textShadow: `0 0 40px rgba(${parseInt(teamColor?.slice(0,2) || 'FF', 16)}, ${parseInt(teamColor?.slice(2,4) || '1E', 16)}, ${parseInt(teamColor?.slice(4,6) || '1E', 16)}, 0.3)`,
                willChange: 'transform, opacity'
              }}
            >
              {teamName}
            </div>
          )}
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
            src={carImagePath}
            alt={`${teamName} car`}
            fill
            className="object-contain"
            style={{ objectPosition: 'center bottom' }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImageError(true)}
            priority
          />
        </div>
      )}
      
      {/* Position Badge */}
      {position && (
        <div className={`absolute bottom-4 left-4 w-10 h-10 rounded-full flex items-center justify-center font-bold text-base ${getPositionStyle()}`}>
          P{position}
        </div>
      )}
      
      {/* Fallback content when image fails */}
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-4xl">
          <div className="text-center">
            <div className="text-6xl mb-2">🏎️</div>
            <div className="text-lg font-medium opacity-80">{teamName}</div>
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