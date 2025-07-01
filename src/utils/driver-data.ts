// Driver number to nationality mapping (2025 season)
const driverNationalities: Record<number, string> = {
  1: 'Netherlands',        // Max Verstappen
  4: 'United Kingdom',     // Lando Norris
  5: 'Brazil',            // Gabriel Bortoleto
  6: 'France',            // Isack Hadjar
  7: 'Australia',         // Jack Doohan
  10: 'France',           // Pierre Gasly
  14: 'Spain',            // Fernando Alonso
  18: 'Canada',           // Lance Stroll
  16: 'Monaco',           // Charles Leclerc
  44: 'United Kingdom',    // Lewis Hamilton
  63: 'United Kingdom',    // George Russell
  12: 'Italy',            // Andrea Kimi Antonelli
  81: 'Australia',        // Oscar Piastri
  31: 'France',           // Esteban Ocon
  87: 'United Kingdom',    // Oliver Bearman
  22: 'Japan',            // Yuki Tsunoda
  23: 'Thailand',         // Alexander Albon
  55: 'Spain',            // Carlos Sainz
  27: 'Germany',          // Nico Hülkenberg
};

// Country name to flag emoji mapping
const countryFlags: Record<string, string> = {
  'Netherlands': '🇳🇱',
  'United Kingdom': '🇬🇧',
  'Brazil': '🇧🇷',
  'France': '🇫🇷',
  'Australia': '🇦🇺',
  'Spain': '🇪🇸',
  'Canada': '🇨🇦',
  'Monaco': '🇲🇨',
  'Italy': '🇮🇹',
  'Japan': '🇯🇵',
  'Thailand': '🇹🇭',
  'Germany': '🇩🇪',
  'United States': '🇺🇸',
};

// Driver birth dates mapping (with multiple name variations)
const driverBirthDates: Record<string, string> = {
  // Max Verstappen variations
  'Max Verstappen': '30/09/1997',
  'Max VERSTAPPEN': '30/09/1997',
  'M VERSTAPPEN': '30/09/1997',
  
  // Lando Norris variations  
  'Lando Norris': '13/11/1999',
  'Lando NORRIS': '13/11/1999',
  'L NORRIS': '13/11/1999',
  
  // Gabriel Bortoleto variations
  'Gabriel Bortoleto': '14/10/2004',
  'Gabriel BORTOLETO': '14/10/2004',
  'G BORTOLETO': '14/10/2004',
  
  // Isack Hadjar variations
  'Isack Hadjar': '28/09/2004',
  'Isack HADJAR': '28/09/2004',
  'I HADJAR': '28/09/2004',
  
  // Jack Doohan variations
  'Jack Doohan': '20/01/2003',
  'Jack DOOHAN': '20/01/2003',
  'J DOOHAN': '20/01/2003',
  
  // Pierre Gasly variations
  'Pierre Gasly': '07/02/1996',
  'Pierre GASLY': '07/02/1996',
  'P GASLY': '07/02/1996',
  
  // Fernando Alonso variations
  'Fernando Alonso': '29/07/1981',
  'Fernando ALONSO': '29/07/1981',
  'F ALONSO': '29/07/1981',
  
  // Lance Stroll variations
  'Lance Stroll': '29/10/1998',
  'Lance STROLL': '29/10/1998',
  'L STROLL': '29/10/1998',
  
  // Charles Leclerc variations
  'Charles Leclerc': '16/10/1997',
  'Charles LECLERC': '16/10/1997',
  'C LECLERC': '16/10/1997',
  
  // Lewis Hamilton variations
  'Lewis Hamilton': '07/01/1985',
  'Lewis HAMILTON': '07/01/1985',
  'L HAMILTON': '07/01/1985',
  
  // George Russell variations
  'George Russell': '15/02/1998',
  'George RUSSELL': '15/02/1998',
  'G RUSSELL': '15/02/1998',
  
  // Kimi Antonelli variations
  'Andrea Kimi Antonelli': '25/08/2006',
  'Kimi Antonelli': '25/08/2006',
  'Kimi ANTONELLI': '25/08/2006',
  'K ANTONELLI': '25/08/2006',
  
  // Oscar Piastri variations
  'Oscar Piastri': '06/04/2001',
  'Oscar PIASTRI': '06/04/2001',
  'O PIASTRI': '06/04/2001',
  
  // Esteban Ocon variations
  'Esteban Ocon': '17/09/1996',
  'Esteban OCON': '17/09/1996',
  'E OCON': '17/09/1996',
  
  // Oliver Bearman variations
  'Oliver Bearman': '08/05/2005',
  'Oliver BEARMAN': '08/05/2005',
  'O BEARMAN': '08/05/2005',
  
  // Yuki Tsunoda variations
  'Yuki Tsunoda': '11/05/2000',
  'Yuki TSUNODA': '11/05/2000',
  'Y TSUNODA': '11/05/2000',
  
  // Alexander Albon variations
  'Alexander Albon': '23/03/1996',
  'Alexander ALBON': '23/03/1996',
  'A ALBON': '23/03/1996',
  
  // Carlos Sainz variations
  'Carlos Sainz': '01/09/1994',
  'Carlos SAINZ': '01/09/1994',
  'C SAINZ': '01/09/1994',
  
  // Nico Hulkenberg variations
  'Nico Hülkenberg': '19/08/1987',
  'Nico Hulkenberg': '19/08/1987',
  'Nico HULKENBERG': '19/08/1987',
  'Nico HÜLKENBERG': '19/08/1987',
  'N HULKENBERG': '19/08/1987',
  'N HÜLKENBERG': '19/08/1987',
  
  // Franco Colapinto variations (if he appears)
  'Franco Colapinto': '27/05/2003',
  'Franco COLAPINTO': '27/05/2003',
  'F COLAPINTO': '27/05/2003',
  
  // Liam Lawson variations
  'Liam Lawson': '11/02/2002',
  'Liam LAWSON': '11/02/2002',
  'L LAWSON': '11/02/2002',
};

