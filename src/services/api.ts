const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://f1-ai-backend.railway.internal';

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

export interface F1Team {
  team_id: string;
  team_name: string;
  team_nationality: string;
  first_appearance: number;
  constructors_championships: number | null;
  drivers_championships: number | null;
  url: string;
  created_at?: string;
  updated_at?: string;
}

export interface EnrichedF1Team extends F1Team {
  championship_position?: number;
  championship_points?: number;
  wins?: number | null;
  team_colour?: string;
  base?: string;
}

export interface TeamsResponse {
  message: string;
  teams: F1Team[];
}

export interface ConstructorStanding {
  classification_id: number;
  team_id: string;
  season: number;
  championship_id: string;
  points: number;
  position: number;
  wins: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface ConstructorStandingsResponse {
  message: string;
  standings: ConstructorStanding[];
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

  static async fetchTeams(): Promise<TeamsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/teams`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching teams:', error);
      throw new Error('Failed to fetch teams from API');
    }
  }

  static async fetchConstructorStandings(): Promise<ConstructorStandingsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/teams-standings`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching constructor standings:', error);
      throw new Error('Failed to fetch constructor standings from API');
    }
  }
} 