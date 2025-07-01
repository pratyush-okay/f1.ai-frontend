const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface F1Driver {
  id: number;
  driver_number: number;
  first_name: string;
  last_name: string;
  full_name: string;
  broadcast_name: string;
  name_acronym: string;
  country_code: string;
  team_name: string;
  team_colour: string;
  headshot_url: string;
  nationality: string;
  team: string;
  number: number;
  image: string;
  championship_position?: number;
  championship_points?: number;
  wins?: number;
}

export interface DriversResponse {
  drivers: F1Driver[];
  total: number;
}

export interface DriverStanding {
  classificationId: number;
  driverId: string;
  teamId: string;
  points: number;
  position: number;
  wins: number | null;
  driver: {
    name: string;
    surname: string;
    nationality: string;
    birthday: string;
    number: number;
    shortName: string;
    url: string;
  };
  team: {
    teamId: string;
    teamName: string;
    country: string;
    firstAppareance: number;
    constructorsChampionships: number | null;
    driversChampionships: number | null;
    url: string;
  };
}

export interface DriverStandingsResponse {
  api: string;
  url: string;
  limit: number;
  offset: number;
  total: number;
  season: number;
  championshipId: string;
  drivers_championship: DriverStanding[];
}

export class ApiService {
  static async fetchDrivers(): Promise<DriversResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/drivers`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching drivers:', error);
      throw new Error('Failed to fetch drivers from API');
    }
  }

  static async fetchDriverStandings(): Promise<DriverStandingsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/driver-standings`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching driver standings:', error);
      throw new Error('Failed to fetch driver standings from API');
    }
  }

  static async fetchDriver(driverNumber: number): Promise<F1Driver> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/drivers/${driverNumber}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching driver ${driverNumber}:`, error);
      throw new Error(`Failed to fetch driver ${driverNumber} from API`);
    }
  }
} 