// Get nationality by driver number
export function getDriverNationality(driverNumber: number): string {
  return driverNationalities[driverNumber] || '';
}

// Get country flag by nationality or driver number
export function getCountryFlag(input: string | number): string {
  let nationality = '';
  
  if (typeof input === 'number') {
    // If input is a driver number, get nationality first
    nationality = driverNationalities[input] || '';
  } else {
    // If input is already a nationality string, use it directly
    nationality = input || '';
  }
  
  if (!nationality) return '🏁';
  
  // Look up flag by nationality
  const flag = countryFlags[nationality];
  if (flag) {
    return flag;
  }
  
  // Debug log to see what we're getting
  console.log('Unknown nationality:', nationality);
  
  // Default flag
  return '🏁';
}

export function calculateAge(birthDateString: string): number {
  if (!birthDateString) return 0;
  
  // Parse DD/MM/YYYY format
  const [day, month, year] = birthDateString.split('/').map(num => parseInt(num));
  const birthDate = new Date(year, month - 1, day); // month is 0-indexed
  const today = new Date();
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

export function getDriverAge(driverName: string): number {
  if (!driverName) return 0;
  
  // Try exact match first
  let birthDate = driverBirthDates[driverName];
  
  // If not found, try different variations
  if (!birthDate) {
    // Try trimmed version
    birthDate = driverBirthDates[driverName.trim()];
  }
  
  if (!birthDate) {
    // Try uppercase version
    birthDate = driverBirthDates[driverName.toUpperCase()];
  }
  
  if (!birthDate) {
    // Try with normalized spacing
    const normalizedName = driverName.replace(/\s+/g, ' ').trim();
    birthDate = driverBirthDates[normalizedName];
  }
  
  if (!birthDate) {
    // Debug log to see what names we're getting
    console.log('Unknown driver name for age calculation:', driverName);
    return 0;
  }
  
  return calculateAge(birthDate);
}

export function getDriverBirthDate(driverName: string): string {
  return driverBirthDates[driverName] || '';
} 