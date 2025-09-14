import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ChallengeCard from "@/components/challenge-card";
import VideoUploadModal from "@/components/video-upload-modal";
import { useChallengeStore } from "@/stores/challengeStore";
import { Challenge } from "@shared/schema";
import { motion } from "framer-motion";
import { Plus, Trophy, Target, Users, Award } from "lucide-react";

const DIFFICULTY_FILTERS = [
  { label: "All", value: null },
  { label: "Beginner", value: 1 },
  { label: "Intermediate", value: 3 },
  { label: "Pro", value: 5 }
];

export default function ChallengeLobby() {
  const { 
    challenges, 
    currentUserId, 
    setChallenges, 
    setLoading, 
    setError 
  } = useChallengeStore();
  
  const [difficultyFilter, setDifficultyFilter] = useState<number | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>("");

  const { data: challengeData, isLoading, error } = useQuery({
    queryKey: ['/api/challenges'],
    refetchInterval: 5000, // Poll for updates
  });

  useEffect(() => {
    setLoading(isLoading);
    if (error) {
      setError(error.message);
    } else if (challengeData) {
      setChallenges(challengeData as Challenge[]);
      setError(null);
    }
  }, [challengeData, isLoading, error, setChallenges, setLoading, setError]);

  const activeChallenges = challenges.filter(
    c => c.status === "active" && (c.creatorId === currentUserId || c.opponentId === currentUserId)
  );

  const openChallenges = challenges.filter(c => {
    const isOpen = c.status === "open" && c.creatorId !== currentUserId;
    if (difficultyFilter === null) return isOpen;
    
    if (difficultyFilter === 1) return isOpen && c.difficulty <= 2;
    if (difficultyFilter === 3) return isOpen && c.difficulty === 3;
    if (difficultyFilter === 5) return isOpen && c.difficulty >= 4;
    
    return isOpen;
  });

  const waitingChallenges = challenges.filter(
    c => c.status === "active" && 
        (c.creatorId === currentUserId || c.opponentId === currentUserId) &&
        c.currentTurn !== currentUserId
  );

  // Mock stats
  const stats = [
    { label: "Active Challenges", value: activeChallenges.length, icon: Target },
    { label: "Tricks Landed", value: 156, icon: Trophy },
    { label: "Players Online", value: 89, icon: Users },
    { label: "Completed Today", value: 23, icon: Award },
  ];

  const handleVideoUpload = (videoFile: File, description: string) => {
    console.log("Uploading video for challenge:", selectedChallengeId, videoFile, description);
    // In a real app, this would upload the video and create a trick attempt
    setUploadModalOpen(false);
  };

  const openUploadModal = (challengeId: string) => {
    setSelectedChallengeId(challengeId);
    setUploadModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading challenges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Hero Section */}
      <motion.section 
        className="py-8 md:py-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl md:text-6xl font-bold graffiti-text mb-4">
          PLAY <span className="text-primary">SKATE</span>
        </h2>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-8">
          Challenge skaters worldwide. Upload tricks, earn letters, and prove your skills in the ultimate game of SKATE.
        </p>
        <Link href="/create">
          <Button 
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-accent pulse-orange text-lg font-bold px-8 py-3"
            data-testid="button-start-new-challenge"
          >
            <Plus className="w-5 h-5 mr-2" />
            Start New Challenge
          </Button>
        </Link>
      </motion.section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            <Card data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>
              <CardContent className="p-4 text-center">
                <stat.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* Active Challenges Section */}
      {activeChallenges.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Your Active Challenges</h3>
            <Button 
              variant="ghost"
              className="text-primary hover:text-accent"
              data-testid="button-view-all-active"
            >
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {activeChallenges.map((challenge, index) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                variant="active"
                index={index}
              />
            ))}
          </div>
        </section>
      )}

      {/* Waiting Challenges Section */}
      {waitingChallenges.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Waiting for Response</h3>
          </div>
          
          <div className="space-y-4">
            {waitingChallenges.map((challenge, index) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                variant="waiting"
                index={index}
              />
            ))}
          </div>
        </section>
      )}

      {/* Open Challenges Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Open Challenges</h3>
          <div className="flex space-x-2">
            {DIFFICULTY_FILTERS.map((filter) => (
              <Button
                key={filter.label}
                variant={difficultyFilter === filter.value ? "default" : "outline"}
                size="sm"
                onClick={() => setDifficultyFilter(filter.value)}
                className={
                  difficultyFilter === filter.value 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground hover:bg-secondary"
                }
                data-testid={`filter-${filter.label.toLowerCase()}`}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {openChallenges.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h4 className="text-lg font-semibold mb-2">No Open Challenges</h4>
              <p className="text-muted-foreground mb-4">
                Be the first to create a challenge and get the competition started!
              </p>
              <Link href="/create">
                <Button data-testid="button-create-first-challenge">
                  Create Challenge
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {openChallenges.map((challenge, index) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                variant="open"
                index={index}
              />
            ))}
          </div>
        )}
      </section>

      {/* Video Upload Modal */}
      <VideoUploadModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        challengeId={selectedChallengeId}
        onUpload={handleVideoUpload}
      />
    </div>
  );
}
