// ─── Prompt-Based Page Generation API ───────────────────────
// POST /api/generate
// Accepts a text prompt and generates a production-ready landing page.

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { generatePageFromPrompt } from "@/lib/services/openai.service";
import { gitPublish } from "@/lib/services/git.service";
import { createLogger } from "@/lib/utils/logger";

const log = createLogger("api-generate");

const requestSchema = z.object({
  prompt: z
    .string()
    .min(10, "Prompt must be at least 10 characters")
    .max(2000, "Prompt must be under 2000 characters"),
  publish: z.boolean().optional().default(false),
});

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();
  log.info("Generate request received", { requestId });

  try {
    // Auth check (optional — only if GENERATE_API_KEY is set)
    const apiKey = process.env.GENERATE_API_KEY;
    if (apiKey) {
      const authHeader = request.headers.get("authorization");
      const token = authHeader?.replace("Bearer ", "") ?? "";
      const tokenBuf = Buffer.from(token);
      const keyBuf = Buffer.from(apiKey);
      if (tokenBuf.length !== keyBuf.length || !timingSafeEqual(tokenBuf, keyBuf)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    // Parse and validate input
    const body = await request.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { prompt, publish } = parsed.data;

    log.info("Generating page from prompt", {
      requestId,
      promptLength: prompt.length,
      publish,
    });

    // Generate
    const result = await generatePageFromPrompt(prompt);

    if (!result.success) {
      log.error("Generation failed", { requestId, errors: result.errors });
      return NextResponse.json(
        { error: "Generation failed", details: result.errors },
        { status: 500 }
      );
    }

    // Optionally publish to git → Amplify
    let deployment = null;
    if (publish) {
      const identifier = result.metadata.promptHash || "unknown";
      const gitResult = await gitPublish(identifier, result);
      deployment = {
        branchName: gitResult.branchName,
        commitSha: gitResult.commitSha,
        filesWritten: gitResult.filesWritten,
        previewUrl: gitResult.previewUrl,
      };
      log.info("Published to git", { requestId, ...deployment });
    }

    return NextResponse.json({
      success: true,
      requestId,
      pages: result.pages.map((p) => ({
        filename: p.filename,
        path: p.path,
        route: p.route,
      })),
      componentCount: result.components.length,
      metadata: result.metadata,
      deployment,
    });
  } catch (err) {
    log.error("Generate API error", {
      requestId,
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
