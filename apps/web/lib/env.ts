// ─── Environment Variable Validation ────────────────────────
// Validates required environment variables at startup.
// Prevents silent failures from missing config.

import { z } from "zod";

const serverEnvSchema = z.object({
  // Figma
  FIGMA_API_TOKEN: z.string().min(1, "FIGMA_API_TOKEN is required"),
  FIGMA_WEBHOOK_SECRET: z.string().optional(),
  FIGMA_TEAM_ID: z.string().optional(),
  FIGMA_DS_FILE_KEY: z.string().optional(),
  FIGMA_DS_FILE_KEYS: z.string().optional(),

  // OpenAI
  OPENAI_API_KEY: z.string().min(1, "OPENAI_API_KEY is required"),
  OPENAI_MODEL: z.string().default("gpt-4o"),

  // GitHub
  GITHUB_TOKEN: z.string().optional(),
  GITHUB_REPOSITORY: z.string().optional(), // owner/repo format (auto-set in GitHub Actions)
  GITHUB_REPO_OWNER: z.string().optional(),
  GITHUB_REPO_NAME: z.string().optional(),

  // App
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_SEGMENT_WRITE_KEY: z.string().optional(),
  NEXT_PUBLIC_BASE_URL: z.string().url().optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;

/**
 * Validate server-side environment variables.
 * Call this at app startup or in API routes.
 */
export function validateServerEnv(): ServerEnv {
  const result = serverEnvSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const message = Object.entries(errors)
      .map(([key, msgs]) => `  ${key}: ${msgs?.join(", ")}`)
      .join("\n");

    console.error(`\n❌ Invalid environment variables:\n${message}\n`);
    console.error("Copy .env.example to .env and fill in the required values.");

    if (process.env.NODE_ENV === "production") {
      throw new Error("Invalid environment configuration");
    }
  }

  return result.success ? result.data : (process.env as unknown as ServerEnv);
}

/**
 * Validate client-side environment variables.
 */
export function validateClientEnv(): ClientEnv {
  const result = clientEnvSchema.safeParse({
    NEXT_PUBLIC_SEGMENT_WRITE_KEY: process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  });

  return result.success ? result.data : ({} as ClientEnv);
}

export const env = validateServerEnv();
export const clientEnv = validateClientEnv();
