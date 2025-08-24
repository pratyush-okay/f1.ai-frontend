"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleTabChange = (value: string) => {
    if (value === "formula1") {
      router.push("/about");
    } else if (value === "teams") {
      router.push("/teams");
    } else if (value === "drivers") {
      router.push("/");
    }
    setIsMenuOpen(false); // Close menu after navigation
  };

  const getCurrentTab = () => {
    if (pathname === "/about") return "formula1";
    if (pathname === "/teams") return "teams";
    return "drivers"; // Home page (/) is now drivers, so default to drivers
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="relative border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 overflow-hidden">
      {/* Diagonal speed stripes background */}
      <div className="absolute inset-0 opacity-25">
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Large diagonal stripes */}
          <div className="absolute -top-2 -left-20 w-40 h-20 bg-gradient-to-r from-red-500/40 to-transparent rotate-12"></div>
          <div className="absolute -top-2 -left-10 w-32 h-20 bg-gradient-to-r from-red-600/30 to-transparent rotate-12"></div>
          <div className="absolute -top-2 left-0 w-24 h-20 bg-gradient-to-r from-red-700/20 to-transparent rotate-12"></div>
          
          {/* Right side diagonal elements */}
          <div className="absolute top-0 right-0 w-60 h-full bg-gradient-to-l from-red-500/15 to-transparent -skew-x-12"></div>
          <div className="absolute top-0 right-20 w-40 h-full bg-gradient-to-l from-red-600/10 to-transparent -skew-x-12"></div>
        </div>
      </div>

      {/* Speed lines background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-2 left-20 w-32 h-0.5 bg-gradient-to-r from-red-500 to-transparent skew-y-1 animate-pulse"></div>
          <div className="absolute top-4 left-40 w-24 h-0.5 bg-gradient-to-r from-orange-500 to-transparent skew-y-1 animate-pulse delay-300"></div>
          <div className="absolute bottom-2 left-60 w-20 h-0.5 bg-gradient-to-r from-red-600 to-transparent skew-y-1 animate-pulse delay-700"></div>
        </div>
      </div>

      {/* Racing stripe accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 opacity-20"></div>

      <div className="container mx-auto px-4 py-4 relative">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="relative group flex items-center">
            {/* Speed element in front of logo */}
            <div className="relative mr-3 flex items-center">
              {/* Racing stripes */}
              <div className="flex items-center space-x-0.5 group-hover:scale-110 transition-transform duration-300">
                <div className="w-1 h-5 bg-gradient-to-b from-red-300 to-red-400 skew-x-12 shadow-lg"></div>
                <div className="w-1 h-5 bg-gradient-to-b from-red-400 to-red-500 skew-x-12 shadow-lg"></div>
                <div className="w-1 h-5 bg-gradient-to-b from-red-500 to-red-600 skew-x-12 shadow-lg"></div>
                <div className="w-1 h-5 bg-gradient-to-b from-red-600 to-red-700 skew-x-12 shadow-lg"></div>
                <div className="w-1 h-5 bg-gradient-to-b from-red-700 to-red-800 skew-x-12 shadow-lg"></div>
              </div>
              
              {/* Dynamic speed lines */}
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-6 h-0.5 bg-gradient-to-r from-red-500 to-transparent animate-pulse"></div>
                <div className="w-4 h-0.5 bg-gradient-to-r from-orange-500 to-transparent animate-pulse delay-150 mt-1"></div>
                <div className="w-5 h-0.5 bg-gradient-to-r from-yellow-500 to-transparent animate-pulse delay-300 mt-1"></div>
              </div>
            </div>

            <h1 
              className="text-2xl font-bold bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent cursor-pointer logo-text transition-all duration-300 hover:scale-105 hover:tracking-wider relative z-10"
              onClick={() => router.push("/")}
            >
              Formula1.ai
            </h1>
              
            {/* Subtle glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-red-400/10 to-orange-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10"></div>
            
            {/* Speed streak effect */}
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-8 h-0.5 bg-gradient-to-r from-red-500 to-transparent opacity-0 group-hover:opacity-60 transition-all duration-300 group-hover:w-16"></div>
          </div>
          
          {/* Desktop Navigation Tabs */}
          <div className="hidden md:block relative">
            <Tabs value={getCurrentTab()} onValueChange={handleTabChange} className="w-auto">
              <TabsList className="grid w-full grid-cols-3 bg-background/50 backdrop-blur-sm border border-border/50 shadow-lg">
                <TabsTrigger 
                  value="drivers" 
                  className="px-4 relative overflow-hidden transition-all duration-300 hover:scale-105 data-[state=active]:bg-red-500/10 data-[state=active]:text-red-500 data-[state=active]:shadow-lg"
                >
                  <span className="relative z-10">Drivers</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </TabsTrigger>
                <TabsTrigger 
                  value="teams" 
                  className="px-4 relative overflow-hidden transition-all duration-300 hover:scale-105 data-[state=active]:bg-red-500/10 data-[state=active]:text-red-500 data-[state=active]:shadow-lg"
                >
                  <span className="relative z-10">Teams</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </TabsTrigger>
                <TabsTrigger 
                  value="formula1" 
                  className="px-4 relative overflow-hidden transition-all duration-300 hover:scale-105 data-[state=active]:bg-red-500/10 data-[state=active]:text-red-500 data-[state=active]:shadow-lg"
                >
                  <span className="relative z-10">About us</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg bg-background/50 backdrop-blur-sm border border-border/50 shadow-lg hover:bg-red-500/10 transition-colors duration-300"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center space-y-1">
                <div className={`w-5 h-0.5 bg-foreground transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                <div className={`w-5 h-0.5 bg-foreground transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
                <div className={`w-5 h-0.5 bg-foreground transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg shadow-lg overflow-hidden">
              <div className="flex flex-col">
                <button
                  onClick={() => handleTabChange("drivers")}
                  className={`px-4 py-3 text-left transition-colors duration-300 hover:bg-red-500/10 ${getCurrentTab() === "drivers" ? "bg-red-500/10 text-red-500" : "hover:text-red-500"}`}
                >
                  <span className="font-medium">Drivers</span>
                </button>
                <button
                  onClick={() => handleTabChange("teams")}
                  className={`px-4 py-3 text-left transition-colors duration-300 hover:bg-red-500/10 ${getCurrentTab() === "teams" ? "bg-red-500/10 text-red-500" : "hover:text-red-500"}`}
                >
                  <span className="font-medium">Teams</span>
                </button>
                <button
                  onClick={() => handleTabChange("formula1")}
                  className={`px-4 py-3 text-left transition-colors duration-300 hover:bg-red-500/10 ${getCurrentTab() === "formula1" ? "bg-red-500/10 text-red-500" : "hover:text-red-500"}`}
                >
                  <span className="font-medium">About us</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 