"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DriverImage } from "@/components/driver-image";
import { TeamLogo } from "@/components/team-logo";
import { ApiService, type F1Driver, type DriverStandingsResponse } from "@/services/api";
import { getDriverAge } from "@/utils/driver-data";

export default function DriversPage() {
  const [drivers, setDrivers] = useState<F1Driver[]>([]);
  const [standings, setStandings] = useState<DriverStandingsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch both drivers and standings data
        const [driversData, standingsData] = await Promise.all([
          ApiService.fetchDrivers(),
          ApiService.fetchDriverStandings()
        ]);
        
        setDrivers(driversData.drivers);
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

  const getPositionColor = (position: number) => {
    if (position === 1) return 'bg-yellow-500 text-yellow-900';
    if (position === 2) return 'bg-gray-400 text-gray-900';
    if (position === 3) return 'bg-amber-600 text-amber-900';
    return 'bg-blue-600 text-white';
  };

  const getStandingRowColor = (position: number) => {
    if (position === 1) return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-500';
    if (position === 2) return 'bg-gradient-to-r from-gray-50 to-gray-100 border-l-4 border-gray-400';
    if (position === 3) return 'bg-gradient-to-r from-amber-50 to-amber-100 border-l-4 border-amber-600';
    if (position <= 10) return 'bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500';
    return 'bg-white hover:bg-gray-50 border-l-4 border-gray-200';
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        {/* Main content area */}
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Formula 1 Drivers</h1>
              <p className="text-muted-foreground text-lg">
                Loading the latest F1 driver data and championship standings...
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(15)].map((_, i) => (
                <Card key={i} className="overflow-hidden animate-pulse">
                  <div className="h-64 bg-gray-200" />
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
        </div>
        
        {/* Fixed standings sidebar */}
        <div className="w-96 bg-gradient-to-b from-slate-50 to-slate-100 border-l border-gray-200 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4" />
            <div className="space-y-3">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Formula 1 Drivers</h1>
          <p className="text-muted-foreground text-lg">
            Unable to load driver data
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
    <div className="flex h-screen">
      {/* Main content area - scrollable */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Formula 1 Drivers</h1>
            <div className="bg-red-500 text-white p-4 rounded-lg mb-4 text-center font-bold text-xl">
              🚨 NEW LAYOUT UPDATE - 3 DRIVERS PER ROW + FIXED STANDINGS SIDEBAR 🚨
            </div>
            <p className="text-muted-foreground text-lg">
              {drivers.length} drivers competing in the current F1 season • Grid view with live standings
            </p>
          </div>

          {/* Driver grid - 3 per row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drivers.map((driver) => (
              <Card 
                key={driver.driver_number} 
                className="overflow-hidden hover:shadow-xl transition-all duration-300 ease-out hover:scale-[1.02] hover:-translate-y-1 group will-change-transform relative"
                style={{ 
                  borderTopColor: `#${driver.team_colour}`, 
                  borderTopWidth: '4px',
                  boxShadow: `0 4px 12px rgba(${parseInt(driver.team_colour?.slice(0,2) || 'FF', 16)}, ${parseInt(driver.team_colour?.slice(2,4) || '1E', 16)}, ${parseInt(driver.team_colour?.slice(4,6) || '1E', 16)}, 0.15)`
                }}
              >
                {/* Championship Position Badge */}
                {driver.championship_position && (
                  <div className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-sm font-bold ${getPositionColor(driver.championship_position)} shadow-lg`}>
                    P{driver.championship_position}
                  </div>
                )}

                <DriverImage 
                  src={driver.headshot_url || driver.image}
                  alt={driver.full_name}
                  number={driver.driver_number}
                  driverName={driver.full_name}
                  teamColor={driver.team_colour}
                  countryCode={driver.country_code}
                />
                
                <CardHeader className="pb-4 transition-all duration-200 ease-out">
                  <CardTitle className="text-lg font-bold">{driver.full_name}</CardTitle>
                  <CardDescription className="text-sm">
                    {driver.name_acronym} • {driver.team_name}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Number</span>
                        <span className="font-bold text-lg">#{driver.driver_number}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Age</span>
                        <span className="font-medium">{getDriverAge(driver.full_name)} years</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Points</span>
                        <span className="font-bold text-green-600">{driver.championship_points || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Wins</span>
                        <span className="font-medium text-yellow-600">{driver.wins || 0}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4 transition-all duration-200 ease-out">
                    <div className="text-center">
                      <div className="flex items-center justify-center transition-transform duration-200 ease-out group-hover:scale-105">
                        <TeamLogo 
                          teamName={driver.team_name} 
                          size="sm" 
                          showName={true}
                          teamColor={driver.team_colour}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        {driver.first_name} {driver.last_name}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {drivers.length === 0 && !loading && !error && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No drivers data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Fixed standings sidebar */}
      <div className="w-96 bg-gradient-to-b from-slate-50 to-slate-100 border-l border-gray-200 shadow-xl">
        <div className="sticky top-0 h-screen overflow-auto">
          <div className="p-6">
            {/* Header */}
            <div className="mb-6">
              <div className="bg-green-500 text-white p-3 rounded-lg mb-4 text-center font-bold">
                ✅ FIXED STANDINGS SIDEBAR - THIS SHOULD NOT SCROLL!
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                🏆 Championship Standings
              </h2>
              <p className="text-sm text-gray-600">
                {standings?.season} Season • Live Results
              </p>
            </div>

            {/* Debug Info */}
            <div className="mb-4 p-3 bg-blue-100 rounded-lg">
              <p className="text-sm font-semibold">Debug Info:</p>
              <p className="text-xs">Loading: {loading ? 'Yes' : 'No'}</p>
              <p className="text-xs">Standings data: {standings ? 'Loaded' : 'Not loaded'}</p>
              <p className="text-xs">Drivers count: {standings?.drivers_championship?.length || 0}</p>
              <p className="text-xs">Error: {error || 'None'}</p>
            </div>

            {/* Loading state for standings */}
            {loading && (
              <div className="space-y-3">
                <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg text-center">
                  🔄 Loading standings data...
                </div>
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            )}

            {/* Error state for standings */}
            {error && (
              <div className="bg-red-100 text-red-800 p-4 rounded-lg text-center">
                <p className="font-semibold">❌ Error loading data:</p>
                <p className="text-sm mt-2">{error}</p>
                <p className="text-xs mt-2">Make sure backend is running on port 8000</p>
              </div>
            )}

            {/* Standings Table */}
            {!loading && !error && standings && (
              <div className="space-y-2">
                <div className="bg-green-100 text-green-800 p-2 rounded text-center text-sm">
                  ✅ Standings loaded successfully!
                </div>
                {standings.drivers_championship.map((standing) => (
                  <div
                    key={standing.classificationId}
                    className={`p-4 rounded-lg transition-all duration-200 hover:shadow-md ${getStandingRowColor(standing.position)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {/* Position */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getPositionColor(standing.position)}`}>
                          {standing.position}
                        </div>
                        
                        {/* Driver info */}
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">
                            {standing.driver.name} {standing.driver.surname}
                          </div>
                          <div className="text-xs text-gray-500">
                            {standing.driver.shortName} • {standing.team.teamName}
                          </div>
                        </div>
                      </div>
                      
                      {/* Stats */}
                      <div className="text-right">
                        <div className="font-bold text-green-600 text-sm">
                          {standing.points} pts
                        </div>
                        <div className="text-xs text-yellow-600">
                          {standing.wins || 0} wins
                        </div>
                      </div>
                    </div>
                    
                    {/* Points bar */}
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div 
                          className="bg-blue-500 h-1 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${Math.min((standing.points / (standings.drivers_championship[0]?.points || 1)) * 100, 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No data state */}
            {!loading && !error && !standings && (
              <div className="bg-gray-100 text-gray-700 p-4 rounded-lg text-center">
                <p className="font-semibold">⚠️ No standings data available</p>
                <p className="text-sm mt-2">Backend might not be running</p>
              </div>
            )}

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Updated in real-time via F1 API
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 