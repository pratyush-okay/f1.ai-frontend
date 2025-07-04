import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent logo-text">
          Formula1.ai
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Explore the world of Formula 1 with real-time data from OpenF1 API, featuring live driver profiles, 
          team information, and comprehensive F1 statistics.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <Link href="/drivers" className="group">
          <Card className="h-full hover:shadow-lg transition-all duration-300 group-hover:scale-105 border-2 hover:border-red-500/50">
            <CardHeader>
              <div className="text-4xl mb-4">🏎️</div>
              <CardTitle className="text-2xl group-hover:text-red-500 transition-colors">
                Drivers
              </CardTitle>
              <CardDescription className="text-base">
                Meet the elite racers competing at the highest level of motorsport
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Live driver data from OpenF1 API</li>
                <li>• Professional driver headshots with country flags</li>
                <li>• Epic hover effects with shining numbers</li>
                <li>• Driver ages and team information</li>
              </ul>
            </CardContent>
          </Card>
        </Link>

        <Link href="/teams" className="group">
          <Card className="h-full hover:shadow-lg transition-all duration-300 group-hover:scale-105 border-2 hover:border-red-500/50">
            <CardHeader>
              <div className="text-4xl mb-4">🏁</div>
              <CardTitle className="text-2xl group-hover:text-red-500 transition-colors">
                Teams
              </CardTitle>
              <CardDescription className="text-base">
                Discover all 10 constructors and their racing heritage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Team headquarters and leadership</li>
                <li>• Technical specifications and chassis</li>
                <li>• Championship history and achievements</li>
                <li>• Current driver lineups</li>
              </ul>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Stats Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-8">2024 Season Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-500">20</div>
            <div className="text-sm text-muted-foreground">F1 Drivers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-500">10</div>
            <div className="text-sm text-muted-foreground">Racing Teams</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-500">24</div>
            <div className="text-sm text-muted-foreground">Race Weekends</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-500">∞</div>
            <div className="text-sm text-muted-foreground">AI Insights</div>
          </div>
        </div>
      </div>
    </div>
  );
} 