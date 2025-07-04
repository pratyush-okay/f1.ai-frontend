"use client";

import Image from "next/image";
import { useState } from "react";
import { getTeamLogoWithFallback } from "@/utils/team-logos";

export interface TeamLogoProps {
  teamName: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showName?: boolean;
  teamColor?: string;
}

export function TeamLogo({ teamName, size = 'md', showName = true, teamColor }: TeamLogoProps) {
  const [imageError, setImageError] = useState(false);
  const { logo, emoji } = getTeamLogoWithFallback(teamName);
  
  const getLogoSize = () => {
    switch (size) {
      case 'xs':
        return 'w-5 h-5';
      case 'sm':
        return 'w-8 h-8';
      case 'md':
        return 'w-12 h-12';
      case 'lg':
        return 'w-16 h-16';
      default:
        return 'w-12 h-12';
    }
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
        <div className={`${getLogoSize()} relative flex-shrink-0 transition-transform duration-200 ease-out`}>
          <Image
            src={logo}
            alt={`${teamName} logo`}
            width={size === 'sm' ? 24 : size === 'md' ? 32 : size === 'lg' ? 48 : 64}
            height={size === 'sm' ? 24 : size === 'md' ? 32 : size === 'lg' ? 48 : 64}
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