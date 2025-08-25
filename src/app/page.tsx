"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DriverImage } from "@/components/driver-image";
import { TeamLogo } from "@/components/team-logo";
import { StandingsTable } from "@/components/standings-table";
import { ApiService, type F1Driver } from "@/services/api";
import { getDriverAge } from "@/utils/driver-data";
import Link from "next/link";

interface NewsArticle {
  title: string;
  news: string;
  source: string;
  published_at: string;
}

interface DriverNews {
  articles: NewsArticle[];
  total_summary: string;
}

export default function Home() {
  const [drivers, setDrivers] = useState<F1Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [driverSummaries, setDriverSummaries] = useState<Record<string, string>>({});

  // Mock news data - in real app, this would come from an API
  const getMockNews = (driverName: string): DriverNews => {
    return {
      articles: [
        {
          title: `${driverName} expresses determination ahead of upcoming race`,
          news: `${driverName} has been showing exceptional form in recent sessions, with team principal praising the driver's commitment and technical feedback. The upcoming race weekend presents an opportunity to build on recent momentum.`,
          source: "ESPN F1",
          published_at: "2025-01-15T10:30:00.000Z"
        },
        {
          title: `Team principal confident in ${driverName}'s championship potential`,
          news: `Following recent performance improvements, the team principal has expressed full confidence in ${driverName}'s ability to challenge for the championship. Technical upgrades planned for the next race should provide additional performance gains.`,
          source: "Sky Sports F1",
          published_at: "2025-01-14T15:45:00.000Z"
        },
        {
          title: `${driverName} sets impressive lap times in testing`,
          news: `${driverName} demonstrated exceptional pace during the latest testing session, setting lap times that have caught the attention of rival teams. The driver's consistency and technical understanding continue to impress.`,
          source: "Fox Sports",
          published_at: "2025-01-13T09:20:00.000Z"
        },
        {
          title: `Fans excited about ${driverName}'s season prospects`,
          news: `Social media has been buzzing with excitement about ${driverName}'s potential this season. Fans are particularly impressed with the driver's work ethic and determination to succeed.`,
          source: "F1.com",
          published_at: "2025-01-12T14:15:00.000Z"
        },
        {
          title: `${driverName} discusses technical developments with engineers`,
          news: `${driverName} spent extra time with the engineering team discussing potential technical developments. The driver's input has been invaluable in developing the car's performance characteristics.`,
          source: "Motorsport.com",
          published_at: "2025-01-11T11:30:00.000Z"
        }
      ],
      total_summary: `${driverName} is currently in excellent form, showing strong performance in recent sessions and demonstrating exceptional technical understanding. The team is confident in the driver's championship potential, with fans and media alike taking notice of the impressive pace and consistency. Technical developments are being implemented based on the driver's valuable feedback, setting up what could be a very successful season.`
    };
  };

  // Helper function to get summary for a specific driver
  const getDriverSummary = (driverName: string): string => {
    const driverKey = driverName.toLowerCase().replace(/\s+/g, '_') + '_total_summary';
    return driverSummaries[driverKey] || getMockNews(driverName).total_summary;
  };

  useEffect(() => {
    async function fetchData() {
      try {
        console.log("🔄 Starting to fetch drivers data...");
        setLoading(true);
        setError(null);
      
        
        // Fetch drivers data
        console.log("📊 Fetching drivers data...");
        const driversData = await ApiService.fetchDrivers();
        console.log("✅ Drivers data received:", driversData.drivers.length, "drivers");
        setDrivers(driversData.drivers);

        // Fetch today's summaries for all drivers
        try {
          const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
          const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://f1ai-backend-production.up.railway.app';
          const summariesUrl = `${API_BASE_URL}/api/storage/f1-ai-news/${today}/summaries`;
          
          console.log("🔄 Fetching driver summaries from:", summariesUrl);
          
          let response = await fetch(summariesUrl);
          
          // If today's summaries don't exist, try yesterday's
          if (!response.ok) {
            const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            const yesterdayUrl = `${API_BASE_URL}/api/storage/f1-ai-news/${yesterday}/summaries`;
            console.log("🔄 Trying yesterday's summaries:", yesterdayUrl);
            response = await fetch(yesterdayUrl);
          }
          
          // If still not found, try a known working date
          if (!response.ok) {
            const knownDate = '2025-08-23';
            const knownUrl = `${API_BASE_URL}/api/storage/f1-ai-news/${knownDate}/summaries`;
            console.log("🔄 Trying known working date:", knownUrl);
            response = await fetch(knownUrl);
          }
          
          if (response.ok) {
            const summariesData = await response.json();
            console.log("📰 Summaries API Response:", summariesData);
            
            if (summariesData.summaries) {
              console.log("✅ Driver summaries found:", Object.keys(summariesData.summaries).length);
              setDriverSummaries(summariesData.summaries);
            } else {
              console.log("⚠️ No summaries found in response");
            }
          } else {
            console.log("❌ No summaries file found for any date");
          }
          
        } catch (summariesError) {
          console.error("❌ Error fetching summaries:", summariesError);
          console.log("📰 Using mock summaries instead");
        }
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
              {drivers.map((driver) => {
                const driverSlug = driver.full_name.toLowerCase().replace(/\s+/g, '_');
                return (
                  <Link 
                    key={driver.driver_number} 
                    href={`/drivers/${driverSlug}`}
                    className="block no-underline"
                  >
                    <Card 
                      className="overflow-hidden hover:shadow-xl transition-all duration-300 ease-out hover:scale-[1.02] group will-change-transform relative bg-black border-gray-800 backdrop-blur-sm cursor-pointer"
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
                    {/* Stats in one line */}
                    <div className="flex justify-between items-center mb-4 px-2">
                      <div className="text-center">
                        <div className="text-xs text-gray-400">Number</div>
                        <div className="font-mono text-lg font-bold text-white">
                          #{driver.full_name === "Max Verstappen" ? 1 : driver.driver_number}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-400">Age</div>
                        <div className="font-mono text-lg font-bold text-white">{getDriverAge(driver.full_name)}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-400">Points</div>
                        <div className="font-mono text-lg font-bold text-green-400">{driver.championship_points || 0}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-400">Wins</div>
                        <div className="font-mono text-lg font-bold text-yellow-400">{driver.wins || 0}</div>
                      </div>
                    </div>

                    {/* Today's Summary */}
                    <div className="mb-4">
                      <div className="text-xs text-gray-400 mb-2 font-medium">Today&apos;s Summary</div>
                      <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">
                        {getDriverSummary(driver.full_name)}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-800">
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
                  </Link>
                );
              })}
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

