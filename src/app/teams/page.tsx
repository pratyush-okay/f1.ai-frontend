"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamLogo } from "@/components/team-logo";
import { ApiService, type F1Team, type ConstructorStandingsResponse } from "@/services/api";

export default function TeamsPage() {
  const [teams, setTeams] = useState<F1Team[]>([]);
  const [standings, setStandings] = useState<ConstructorStandingsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch both teams and constructor standings data
        const [teamsData, standingsData] = await Promise.all([
          ApiService.fetchTeams(),
          ApiService.fetchConstructorStandings()
        ]);
        
        setTeams(teamsData.teams);
        setStandings(standingsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const getTeamStanding = (teamId: string) => {
    return standings?.standings.find(s => s.team_id === teamId);
  };

  const getPositionColor = (position: number) => {
    if (position === 1) return 'bg-yellow-500 text-yellow-900';
    if (position === 2) return 'bg-gray-400 text-gray-900';
    if (position === 3) return 'bg-amber-600 text-amber-900';
    return 'bg-blue-600 text-white';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Formula 1 Teams</h1>
          <p className="text-muted-foreground text-lg">
            Loading the latest F1 team data and constructor standings...
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(10)].map((_, i) => (
            <Card key={i} className="overflow-hidden animate-pulse">
              <div className="h-3 bg-gray-200 w-full" />
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Formula 1 Teams</h1>
          <p className="text-muted-foreground text-lg">
            Unable to load team data
          </p>
        </div>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Data</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Formula 1 Teams</h1>
        <p className="text-muted-foreground text-lg">
          All 10 constructors competing in the 2025 Formula 1 World Championship • Live standings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {teams.map((team) => {
          const standing = getTeamStanding(team.team_id);
          return (
          <Card key={team.team_id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 relative">
            {/* Championship Position Badge */}
            {standing?.position && (
              <div className={`absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-sm font-bold ${getPositionColor(standing.position)} shadow-lg`}>
                P{standing.position}
              </div>
            )}

            <div 
              className="h-3 w-full bg-gradient-to-r from-blue-500 to-red-500"
            />
            
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3 mb-2">
                <TeamLogo 
                  teamName={team.team_name} 
                  size="md" 
                  showName={false}
                />
                <CardTitle className="text-lg font-bold">{team.team_name}</CardTitle>
              </div>
              <CardDescription className="text-sm">
                {team.team_nationality}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">First Entry</span>
                  <span className="font-medium">{team.first_appearance}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Current Points</span>
                  <span className="font-bold text-green-600">{standing?.points || 0}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Current Wins</span>
                  <span className="font-medium text-yellow-600">{standing?.wins || 0}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-primary">{team.constructors_championships || 0}</div>
                    <div className="text-xs text-muted-foreground">Constructor Titles</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-primary">{team.drivers_championships || 0}</div>
                    <div className="text-xs text-muted-foreground">Driver Titles</div>
                  </div>
                </div>
              </div>

              {team.url && (
                <div className="border-t pt-4">
                  <a 
                    href={team.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    Learn more →
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
          );
        })}
      </div>

      {teams.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No teams data available</p>
        </div>
      )}
    </div>
  );
} 