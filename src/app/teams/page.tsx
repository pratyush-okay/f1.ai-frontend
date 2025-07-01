import { teams } from "@/data/f1-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamLogo } from "@/components/team-logo";

export default function TeamsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Formula 1 Teams</h1>
        <p className="text-muted-foreground text-lg">
          All 10 constructors competing in the 2024 Formula 1 World Championship
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {teams.map((team) => (
          <Card key={team.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div 
              className="h-3 w-full"
              style={{ backgroundColor: team.color }}
            />
            
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3 mb-2">
                <TeamLogo 
                  teamName={team.name} 
                  size="md" 
                  showName={false}
                />
                <CardTitle className="text-lg font-bold">{team.name}</CardTitle>
              </div>
              <CardDescription className="text-sm">
                {team.base}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Team Chief</span>
                  <span className="font-medium">{team.teamChief}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Chassis</span>
                  <span className="font-medium">{team.chassis}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Power Unit</span>
                  <span className="font-medium">{team.powerUnit}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">First Entry</span>
                  <span className="font-medium">{team.firstEntry}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-primary">{team.worldChampionships}</div>
                    <div className="text-xs text-muted-foreground">Championships</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-primary">{team.polePositions}</div>
                    <div className="text-xs text-muted-foreground">Pole Positions</div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="text-sm">
                  <span className="text-muted-foreground">Drivers: </span>
                  <span className="font-medium">{team.drivers.join(", ")}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>Best: {team.highestRaceFinish}</span>
                <span>{team.fastestLaps} Fastest Laps</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {teams.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No teams data available</p>
        </div>
      )}
    </div>
  );
} 