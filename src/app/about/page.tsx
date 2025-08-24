import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="relative group flex items-center justify-center mb-6">
          {/* Speed element in front of logo */}
          <div className="relative mr-2 sm:mr-4 md:mr-6 flex items-center">
            {/* Racing stripes */}
            <div className="flex items-center space-x-0.5 sm:space-x-1 group-hover:scale-110 transition-transform duration-300">
              <div className="w-1 sm:w-1.5 md:w-2 h-4 sm:h-6 md:h-8 bg-gradient-to-b from-red-300 to-red-400 skew-x-12 shadow-lg"></div>
              <div className="w-1 sm:w-1.5 md:w-2 h-4 sm:h-6 md:h-8 bg-gradient-to-b from-red-400 to-red-500 skew-x-12 shadow-lg"></div>
              <div className="w-1 sm:w-1.5 md:w-2 h-4 sm:h-6 md:h-8 bg-gradient-to-b from-red-500 to-red-600 skew-x-12 shadow-lg"></div>
              <div className="w-1 sm:w-1.5 md:w-2 h-4 sm:h-6 md:h-8 bg-gradient-to-b from-red-600 to-red-700 skew-x-12 shadow-lg"></div>
              <div className="w-1 sm:w-1.5 md:w-2 h-4 sm:h-6 md:h-8 bg-gradient-to-b from-red-700 to-red-800 skew-x-12 shadow-lg"></div>
            </div>
            
            {/* Dynamic speed lines */}
            <div className="absolute -right-2 sm:-right-3 md:-right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-6 sm:w-8 md:w-12 h-0.5 sm:h-0.5 md:h-1 bg-gradient-to-r from-red-500 to-transparent animate-pulse"></div>
              <div className="w-4 sm:w-6 md:w-8 h-0.5 sm:h-0.5 md:h-1 bg-gradient-to-r from-orange-500 to-transparent animate-pulse delay-150 mt-0.5 sm:mt-1"></div>
              <div className="w-5 sm:w-7 md:w-10 h-0.5 sm:h-0.5 md:h-1 bg-gradient-to-r from-yellow-500 to-transparent animate-pulse delay-300 mt-0.5 sm:mt-1"></div>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent logo-text transition-all duration-300 hover:scale-105 hover:tracking-wider relative z-10">
            Formula1.ai
          </h1>
            
          {/* Subtle glow effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-red-400/10 to-orange-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10"></div>
          
          {/* Speed streak effect */}
          <div className="absolute -right-2 sm:-right-3 md:-right-4 top-1/2 -translate-y-1/2 w-8 sm:w-12 md:w-16 h-0.5 sm:h-0.5 md:h-1 bg-gradient-to-r from-red-500 to-transparent opacity-0 group-hover:opacity-60 transition-all duration-300 group-hover:w-16 sm:group-hover:w-24 md:group-hover:w-32"></div>
        </div>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Formula1.ai is an AI-powered news aggregator that brings you daily insights from across the F1 universe. 
          We analyze news from major platforms and provide personalized driver insights, keeping you updated with 
          the latest developments in Formula 1.
        </p>
      </div>

      {/* AI Features Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">AI-Powered Insights</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 hover:border-red-500/50">
            <CardHeader>
              <div className="text-4xl mb-4">📰</div>
              <CardTitle className="text-xl">Daily News Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                We analyze news from major platforms including:
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• ESPN F1</li>
                <li>• Sky Sports F1</li>
                <li>• Fox Sports</li>
                <li>• F1.com</li>
                <li>• Motorsport.com</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 hover:border-red-500/50">
            <CardHeader>
              <div className="text-4xl mb-4">🤖</div>
              <CardTitle className="text-xl">AI Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Our AI processes news daily to provide:
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Personalized driver insights</li>
                <li>• Sentiment analysis</li>
                <li>• Key story summaries</li>
                <li>• Trend identification</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 hover:border-red-500/50">
            <CardHeader>
              <div className="text-4xl mb-4">🚀</div>
              <CardTitle className="text-xl">Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Next steps include:
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Social media analysis (Reddit, Twitter)</li>
                <li>• Fan sentiment tracking</li>
                <li>• Live radio communications</li>
                <li>• Real-time race insights</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <Link href="/" className="group">
          <Card className="h-full hover:shadow-lg transition-all duration-300 group-hover:scale-105 border-2 hover:border-red-500/50">
            <CardHeader>
              <div className="text-4xl mb-4">🏎️</div>
              <CardTitle className="text-2xl group-hover:text-red-500 transition-colors">
                Driver Insights
              </CardTitle>
              <CardDescription className="text-base">
                AI-curated news and insights for each F1 driver
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Daily news summaries for each driver</li>
                <li>• AI-analyzed sentiment and trends</li>
                <li>• Personalized driver profiles</li>
                <li>• Real-time performance insights</li>
              </ul>
            </CardContent>
          </Card>
        </Link>

        <Link href="/teams" className="group">
          <Card className="h-full hover:shadow-lg transition-all duration-300 group-hover:scale-105 border-2 hover:border-red-500/50">
            <CardHeader>
              <div className="text-4xl mb-4">🏁</div>
              <CardTitle className="text-2xl group-hover:text-red-500 transition-colors">
                Team Analysis
              </CardTitle>
              <CardDescription className="text-base">
                Comprehensive team data and strategic insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Team performance analytics</li>
                <li>• Strategic developments</li>
                <li>• Technical innovations</li>
                <li>• Championship standings</li>
              </ul>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Stats Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-8">Platform Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-500">21</div>
            <div className="text-sm text-muted-foreground">F1 Drivers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-500">10</div>
            <div className="text-sm text-muted-foreground">Racing Teams</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-500">5+</div>
            <div className="text-sm text-muted-foreground">News Sources</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-500">24/7</div>
            <div className="text-sm text-muted-foreground">AI Analysis</div>
          </div>
        </div>
      </div>

      {/* Technology Section */}
      <div className="mt-16 text-center">
        <h2 className="text-3xl font-bold mb-8">Powered by AI</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Our AI system runs daily analysis to keep insights fresh and relevant. 
          We process thousands of news articles to bring you the most important 
          developments in Formula 1, personalized for each driver and team.
        </p>
      </div>
    </div>
  );
} 