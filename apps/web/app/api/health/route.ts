import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    service: "martech-website-builder",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    env: {
      hasFigmaToken: !!process.env.FIGMA_API_TOKEN,
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
      hasSegmentKey: !!process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY,
      hasGithubToken: !!process.env.GITHUB_TOKEN,
    },
  });
}
