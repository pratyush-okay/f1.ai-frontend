// Utility function to get source logo based on source name
export function getSourceLogo(source: string): string {
  const sourceLower = source.toLowerCase();
  
  // Map source names to their logo files
  if (sourceLower.includes('espn')) {
    return '/sources/ESPN Logos.png';
  }
  if (sourceLower.includes('sky') || sourceLower.includes('skysports')) {
    return '/sources/Skysports.svg';
  }
  if (sourceLower.includes('fox') || sourceLower.includes('fox sports')) {
    return '/sources/Fox_Sports.svg';
  }
  if (sourceLower.includes('f1.com') || sourceLower.includes('formula1') || sourceLower.includes('f1')) {
    return '/sources/F1_com.avif';
  }
  if (sourceLower.includes('motorsport') || sourceLower.includes('motorsport.com')) {
    return '/sources/motorsport-com.png';
  }
  
  // Default fallback
  return '/sources/ESPN Logos.png';
}

// Get source display name (cleaner version)
export function getSourceDisplayName(source: string): string {
  const sourceLower = source.toLowerCase();
  
  if (sourceLower.includes('espn')) {
    return 'ESPN F1';
  }
  if (sourceLower.includes('sky') || sourceLower.includes('skysports')) {
    return 'Sky Sports F1';
  }
  if (sourceLower.includes('fox') || sourceLower.includes('fox sports')) {
    return 'Fox Sports';
  }
  if (sourceLower.includes('f1.com') || sourceLower.includes('formula1')) {
    return 'F1.com';
  }
  if (sourceLower.includes('motorsport') || sourceLower.includes('motorsport.com')) {
    return 'Motorsport.com';
  }
  
  return source;
}
