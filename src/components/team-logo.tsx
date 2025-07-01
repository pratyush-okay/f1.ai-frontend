"use client";

import Image from "next/image";
import { useState } from "react";
import { getTeamLogoWithFallback } from "@/utils/team-logos";

interface TeamLogoProps {
  teamName: string;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  teamColor?: string;
}

export function TeamLogo({ teamName, size = 'sm', showName = true, teamColor }: TeamLogoProps) {
  const [imageError, setImageError] = useState(false);
  const { logo, emoji } = getTeamLogoWithFallback(teamName);
  
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };
  
  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };
  
  const emojiSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className="flex items-center space-x-2 will-change-transform">
      {/* Team Logo or Emoji */}
      {logo && !imageError ? (
        <div className={`${sizeClasses[size]} relative flex-shrink-0 transition-transform duration-200 ease-out`}>
          <Image
            src={logo}
            alt={`${teamName} logo`}
            width={size === 'sm' ? 24 : size === 'md' ? 32 : 48}
            height={size === 'sm' ? 24 : size === 'md' ? 32 : 48}
            className="object-contain"
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        <span className={`${emojiSizeClasses[size]} flex-shrink-0 transition-transform duration-200 ease-out`}>
          {emoji}
        </span>
      )}
      
      {/* Team Name */}
      {showName && (
        <span 
          className={`${textSizeClasses[size]} font-medium transition-colors duration-200 ease-out`}
          style={teamColor ? { color: `#${teamColor}` } : {}}
        >
          {teamName}
        </span>
      )}
    </div>
  );
} 