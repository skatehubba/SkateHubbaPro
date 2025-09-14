import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import ChallengeLobby from "@/pages/challenge-lobby";
import ChallengeDetail from "@/pages/challenge-detail";
import CreateChallenge from "@/pages/create-challenge";
import Layout from "@/components/layout";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={ChallengeLobby} />
        <Route path="/challenges" component={ChallengeLobby} />
        <Route path="/challenges/:id" component={ChallengeDetail} />
        <Route path="/create" component={CreateChallenge} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
