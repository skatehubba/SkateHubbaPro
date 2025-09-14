import { type User, type InsertUser, type Challenge, type InsertChallenge, type TrickAttempt, type InsertTrickAttempt } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Challenge operations
  getChallenges(): Promise<Challenge[]>;
  getChallenge(id: string): Promise<Challenge | undefined>;
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
  updateChallenge(id: string, updates: Partial<Challenge>): Promise<Challenge | undefined>;
  getChallengesByUser(userId: string): Promise<Challenge[]>;
  
  // Trick attempt operations
  getTrickAttempts(challengeId: string): Promise<TrickAttempt[]>;
  createTrickAttempt(attempt: InsertTrickAttempt): Promise<TrickAttempt>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private challenges: Map<string, Challenge>;
  private trickAttempts: Map<string, TrickAttempt>;

  constructor() {
    this.users = new Map();
    this.challenges = new Map();
    this.trickAttempts = new Map();
    
    // Initialize with some sample data for demo
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create some sample users
    const sampleUsers = [
      { id: "user1", username: "TonyHawk_99", password: "password" },
      { id: "user2", username: "StreetSkater_23", password: "password" },
      { id: "user3", username: "SkaterDude_42", password: "password" },
      { id: "user4", username: "ProSkater_88", password: "password" },
      { id: "user5", username: "FlipMaster_21", password: "password" },
    ];

    sampleUsers.forEach(user => this.users.set(user.id, user));

    // Create some sample challenges
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    const sampleChallenges: Challenge[] = [
      {
        id: "challenge1",
        creatorId: "user1",
        opponentId: "user2",
        trick: "Kickflip to Manual",
        status: "active",
        creatorLetters: "SK",
        opponentLetters: "",
        currentTurn: "user2",
        expiresAt: tomorrow,
        createdAt: now,
        updatedAt: now,
        difficulty: 3,
        buyIn: 0,
        videoUrl: null,
        videoThumbnail: null,
      },
      {
        id: "challenge2",
        creatorId: "user3",
        opponentId: null,
        trick: "Varial Heelflip",
        status: "open",
        creatorLetters: "",
        opponentLetters: "",
        currentTurn: null,
        expiresAt: null,
        createdAt: now,
        updatedAt: now,
        difficulty: 3,
        buyIn: 500,
        videoUrl: null,
        videoThumbnail: null,
      },
      {
        id: "challenge3",
        creatorId: "user4",
        opponentId: null,
        trick: "Backside 360",
        status: "open",
        creatorLetters: "",
        opponentLetters: "",
        currentTurn: null,
        expiresAt: null,
        createdAt: now,
        updatedAt: now,
        difficulty: 4,
        buyIn: 1000,
        videoUrl: null,
        videoThumbnail: null,
      },
      {
        id: "challenge4",
        creatorId: "user5",
        opponentId: null,
        trick: "Nollie Flip",
        status: "open",
        creatorLetters: "",
        opponentLetters: "",
        currentTurn: null,
        expiresAt: null,
        createdAt: now,
        updatedAt: now,
        difficulty: 2,
        buyIn: 0,
        videoUrl: null,
        videoThumbnail: null,
      },
    ];

    sampleChallenges.forEach(challenge => this.challenges.set(challenge.id, challenge));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getChallenges(): Promise<Challenge[]> {
    return Array.from(this.challenges.values());
  }

  async getChallenge(id: string): Promise<Challenge | undefined> {
    return this.challenges.get(id);
  }

  async createChallenge(challenge: InsertChallenge): Promise<Challenge> {
    const id = randomUUID();
    const now = new Date();
    const newChallenge: Challenge = {
      ...challenge,
      id,
      createdAt: now,
      updatedAt: now,
      status: challenge.status || "open",
      opponentId: challenge.opponentId || null,
      currentTurn: challenge.currentTurn || null,
      expiresAt: challenge.expiresAt || null,
      videoUrl: challenge.videoUrl || null,
      videoThumbnail: challenge.videoThumbnail || null,
      creatorLetters: challenge.creatorLetters || "",
      opponentLetters: challenge.opponentLetters || "",
    };
    this.challenges.set(id, newChallenge);
    return newChallenge;
  }

  async updateChallenge(id: string, updates: Partial<Challenge>): Promise<Challenge | undefined> {
    const challenge = this.challenges.get(id);
    if (!challenge) return undefined;

    const updatedChallenge = {
      ...challenge,
      ...updates,
      updatedAt: new Date(),
    };
    this.challenges.set(id, updatedChallenge);
    return updatedChallenge;
  }

  async getChallengesByUser(userId: string): Promise<Challenge[]> {
    return Array.from(this.challenges.values()).filter(
      challenge => challenge.creatorId === userId || challenge.opponentId === userId
    );
  }

  async getTrickAttempts(challengeId: string): Promise<TrickAttempt[]> {
    return Array.from(this.trickAttempts.values()).filter(
      attempt => attempt.challengeId === challengeId
    );
  }

  async createTrickAttempt(attempt: InsertTrickAttempt): Promise<TrickAttempt> {
    const id = randomUUID();
    const newAttempt: TrickAttempt = {
      ...attempt,
      id,
      timestamp: new Date(),
      videoUrl: attempt.videoUrl || null,
    };
    this.trickAttempts.set(id, newAttempt);
    return newAttempt;
  }
}

export const storage = new MemStorage();
