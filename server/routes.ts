import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertChallengeSchema, insertTrickAttemptSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Challenge routes
  app.get("/api/challenges", async (req, res) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
      const challenges = await storage.getChallenges();
      res.json(challenges);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch challenges" });
    }
  });

  app.get("/api/challenges/:id", async (req, res) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      const challenge = await storage.getChallenge(req.params.id);
      if (!challenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }
      res.json(challenge);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch challenge" });
    }
  });

  app.post("/api/challenges", async (req, res) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      const validatedData = insertChallengeSchema.parse(req.body);
      const challenge = await storage.createChallenge(validatedData);
      res.status(201).json(challenge);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Invalid challenge data" });
    }
  });

  app.patch("/api/challenges/:id", async (req, res) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 150));
      const challenge = await storage.updateChallenge(req.params.id, req.body);
      if (!challenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }
      res.json(challenge);
    } catch (error) {
      res.status(500).json({ message: "Failed to update challenge" });
    }
  });

  app.post("/api/challenges/:id/join", async (req, res) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 150));
      const { userId } = req.body;
      
      const challenge = await storage.getChallenge(req.params.id);
      if (!challenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }
      
      if (challenge.status !== "open") {
        return res.status(400).json({ message: "Challenge is not open" });
      }

      const updatedChallenge = await storage.updateChallenge(req.params.id, {
        opponentId: userId,
        status: "active",
        currentTurn: userId,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      });

      res.json(updatedChallenge);
    } catch (error) {
      res.status(500).json({ message: "Failed to join challenge" });
    }
  });

  app.get("/api/challenges/:id/attempts", async (req, res) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      const attempts = await storage.getTrickAttempts(req.params.id);
      res.json(attempts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trick attempts" });
    }
  });

  app.post("/api/challenges/:id/attempts", async (req, res) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      const validatedData = insertTrickAttemptSchema.parse({
        ...req.body,
        challengeId: req.params.id,
      });
      const attempt = await storage.createTrickAttempt(validatedData);
      res.status(201).json(attempt);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Invalid attempt data" });
    }
  });

  // Mock users for demo (in real app would have auth)
  app.get("/api/users", async (req, res) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      const users = [
        { id: "user1", username: "TonyHawk_99" },
        { id: "user2", username: "StreetSkater_23" },
        { id: "user3", username: "SkaterDude_42" },
        { id: "user4", username: "ProSkater_88" },
        { id: "user5", username: "FlipMaster_21" },
      ];
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
