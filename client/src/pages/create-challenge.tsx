import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useChallengeStore } from "@/stores/challengeStore";
import { apiRequest } from "@/lib/queryClient";
import { motion } from "framer-motion";
import { ArrowLeft, Target, DollarSign, Star } from "lucide-react";

const createChallengeSchema = z.object({
  trick: z.string().min(1, "Trick name is required").max(100, "Trick name too long"),
  difficulty: z.number().min(1).max(5),
  buyIn: z.number().min(0).max(10000), // In cents, max $100
});

type CreateChallengeForm = z.infer<typeof createChallengeSchema>;

const POPULAR_TRICKS = [
  "Kickflip",
  "Heelflip", 
  "Tre Flip",
  "Hardflip",
  "Inward Heelflip",
  "Varial Kickflip",
  "Backside 180",
  "Frontside 180",
  "360 Flip",
  "Nollie Flip",
  "Switch Kickflip",
  "Frontside Shuvit"
];

export default function CreateChallenge() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { currentUserId, addChallenge } = useChallengeStore();
  const queryClient = useQueryClient();
  
  const form = useForm<CreateChallengeForm>({
    resolver: zodResolver(createChallengeSchema),
    defaultValues: {
      trick: "",
      difficulty: 3,
      buyIn: 0,
    },
  });

  const createChallengeMutation = useMutation({
    mutationFn: async (data: CreateChallengeForm) => {
      const response = await apiRequest("POST", "/api/challenges", {
        ...data,
        creatorId: currentUserId,
        status: "open",
        creatorLetters: "",
        opponentLetters: "",
      });
      return response.json();
    },
    onSuccess: (challenge) => {
      addChallenge(challenge);
      queryClient.invalidateQueries({ queryKey: ['/api/challenges'] });
      toast({
        title: "Challenge Created!",
        description: "Your challenge is now live and waiting for opponents.",
      });
      setLocation("/challenges");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create challenge",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateChallengeForm) => {
    createChallengeMutation.mutate(data);
  };

  const setPopularTrick = (trick: string) => {
    form.setValue("trick", trick);
  };

  const difficultyLabels = {
    1: "Beginner",
    2: "Easy", 
    3: "Intermediate",
    4: "Advanced",
    5: "Pro"
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
          <h1 className="text-3xl font-bold graffiti-text text-primary">
            CREATE CHALLENGE
          </h1>
          <p className="text-muted-foreground">
            Set up a new SKATE challenge and wait for opponents
          </p>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span>Challenge Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Trick Name */}
                    <FormField
                      control={form.control}
                      name="trick"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Trick Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter the trick name..."
                              {...field}
                              data-testid="input-trick-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Popular Tricks */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">
                        Popular Tricks
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {POPULAR_TRICKS.map((trick) => (
                          <Button
                            key={trick}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setPopularTrick(trick)}
                            className="justify-start text-left h-auto py-2"
                            data-testid={`button-trick-${trick.toLowerCase().replace(/\s+/g, '-')}`}
                          >
                            {trick}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Difficulty */}
                    <FormField
                      control={form.control}
                      name="difficulty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center justify-between">
                            <span>Difficulty Level</span>
                            <span className="text-primary font-semibold">
                              {difficultyLabels[field.value as keyof typeof difficultyLabels]}
                            </span>
                          </FormLabel>
                          <FormControl>
                            <div className="px-2">
                              <Slider
                                min={1}
                                max={5}
                                step={1}
                                value={[field.value]}
                                onValueChange={(value) => field.onChange(value[0])}
                                className="w-full"
                                data-testid="slider-difficulty"
                              />
                              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                <span>Beginner</span>
                                <span>Pro</span>
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Buy-in */}
                    <FormField
                      control={form.control}
                      name="buyIn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4" />
                            <span>Buy-in Amount (Optional)</span>
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                                $
                              </span>
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                step="1"
                                placeholder="0"
                                className="pl-8"
                                value={field.value / 100}
                                onChange={(e) => field.onChange(Math.round(parseFloat(e.target.value || "0") * 100))}
                                data-testid="input-buy-in"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-muted-foreground">
                            Set to $0 for free challenges. Maximum $100.
                          </p>
                        </FormItem>
                      )}
                    />

                    {/* Submit Button */}
                    <div className="flex space-x-4">
                      <Link href="/challenges">
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="flex-1"
                          data-testid="button-cancel"
                        >
                          Cancel
                        </Button>
                      </Link>
                      <Button
                        type="submit"
                        className="flex-1 bg-primary text-primary-foreground hover:bg-accent pulse-orange"
                        disabled={createChallengeMutation.isPending}
                        data-testid="button-create-challenge"
                      >
                        {createChallengeMutation.isPending ? "Creating..." : "Create Challenge"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Challenge Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-lg">
                    {form.watch("trick") || "Trick Name"}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    by {currentUserId === "user1" ? "TonyHawk_99" : "You"}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Difficulty: {"⭐".repeat(form.watch("difficulty"))}
                  </span>
                  <span className="text-sm text-accent font-semibold">
                    {form.watch("buyIn") === 0 ? "Free" : `$${(form.watch("buyIn") / 100).toFixed(0)} Buy-in`}
                  </span>
                </div>

                <Button 
                  className="w-full bg-primary text-primary-foreground"
                  disabled
                >
                  Accept Challenge
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-primary" />
                  <span>Tips</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>• Choose tricks you can consistently land</p>
                <p>• Higher difficulty = more respect points</p>
                <p>• Buy-ins create competitive pressure</p>
                <p>• Be ready to film your attempts clearly</p>
                <p>• Respond within 24 hours or auto-forfeit</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* SKATE Rules */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>How SKATE Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>1. You set the trick, opponent goes first</p>
                <p>2. Each miss = a letter (S-K-A-T-E)</p>
                <p>3. First to spell SKATE loses</p>
                <p>4. Video proof required for all attempts</p>
                <p>5. 24-hour response window</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
