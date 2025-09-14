import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Challenge } from "@shared/schema";
import { Link } from "wouter";
import SkateLetters from "./skate-letters";
import CountdownTimer from "./countdown-timer";
import { useChallengeStore } from "@/stores/challengeStore";
import { Video, Eye } from "lucide-react";
import { motion } from "framer-motion";

interface ChallengeCardProps {
  challenge: Challenge;
  variant?: "active" | "open" | "waiting";
  index?: number;
}

const getDifficultyStars = (difficulty: number) => {
  return "⭐".repeat(Math.min(difficulty, 5));
};

const formatBuyIn = (buyInCents: number) => {
  if (buyInCents === 0) return "Free";
  return `$${(buyInCents / 100).toFixed(0)} Buy-in`;
};

const getUsernameById = (userId: string | null) => {
  const userMap: Record<string, string> = {
    "user1": "TonyHawk_99",
    "user2": "StreetSkater_23", 
    "user3": "SkaterDude_42",
    "user4": "ProSkater_88",
    "user5": "FlipMaster_21",
  };
  return userId ? userMap[userId] || "Unknown" : "Unknown";
};

export default function ChallengeCard({ challenge, variant = "open", index = 0 }: ChallengeCardProps) {
  const { currentUserId, joinChallenge } = useChallengeStore();
  
  const creatorUsername = getUsernameById(challenge.creatorId);
  const opponentUsername = getUsernameById(challenge.opponentId);
  
  const isActive = variant === "active" && challenge.status === "active";
  const isCurrentUserTurn = challenge.currentTurn === currentUserId;
  
  const handleJoinChallenge = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (challenge.status === "open") {
      joinChallenge(challenge.id, currentUserId);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="challenge-card" data-testid={`challenge-card-${challenge.id}`}>
        <CardContent className="p-4 md:p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-xl font-semibold" data-testid={`challenge-title-${challenge.id}`}>
                {variant === "open" ? challenge.trick : `vs. ${opponentUsername}`}
              </h4>
              <p className="text-muted-foreground" data-testid={`challenge-trick-${challenge.id}`}>
                {variant === "open" ? `by ${creatorUsername}` : challenge.trick}
              </p>
            </div>
            <div className="text-right">
              {isActive && challenge.expiresAt ? (
                <div>
                  <CountdownTimer 
                    expiresAt={challenge.expiresAt}
                    className="text-2xl font-bold"
                  />
                  <div className="text-sm text-muted-foreground">Time Left</div>
                </div>
              ) : (
                <Badge
                  variant={challenge.status === "open" ? "default" : "secondary"}
                  className={challenge.status === "open" ? "bg-primary/20 text-primary" : ""}
                  data-testid={`challenge-status-${challenge.id}`}
                >
                  {challenge.status === "active" && variant === "waiting" ? "Waiting" : challenge.status}
                </Badge>
              )}
            </div>
          </div>

          {/* SKATE Progress for active challenges */}
          {isActive && (
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-muted-foreground mb-2">Your Progress</div>
                <SkateLetters 
                  letters={challenge.creatorId === currentUserId ? challenge.creatorLetters : challenge.opponentLetters}
                  animated
                />
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-2">Opponent</div>
                <SkateLetters 
                  letters={challenge.creatorId === currentUserId ? challenge.opponentLetters : challenge.creatorLetters}
                />
              </div>
            </div>
          )}

          {/* Challenge info for open challenges */}
          {variant === "open" && (
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{creatorUsername.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">by {creatorUsername}</span>
              </div>
              <div className="text-right space-y-1">
                <div className="text-sm text-muted-foreground">
                  Difficulty: {getDifficultyStars(challenge.difficulty)}
                </div>
                <div className="text-sm text-accent font-semibold">
                  {formatBuyIn(challenge.buyIn)}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            {variant === "open" ? (
              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-accent"
                onClick={handleJoinChallenge}
                data-testid={`button-accept-challenge-${challenge.id}`}
              >
                Accept Challenge
              </Button>
            ) : isActive ? (
              <>
                {isCurrentUserTurn && (
                  <Button
                    className="flex-1 bg-primary text-primary-foreground hover:bg-accent"
                    data-testid={`button-upload-trick-${challenge.id}`}
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Upload Trick
                  </Button>
                )}
                <Link href={`/challenges/${challenge.id}`}>
                  <Button
                    variant="secondary"
                    className="flex-1"
                    data-testid={`button-view-details-${challenge.id}`}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </Link>
              </>
            ) : (
              <Link href={`/challenges/${challenge.id}`}>
                <Button
                  variant="secondary"
                  className="w-full"
                  data-testid={`button-view-challenge-${challenge.id}`}
                >
                  View Challenge
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
