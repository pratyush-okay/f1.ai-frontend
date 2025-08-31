"use client";

import { useState, useEffect } from "react";
import { ApiService, F1Driver, F1Team } from "@/services/api";
import { Card } from "@/components/ui/card";

interface NewsArticle {
  title: string;
  news: string;
  source: string;
  published_at: string;
}

interface CombinedNewsArticle extends NewsArticle {
  type: 'driver' | 'team';
  entityName: string;
}

export default function AINewsPage() {
  const [allArticles, setAllArticles] = useState<CombinedNewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'drivers' | 'teams'>('all');
  const [drivers, setDrivers] = useState<F1Driver[]>([]);
  const [teams, setTeams] = useState<F1Team[]>([]);
  const [selectedDrivers, setSelectedDrivers] = useState<Set<string>>(new Set());
  const [selectedTeams, setSelectedTeams] = useState<Set<string>>(new Set());
  const [showDriverFilters, setShowDriverFilters] = useState(false);
  const [showTeamFilters, setShowTeamFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://f1ai-backend-production.up.railway.app';

  // Get team API ID mapping
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

  // Fetch news for a specific driver
  const fetchDriverNews = async (driver: F1Driver, date: string): Promise<CombinedNewsArticle[]> => {
    try {
      const driverFilename = driver.full_name.toLowerCase().replace(/\s+/g, '_') + '.json';
      const apiUrl = `${API_BASE_URL}/api/storage/f1-ai-news/${date}/${driverFilename}`;
      
      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        console.log(`📄 Driver news data for ${driver.full_name}:`, data);
        
        // Check if data has articles property and it's an array
        // The articles can be either directly in data.articles or nested in data.content.articles
        const articles = data?.articles || data?.content?.articles;
        if (articles && Array.isArray(articles)) {
          return articles.map(article => ({
            ...article,
            type: 'driver' as const,
            entityName: driver.full_name
          }));
        } else {
          console.log(`⚠️ No articles found for driver ${driver.full_name} on ${date}`);
        }
      } else {
        console.log(`❌ No news file found for driver ${driver.full_name} on ${date} (${response.status})`);
      }
    } catch (error) {
      console.error(`Error fetching news for driver ${driver.full_name}:`, error);
    }
    return [];
  };

  // Fetch news for a specific team
  const fetchTeamNews = async (team: F1Team, date: string): Promise<CombinedNewsArticle[]> => {
    try {
      const teamApiId = getTeamApiId(team.team_name);
      const teamFilename = `${teamApiId}.json`;
      const apiUrl = `${API_BASE_URL}/api/storage/f1-ai-team-news/${date}/${teamFilename}`;
      
      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        console.log(`📄 Team news data for ${team.team_name}:`, data);
        
        // Check if data has articles property and it's an array
        // The articles can be either directly in data.articles or nested in data.content.articles
        const articles = data?.articles || data?.content?.articles;
        if (articles && Array.isArray(articles)) {
          return articles.map(article => ({
            ...article,
            type: 'team' as const,
            entityName: team.team_name
          }));
        } else {
          console.log(`⚠️ No articles found for team ${team.team_name} on ${date}`);
        }
      } else {
        console.log(`❌ No news file found for team ${team.team_name} on ${date} (${response.status})`);
      }
    } catch (error) {
      console.error(`Error fetching news for team ${team.team_name}:`, error);
    }
    return [];
  };

  // Fetch all news articles
  const fetchAllNews = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get today's and yesterday's dates
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // Fetch drivers and teams data
      const [driversData, teamsData] = await Promise.all([
        ApiService.fetchDrivers(),
        ApiService.fetchTeams()
      ]);

      // Set drivers and teams for filtering
      console.log("📊 Setting drivers data:", driversData.drivers.length, "drivers");
      console.log("📊 Setting teams data:", teamsData.teams.length, "teams");
      setDrivers(driversData.drivers);
      setTeams(teamsData.teams);

      const allArticles: CombinedNewsArticle[] = [];

      // Try today's date first, then yesterday's, then a known working date
      const knownDate = '2025-08-23'; // Fallback date
      for (const date of [today, yesterday, knownDate]) {
        console.log(`🔄 Fetching news for date: ${date}`);

        // Fetch driver news
        const driverNewsPromises = driversData.drivers.map(driver => 
          fetchDriverNews(driver, date)
        );
        const driverNewsResults = await Promise.all(driverNewsPromises);
        const driverArticles = driverNewsResults.flat();

        // Fetch team news
        const teamNewsPromises = teamsData.teams.map(team => 
          fetchTeamNews(team, date)
        );
        const teamNewsResults = await Promise.all(teamNewsPromises);
        const teamArticles = teamNewsResults.flat();

        // If we found articles for this date, use them and break
        if (driverArticles.length > 0 || teamArticles.length > 0) {
          allArticles.push(...driverArticles, ...teamArticles);
          console.log(`✅ Found ${driverArticles.length} driver articles and ${teamArticles.length} team articles for ${date}`);
          break;
        }
      }

      // Sort articles by published date (newest first)
      allArticles.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());

      setAllArticles(allArticles);
      console.log(`📰 Total articles loaded: ${allArticles.length}`);
    } catch (error) {
      console.error('❌ Error fetching news:', error);
      setError('Failed to load news articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllNews();
  }, []);

  // Filter articles based on selection
  const filteredArticles = allArticles.filter(article => {
    // First filter by main category
    if (selectedFilter === 'drivers' && article.type !== 'driver') return false;
    if (selectedFilter === 'teams' && article.type !== 'team') return false;
    
    // Then filter by specific drivers/teams if any are selected
    if (selectedFilter === 'drivers' || selectedFilter === 'all') {
      if (selectedDrivers.size > 0 && !selectedDrivers.has(article.entityName)) {
        return false;
      }
    }
    
    if (selectedFilter === 'teams' || selectedFilter === 'all') {
      if (selectedTeams.size > 0 && !selectedTeams.has(article.entityName)) {
        return false;
      }
    }
    
    return true;
  });

  // Helper functions for filter management
  const toggleDriver = (driverName: string) => {
    const newSelected = new Set(selectedDrivers);
    if (newSelected.has(driverName)) {
      newSelected.delete(driverName);
    } else {
      newSelected.add(driverName);
    }
    setSelectedDrivers(newSelected);
  };

  const toggleTeam = (teamName: string) => {
    const newSelected = new Set(selectedTeams);
    if (newSelected.has(teamName)) {
      newSelected.delete(teamName);
    } else {
      newSelected.add(teamName);
    }
    setSelectedTeams(newSelected);
  };

  const selectAllDrivers = () => {
    setSelectedDrivers(new Set(drivers.map(d => d.full_name)));
  };

  const clearAllDrivers = () => {
    setSelectedDrivers(new Set());
  };

  const selectAllTeams = () => {
    setSelectedTeams(new Set(teams.map(t => t.team_name)));
  };

  const clearAllTeams = () => {
    setSelectedTeams(new Set());
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 text-white">Formula 1 AI News</h1>
            <p className="text-gray-400 text-lg">
              Loading the latest F1 news and insights...
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main content area */}
            <div className="lg:col-span-3">
              {/* Featured Article Skeleton */}
              <div className="bg-card rounded-lg border shadow-sm overflow-hidden animate-pulse mb-8">
                <div className="p-8">
                  {/* Badge and Date Skeleton */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-20 h-7 bg-gray-800/50 rounded-full"></div>
                    <div className="w-32 h-5 bg-gray-800/50 rounded"></div>
                  </div>

                  {/* Entity Name Skeleton */}
                  <div className="w-40 h-5 bg-gray-800/50 rounded mb-3"></div>

                  {/* Article Title Skeleton */}
                  <div className="space-y-3 mb-4">
                    <div className="h-8 bg-gray-800/50 rounded"></div>
                    <div className="h-8 bg-gray-800/50 rounded w-4/5"></div>
                  </div>

                  {/* Article Content Skeleton */}
                  <div className="space-y-3 mb-6">
                    <div className="h-5 bg-gray-800/50 rounded"></div>
                    <div className="h-5 bg-gray-800/50 rounded w-11/12"></div>
                    <div className="h-5 bg-gray-800/50 rounded w-10/12"></div>
                    <div className="h-5 bg-gray-800/50 rounded w-9/12"></div>
                  </div>

                  {/* Source Skeleton */}
                  <div className="flex items-center justify-between">
                    <div className="w-24 h-4 bg-gray-800/50 rounded"></div>
                  </div>
                </div>
              </div>

              {/* Regular News Cards Skeleton */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(11)].map((_, index) => {
                  const isLarge = index % 5 === 0;
                  const isMedium = index % 3 === 0;
                  
                  return (
                    <Card 
                      key={index}
                      className={`bg-card rounded-lg border shadow-sm overflow-hidden animate-pulse ${
                        isLarge ? 'md:col-span-2 lg:col-span-2' : ''
                      }`}
                    >
                      <div className={`${isLarge ? 'p-8' : isMedium ? 'p-6' : 'p-5'}`}>
                        {/* Badge and Date Skeleton */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-16 h-6 bg-gray-800/50 rounded-full"></div>
                          <div className="w-24 h-4 bg-gray-800/50 rounded"></div>
                        </div>

                        {/* Entity Name Skeleton */}
                        <div className={`bg-gray-800/50 rounded mb-2 ${
                          isLarge ? 'w-36 h-5' : 'w-32 h-4'
                        }`}></div>

                        {/* Article Title Skeleton */}
                        <div className="space-y-2 mb-3">
                          <div className={`bg-gray-800/50 rounded ${
                            isLarge ? 'h-6' : isMedium ? 'h-5' : 'h-4'
                          }`}></div>
                          <div className={`bg-gray-800/50 rounded ${
                            isLarge ? 'h-6 w-3/4' : isMedium ? 'h-5 w-3/4' : 'h-4 w-3/4'
                          }`}></div>
                        </div>

                        {/* Article Content Skeleton */}
                        <div className="space-y-2 mb-4">
                          <div className="h-4 bg-gray-800/50 rounded"></div>
                          <div className="h-4 bg-gray-800/50 rounded w-5/6"></div>
                          <div className="h-4 bg-gray-800/50 rounded w-4/5"></div>
                          <div className="h-4 bg-gray-800/50 rounded w-3/4"></div>
                        </div>

                        {/* Source Skeleton */}
                        <div className="flex items-center justify-between">
                          <div className="w-20 h-3 bg-gray-800/50 rounded"></div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
            
                         {/* Sidebar */}
             <div className="lg:col-span-1">
               <div className="space-y-6">
                 {/* News Statistics Skeleton */}
                 <div className="bg-card rounded-lg border shadow-sm p-6 animate-pulse">
                   <div className="h-6 bg-gray-800 rounded mb-4" />
                   <div className="space-y-3">
                     {[...Array(4)].map((_, i) => (
                       <div key={i} className="h-4 bg-gray-800 rounded" />
                     ))}
                   </div>
                 </div>

                 {/* Driver Filters Skeleton */}
                 <div className="bg-card rounded-lg border shadow-sm p-6 animate-pulse">
                   <div className="h-6 bg-gray-800 rounded mb-4" />
                   <div className="space-y-2">
                     {[...Array(8)].map((_, i) => (
                       <div key={i} className="h-4 bg-gray-800 rounded" />
                     ))}
                   </div>
                 </div>

                 {/* Team Filters Skeleton */}
                 <div className="bg-card rounded-lg border shadow-sm p-6 animate-pulse">
                   <div className="h-6 bg-gray-800 rounded mb-4" />
                   <div className="space-y-2">
                     {[...Array(6)].map((_, i) => (
                       <div key={i} className="h-4 bg-gray-800 rounded" />
                     ))}
                   </div>
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
            <h1 className="text-4xl font-bold mb-2 text-white">Formula 1 AI News</h1>
            <p className="text-gray-400 text-lg">
              Unable to load news articles
            </p>
          </div>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-400 mb-2">Error Loading Data</h2>
            <p className="text-gray-400 mb-4">{error}</p>
            <button 
              onClick={fetchAllNews}
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
          <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-white">Formula 1 AI News</h1>
            <p className="text-gray-400 text-lg">
                Latest news and insights from the world of Formula 1
            </p>
          </div>

            {/* Desktop Filter Controls */}
            <div className="hidden lg:flex space-x-2 bg-background/50 backdrop-blur-sm border border-border/50 rounded-lg p-1 shadow-lg">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-2 rounded-md transition-all duration-300 ${
                selectedFilter === 'all' 
                  ? 'bg-red-500 text-white shadow-lg' 
                  : 'hover:bg-red-500/10 hover:text-red-500'
              }`}
            >
              All ({allArticles.length})
            </button>
            <button
              onClick={() => setSelectedFilter('drivers')}
              className={`px-4 py-2 rounded-md transition-all duration-300 ${
                selectedFilter === 'drivers' 
                  ? 'bg-red-500 text-white shadow-lg' 
                  : 'hover:bg-red-500/10 hover:text-red-500'
              }`}
            >
              Drivers ({allArticles.filter(a => a.type === 'driver').length})
            </button>
            <button
              onClick={() => setSelectedFilter('teams')}
              className={`px-4 py-2 rounded-md transition-all duration-300 ${
                selectedFilter === 'teams' 
                  ? 'bg-red-500 text-white shadow-lg' 
                  : 'hover:bg-red-500/10 hover:text-red-500'
              }`}
            >
              Teams ({allArticles.filter(a => a.type === 'team').length})
            </button>
          </div>
        </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-red-900/20 to-red-800/20 border border-red-800/30 rounded-lg hover:from-red-900/30 hover:to-red-800/30 transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-600/20 rounded-lg flex items-center justify-center">
                  <span className="text-red-400 text-lg">🔍</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Filters</h3>
                  <p className="text-xs text-red-300">
                    {selectedFilter === 'all' ? 'All articles' : selectedFilter === 'drivers' ? 'Driver news only' : 'Team news only'}
                </p>
              </div>
                      </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${selectedFilter !== 'all' ? 'bg-red-400' : 'bg-gray-600'}`}></div>
                <svg 
                  className={`w-5 h-5 text-red-400 transition-transform duration-200 ${showMobileFilters ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* Mobile Filter Panel */}
            {showMobileFilters && (
              <div className="mt-4 space-y-4">
                {/* Category Filter */}
                <div className="bg-card rounded-lg border shadow-sm p-4">
                  <h4 className="text-sm font-semibold text-white mb-3">Category</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setSelectedFilter('all')}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        selectedFilter === 'all' 
                          ? 'bg-red-500 text-white shadow-lg' 
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      All ({allArticles.length})
                    </button>
                    <button
                      onClick={() => setSelectedFilter('drivers')}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        selectedFilter === 'drivers' 
                          ? 'bg-red-500 text-white shadow-lg' 
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      Drivers ({allArticles.filter(a => a.type === 'driver').length})
                    </button>
                    <button
                      onClick={() => setSelectedFilter('teams')}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        selectedFilter === 'teams' 
                          ? 'bg-red-500 text-white shadow-lg' 
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      Teams ({allArticles.filter(a => a.type === 'team').length})
                    </button>
                  </div>
                </div>

                {/* Driver Filters */}
                <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
                  <div 
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-900/20 to-blue-800/20 border-b border-blue-800/30 cursor-pointer hover:from-blue-900/30 hover:to-blue-800/30 transition-all duration-200"
                    onClick={() => setShowDriverFilters(!showDriverFilters)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                        <span className="text-blue-400 text-lg">🏎️</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Driver Filters</h3>
                        <p className="text-xs text-blue-300">
                          {selectedDrivers.size > 0 ? `${selectedDrivers.size} selected` : `${drivers.length} drivers available`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${selectedDrivers.size > 0 ? 'bg-blue-400' : 'bg-gray-600'}`}></div>
                      <svg 
                        className={`w-5 h-5 text-blue-400 transition-transform duration-200 ${showDriverFilters ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                  </div>
                  </div>
                  
                  {showDriverFilters && (
                    <div className="p-4 space-y-4">
                      <div className="flex gap-2">
                        <button
                          onClick={selectAllDrivers}
                          className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          Select All
                        </button>
                        <button
                          onClick={clearAllDrivers}
                          className="flex-1 px-3 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white text-sm rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          Clear All
                        </button>
                      </div>
                      
                      <div className="max-h-48 overflow-y-auto space-y-2 custom-scrollbar">
                        {drivers.length > 0 ? (
                          drivers.map((driver) => (
                            <label 
                              key={driver.driver_number} 
                              className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-blue-900/20 group ${
                                selectedDrivers.has(driver.full_name) ? 'bg-blue-900/30 border border-blue-700/50' : 'hover:border-blue-700/30 border border-transparent'
                              }`}
                            >
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  checked={selectedDrivers.has(driver.full_name)}
                                  onChange={() => toggleDriver(driver.full_name)}
                                  className="w-4 h-4 rounded border-2 border-blue-600 bg-gray-800 text-transparent focus:ring-blue-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200"
                                />
                            </div>
                              <div className="flex-1">
                                <span className={`text-sm font-medium transition-colors duration-200 ${
                                  selectedDrivers.has(driver.full_name) 
                                    ? 'text-blue-200' 
                                    : 'text-gray-300 group-hover:text-white'
                                }`}>
                                  {driver.full_name}
                              </span>
                                <div className="text-xs text-gray-500 mt-0.5">
                                  #{driver.driver_number} • {driver.team_name}
                            </div>
                          </div>
                              {selectedDrivers.has(driver.full_name) && (
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                              )}
                            </label>
                          ))
                        ) : (
                          <div className="text-center py-4">
                            <div className="w-6 h-6 bg-blue-600/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                              <span className="text-blue-400">⏳</span>
                        </div>
                            <div className="text-xs text-gray-500">Loading drivers...</div>
                  </div>
                )}
                      </div>
              </div>
            )}
          </div>

                {/* Team Filters */}
                <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
                  <div 
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-green-900/20 to-green-800/20 border-b border-green-800/30 cursor-pointer hover:from-green-900/30 hover:to-green-800/30 transition-all duration-200"
                    onClick={() => setShowTeamFilters(!showTeamFilters)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center">
                        <span className="text-green-400 text-lg">🏁</span>
                  </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Team Filters</h3>
                        <p className="text-xs text-green-300">
                          {selectedTeams.size > 0 ? `${selectedTeams.size} selected` : `${teams.length} teams available`}
                        </p>
                  </div>
                  </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${selectedTeams.size > 0 ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                      <svg 
                        className={`w-5 h-5 text-green-400 transition-transform duration-200 ${showTeamFilters ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  
                  {showTeamFilters && (
                    <div className="p-4 space-y-4">
                      <div className="flex gap-2">
                        <button
                          onClick={selectAllTeams}
                          className="flex-1 px-3 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          Select All
                        </button>
                        <button
                          onClick={clearAllTeams}
                          className="flex-1 px-3 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white text-sm rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          Clear All
                        </button>
                      </div>
                      
                      <div className="max-h-48 overflow-y-auto space-y-2 custom-scrollbar">
                        {teams.length > 0 ? (
                          teams.map((team) => (
                            <label 
                              key={team.team_id} 
                              className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-green-900/20 group ${
                                selectedTeams.has(team.team_name) ? 'bg-green-900/30 border border-green-700/50' : 'hover:border-green-700/30 border border-transparent'
                              }`}
                            >
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  checked={selectedTeams.has(team.team_name)}
                                  onChange={() => toggleTeam(team.team_name)}
                                  className="w-4 h-4 rounded border-2 border-green-600 bg-gray-800 text-transparent focus:ring-green-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200"
                                />
                              </div>
                              <div className="flex-1">
                                <span className={`text-sm font-medium transition-colors duration-200 ${
                                  selectedTeams.has(team.team_name) 
                                    ? 'text-green-200' 
                                    : 'text-gray-300 group-hover:text-white'
                                }`}>
                                  {team.team_name}
                    </span>
                                <div className="text-xs text-gray-500 mt-0.5">
                                  {team.team_nationality} • Est. {team.first_appearance}
                  </div>
                              </div>
                              {selectedTeams.has(team.team_name) && (
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                              )}
                            </label>
                          ))
                        ) : (
                          <div className="text-center py-4">
                            <div className="w-6 h-6 bg-green-600/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                              <span className="text-green-400">⏳</span>
                            </div>
                            <div className="text-xs text-gray-500">Loading teams...</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
                </div>
              </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main content area - News articles */}
          <div className="lg:col-span-3">
            {/* Articles Layout */}
            {filteredArticles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">
                  No news articles found for the selected filter.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Featured Article (First article gets special treatment) */}
                {filteredArticles.length > 0 && (
                  <div className="bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
                    <div className="p-8">
                      {/* Article Type Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          filteredArticles[0].type === 'driver' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {filteredArticles[0].type === 'driver' ? 'Driver' : 'Team'}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(filteredArticles[0].published_at)}
                        </span>
                      </div>

                      {/* Entity Name */}
                      <h3 className="text-lg font-medium text-muted-foreground mb-3">
                        {filteredArticles[0].entityName}
                      </h3>

                      {/* Article Title */}
                      <h2 className="text-3xl font-bold mb-4 text-foreground leading-tight">
                        {filteredArticles[0].title}
                      </h2>

                      {/* Article Content */}
                      <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                        {filteredArticles[0].news}
                      </p>

                      {/* Source */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Source: {filteredArticles[0].source}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Regular Articles Grid */}
                {filteredArticles.length > 1 && (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredArticles.slice(1).map((article, index) => {
                      // Create different sizes based on index for visual variety
                      const isLarge = index % 5 === 0; // Every 5th article is larger
                      const isMedium = index % 3 === 0; // Every 3rd article is medium
                      
                      return (
                        <div 
                          key={`${article.type}-${article.entityName}-${index}`}
                          className={`bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden ${
                            isLarge ? 'md:col-span-2 lg:col-span-2' : ''
                          }`}
                        >
                          <div className={`${isLarge ? 'p-8' : isMedium ? 'p-6' : 'p-5'}`}>
                            {/* Article Type Badge */}
                            <div className="flex items-center justify-between mb-3">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                article.type === 'driver' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {article.type === 'driver' ? 'Driver' : 'Team'}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(article.published_at)}
                              </span>
                            </div>

                            {/* Entity Name */}
                            <h3 className={`font-medium text-muted-foreground mb-2 ${
                              isLarge ? 'text-base' : 'text-sm'
                            }`}>
                              {article.entityName}
                            </h3>

                            {/* Article Title */}
                            <h2 className={`font-semibold mb-3 text-foreground line-clamp-2 ${
                              isLarge ? 'text-xl' : isMedium ? 'text-lg' : 'text-base'
                            }`}>
                              {article.title}
                            </h2>

                            {/* Article Content */}
                            <p className={`text-muted-foreground mb-4 line-clamp-4 ${
                              isLarge ? 'text-base' : 'text-sm'
                            }`}>
                              {article.news}
                            </p>

                            {/* Source */}
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                Source: {article.source}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar - Hidden on mobile, shown on desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto hide-scrollbar space-y-6">

              {/* Driver Filters */}
              <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
                <div 
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-900/20 to-blue-800/20 border-b border-blue-800/30 cursor-pointer hover:from-blue-900/30 hover:to-blue-800/30 transition-all duration-200"
                  onClick={() => setShowDriverFilters(!showDriverFilters)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                      <span className="text-blue-400 text-lg">🏎️</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Driver Filters</h3>
                      <p className="text-xs text-blue-300">
                        {selectedDrivers.size > 0 ? `${selectedDrivers.size} selected` : `${drivers.length} drivers available`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${selectedDrivers.size > 0 ? 'bg-blue-400' : 'bg-gray-600'}`}></div>
                    <svg 
                      className={`w-5 h-5 text-blue-400 transition-transform duration-200 ${showDriverFilters ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                {showDriverFilters && (
                  <div className="p-4 space-y-4">
                    <div className="flex gap-2">
                      <button
                        onClick={selectAllDrivers}
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        Select All
                      </button>
                      <button
                        onClick={clearAllDrivers}
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white text-sm rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        Clear All
                      </button>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto space-y-2 custom-scrollbar">
                      {drivers.length > 0 ? (
                        drivers.map((driver) => (
                          <label 
                            key={driver.driver_number} 
                            className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-blue-900/20 group ${
                              selectedDrivers.has(driver.full_name) ? 'bg-blue-900/30 border border-blue-700/50' : 'hover:border-blue-700/30 border border-transparent'
                            }`}
                          >
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={selectedDrivers.has(driver.full_name)}
                                onChange={() => toggleDriver(driver.full_name)}
                                className="w-4 h-4 rounded border-2 border-blue-600 bg-gray-800 text-transparent focus:ring-blue-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200"
                              />
                            </div>
                            <div className="flex-1">
                              <span className={`text-sm font-medium transition-colors duration-200 ${
                                selectedDrivers.has(driver.full_name) 
                                  ? 'text-blue-200' 
                                  : 'text-gray-300 group-hover:text-white'
                              }`}>
                                {driver.full_name}
                              </span>
                              <div className="text-xs text-gray-500 mt-0.5">
                                #{driver.driver_number} • {driver.team_name}
                              </div>
                            </div>
                            {selectedDrivers.has(driver.full_name) && (
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                            )}
                          </label>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                            <span className="text-blue-400">⏳</span>
                          </div>
                          <div className="text-sm text-gray-500">Loading drivers...</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Team Filters */}
              <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
                <div 
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-green-900/20 to-green-800/20 border-b border-green-800/30 cursor-pointer hover:from-green-900/30 hover:to-green-800/30 transition-all duration-200"
                  onClick={() => setShowTeamFilters(!showTeamFilters)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center">
                      <span className="text-green-400 text-lg">🏁</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Team Filters</h3>
                      <p className="text-xs text-green-300">
                        {selectedTeams.size > 0 ? `${selectedTeams.size} selected` : `${teams.length} teams available`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${selectedTeams.size > 0 ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                    <svg 
                      className={`w-5 h-5 text-green-400 transition-transform duration-200 ${showTeamFilters ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                {showTeamFilters && (
                  <div className="p-4 space-y-4">
                    <div className="flex gap-2">
                      <button
                        onClick={selectAllTeams}
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        Select All
                      </button>
                      <button
                        onClick={clearAllTeams}
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white text-sm rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        Clear All
                      </button>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto space-y-2 custom-scrollbar">
                      {teams.length > 0 ? (
                        teams.map((team) => (
                          <label 
                            key={team.team_id} 
                            className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-green-900/20 group ${
                              selectedTeams.has(team.team_name) ? 'bg-green-900/30 border border-green-700/50' : 'hover:border-green-700/30 border border-transparent'
                            }`}
                          >
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={selectedTeams.has(team.team_name)}
                                onChange={() => toggleTeam(team.team_name)}
                                className="w-4 h-4 rounded border-2 border-green-600 bg-gray-800 text-transparent focus:ring-green-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200"
                              />
                            </div>
                            <div className="flex-1">
                              <span className={`text-sm font-medium transition-colors duration-200 ${
                                selectedTeams.has(team.team_name) 
                                  ? 'text-green-200' 
                                  : 'text-gray-300 group-hover:text-white'
                              }`}>
                                {team.team_name}
                              </span>
                              <div className="text-xs text-gray-500 mt-0.5">
                                {team.team_nationality} • Est. {team.first_appearance}
                              </div>
                            </div>
                            {selectedTeams.has(team.team_name) && (
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            )}
                          </label>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <div className="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                            <span className="text-green-400">⏳</span>
                          </div>
                          <div className="text-sm text-gray-500">Loading teams...</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main content area - News articles */}
          <div className="lg:col-span-3">
            {/* Articles Layout */}
            {filteredArticles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">
                  No news articles found for the selected filter.
                </p>
        </div>
            ) : (
              <div className="space-y-8">
                {/* Featured Article (First article gets special treatment) */}
                {filteredArticles.length > 0 && (
                  <div className="bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
                    <div className="p-8">
                      {/* Article Type Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          filteredArticles[0].type === 'driver' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {filteredArticles[0].type === 'driver' ? 'Driver' : 'Team'}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(filteredArticles[0].published_at)}
                        </span>
                      </div>

                      {/* Entity Name */}
                      <h3 className="text-lg font-medium text-muted-foreground mb-3">
                        {filteredArticles[0].entityName}
                      </h3>

                      {/* Article Title */}
                      <h2 className="text-3xl font-bold mb-4 text-foreground leading-tight">
                        {filteredArticles[0].title}
                      </h2>

                      {/* Article Content */}
                      <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                        {filteredArticles[0].news}
                      </p>

                      {/* Source */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Source: {filteredArticles[0].source}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Regular Articles Grid */}
                {filteredArticles.length > 1 && (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredArticles.slice(1).map((article, index) => {
                      // Create different sizes based on index for visual variety
                      const isLarge = index % 5 === 0; // Every 5th article is larger
                      const isMedium = index % 3 === 0; // Every 3rd article is medium
                      
                      return (
                        <div 
                          key={`${article.type}-${article.entityName}-${index}`}
                          className={`bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden ${
                            isLarge ? 'md:col-span-2 lg:col-span-2' : ''
                          }`}
                        >
                          <div className={`${isLarge ? 'p-8' : isMedium ? 'p-6' : 'p-5'}`}>
                            {/* Article Type Badge */}
                            <div className="flex items-center justify-between mb-3">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                article.type === 'driver' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {article.type === 'driver' ? 'Driver' : 'Team'}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(article.published_at)}
                              </span>
                            </div>

                            {/* Entity Name */}
                            <h3 className={`font-medium text-muted-foreground mb-2 ${
                              isLarge ? 'text-base' : 'text-sm'
                            }`}>
                              {article.entityName}
                            </h3>

                            {/* Article Title */}
                            <h2 className={`font-semibold mb-3 text-foreground line-clamp-2 ${
                              isLarge ? 'text-xl' : isMedium ? 'text-lg' : 'text-base'
                            }`}>
                              {article.title}
                            </h2>

                            {/* Article Content */}
                            <p className={`text-muted-foreground mb-4 line-clamp-4 ${
                              isLarge ? 'text-base' : 'text-sm'
                            }`}>
                              {article.news}
                            </p>

                            {/* Source */}
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                Source: {article.source}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>


        </div>
      </div>
    </div>
  );
}
