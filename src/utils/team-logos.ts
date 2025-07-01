// Team name to local logo file mapping for F1 teams (2025 season)
const teamLogos: Record<string, string> = {
  // Red Bull Racing
  'Red Bull Racing': '/teamlogos/Red Bull Racing Logo 2025.avif',
  'Red Bull Racing Honda RBPT': '/teamlogos/Red Bull Racing Logo 2025.avif',
  
  // McLaren
  'McLaren': '/teamlogos/2025 McLaren Logo White.avif',
  'McLaren Mercedes': '/teamlogos/2025 McLaren Logo White.avif',
  
  // Ferrari
  'Ferrari': '/teamlogos/Ferrari Logo 2025.avif',
  'Scuderia Ferrari': '/teamlogos/Ferrari Logo 2025.avif',
  
  // Mercedes
  'Mercedes': '/teamlogos/2025 Mercedes Logo White.avif',
  'Mercedes-AMG Petronas F1 Team': '/teamlogos/2025 Mercedes Logo White.avif',
  
  // Aston Martin
  'Aston Martin': '/teamlogos/Aston Martin Logo 2025.avif',
  'Aston Martin Aramco': '/teamlogos/Aston Martin Logo 2025.avif',
  
  // Alpine - using Racing Bulls logo as placeholder (no Alpine logo provided)
  'Alpine': '/teamlogos/F1 Racing Teams 2025 Logo White.avif',
  'BWT Alpine F1 Team': '/teamlogos/F1 Racing Teams 2025 Logo White.avif',
  
  // Williams
  'Williams': '/teamlogos/F1 2025 Williams Logo White.avif',
  'Williams Racing': '/teamlogos/F1 2025 Williams Logo White.avif',
  
  // Racing Bulls (RB/AlphaTauri)
  'Racing Bulls': '/teamlogos/F1 Racing Teams 2025 Red Bull Logo.avif',
  'RB': '/teamlogos/F1 Racing Teams 2025 Red Bull Logo.avif',
  'AlphaTauri': '/teamlogos/F1 Racing Teams 2025 Red Bull Logo.avif',
  
  // Haas
  'Haas': '/teamlogos/F1 2025 Haas Logo White.avif',
  'Haas F1 Team': '/teamlogos/F1 2025 Haas Logo White.avif',
  'MoneyGram Haas F1 Team': '/teamlogos/F1 2025 Haas Logo White.avif',
  
  // Kick Sauber (Alfa Romeo/Sauber)
  'Kick Sauber': '/teamlogos/2025 Sauber Logo White.avif',
  'Sauber': '/teamlogos/2025 Sauber Logo White.avif',
  'Alfa Romeo': '/teamlogos/2025 Sauber Logo White.avif',
};

// Fallback emoji icons for teams if logos fail to load
const teamEmojis: Record<string, string> = {
  'Red Bull Racing': '🐂',
  'Red Bull Racing Honda RBPT': '🐂',
  'McLaren': '🧡',
  'McLaren Mercedes': '🧡',
  'Ferrari': '🐎',
  'Scuderia Ferrari': '🐎',
  'Mercedes': '⭐',
  'Mercedes-AMG Petronas F1 Team': '⭐',
  'Aston Martin': '🦅',
  'Aston Martin Aramco': '🦅',
  'Alpine': '🏔️',
  'BWT Alpine F1 Team': '🏔️',
  'Williams': '⚡',
  'Williams Racing': '⚡',
  'Racing Bulls': '🐂',
  'RB': '🐂',
  'AlphaTauri': '🐂',
  'Haas': '🇺🇸',
  'Haas F1 Team': '🇺🇸',
  'MoneyGram Haas F1 Team': '🇺🇸',
  'Kick Sauber': '🇨🇭',
  'Sauber': '🇨🇭',
  'Alfa Romeo': '🇨🇭',
};

export function getTeamLogo(teamName: string): string {
  if (!teamName) return '';
  
  // Clean up team name (remove extra spaces, normalize)
  const cleanTeamName = teamName.trim();
  
  // Try exact match first
  if (teamLogos[cleanTeamName]) {
    return teamLogos[cleanTeamName];
  }
  
  // Try partial matches for common variations
  for (const [key, logo] of Object.entries(teamLogos)) {
    if (cleanTeamName.toLowerCase().includes(key.toLowerCase()) || 
        key.toLowerCase().includes(cleanTeamName.toLowerCase())) {
      return logo;
    }
  }
  
  return '';
}

export function getTeamEmoji(teamName: string): string {
  if (!teamName) return '🏎️';
  
  const cleanTeamName = teamName.trim();
  
  // Try exact match first
  if (teamEmojis[cleanTeamName]) {
    return teamEmojis[cleanTeamName];
  }
  
  // Try partial matches
  for (const [key, emoji] of Object.entries(teamEmojis)) {
    if (cleanTeamName.toLowerCase().includes(key.toLowerCase()) || 
        key.toLowerCase().includes(cleanTeamName.toLowerCase())) {
      return emoji;
    }
  }
  
  return '🏎️';
}

export function getTeamLogoWithFallback(teamName: string): { logo: string; emoji: string } {
  return {
    logo: getTeamLogo(teamName),
    emoji: getTeamEmoji(teamName)
  };
} 