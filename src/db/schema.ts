import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  jsonb,
  integer,
  varchar,
} from "drizzle-orm/pg-core";

// Better Auth Tables
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull(),
  image: text("image"),
  credits: integer("credits").default(10).notNull(),
  plan: varchar("plan", { length: 20 }).default("free").notNull(),
  lastCreditReset: timestamp("last_credit_reset").defaultNow().notNull(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

// Social Content & SEO Tables
export const socialContent = pgTable("social_content", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  platform: varchar("platform", { length: 50 }).notNull(), // 'facebook' | 'instagram' | 'linkedin' | 'youtube'
  title: text("title"),
  body: text("body").notNull(),
  keywords: jsonb("keywords").$type<string[]>(),
  hashtags: jsonb("hashtags").$type<string[]>(),
  metadata: jsonb("metadata").$type<{
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    jsonLd?: Record<string, any>;
    seoExplanation?: string;
    imagePrompt?: string;
  }>(),
  status: varchar("status", { length: 20 }).default("draft"), // 'draft' | 'final'
  seoScore: integer("seo_score").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const seoAudit = pgTable("seo_audit", {
  id: uuid("id").primaryKey().defaultRandom(),
  contentId: uuid("content_id")
    .notNull()
    .references(() => socialContent.id),
  auditType: varchar("audit_type", { length: 50 }).notNull(), // 'real-time' | 'batch'
  score: integer("score").notNull(),
  suggestions: jsonb("suggestions").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
