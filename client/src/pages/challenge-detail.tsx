import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import SkateLetters from "@/components/skate-letters";
import CountdownTimer from "@/components/countdown-timer";
import VideoUploadModal from "@/components/video-upload-modal";
import { useChallengeStore } from "@/stores/challengeStore";
import { Challenge, TrickAttempt } from "@shared/schema";
import { motion } from "framer-motion";
import { 
  Video, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Trophy, 
  Target,
  ArrowLeft,
  Play
} from "lucide-react";
import { Link } from "wouter";

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

export default function ChallengeDetail() {
  const [, params] = useRoute("/challenges/:id");
  const challengeId = params?.id || "";
  
  const { currentUserId, currentChallenge, setCurrentChallenge, earnLetter } = useChallengeStore();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  
  const { data: challenge, isLoading: challengeLoading } = useQuery({
    queryKey: ['/api/challenges', challengeId],
    enabled: !!challengeId,
  });

  const { data: attempts = [], isLoading: attemptsLoading } = useQuery({
    queryKey: ['/api/challenges', challengeId, 'attempts'],
    enabled: !!challengeId,
  });

  useEffect(() => {
    if (challenge) {
      setCurrentChallenge(challenge as Challenge);
    }
  }, [challenge, setCurrentChallenge]);

  if (challengeLoading) {
    return (
      <div className="py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading challenge...</p>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Challenge Not Found</h2>
        <Link href="/challenges">
          <Button data-testid="button-back-to-lobby">Back to Lobby</Button>
        </Link>
      </div>
    );
  }

  // Type assertion to ensure TypeScript knows about the challenge structure
  const challengeData = challenge as Challenge;

  const creatorUsername = getUsernameById(challengeData.creatorId);
  const opponentUsername = getUsernameById(challengeData.opponentId);
  const isCreator = challengeData.creatorId === currentUserId;
  const isOpponent = challengeData.opponentId === currentUserId;
  const isParticipant = isCreator || isOpponent;
  const isCurrentUserTurn = challengeData.currentTurn === currentUserId;

  const userLetters = isCreator ? challengeData.creatorLetters : challengeData.opponentLetters;
  const opponentLetters = isCreator ? challengeData.opponentLetters : challengeData.creatorLetters;

  const handleVideoUpload = (videoFile: File, description: string) => {
    console.log("Uploading video:", videoFile, description);
    // In a real app, this would upload the video and create a trick attempt
    setUploadModalOpen(false);
  };

  const handleMarkLanded = () => {
    // Mock landing a trick - opponent gets a letter
    const nextLetter = "SKATE"[opponentLetters.length];
    if (nextLetter) {
      const opponentId = isCreator ? challengeData.opponentId : challengeData.creatorId;
      if (opponentId) {
        earnLetter(challengeId, opponentId, nextLetter);
      }
    }
  };

  const handleMarkMissed = () => {
    // Mock missing a trick - current user gets a letter  
    const nextLetter = "SKATE"[userLetters.length];
    if (nextLetter) {
      earnLetter(challengeId, currentUserId, nextLetter);
    }
  };

  return (
    <div className="py-8">
      {/* Header */}
      <motion.div 
        className="flex items-center mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Link href="/challenges">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-4"
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold graffiti-text">
            {challengeData.trick}
          </h1>
          <p className="text-muted-foreground">
            {creatorUsername} vs {opponentUsername || "Open Challenge"}
          </p>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Challenge Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Challenge Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Challenge Status
                  <Badge 
                    variant={challengeData.status === "active" ? "default" : "secondary"}
                    data-testid="challenge-status-badge"
                  >
                    {challengeData.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {challengeData.status === "active" && challengeData.expiresAt && (
                  <div className="text-center">
                    <CountdownTimer 
                      expiresAt={challengeData.expiresAt}
                      className="text-4xl font-bold mb-2"
                    />
                    <p className="text-muted-foreground">Time Remaining</p>
                  </div>
                )}

                {/* Player Progress */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <Avatar className="h-16 w-16 mx-auto mb-2">
                      <AvatarFallback className="text-lg">
                        {creatorUsername.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <h4 className="font-semibold">{creatorUsername}</h4>
                    <SkateLetters 
                      letters={challengeData.creatorLetters} 
                      className="justify-center mt-2"
                      animated
                    />
                  </div>
                  
                  <div className="text-center">
                    <Avatar className="h-16 w-16 mx-auto mb-2">
                      <AvatarFallback className="text-lg">
                        {opponentUsername.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <h4 className="font-semibold">{opponentUsername}</h4>
                    <SkateLetters 
                      letters={challengeData.opponentLetters} 
                      className="justify-center mt-2"
                      animated
                    />
                  </div>
                </div>

                {/* Turn Indicator */}
                {challengeData.status === "active" && (
                  <div className="text-center">
                    <Separator className="my-4" />
                    <div className="flex items-center justify-center space-x-2">
                      <Target className="h-5 w-5 text-primary" />
                      <span className="font-semibold">
                        {isCurrentUserTurn ? "Your turn!" : `${getUsernameById(challengeData.currentTurn)}'s turn`}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          {isParticipant && challengeData.status === "active" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  {isCurrentUserTurn ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Button
                        className="bg-primary text-primary-foreground hover:bg-accent"
                        onClick={() => setUploadModalOpen(true)}
                        data-testid="button-upload-trick"
                      >
                        <Video className="w-4 h-4 mr-2" />
                        Upload Trick
                      </Button>
                      <Button
                        variant="outline"
                        className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                        onClick={handleMarkLanded}
                        data-testid="button-mark-landed"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark as Landed
                      </Button>
                      <Button
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        onClick={handleMarkMissed}
                        data-testid="button-mark-missed"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Mark as Missed
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Waiting for {getUsernameById(challengeData.currentTurn)} to make their move
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Trick Attempts History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Attempt History</CardTitle>
              </CardHeader>
              <CardContent>
                {attemptsLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : attempts.length === 0 ? (
                  <div className="text-center py-8">
                    <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No attempts yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {attempts.map((attempt: TrickAttempt, index: number) => (
                      <motion.div
                        key={attempt.id}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        data-testid={`attempt-${attempt.id}`}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {getUsernameById(attempt.userId).slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{getUsernameById(attempt.userId)}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(attempt.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {attempt.videoUrl && (
                            <Button size="sm" variant="outline" data-testid={`button-watch-video-${attempt.id}`}>
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                          <Badge 
                            variant={attempt.landed ? "default" : "destructive"}
                            data-testid={`attempt-result-${attempt.id}`}
                          >
                            {attempt.landed ? "Landed" : "Missed"}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Challenge Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Challenge Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Difficulty:</span>
                  <span>{"⭐".repeat(challenge.difficulty)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Buy-in:</span>
                  <span className="font-semibold">
                    {challenge.buyIn === 0 ? "Free" : `$${(challenge.buyIn / 100).toFixed(0)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{new Date(challenge.createdAt).toLocaleDateString()}</span>
                </div>
                {challenge.expiresAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expires:</span>
                    <span>{new Date(challenge.expiresAt).toLocaleDateString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Rules */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>SKATE Rules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• Each player takes turns attempting the trick</p>
                <p>• Miss a trick = earn a letter (S-K-A-T-E)</p>
                <p>• First to spell SKATE loses</p>
                <p>• 24-hour response window</p>
                <p>• Video proof required for attempts</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Video Upload Modal */}
      <VideoUploadModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        challengeId={challengeId}
        onUpload={handleVideoUpload}
      />
    </div>
  );
}
