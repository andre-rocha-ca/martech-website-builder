// ─── Figma Webhook Handler ──────────────────────────────────
// Receives FILE_UPDATE events from Figma and routes DS changes
// to GitHub Actions for component sync.
// Page generation is now prompt-driven via POST /api/generate.

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createHmac } from "node:crypto";
import type { FigmaWebhookPayload } from "@/lib/types/figma.types";
import { dispatchDSSync } from "@/lib/services/github.service";
import { createLogger } from "@/lib/utils/logger";

const log = createLogger("webhook-figma");
type WebhookRoute = "ds-sync";

// ─── DS File Detection ──────────────────────────────────────

/**
 * Check if the updated file is the Design System source file.
 * When FIGMA_DS_FILE_KEY is set and matches the webhook's file_key,
 * we dispatch to GitHub Actions instead of running inline generation.
 */
function isDesignSystemFile(fileKey: string): boolean {
  const dsFileKeys = [
    process.env.FIGMA_DS_FILE_KEY,
    ...(process.env.FIGMA_DS_FILE_KEYS?.split(",") ?? []),
  ]
    .map((key) => key?.trim())
    .filter((key): key is string => Boolean(key));

  return dsFileKeys.includes(fileKey);
}

// ─── Signature Verification ─────────────────────────────────

function verifySignature(body: string, signature: string): boolean {
  const secret = process.env.FIGMA_WEBHOOK_SECRET;
  if (!secret) {
    log.warn("FIGMA_WEBHOOK_SECRET not set — skipping verification");
    return true; // Allow in development
  }

  const hmac = createHmac("sha256", secret);
  hmac.update(body);
  const expected = hmac.digest("hex");

  // Constant-time comparison
  if (expected.length !== signature.length) return false;
  let result = 0;
  for (let i = 0; i < expected.length; i++) {
    result |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return result === 0;
}

// ─── POST Handler ───────────────────────────────────────────

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();
  log.info("Webhook received", { requestId });

  try {
    // 1. Read and verify the payload
    const rawBody = await request.text();
    const signature = request.headers.get("x-figma-signature") || "";

    if (process.env.FIGMA_WEBHOOK_SECRET && !verifySignature(rawBody, signature)) {
      log.error("Invalid webhook signature", { requestId });
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // 2. Parse the payload
    let payload: FigmaWebhookPayload;
    try {
      payload = JSON.parse(rawBody) as FigmaWebhookPayload;
    } catch {
      log.error("Invalid JSON payload", { requestId });
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    log.info("Webhook payload parsed", {
      requestId,
      eventType: payload.event_type,
      fileKey: payload.file_key,
      fileName: payload.file_name,
    });

    // 3. Determine the route before acknowledging
    const isDSFile = isDesignSystemFile(payload.file_key);
    const isDSEvent =
      payload.event_type === "FILE_UPDATE" ||
      payload.event_type === "FILE_VERSION_UPDATE" ||
      payload.event_type === "LIBRARY_PUBLISH";

    let route: WebhookRoute | "ignored" = "ignored";
    let ignoredReason: string | undefined;

    if (isDSFile && isDSEvent) {
      route = "ds-sync";
    } else {
      // Non-DS file updates are ignored — page generation is now prompt-driven via /api/generate
      ignoredReason = `Non-DS event (${payload.event_type}) — use POST /api/generate for page creation`;
    }

    log.info("Routing webhook", {
      requestId,
      route,
      eventType: payload.event_type,
      isDSFile,
      ignoredReason,
    });

    // 4. Acknowledge immediately — process async
    // In production, you'd enqueue this to a job queue (SQS, Redis, etc.)
    // For simplicity, we process inline but don't block the response.
    if (route !== "ignored") {
      processWebhookAsync(requestId, payload, route).catch((err) => {
        log.error("Async pipeline failed", {
          requestId,
          error: err instanceof Error ? err.message : String(err),
        });
      });
    }

    return NextResponse.json({
      status: "accepted",
      requestId,
      route,
      ignoredReason,
      message:
        route === "ignored"
          ? `Webhook ignored: ${ignoredReason}`
          : `Processing design "${payload.file_name}" (${payload.file_key}) → ${route}`,
    });
  } catch (err) {
    log.error("Webhook handler error", {
      requestId,
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── Async Pipeline ─────────────────────────────────────────

async function processWebhookAsync(
  requestId: string,
  payload: FigmaWebhookPayload,
  route: WebhookRoute
) {
  const startTime = Date.now();
  log.info("Pipeline started", { requestId, fileKey: payload.file_key });

  try {
    // ── Route: Design System file → dispatch to GitHub Actions ──
    if (route === "ds-sync") {
      log.info("DS file detected — dispatching sync to GitHub Actions", {
        requestId,
        fileKey: payload.file_key,
      });

      const dispatchResult = await dispatchDSSync({
        file_key: payload.file_key,
        file_name: payload.file_name,
        triggered_by: payload.triggered_by?.handle || "unknown",
        webhook_request_id: requestId,
        timestamp: payload.timestamp,
      });

      if (!dispatchResult.success) {
        log.error("DS sync dispatch failed", {
          requestId,
          message: dispatchResult.message,
        });
      } else {
        log.info("DS sync dispatched", {
          requestId,
          message: dispatchResult.message,
          durationMs: Date.now() - startTime,
        });
      }

      return;
    }
  } catch (err) {
    log.error("Pipeline error", {
      requestId,
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
  }
}

// ─── GET Handler (Health check for Figma webhook verification) ───

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "martech-website-builder",
    webhook: "figma",
    timestamp: new Date().toISOString(),
  });
}
