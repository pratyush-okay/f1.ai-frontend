"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ApiService, type DriverStanding } from "@/services/api";
import { TeamLogo } from "@/components/team-logo";

interface StandingsTableProps {
  maxRows?: number;
  compact?: boolean;
}

export function StandingsTable({ maxRows, compact = false }: StandingsTableProps) {
  const [standings, setStandings] = useState<DriverStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStandings() {
      try {
        const data = await ApiService.fetchDriverStandings();
        setStandings(data.drivers_championship || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch standings');
        console.error('Error fetching standings:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStandings();
  }, []);

  const displayStandings = maxRows ? standings.slice(0, maxRows) : standings;

  if (loading) {
    return (
      <Card className="p-4 space-y-3 bg-black/40 border-gray-800">
        <div className="h-6 bg-gray-800/50 rounded w-2/3 animate-pulse" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-14 bg-gray-800/50 rounded-lg animate-pulse" />
        ))}
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4 text-center bg-black/40 border-gray-800">
        <p className="text-red-400">Failed to load standings</p>
      </Card>
    );
  }

  return (
    <Card className="bg-black/40 border-gray-800 backdrop-blur-sm">
      <div className="p-4 border-b border-gray-800">
        <h3 className="font-semibold text-white text-lg flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-500/20 text-red-400">
            🏆
          </span>
          Driver Standings
        </h3>
      </div>
      <div className="divide-y divide-gray-800/50">
        {displayStandings.map((standing, index) => (
          <div
            key={standing.driverId}
            className={`group px-4 ${compact ? 'py-2' : 'py-3'} transition-colors hover:bg-gray-900/30`}
          >
            <div className="flex items-center gap-4">
              {/* Position */}
              <div className="flex-shrink-0 w-12">
                <div className={`
                  ${compact ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm'} rounded-full flex items-center justify-center font-bold
                  ${index === 0 ? 'bg-yellow-500/20 text-yellow-300 ring-1 ring-yellow-500/50' : 
                    index === 1 ? 'bg-gray-400/20 text-gray-300 ring-1 ring-gray-400/50' : 
                    index === 2 ? 'bg-amber-600/20 text-amber-300 ring-1 ring-amber-600/50' : 
                    'bg-gray-800/50 text-gray-400'}
                `}>
                  {standing.position}
                </div>
              </div>

              {/* Driver Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-semibold text-white ${compact ? 'text-sm' : ''}`}>
                    {standing.driver.name} {standing.driver.surname}
                  </span>
                  <div className="px-2 py-0.5 rounded-full bg-gray-800/50 text-gray-400 text-xs font-medium">
                    {standing.driver.shortName}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <TeamLogo 
                      teamName={standing.team.teamName} 
                      size="sm" 
                      showName={false}
                    />
                  </div>
                  {(standing.wins ?? 0) > 0 && (
                    <div className={`text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-300 font-medium flex items-center gap-1 ${compact ? 'text-[10px]' : ''}`}>
                      <span>🏆</span> {standing.wins}
                    </div>
                  )}
                </div>
              </div>

              {/* Points */}
              <div className="flex-shrink-0 text-right">
                <div className={`font-bold font-mono text-white ${compact ? 'text-base' : 'text-lg'}`}>
                  {standing.points}
                </div>
                <div className={`text-gray-400 font-medium ${compact ? 'text-[10px]' : 'text-xs'}`}>
                  PTS
                </div>
              </div>
            </div>

            {/* Progress bar indicating points relative to leader */}
            <div className={`${compact ? 'mt-1.5' : 'mt-2'} h-1 w-full bg-gray-800/30 rounded-full overflow-hidden`}>
              <div 
                className={`h-full rounded-full transition-all duration-300 ease-out
                  ${index === 0 ? 'bg-yellow-500/50' : 
                    index === 1 ? 'bg-gray-400/50' : 
                    index === 2 ? 'bg-amber-600/50' : 
                    'bg-red-500/50'}`}
                style={{ 
                  width: `${(standing.points / displayStandings[0].points) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
} 