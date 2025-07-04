"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, usePathname } from "next/navigation";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleTabChange = (value: string) => {
    if (value === "formula1") {
      router.push("/about");
    } else if (value === "teams") {
      router.push("/teams");
    } else if (value === "drivers") {
      router.push("/");
    }
  };

  const getCurrentTab = () => {
    if (pathname === "/about") return "formula1";
    if (pathname === "/teams") return "teams";
    return "drivers"; // Home page (/) is now drivers, so default to drivers
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-start">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-6">
            <h1 
              className="text-2xl font-bold bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity logo-text"
              onClick={() => router.push("/")}
            >
              formula1.ai
            </h1>
            
            {/* Navigation Tabs - Right next to logo */}
            <Tabs value={getCurrentTab()} onValueChange={handleTabChange} className="w-auto">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="formula1" className="px-4">
                  About us
                </TabsTrigger>
                <TabsTrigger value="teams" className="px-4">
                  Teams
                </TabsTrigger>
                <TabsTrigger value="drivers" className="px-4">
                  Drivers
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>
    </nav>
  );
} 