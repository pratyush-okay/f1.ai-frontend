"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamLogo } from "@/components/team-logo";
import { TeamImage } from "@/components/team-image";
import { TeamStandingsTable } from "@/components/team-standings-table";
import { ApiService, type F1Team, type EnrichedF1Team, type ConstructorStanding, type F1Driver } from "@/services/api";
import { teams } from "@/data/f1-data";
import Link from "next/link";

export default function TeamsPage() {
  const [enrichedTeams, setEnrichedTeams] = useState<EnrichedF1Team[]>([]);
  const [drivers, setDrivers] = useState<F1Driver[]>([]);
  const [teamSummaries, setTeamSummaries] = useState<Record<string, string>>({});
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

        // Fetch team summaries
        await fetchTeamSummaries();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Fetch team summaries from API
  const fetchTeamSummaries = async () => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://f1ai-backend-production.up.railway.app';
      
      // Try today's date first
      const today = new Date().toISOString().split('T')[0];
      let apiUrl = `${API_BASE_URL}/api/storage/f1-ai-team-news/${today}/summaries`;
      console.log("🔄 Fetching team summaries from:", apiUrl);
      
      let response = await fetch(apiUrl);
      
      // If today's file doesn't exist, try yesterday's date
      if (!response.ok) {
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        apiUrl = `${API_BASE_URL}/api/storage/f1-ai-team-news/${yesterday}/summaries`;
        console.log("🔄 Trying yesterday's date:", apiUrl);
        response = await fetch(apiUrl);
      }
      
      if (response.ok) {
        const data = await response.json();
        console.log("📰 Team Summaries API Response:", data);
        
        if (data.summaries) {
          console.log("✅ Team summaries found:", Object.keys(data.summaries).length);
          setTeamSummaries(data.summaries);
        } else {
          console.log("⚠️ No summaries found in response");
        }
      } else {
        console.log("❌ No summaries file found for any date");
      }
    } catch (error) {
      console.error("❌ Error fetching team summaries:", error);
    }
  };

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

  // Get today's summary for each team from API data
  const getTodaysSummary = (teamName: string): string => {
    // Map team names to their API team IDs
    const getTeamApiId = (teamName: string): string => {
      const teamIdMap: Record<string, string> = {
        'Alpine F1 Team': 'alpine',
        'Aston Martin F1 Team': 'aston_martin',
        'Scuderia Ferrari': 'ferrari',
        'Haas F1 Team': 'haas',
        'McLaren Formula 1 Team': 'mclaren',
        'Mercedes Formula 1 Team': 'mercedes',
        'RB F1 Team': 'rb',
        'Red Bull Racing': 'red_bull',
        'Sauber F1 Team': 'sauber',
        'Williams Racing': 'williams'
      };
      
      return teamIdMap[teamName] || teamName.toLowerCase().replace(/\s+/g, '_');
    };

    const teamApiId = getTeamApiId(teamName);
    const summaryKey = `${teamApiId}_total_summary`;
    
    // Return real summary from API if available, otherwise fallback
    if (teamSummaries[summaryKey]) {
      return teamSummaries[summaryKey];
    }
    
    // Fallback summaries if API data is not available
    const fallbackSummaries: Record<string, string> = {
      'Red Bull Racing': 'Red Bull continues to dominate with Max Verstappen leading the championship. The team is focusing on aerodynamic upgrades for the upcoming race.',
      'Mercedes Formula 1 Team': 'Mercedes shows promising pace in recent testing. George Russell and Lewis Hamilton are working closely with engineers on car development.',
      'Scuderia Ferrari': 'Ferrari demonstrates strong qualifying performance. Charles Leclerc and Carlos Sainz are confident about their race pace improvements.',
      'McLaren Formula 1 Team': 'McLaren reveals significant technical upgrades. Lando Norris and Oscar Piastri are optimistic about their championship prospects.',
      'Aston Martin F1 Team': 'Aston Martin announces new partnership deal. Fernando Alonso and Lance Stroll are adapting well to the latest car updates.',
      'Alpine F1 Team': 'Alpine focuses on engine reliability improvements. The team is working on reducing weight and improving aerodynamic efficiency.',
      'Williams Racing': 'Williams shows encouraging progress in recent sessions. The team is developing new aerodynamic components for better performance.',
      'RB F1 Team': 'RB continues development of their 2025 challenger. The team is optimistic about their midfield battle prospects.',
      'Haas F1 Team': 'Haas announces new technical partnership. The team is working on improving their qualifying and race pace consistency.',
      'Sauber F1 Team': 'Sauber reveals new livery design for upcoming races. The team is focusing on aerodynamic efficiency and tire management.'
    };

    return fallbackSummaries[teamName] || `${teamName} is working on technical developments and driver performance improvements for the upcoming race weekend.`;
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
                <Link 
                  key={team.team_id} 
                  href={`/teams/${team.team_name.toLowerCase().replace(/\s+/g, '_')}`}
                  className="block"
                >
                  <Card 
                    className="overflow-hidden hover:shadow-xl transition-all duration-300 ease-out hover:scale-[1.02] group will-change-transform relative bg-black border-gray-800 backdrop-blur-sm cursor-pointer"
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
                    {/* Stats Row - All 4 stats on same line */}
                    <div className="flex justify-between items-center mb-4 px-2">
                      <div className="text-center">
                        <div className="text-xs text-gray-400">Points</div>
                        <div className="font-mono text-lg font-bold text-green-400">
                          {team.championship_points || 0}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-400">Wins</div>
                        <div className="font-mono text-lg font-bold text-yellow-400">
                          {team.wins || 0}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-400">Titles</div>
                        <div className="font-mono text-lg font-bold text-blue-400">
                          {team.constructors_championships || 0}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-400">Since</div>
                        <div className="font-mono text-lg font-bold text-purple-400">
                          {team.first_appearance}
                        </div>
                      </div>
                    </div>

                    {/* Today's Summary */}
                    <div className="mt-4 pt-4 border-t border-gray-800">
                      <div className="mb-3">
                        <div className="text-xs text-gray-400 font-semibold mb-2">Today&apos;s Summary</div>
                        <div className="h-16 overflow-hidden">
                          <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">
                            {getTodaysSummary(team.team_name)}
                          </p>
                        </div>
                      </div>
                      
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
                </Link>
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