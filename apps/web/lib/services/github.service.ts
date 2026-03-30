// ─── GitHub API Service ─────────────────────────────────────
// Dispatches repository events to trigger GitHub Actions workflows.
// Used by the Figma webhook to trigger DS sync when the Design System
// file is updated, instead of running the sync inline (which would
// exceed serverless function timeouts).

import { createLogger } from "../utils/logger";

const log = createLogger("github-service");

// ─── Configuration ─────────────────────────────────────────

interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
}

function getConfig(): GitHubConfig {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN is not set");

  // Support both GITHUB_REPOSITORY (owner/repo) and separate OWNER/NAME vars
  const repoSlug = process.env.GITHUB_REPOSITORY;
  if (repoSlug) {
    const [owner, repo] = repoSlug.split("/");
    if (owner && repo) return { token, owner, repo };
  }

  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;
  if (!owner || !repo) {
    throw new Error(
      "GitHub repo not configured. Set GITHUB_REPOSITORY (owner/repo) " +
        "or both GITHUB_REPO_OWNER and GITHUB_REPO_NAME."
    );
  }

  return { token, owner, repo };
}

// ─── Repository Dispatch ───────────────────────────────────

interface DispatchPayload {
  file_key: string;
  file_name: string;
  triggered_by: string;
  webhook_request_id: string;
  timestamp: string;
}

/**
 * Trigger the Design System sync GitHub Action via repository_dispatch.
 *
 * This sends a `figma-ds-updated` event to GitHub, which the
 * `.github/workflows/ds-sync.yml` workflow listens for.
 *
 * The Action then:
 *   1. Runs `pnpm ds:sync` (diff + OpenAI code generation)
 *   2. Runs `pnpm ds:build`
 *   3. Creates a PR if changes were detected
 */
export async function dispatchDSSync(
  payload: DispatchPayload
): Promise<{ success: boolean; message: string }> {
  const config = getConfig();

  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/dispatches`;

  log.info("Dispatching DS sync to GitHub Actions", {
    repo: `${config.owner}/${config.repo}`,
    fileKey: payload.file_key,
    fileName: payload.file_name,
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({
        event_type: "figma-ds-updated",
        client_payload: payload,
      }),
    });

    // GitHub returns 204 No Content on success
    if (response.status === 204) {
      log.info("DS sync dispatched successfully", {
        fileKey: payload.file_key,
      });
      return {
        success: true,
        message: `DS sync workflow dispatched for "${payload.file_name}"`,
      };
    }

    const body = await response.text();
    log.error("GitHub dispatch failed", {
      status: response.status,
      body,
    });
    return {
      success: false,
      message: `GitHub API returned ${response.status}: ${body}`,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    log.error("GitHub dispatch error", { error: msg });
    return {
      success: false,
      message: `Dispatch failed: ${msg}`,
    };
  }
}
