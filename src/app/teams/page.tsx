"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamLogo } from "@/components/team-logo";
import { TeamImage } from "@/components/team-image";
import { TeamStandingsTable } from "@/components/team-standings-table";
import { ApiService, type F1Team, type EnrichedF1Team, type ConstructorStanding, type F1Driver } from "@/services/api";
import { teams } from "@/data/f1-data";

export default function TeamsPage() {
  const [enrichedTeams, setEnrichedTeams] = useState<EnrichedF1Team[]>([]);
  const [drivers, setDrivers] = useState<F1Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch teams, standings, and drivers data
        const [teamsData, standingsData, driversData] = await Promise.all([
          ApiService.fetchTeams(),
          ApiService.fetchConstructorStandings(),
          ApiService.fetchDrivers()
        ]);

        setDrivers(driversData.drivers);

        // Merge teams with standings and static data
        const enriched = teamsData.teams.map((team: F1Team) => {
          const standing = standingsData.standings.find((s: ConstructorStanding) => s.team_id === team.team_id);
          const staticTeam = teams.find(t => 
            t.name.toLowerCase().includes(team.team_name.toLowerCase()) ||
            team.team_name.toLowerCase().includes(t.name.toLowerCase())
          );

          return {
            ...team,
            championship_position: standing?.position,
            championship_points: standing?.points,
            wins: standing?.wins,
            team_colour: staticTeam?.color.replace('#', ''),
            base: getTeamBase(team.team_name, team.team_nationality)
          };
        });

        // Sort by championship position
        enriched.sort((a, b) => (a.championship_position || 999) - (b.championship_position || 999));
        
        setEnrichedTeams(enriched);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Get team drivers
  const getTeamDrivers = (teamName: string): string[] => {
    return drivers
      .filter(driver => driver.team_name === teamName)
      .map(driver => driver.full_name);
  };

  // Get team color from f1-data.ts
  const getTeamColor = (teamName: string): string => {
    const team = teams.find(t => 
      t.name.toLowerCase().includes(teamName.toLowerCase()) ||
      teamName.toLowerCase().includes(t.name.toLowerCase())
    );
    return team?.color.replace('#', '') || 'FF1E1E';
  };

  // Get team base location
  const getTeamBase = (teamName: string, nationality: string): string => {
    const baseMap: Record<string, string> = {
      'McLaren Formula 1 Team': 'Woking, United Kingdom',
      'Scuderia Ferrari': 'Maranello, Italy',
      'Mercedes Formula 1 Team': 'Brackley, United Kingdom',
      'Red Bull Racing': 'Milton Keynes, United Kingdom',
      'Williams Racing': 'Grove, United Kingdom',
      'RB F1 Team': 'Faenza, Italy',
      'Haas F1 Team': 'Kannapolis, United States',
      'Aston Martin F1 Team': 'Silverstone, United Kingdom',
      'Sauber F1 Team': 'Hinwil, Switzerland',
      'Alpine F1 Team': 'Enstone, United Kingdom'
    };

    return baseMap[teamName] || nationality;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 text-white">Formula 1 Teams</h1>
            <p className="text-gray-400 text-lg">
              Loading team data...
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden bg-black/40 border-gray-800 backdrop-blur-sm animate-pulse">
                    <div className="h-64 bg-gray-800/50" />
                    <div className="p-6 space-y-4">
                      <div className="h-4 bg-gray-800/50 rounded w-3/4" />
                      <div className="h-4 bg-gray-800/50 rounded w-1/2" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="h-96 bg-gray-800/50 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 text-white">Formula 1 Teams</h1>
            <p className="text-gray-400 text-lg">
              Unable to load team data
            </p>
          </div>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Data</h2>
            <p className="text-gray-400 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-white">Formula 1 Teams</h1>
          <p className="text-gray-400 text-lg">
            {enrichedTeams.length} teams competing in the current F1 season
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main content area - Team cards */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrichedTeams.map((team) => (
                <Card 
                  key={team.team_id} 
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 ease-out hover:scale-[1.02] group will-change-transform relative bg-black border-gray-800 backdrop-blur-sm"
                  style={{ 
                    borderTopColor: `#${getTeamColor(team.team_name)}`,
                    borderTopWidth: '4px',
                    boxShadow: `0 4px 12px rgba(${parseInt(getTeamColor(team.team_name).slice(0,2) || 'FF', 16)}, ${parseInt(getTeamColor(team.team_name).slice(2,4) || '1E', 16)}, ${parseInt(getTeamColor(team.team_name).slice(4,6) || '1E', 16)}, 0.15)`
                  }}
                >
                  {/* Championship Position Badge */}
                  {team.championship_position && (
                    <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-sm font-bold bg-gray-800/50 text-gray-400 shadow-lg">
                      P{team.championship_position}
                    </div>
                  )}

                  <TeamImage 
                    teamName={team.team_name}
                    teamColor={getTeamColor(team.team_name)}
                    position={team.championship_position}
                    drivers={getTeamDrivers(team.team_name)}
                  />
                  
                  <CardHeader className="pb-2 text-center">
                    <CardTitle className="text-lg font-bold text-white group-hover:text-red-500 transition-colors">
                      {team.team_name}
                    </CardTitle>
                    <CardDescription className="text-gray-400 text-sm flex items-center justify-center gap-2">
                      <span>{team.base}</span>
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-1 text-center">
                        <div className="text-xs text-gray-400">Points</div>
                        <div className="font-mono text-xl font-bold text-green-400">
                          {team.championship_points || 0}
                        </div>
                      </div>
                      <div className="space-y-1 text-center">
                        <div className="text-xs text-gray-400">Wins</div>
                        <div className="font-mono text-xl font-bold text-yellow-400">
                          {team.wins || 0}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-1 text-center">
                        <div className="text-xs text-gray-400">Constructor Titles</div>
                        <div className="font-mono text-lg font-bold text-blue-400">
                          {team.constructors_championships || 0}
                        </div>
                      </div>
                      <div className="space-y-1 text-center">
                        <div className="text-xs text-gray-400">First Entry</div>
                        <div className="font-mono text-lg font-bold text-purple-400">
                          {team.first_appearance}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-800">
                      <div className="flex items-center justify-center">
                        <TeamLogo 
                          teamName={team.team_name} 
                          size="sm" 
                          showName={true}
                          teamColor={getTeamColor(team.team_name)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Standings table */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <TeamStandingsTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 