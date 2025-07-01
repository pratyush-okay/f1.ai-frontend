// Driver name to image file mapping
const driverImageMap: Record<string, string> = {
  'Max Verstappen': 'Max Verstappen.avif',
  'Lando Norris': 'Lando Norris.avif',
  'Gabriel Bortoleto': 'Gabriel Bortoleto.avif',
  'Isack Hadjar': 'Isack Hadjar.avif',
  'Pierre Gasly': 'Pierre Gasly.avif',
  'Kimi Antonelli': 'Kimi Antonelli.avif',
  'Fernando Alonso': 'Fernando Alonso.avif',
  'Charles Leclerc': 'Charles Leclerc.avif',
  'Lance Stroll': 'Lance Stroll.avif',
  'Yuki Tsunoda': 'Yuki Tsunoda.avif',
  'Alexander Albon': 'Alexander Albon.avif',
  'Nico Hulkenberg': 'Nico Hulkenberg.avif',
  'Liam Lawson': 'Liam Lawson.avif',
  'Esteban Ocon': 'Esteban Ocon.avif',
  'Franco Colapinto': 'Franco Colapinto.avif',
  'Lewis Hamilton': 'Lewis Hamilton.avif',
  'Carlos Sainz': 'Carlos Sainz.avif',
  'George Russell': 'George Russell.avif',
  'Oscar Piastri': 'Oscar Piastri.avif',
  'Oliver Bearman': 'Oliver Bearman.avif'
};

// Alternative name variations that might come from the API
const nameVariations: Record<string, string> = {
  'Max VERSTAPPEN': 'Max Verstappen',
  'Lando NORRIS': 'Lando Norris',
  'Gabriel BORTOLETO': 'Gabriel Bortoleto',
  'Isack HADJAR': 'Isack Hadjar',
  'Pierre GASLY': 'Pierre Gasly',
  'Kimi ANTONELLI': 'Kimi Antonelli',
  'Fernando ALONSO': 'Fernando Alonso',
  'Charles LECLERC': 'Charles Leclerc',
  'Lance STROLL': 'Lance Stroll',
  'Yuki TSUNODA': 'Yuki Tsunoda',
  'Alexander ALBON': 'Alexander Albon',
  'Nico HULKENBERG': 'Nico Hulkenberg',
  'Nico HÜLKENBERG': 'Nico Hulkenberg',
  'Liam LAWSON': 'Liam Lawson',
  'Esteban OCON': 'Esteban Ocon',
  'Franco COLAPINTO': 'Franco Colapinto',
  'Lewis HAMILTON': 'Lewis Hamilton',
  'Carlos SAINZ': 'Carlos Sainz',
  'George RUSSELL': 'George Russell',
  'Oscar PIASTRI': 'Oscar Piastri',
  'Oliver BEARMAN': 'Oliver Bearman'
};

export function getDriverImagePath(driverName: string): string {
  // Normalize the name
  const normalizedName = nameVariations[driverName] || driverName;
  const imageFile = driverImageMap[normalizedName];
  
  if (imageFile) {
    return `/drivers/${imageFile}`;
  }
  
  // Fallback: try to construct filename from name
  const fallbackFile = `${normalizedName}.avif`;
  return `/drivers/${fallbackFile}`;
}

export function getTeamGradient(teamColor: string): string {
  const color = teamColor ? `#${teamColor}` : '#FF1E1E';
  
  // Create sophisticated gradients based on team colors
  const gradients: Record<string, string> = {
    // Red Bull Racing
    '#3671C6': 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)',
    '#0600EF': 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)',
    
    // McLaren
    '#FF8700': 'linear-gradient(135deg, #ea580c 0%, #f97316 50%, #fb923c 100%)',
    
    // Ferrari
    '#DC0000': 'linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f87171 100%)',
    
    // Mercedes
    '#00D2BE': 'linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #5eead4 100%)',
    
    // Aston Martin
    '#006F62': 'linear-gradient(135deg, #065f46 0%, #059669 50%, #34d399 100%)',
    
    // Alpine
    '#0090FF': 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 50%, #93c5fd 100%)',
    
    // Williams
    '#005AFF': 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #93c5fd 100%)',
    
    // RB/Racing Bulls
    '#6692FF': 'linear-gradient(135deg, #4338ca 0%, #6366f1 50%, #a5b4fc 100%)',
    
    // Haas
    '#FFFFFF': 'linear-gradient(135deg, #374151 0%, #6b7280 50%, #d1d5db 100%)',
    
    // Kick Sauber
    '#52E252': 'linear-gradient(135deg, #16a34a 0%, #22c55e 50%, #86efac 100%)'
  };

  return gradients[color] || `linear-gradient(135deg, ${color}40 0%, ${color}80 50%, ${color}40 100%)`;
}

export function hasLocalDriverImage(driverName: string): boolean {
  const normalizedName = nameVariations[driverName] || driverName;
  return normalizedName in driverImageMap;
} 