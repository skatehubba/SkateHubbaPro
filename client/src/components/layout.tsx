import { Link, useLocation } from "wouter";
import { Home, Trophy, Plus, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <h1 className="text-2xl font-bold text-primary graffiti-text cursor-pointer">
                SkateHubba
              </h1>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/challenges">
                <Button 
                  variant="ghost" 
                  className={location === "/challenges" || location === "/" ? "text-primary" : "text-foreground hover:text-primary"}
                  data-testid="nav-challenges"
                >
                  Challenges
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                className="text-muted-foreground hover:text-primary"
                data-testid="nav-leaderboard"
              >
                Leaderboard
              </Button>
              <Button 
                variant="ghost" 
                className="text-muted-foreground hover:text-primary"
                data-testid="nav-profile"
              >
                Profile
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/create">
              <Button 
                className="hidden md:block bg-primary text-primary-foreground hover:bg-accent pulse-orange"
                data-testid="button-new-challenge"
              >
                New Challenge
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="icon"
              data-testid="button-profile"
            >
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-20 md:pb-8">
        {children}
      </main>

      {/* Mobile Navigation */}
      <nav className="mobile-nav bg-card border-t border-border md:hidden">
        <div className="flex items-center justify-around py-2">
          <Link href="/">
            <Button 
              variant="ghost" 
              className={`flex flex-col items-center py-2 px-4 ${location === "/" ? "text-primary" : "text-muted-foreground"}`}
              data-testid="mobile-nav-home"
            >
              <Home className="h-5 w-5 mb-1" />
              <span className="text-xs">Home</span>
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            className="flex flex-col items-center py-2 px-4 text-muted-foreground"
            data-testid="mobile-nav-leaderboard"
          >
            <Trophy className="h-5 w-5 mb-1" />
            <span className="text-xs">Leaderboard</span>
          </Button>
          <Link href="/create">
            <Button 
              variant="ghost" 
              className="flex flex-col items-center py-2 px-4 text-muted-foreground"
              data-testid="mobile-nav-new"
            >
              <Plus className="h-6 w-6 mb-1" />
              <span className="text-xs">New</span>
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            className="flex flex-col items-center py-2 px-4 text-muted-foreground"
            data-testid="mobile-nav-alerts"
          >
            <Bell className="h-5 w-5 mb-1" />
            <span className="text-xs">Alerts</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex flex-col items-center py-2 px-4 text-muted-foreground"
            data-testid="mobile-nav-profile"
          >
            <User className="h-5 w-5 mb-1" />
            <span className="text-xs">Profile</span>
          </Button>
        </div>
      </nav>
    </div>
  );
}
