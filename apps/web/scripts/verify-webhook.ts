#!/usr/bin/env tsx
import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../../../.env") });

// ─── Webhook Registration & Verification ────────────────────
// Registers or verifies the Figma webhook for this project.
//
// Usage:
//   npx tsx scripts/verify-webhook.ts list
//   npx tsx scripts/verify-webhook.ts register <endpoint-url>
//   npx tsx scripts/verify-webhook.ts delete <webhook-id>

const FIGMA_API_BASE = "https://api.figma.com/v2";

async function figmaFetch(endpoint: string, options?: RequestInit) {
  const token = process.env.FIGMA_API_TOKEN;
  if (!token) throw new Error("FIGMA_API_TOKEN is required");

  const response = await fetch(`${FIGMA_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "X-FIGMA-TOKEN": token,
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Figma API ${response.status}: ${body}`);
  }

  return response.json();
}

async function listWebhooks() {
  const teamId = process.env.FIGMA_TEAM_ID;
  if (!teamId) throw new Error("FIGMA_TEAM_ID is required");

  const data = await figmaFetch(`/webhooks/team/${teamId}`);
  console.log("Current webhooks:");
  console.log(JSON.stringify(data, null, 2));
}

async function registerWebhook(endpointUrl: string) {
  const teamId = process.env.FIGMA_TEAM_ID;
  if (!teamId) throw new Error("FIGMA_TEAM_ID is required");

  const data = await figmaFetch("/webhooks", {
    method: "POST",
    body: JSON.stringify({
      event_type: "FILE_UPDATE",
      team_id: teamId,
      endpoint: endpointUrl,
      passcode: process.env.FIGMA_WEBHOOK_SECRET || "default-secret",
      description: "Martech Website Builder — auto-generate pages on design update",
    }),
  });

  console.log("✅ Webhook registered:");
  console.log(JSON.stringify(data, null, 2));
}

async function deleteWebhook(webhookId: string) {
  await figmaFetch(`/webhooks/${webhookId}`, { method: "DELETE" });
  console.log(`✅ Webhook ${webhookId} deleted`);
}

async function main() {
  const command = process.argv[2];
  const arg = process.argv[3];

  switch (command) {
    case "list":
      await listWebhooks();
      break;
    case "register":
      if (!arg) {
        console.error("Usage: verify-webhook.ts register <endpoint-url>");
        process.exit(1);
      }
      await registerWebhook(arg);
      break;
    case "delete":
      if (!arg) {
        console.error("Usage: verify-webhook.ts delete <webhook-id>");
        process.exit(1);
      }
      await deleteWebhook(arg);
      break;
    default:
      console.log("Usage:");
      console.log("  verify-webhook.ts list                    — List all webhooks");
      console.log("  verify-webhook.ts register <endpoint-url> — Register a new webhook");
      console.log("  verify-webhook.ts delete <webhook-id>     — Delete a webhook");
  }
}

main().catch((err) => {
  console.error(`❌ ${err.message}`);
  process.exit(1);
});
