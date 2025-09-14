import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const challenges = pgTable("challenges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  creatorId: varchar("creator_id").notNull(),
  opponentId: varchar("opponent_id"),
  trick: text("trick").notNull(),
  status: text("status").notNull().default("open"), // open, active, completed, expired
  creatorLetters: text("creator_letters").notNull().default(""),
  opponentLetters: text("opponent_letters").notNull().default(""),
  currentTurn: varchar("current_turn"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  difficulty: integer("difficulty").notNull().default(1), // 1-5 stars
  buyIn: integer("buy_in").notNull().default(0), // in cents
  videoUrl: text("video_url"),
  videoThumbnail: text("video_thumbnail"),
});

export const trickAttempts = pgTable("trick_attempts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  challengeId: varchar("challenge_id").notNull(),
  userId: varchar("user_id").notNull(),
  videoUrl: text("video_url"),
  landed: boolean("landed").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertChallengeSchema = createInsertSchema(challenges).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTrickAttemptSchema = createInsertSchema(trickAttempts).omit({
  id: true,
  timestamp: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Challenge = typeof challenges.$inferSelect;
export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
export type TrickAttempt = typeof trickAttempts.$inferSelect;
export type InsertTrickAttempt = z.infer<typeof insertTrickAttemptSchema>;

// Frontend-only types for the challenge system
export type ChallengeStatus = "open" | "active" | "completed" | "expired";
export type SkateLetters = "S" | "K" | "A" | "T" | "E";
