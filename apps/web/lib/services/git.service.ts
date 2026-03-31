// ─── Git Automation Service ─────────────────────────────────
// Handles branch creation, staging, committing, and pushing generated code

import type { SimpleGit } from "simple-git";
import { simpleGit } from "simple-git";
import type { GenerationResult } from "../types/design.types";
import { createLogger } from "../utils/logger";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const log = createLogger("git-service");

// ─── Configuration ──────────────────────────────────────────

const REPO_ROOT = process.cwd();

// ─── Amplify Preview URL ───────────────────────────────────

/**
 * Build the expected Amplify preview URL for a given branch.
 *
 * Amplify auto-creates preview environments for branches matching
 * the configured pattern (design/*). The URL format is:
 *   https://<branch-slug>.<amplify-app-id>.amplifyapp.com
 */
export function buildPreviewUrl(branchName: string): string | null {
  const appId = process.env.AMPLIFY_APP_ID;

  if (!appId) {
    log.warn("AMPLIFY_APP_ID not set — cannot compute preview URL");
    return null;
  }

  const slug = branchName
    .toLowerCase()
    .replace(/[/.]/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 38);

  return `https://${slug}.${appId}.amplifyapp.com`;
}

function getGit(): SimpleGit {
  return simpleGit(REPO_ROOT);
}

// ─── Branch Management ──────────────────────────────────────

/**
 * Create a new design branch from the current HEAD.
 * Branch format: design/YYYYMMDD-HHmmss-{identifier}
 * @param identifier - Figma file ID, prompt hash, or any short identifier
 */
export async function createDesignBranch(identifier: string): Promise<string> {
  const git = getGit();
  const timestamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
  const shortId = identifier.slice(0, 8);
  const branchName = `design/${timestamp}-${shortId}`;

  log.info("Creating design branch", { branchName });

  // Ensure we're on latest main
  try {
    await git.fetch("origin", "main");
    await git.checkout("main");
    await git.pull("origin", "main");
  } catch (err) {
    log.warn("Could not update main, creating branch from current HEAD", {
      error: err instanceof Error ? err.message : String(err),
    });
  }

  await git.checkoutLocalBranch(branchName);
  log.info("Branch created", { branchName });

  return branchName;
}

// ─── File Writing ───────────────────────────────────────────

/**
 * Write all generated files to the repository working directory.
 */
export async function writeGeneratedFiles(result: GenerationResult): Promise<string[]> {
  const writtenFiles: string[] = [];
  const resolvedRoot = path.resolve(REPO_ROOT);

  function assertSafePath(filePath: string): void {
    const resolved = path.resolve(filePath);
    if (!resolved.startsWith(resolvedRoot + path.sep)) {
      throw new Error(`Path traversal detected: ${resolved} escapes repo root`);
    }
  }

  // Write components
  for (const component of result.components) {
    const filePath = path.join(REPO_ROOT, component.path, component.filename);
    assertSafePath(filePath);
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, component.content, "utf-8");
    writtenFiles.push(path.join(component.path, component.filename));
    log.debug("Wrote component", { file: filePath });
  }

  // Write pages
  for (const page of result.pages) {
    const filePath = path.join(REPO_ROOT, page.path, page.filename);
    assertSafePath(filePath);
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, page.content, "utf-8");
    writtenFiles.push(path.join(page.path, page.filename));
    log.debug("Wrote page", { file: filePath });
  }

  // Write design metadata
  const metadataPath = path.join(REPO_ROOT, ".design-metadata.json");
  await writeFile(metadataPath, JSON.stringify(result.metadata, null, 2), "utf-8");
  writtenFiles.push(".design-metadata.json");

  log.info("Generated files written", { count: writtenFiles.length });
  return writtenFiles;
}

// ─── Commit & Push ──────────────────────────────────────────

/**
 * Stage, commit, and push all generated files.
 */
export async function commitAndPush(
  branchName: string,
  result: GenerationResult,
  files: string[]
): Promise<{ commitSha: string; branchName: string }> {
  const git = getGit();
  const { metadata } = result;

  // Stage files
  log.info("Staging generated files", { count: files.length });
  for (const file of files) {
    await git.add(file);
  }

  // Also stage any downloaded assets
  try {
    await git.add("public/assets/");
  } catch (err) {
    log.debug("No assets to stage", { error: err instanceof Error ? err.message : String(err) });
  }

  // Build commit message based on source
  const commitMessage =
    metadata.source === "prompt"
      ? `feat: generate landing page from prompt

Prompt: ${metadata.promptText?.slice(0, 100)}${(metadata.promptText?.length ?? 0) > 100 ? "..." : ""}
Hash: ${metadata.promptHash}
Generated At: ${metadata.generatedAt}

Components: ${metadata.componentCount}
Pages: ${metadata.pageCount}
Generation Time: ${metadata.generationDurationMs}ms

Generated by: martech-website-builder v1.0`
      : `feat: auto-generate pages from Figma design

Figma File ID: ${metadata.figmaFileId}
Design Version: ${metadata.figmaVersion}
Generated At: ${metadata.generatedAt}

Components: ${metadata.componentCount}
Pages: ${metadata.pageCount}
Generation Time: ${metadata.generationDurationMs}ms

Generated by: martech-website-builder v1.0`;

  // Commit
  log.info("Creating commit");
  const commitResult = await git.commit(commitMessage);
  const commitSha = commitResult.commit || "unknown";
  log.info("Commit created", { commitSha });

  // Push with verification
  log.info("Pushing to remote", { branch: branchName });
  try {
    await git.push("origin", branchName, ["--set-upstream"]);
    log.info("Push complete", { branch: branchName, commitSha });
  } catch (pushErr) {
    const msg = pushErr instanceof Error ? pushErr.message : String(pushErr);
    log.error("Push failed", { branch: branchName, error: msg });
    throw new Error(`Git push to origin/${branchName} failed: ${msg}`);
  }

  return { commitSha, branchName };
}

/**
 * Full git workflow: create branch → write files → commit → push
 */
export async function gitPublish(
  identifier: string,
  result: GenerationResult
): Promise<{
  branchName: string;
  commitSha: string;
  filesWritten: number;
  previewUrl: string | null;
}> {
  return log.timed("Git publish", async () => {
    // 1. Create branch
    const branchName = await createDesignBranch(identifier);

    // 2. Write files
    const files = await writeGeneratedFiles(result);

    // 3. Commit and push
    const { commitSha } = await commitAndPush(branchName, result, files);

    // 4. Compute Amplify preview URL
    const previewUrl = buildPreviewUrl(branchName);

    return {
      branchName,
      commitSha,
      filesWritten: files.length,
      previewUrl,
    };
  });
}
