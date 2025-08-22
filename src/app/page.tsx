"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DriverImage } from "@/components/driver-image";
import { TeamLogo } from "@/components/team-logo";
import { StandingsTable } from "@/components/standings-table";
import { ApiService, type F1Driver } from "@/services/api";
import { getDriverAge } from "@/utils/driver-data";

export default function Home() {
  const [drivers, setDrivers] = useState<F1Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log("🔄 Starting to fetch drivers data...");
        setLoading(true);
        setError(null);
        
        // Test API connection first
        console.log("🧪 Testing API connection...");
        const testResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://f1-ai-backend.railway.internal'}/api/drivers`);
        console.log("✅ API test response:", testResponse.status, testResponse.statusText);
        
        if (!testResponse.ok) {
          throw new Error(`API test failed: ${testResponse.status} ${testResponse.statusText}`);
        }
        
        // Fetch drivers data
        console.log("📊 Fetching drivers data...");
        const driversData = await ApiService.fetchDrivers();
        console.log("✅ Drivers data received:", driversData.drivers.length, "drivers");
        setDrivers(driversData.drivers);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
        console.error("❌ Error fetching data:", err);
        setError(errorMessage);
      } finally {
        console.log("🏁 Loading finished");
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 text-white">Formula 1 Drivers</h1>
            <p className="text-gray-400 text-lg">
              Loading the latest F1 driver data and championship standings...
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main content area */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(15)].map((_, i) => (
                  <Card key={i} className="overflow-hidden animate-pulse bg-gray-900 border-gray-800">
                    <div className="h-64 bg-gray-800" />
                    <CardHeader>
                      <div className="h-6 bg-gray-800 rounded mb-2" />
                      <div className="h-4 bg-gray-800 rounded w-3/4" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-800 rounded" />
                        <div className="h-4 bg-gray-800 rounded w-2/3" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* Standings sidebar */}
            <div className="lg:col-span-1">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-800 rounded mb-6" />
                <div className="space-y-3">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-800 rounded-lg" />
                  ))}
                </div>
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
            <h1 className="text-4xl font-bold mb-2 text-white">Formula 1 Drivers</h1>
            <p className="text-gray-400 text-lg">
              Unable to load driver data
            </p>
          </div>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-400 mb-2">Error Loading Data</h2>
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
          <h1 className="text-4xl font-bold mb-2 text-white">Formula 1 Drivers</h1>
          <p className="text-gray-400 text-lg">
            {drivers.length} drivers competing in the current F1 season
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main content area - Driver cards */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drivers.map((driver) => (
                <Card 
                  key={driver.driver_number} 
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 ease-out hover:scale-[1.02] group will-change-transform relative bg-black border-gray-800 backdrop-blur-sm"
                >
                  <DriverImage 
                    src={driver.headshot_url || driver.image}
                    alt={driver.full_name}
                    number={driver.driver_number}
                    driverName={driver.full_name}
                    teamColor={driver.team_colour}
                    countryCode={driver.country_code}
                    position={driver.championship_position}
                  />
                  
                  <CardHeader className="pb-2 text-center">
                    <CardTitle className="text-lg font-bold text-white group-hover:text-red-500 transition-colors">
                      {driver.full_name}
                    </CardTitle>
                    <CardDescription className="text-gray-400 text-sm flex items-center justify-center gap-2">
                      <span className="font-mono">{driver.name_acronym}</span>
                      <span className="text-gray-600">•</span>
                      <span>{driver.team_name}</span>
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-1 text-center">
                        <div className="text-xs text-gray-400">Number</div>
                        <div className="font-mono text-xl font-bold text-white">
                          #{driver.full_name === "Max Verstappen" ? 1 : driver.driver_number}
                        </div>
                      </div>
                      <div className="space-y-1 text-center">
                        <div className="text-xs text-gray-400">Age</div>
                        <div className="font-mono text-xl font-bold text-white">{getDriverAge(driver.full_name)}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1 text-center">
                        <div className="text-xs text-gray-400">Points</div>
                        <div className="font-mono text-xl font-bold text-green-400">{driver.championship_points || 0}</div>
                      </div>
                      <div className="space-y-1 text-center">
                        <div className="text-xs text-gray-400">Wins</div>
                        <div className="font-mono text-xl font-bold text-yellow-400">{driver.wins || 0}</div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-800">
                      <div className="flex items-center justify-center">
                        <TeamLogo 
                          teamName={driver.team_name} 
                          size="sm" 
                          showName={true}
                          teamColor={driver.team_colour}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {drivers.length === 0 && !loading && !error && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No drivers data available</p>
              </div>
            )}
          </div>

          {/* Standings sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto hide-scrollbar">
              <StandingsTable compact={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
