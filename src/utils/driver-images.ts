// Driver name to image file mapping (based on actual files in /public/drivers/)
const driverImageMap: Record<string, string> = {
  'Max Verstappen': 'Max Verstappen.avif',
  'Lando Norris': 'Lando Norris.avif',
  'Gabriel Bortoleto': 'Gabriel Bortoleto.avif',
  'Isack Hadjar': 'Isack Hadjar.avif',
  'Pierre Gasly': 'Pierre Gasly.avif',
  'Kimi Antonelli': 'Kimi Antonelli.avif',
  'Andrea Kimi Antonelli': 'Kimi Antonelli.avif', // Database name
  'Fernando Alonso': 'Fernando Alonso.avif',
  'Charles Leclerc': 'Charles Leclerc.avif',
  'Lance Stroll': 'Lance Stroll.avif',
  'Yuki Tsunoda': 'Yuki Tsunoda.avif',
  'Alexander Albon': 'Alexander Albon.avif',
  'Alex Albon': 'Alexander Albon.avif', // Short name
  'Nico Hulkenberg': 'Nico Hulkenberg.avif',
  'Nico Hülkenberg': 'Nico Hulkenberg.avif', // Umlaut variation
  'Liam Lawson': 'Liam Lawson.avif',
  'Esteban Ocon': 'Esteban Ocon.avif',
  'Franco Colapinto': 'Franco Colapinto.avif',
  'Lewis Hamilton': 'Lewis Hamilton.avif',
  'Carlos Sainz': 'Carlos Sainz.avif',
  'Carlos Sainz Jr.': 'Carlos Sainz.avif', // Jr. variation
  'George Russell': 'George Russell.avif',
  'Oscar Piastri': 'Oscar Piastri.avif',
  'Oliver Bearman': 'Oliver Bearman.avif',
  'Jack Doohan': 'Jack Doohan.avif'
};

// Alternative name variations that might come from the API
const nameVariations: Record<string, string> = {
  'Max VERSTAPPEN': 'Max Verstappen',
  'Lando NORRIS': 'Lando Norris',
  'Gabriel BORTOLETO': 'Gabriel Bortoleto',
  'Isack HADJAR': 'Isack Hadjar',
  'Pierre GASLY': 'Pierre Gasly',
  'Kimi ANTONELLI': 'Kimi Antonelli',
  'Andrea Kimi Antonelli': 'Kimi Antonelli', // Database name variation
  'Fernando ALONSO': 'Fernando Alonso',
  'Charles LECLERC': 'Charles Leclerc',
  'Lance STROLL': 'Lance Stroll',
  'Yuki TSUNODA': 'Yuki Tsunoda',
  'Alexander ALBON': 'Alexander Albon',
  'Alex Albon': 'Alexander Albon', // Common short name
  'Nico HULKENBERG': 'Nico Hulkenberg',
  'Nico HÜLKENBERG': 'Nico Hulkenberg',
  'Liam LAWSON': 'Liam Lawson',
  'Esteban OCON': 'Esteban Ocon',
  'Franco COLAPINTO': 'Franco Colapinto',
  'Lewis HAMILTON': 'Lewis Hamilton',
  'Carlos SAINZ': 'Carlos Sainz',
  'Carlos Sainz Jr.': 'Carlos Sainz', // Jr. variation
  'George RUSSELL': 'George Russell',
  'Oscar PIASTRI': 'Oscar Piastri',
  'Oliver BEARMAN': 'Oliver Bearman',
  'Jack DOOHAN': 'Jack Doohan'
};

export function getDriverImagePath(driverName: string): string {
  if (!driverName) return '/drivers/default.avif';
  
  // Try exact match first
  if (driverImageMap[driverName]) {
    return `/drivers/${driverImageMap[driverName]}`;
  }
  
  // Try with name variations
  const normalizedName = nameVariations[driverName] || driverName;
  if (driverImageMap[normalizedName]) {
    return `/drivers/${driverImageMap[normalizedName]}`;
  }
  
  // Try case-insensitive match
  const lowerName = driverName.toLowerCase();
  for (const [key, file] of Object.entries(driverImageMap)) {
    if (key.toLowerCase() === lowerName) {
      return `/drivers/${file}`;
    }
  }
  
  // Try partial matches (useful for name variations not in our mapping)
  for (const [key, file] of Object.entries(driverImageMap)) {
    const keyParts = key.toLowerCase().split(' ');
    const nameParts = driverName.toLowerCase().split(' ');
    
    // Check if surname matches (last name is usually most distinctive)
    if (keyParts.length > 0 && nameParts.length > 0) {
      const keySurname = keyParts[keyParts.length - 1];
      const nameSurname = nameParts[nameParts.length - 1];
      if (keySurname === nameSurname && keyParts[0] === nameParts[0]) {
        return `/drivers/${file}`;
      }
    }
  }
  
  // Final fallback: try to construct filename from name
  const fallbackFile = `${normalizedName}.avif`;
  return `/drivers/${fallbackFile}`;
}

export function getTeamGradient(teamColor: string): string {
  const color = teamColor ? `#${teamColor}` : '#FF1E1E';
  
  // Create more subtle gradients based on team colors
  const gradients: Record<string, string> = {
    // Red Bull Racing
    '#3671C6': 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%)',
    '#0600EF': 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%)',
    
    // McLaren
    '#FF8700': 'linear-gradient(135deg, #c2410c 0%, #ea580c 50%, #f97316 100%)',
    
    // Ferrari
    '#DC0000': 'linear-gradient(135deg, #991b1b 0%, #dc2626 50%, #ef4444 100%)',
    
    // Mercedes
    '#00D2BE': 'linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%)',
    
    // Aston Martin
    '#006F62': 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #059669 100%)',
    
    // Alpine
    '#0090FF': 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #3b82f6 100%)',
    
    // Williams
    '#005AFF': 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #3b82f6 100%)',
    
    // RB/Racing Bulls
    '#6692FF': 'linear-gradient(135deg, #3730a3 0%, #4338ca 50%, #6366f1 100%)',
    
    // Haas
    '#FFFFFF': 'linear-gradient(135deg, #1f2937 0%, #374151 50%, #6b7280 100%)',
    
    // Kick Sauber
    '#52E252': 'linear-gradient(135deg, #15803d 0%, #16a34a 50%, #22c55e 100%)'
  };

  return gradients[color] || `linear-gradient(135deg, ${color}60 0%, ${color}80 50%, ${color}60 100%)`;
}

export function hasLocalDriverImage(driverName: string): boolean {
  if (!driverName) return false;
  
  // Try exact match
  if (driverImageMap[driverName]) return true;
  
  // Try with name variations
  const normalizedName = nameVariations[driverName] || driverName;
  if (driverImageMap[normalizedName]) return true;
  
  // Try case-insensitive match
  const lowerName = driverName.toLowerCase();
  for (const key of Object.keys(driverImageMap)) {
    if (key.toLowerCase() === lowerName) return true;
  }
  
  // Try partial matches
  for (const key of Object.keys(driverImageMap)) {
    const keyParts = key.toLowerCase().split(' ');
    const nameParts = driverName.toLowerCase().split(' ');
    
    if (keyParts.length > 0 && nameParts.length > 0) {
      const keySurname = keyParts[keyParts.length - 1];
      const nameSurname = nameParts[nameParts.length - 1];
      if (keySurname === nameSurname && keyParts[0] === nameParts[0]) {
        return true;
      }
    }
  }
  
  return false;
} 