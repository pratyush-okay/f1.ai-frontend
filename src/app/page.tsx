"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DriverImage } from "@/components/driver-image";
import { TeamLogo } from "@/components/team-logo";
import { ApiService, type F1Driver } from "@/services/api";
import { getDriverAge } from "@/utils/driver-data";

export default function Home() {
  const [drivers, setDrivers] = useState<F1Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDrivers() {
      try {
        setLoading(true);
        setError(null);
        const data = await ApiService.fetchDrivers();
        setDrivers(data.drivers);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch drivers');
        console.error('Error fetching drivers:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDrivers();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Formula 1 Drivers</h1>
          <p className="text-muted-foreground text-lg">
            Loading the latest F1 driver data from OpenF1 API...
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(20)].map((_, i) => (
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Formula 1 Drivers</h1>
        <p className="text-muted-foreground text-lg">
          {drivers.length} drivers competing in the current F1 season (Live data from OpenF1)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {drivers.map((driver) => (
          <Card 
            key={driver.driver_number} 
            className="overflow-hidden hover:shadow-xl transition-all duration-300 ease-out hover:scale-[1.02] hover:-translate-y-1 group will-change-transform"
            style={{ 
              borderTopColor: `#${driver.team_colour}`, 
              borderTopWidth: '4px',
              boxShadow: `0 4px 12px rgba(${parseInt(driver.team_colour?.slice(0,2) || 'FF', 16)}, ${parseInt(driver.team_colour?.slice(2,4) || '1E', 16)}, ${parseInt(driver.team_colour?.slice(4,6) || '1E', 16)}, 0.15)`
            }}
          >
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
                    <span className="text-muted-foreground">Team Color</span>
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: `#${driver.team_colour}` }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Broadcast</span>
                    <span className="font-medium text-xs">{driver.broadcast_name}</span>
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
  );
}
