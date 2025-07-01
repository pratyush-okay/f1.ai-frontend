export interface Driver {
  id: number;
  name: string;
  team: string;
  nationality: string;
  number: number;
  points: number;
  championships: number;
  image: string;
}

export interface Team {
  id: number;
  name: string;
  base: string;
  teamChief: string;
  chassis: string;
  powerUnit: string;
  firstEntry: number;
  worldChampionships: number;
  highestRaceFinish: string;
  polePositions: number;
  fastestLaps: number;
  color: string;
  drivers: string[];
}

export const drivers: Driver[] = [
  {
    id: 1,
    name: "Max Verstappen",
    team: "Red Bull Racing",
    nationality: "Dutch",
    number: 1,
    points: 575,
    championships: 3,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=400&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Sergio Pérez",
    team: "Red Bull Racing", 
    nationality: "Mexican",
    number: 11,
    points: 285,
    championships: 0,
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=300&h=400&fit=crop&crop=face"
  }
];

export const teams: Team[] = [
  {
    id: 1,
    name: "Red Bull Racing",
    base: "Milton Keynes, United Kingdom",
    teamChief: "Christian Horner",
    chassis: "RB20",
    powerUnit: "Honda RBPT",
    firstEntry: 2005,
    worldChampionships: 6,
    highestRaceFinish: "1st (x110)",
    polePositions: 103,
    fastestLaps: 94,
    color: "#0600EF",
    drivers: ["Max Verstappen", "Sergio Pérez"]
  },
  {
    id: 2,
    name: "McLaren",
    base: "Woking, United Kingdom",
    teamChief: "Andrea Stella",
    chassis: "MCL38",
    powerUnit: "Mercedes",
    firstEntry: 1966,
    worldChampionships: 8,
    highestRaceFinish: "1st (x183)",
    polePositions: 156,
    fastestLaps: 164,
    color: "#FF8700",
    drivers: ["Lando Norris", "Oscar Piastri"]
  },
  {
    id: 3,
    name: "Ferrari",
    base: "Maranello, Italy",
    teamChief: "Frédéric Vasseur",
    chassis: "SF-24",
    powerUnit: "Ferrari",
    firstEntry: 1950,
    worldChampionships: 16,
    highestRaceFinish: "1st (x243)",
    polePositions: 249,
    fastestLaps: 263,
    color: "#DC0000",
    drivers: ["Charles Leclerc", "Carlos Sainz"]
  },
  {
    id: 4,
    name: "Mercedes",
    base: "Brackley, United Kingdom",
    teamChief: "Toto Wolff",
    chassis: "W15",
    powerUnit: "Mercedes",
    firstEntry: 2010,
    worldChampionships: 8,
    highestRaceFinish: "1st (x125)",
    polePositions: 138,
    fastestLaps: 91,
    color: "#00D2BE",
    drivers: ["Lewis Hamilton", "George Russell"]
  },
  {
    id: 5,
    name: "Aston Martin",
    base: "Silverstone, United Kingdom", 
    teamChief: "Mike Krack",
    chassis: "AMR24",
    powerUnit: "Mercedes",
    firstEntry: 2021,
    worldChampionships: 0,
    highestRaceFinish: "1st (x1)",
    polePositions: 1,
    fastestLaps: 1,
    color: "#006F62",
    drivers: ["Fernando Alonso", "Lance Stroll"]
  },
  {
    id: 6,
    name: "Alpine",
    base: "Enstone, United Kingdom",
    teamChief: "Bruno Famin",
    chassis: "A524",
    powerUnit: "Renault",
    firstEntry: 1986,
    worldChampionships: 2,
    highestRaceFinish: "1st (x21)",
    polePositions: 20,
    fastestLaps: 15,
    color: "#0090FF",
    drivers: ["Pierre Gasly", "Esteban Ocon"]
  },
  {
    id: 7,
    name: "Williams",
    base: "Grove, United Kingdom",
    teamChief: "James Vowles", 
    chassis: "FW46",
    powerUnit: "Mercedes",
    firstEntry: 1977,
    worldChampionships: 9,
    highestRaceFinish: "1st (x114)",
    polePositions: 128,
    fastestLaps: 133,
    color: "#005AFF",
    drivers: ["Alex Albon", "Logan Sargeant"]
  },
  {
    id: 8,
    name: "RB",
    base: "Faenza, Italy",
    teamChief: "Laurent Mekies",
    chassis: "VCARB 01",
    powerUnit: "Honda RBPT",
    firstEntry: 2006,
    worldChampionships: 0,
    highestRaceFinish: "1st (x2)",
    polePositions: 1,
    fastestLaps: 2,
    color: "#6692FF",
    drivers: ["Yuki Tsunoda", "Daniel Ricciardo"]
  },
  {
    id: 9,
    name: "Haas",
    base: "Kannapolis, United States",
    teamChief: "Ayao Komatsu",
    chassis: "VF-24",
    powerUnit: "Ferrari",
    firstEntry: 2016,
    worldChampionships: 0,
    highestRaceFinish: "4th (x2)",
    polePositions: 1,
    fastestLaps: 2,
    color: "#FFFFFF",
    drivers: ["Nico Hülkenberg", "Kevin Magnussen"]
  },
  {
    id: 10,
    name: "Kick Sauber",
    base: "Hinwil, Switzerland",
    teamChief: "Alessandro Alunni Bravi",
    chassis: "C44",
    powerUnit: "Ferrari",
    firstEntry: 1993,
    worldChampionships: 0,
    highestRaceFinish: "1st (x1)",
    polePositions: 1,
    fastestLaps: 7,
    color: "#52E252",
    drivers: ["Valtteri Bottas", "Zhou Guanyu"]
  }
]; 