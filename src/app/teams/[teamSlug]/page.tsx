"use client";

import { useState, useEffect, use } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamLogo } from "@/components/team-logo";
import { TeamImage } from "@/components/team-image";
import { ApiService, type F1Team, type EnrichedF1Team, type ConstructorStanding, type F1Driver } from "@/services/api";
import { getSourceLogo, getSourceDisplayName } from "@/utils/source-logos";
import { teams } from "@/data/f1-data";
import Link from "next/link";
import Image from "next/image";

// Replace the hardcoded localhost with environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://f1ai-backend-production.up.railway.app';

interface TeamPageProps {
  params: Promise<{
    teamSlug: string;
  }>;
}

interface NewsArticle {
  title: string;
  news: string;
  source: string;
  published_at: string;
}

interface TeamNews {
  articles: NewsArticle[];
  total_summary: string;
}

export default function TeamPage({ params }: TeamPageProps) {
  const unwrappedParams = use(params) as { teamSlug: string };
  const [team, setTeam] = useState<EnrichedF1Team | null>(null);
  const [teamDrivers, setTeamDrivers] = useState<F1Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newsData, setNewsData] = useState<TeamNews | null>(null);

  // Mock news data - in real app, this would come from an API
  const getMockNews = (teamName: string): TeamNews => {
    return {
      articles: [
        {
          title: `${teamName} reveals major technical upgrades for upcoming race`,
          news: `${teamName} has announced significant technical developments ahead of the next Grand Prix. The team's engineering department has been working tirelessly on aerodynamic improvements and engine optimization. Team principal expressed confidence that these upgrades will provide a substantial performance boost.`,
          source: "ESPN F1",
          published_at: "2025-01-15T10:30:00.000Z"
        },
        {
          title: `${teamName} drivers show promising pace in latest testing session`,
          news: `Both ${teamName} drivers demonstrated impressive lap times during the recent testing session. The team's technical director praised the drivers' feedback and consistency, noting that the car's development is progressing well according to plan.`,
          source: "Sky Sports F1",
          published_at: "2025-01-14T15:45:00.000Z"
        },
        {
          title: `${teamName} announces new partnership deal`,
          news: `${teamName} has secured a major new partnership that will provide additional resources for car development. The deal is expected to strengthen the team's position in the championship and support their long-term ambitions in Formula 1.`,
          source: "Fox Sports",
          published_at: "2025-01-13T09:20:00.000Z"
        },
        {
          title: `Fans excited about ${teamName}'s championship prospects`,
          news: `Social media has been buzzing with excitement about ${teamName}'s potential this season. Fans are particularly impressed with the team's strategic approach and the strong relationship between the drivers and engineering staff.`,
          source: "F1.com",
          published_at: "2025-01-12T14:15:00.000Z"
        },
        {
          title: `${teamName} discusses future development plans`,
          news: `${teamName} has outlined their development strategy for the remainder of the season. The team is focusing on continuous improvement and believes they have the right structure in place to challenge for podium positions consistently.`,
          source: "Motorsport.com",
          published_at: "2025-01-11T11:30:00.000Z"
        }
      ],
      total_summary: `${teamName} is currently showing strong form with promising technical developments and driver performance. The team's engineering department has been working on significant upgrades that are expected to provide a substantial performance boost. Both drivers are demonstrating impressive pace and consistency, with the team's strategic approach and strong partnerships positioning them well for championship success. Fans and media alike are taking notice of the team's potential this season.`
    };
  };

  // Source Logo Component
  const SourceLogo = ({ source }: { source: string }) => {
    const logoPath = getSourceLogo(source);
    const displayName = getSourceDisplayName(source);
    const isSkySports = source.toLowerCase().includes('sky');
    
    return (
      <div className="flex items-center gap-5">
        <div className={`relative w-24 h-24 ${isSkySports ? 'p-2' : ''}`}>
          <Image
            src={logoPath}
            alt={displayName}
            fill
            className={`object-contain ${isSkySports ? 'scale-120' : ''}`}
            sizes="96px"
            onError={(e) => {
              // Fallback to text if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `<span class="text-sm text-gray-400 font-bold flex items-center justify-center h-full">${displayName}</span>`;
              }
            }}
          />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-white">{displayName}</span>
        </div>
      </div>
    );
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

  useEffect(() => {
    async function fetchTeamData() {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all teams, standings, and drivers data
        const [teamsData, standingsData, driversData] = await Promise.all([
          ApiService.fetchTeams(),
          ApiService.fetchConstructorStandings(),
          ApiService.fetchDrivers()
        ]);

        // Find the team matching the slug
        const foundTeam = teamsData.teams.find((t: F1Team) => 
          t.team_name.toLowerCase().replace(/\s+/g, '_') === unwrappedParams.teamSlug.toLowerCase()
        );
        
        if (!foundTeam) {
          throw new Error(`Team not found: ${unwrappedParams.teamSlug}`);
        }

        // Get team standings
        const standing = standingsData.standings.find((s: ConstructorStanding) => s.team_id === foundTeam.team_id);
        const staticTeam = teams.find(t => 
          t.name.toLowerCase().includes(foundTeam.team_name.toLowerCase()) ||
          foundTeam.team_name.toLowerCase().includes(t.name.toLowerCase())
        );

        // Create enriched team data
        const enrichedTeam: EnrichedF1Team = {
          ...foundTeam,
          championship_position: standing?.position,
          championship_points: standing?.points,
          wins: standing?.wins,
          team_colour: staticTeam?.color.replace('#', ''),
          base: getTeamBase(foundTeam.team_name, foundTeam.team_nationality)
        };
        
        console.log("✅ Team data found:", enrichedTeam.team_name);
        setTeam(enrichedTeam);

        // Get team drivers
        const teamDrivers = driversData.drivers.filter((driver: F1Driver) => 
          driver.team_name === foundTeam.team_name
        );
        setTeamDrivers(teamDrivers);

        // Fetch real news data for the team
        try {
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

          const teamApiId = getTeamApiId(foundTeam.team_name);
          const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
          const teamFilename = `${teamApiId}.json`;
          
          // Try today's date first
          let apiUrl = `${API_BASE_URL}/api/storage/f1-ai-team-news/${today}/${teamFilename}`;
          console.log("🔄 Fetching team news data from:", apiUrl);
          
          let response = await fetch(apiUrl);
          
          // If today's file doesn't exist, try yesterday's date
          if (!response.ok) {
            const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            apiUrl = `${API_BASE_URL}/api/storage/f1-ai-team-news/${yesterday}/${teamFilename}`;
            console.log("🔄 Trying yesterday's date:", apiUrl);
            response = await fetch(apiUrl);
          }
          
          // If still not found, try a known working date
          if (!response.ok) {
            const knownDate = '2025-08-27'; // Use the date from your example
            apiUrl = `${API_BASE_URL}/api/storage/f1-ai-team-news/${knownDate}/${teamFilename}`;
            console.log("🔄 Trying known working date:", apiUrl);
            response = await fetch(apiUrl);
          }
          
          if (response.ok) {
            const apiResponse = await response.json();
            console.log("📰 Team News API Response:", apiResponse);
            
            if (apiResponse.content && apiResponse.content.articles) {
              console.log("✅ Team news articles found:", apiResponse.content.articles.length);
              console.log("📝 Summary:", apiResponse.content.total_summary);
              
              // Store the real news data
              setNewsData(apiResponse.content);
            } else {
              console.log("⚠️ No team news content found in response");
              // Use mock data as fallback
              setNewsData(getMockNews(foundTeam.team_name));
            }
          } else {
            console.log("❌ No team news file found for any date");
            // Use mock data as fallback
            setNewsData(getMockNews(foundTeam.team_name));
          }
          
        } catch (newsError) {
          console.error("❌ Error fetching team news data:", newsError);
          console.log("📰 Using mock team news data instead");
          setNewsData(getMockNews(foundTeam.team_name));
        }
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch team data';
        console.error("❌ Error fetching team data:", err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchTeamData();
  }, [unwrappedParams.teamSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="h-8 bg-gray-800 rounded mb-2 animate-pulse" />
            <div className="h-4 bg-gray-800 rounded w-1/2 animate-pulse" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="animate-pulse">
                <div className="h-96 bg-gray-800 rounded-lg mb-6" />
                <div className="space-y-4">
                  <div className="h-6 bg-gray-800 rounded" />
                  <div className="h-4 bg-gray-800 rounded w-3/4" />
                  <div className="h-4 bg-gray-800 rounded w-1/2" />
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="animate-pulse">
                <div className="h-64 bg-gray-800 rounded-lg mb-6" />
                <div className="space-y-3">
                  {[...Array(6)].map((_, i) => (
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

  if (error || !team) {
    return (
      <div className="min-h-screen bg-black py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
          </div>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-400 mb-2">Team Not Found</h2>
            <p className="text-gray-400 mb-4">{error || 'The requested team could not be found.'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/teams" className="text-blue-400 hover:text-blue-300 mb-4 inline-block transition-colors">
            ← Back to Teams
          </Link>
          <h1 className="text-4xl font-bold mb-2 text-white">{team.team_name}</h1>
          <p className="text-gray-400 text-lg">
            {team.base} • Championship Position: {team.championship_position || 'N/A'}
          </p>
        </div>

        {/* Summary Section */}
        <div className="mb-8">
          <Card className="bg-black border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <span className="text-blue-400">🏎️</span>
                Latest News Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 leading-relaxed">
                {newsData?.total_summary || getMockNews(team.team_name).total_summary}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main content area - News Articles */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {(newsData?.articles || getMockNews(team.team_name).articles).map((article, index) => (
                <Card key={index} className="bg-black border-gray-800 backdrop-blur-sm hover:border-gray-700 transition-colors">
                  <CardHeader>
                    <div className="space-y-4">
                      {/* Source and Date Row */}
                      <div className="flex justify-between items-center">
                        <SourceLogo source={article.source} />
                        <div className="text-right">
                          <span className="text-xl font-bold text-blue-400">
                            {new Date(article.published_at).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                      
                      {/* Article Title */}
                      <CardTitle className="text-xl text-white leading-tight">
                        {article.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 leading-relaxed">
                      {article.news}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar - Team Information */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Team Image Card */}
              <Card className="bg-black border-gray-800 overflow-hidden">
                <div className="relative">
                  <TeamImage 
                    teamName={team.team_name}
                    teamColor={getTeamColor(team.team_name)}
                    position={team.championship_position}
                    drivers={teamDrivers.map(d => d.full_name)}
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white">{team.team_name}</CardTitle>
                  <CardDescription className="text-sm text-gray-400">
                    {team.base}
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Quick Stats */}
              <Card className="bg-black border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Season Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Championship Position</span>
                    <span className="font-bold text-lg text-white">{team.championship_position || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Points</span>
                    <span className="font-bold text-green-400">{team.championship_points || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Wins</span>
                    <span className="font-bold text-yellow-400">{team.wins || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Constructor Titles</span>
                    <span className="font-bold text-blue-400">{team.constructors_championships || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">First Entry</span>
                    <span className="font-bold text-purple-400">{team.first_appearance}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Team Logo */}
              <Card className="bg-black border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Team Logo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <TeamLogo 
                      teamName={team.team_name} 
                      size="lg" 
                      showName={true}
                      teamColor={getTeamColor(team.team_name)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Team Drivers */}
              <Card className="bg-black border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Team Drivers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {teamDrivers.map((driver, index) => (
                    <div key={driver.id || `driver-${index}`} className="flex items-center justify-between p-2 bg-gray-900 rounded">
                      <div>
                        <div className="font-semibold text-white">{driver.full_name}</div>
                        <div className="text-sm text-gray-400">#{driver.driver_number}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-400">P{driver.championship_position || 'N/A'}</div>
                        <div className="text-xs text-green-400">{driver.championship_points || 0} pts</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Team Information */}
              <Card className="bg-black border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Team Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-400">Nationality</div>
                    <div className="font-semibold text-white">{team.team_nationality}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Base</div>
                    <div className="font-semibold text-white">{team.base}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Team ID</div>
                    <div className="font-semibold text-white">{team.team_id}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
