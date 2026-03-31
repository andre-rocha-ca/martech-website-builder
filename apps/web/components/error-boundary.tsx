"use client";

// ─── Error Boundary ─────────────────────────────────────────
// Catches render errors in generated pages and shows a
// user-friendly fallback instead of a blank screen.

import { useEffect } from "react";
import { Button } from "@martech/design-system";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[ErrorBoundary]", error);

    // Track error in Segment
    const analytics = (
      window as { analytics?: { track: (name: string, props: Record<string, unknown>) => void } }
    ).analytics;
    if (typeof window !== "undefined" && analytics) {
      analytics.track("Error Occurred", {
        message: error.message,
        digest: error.digest,
        page: window.location.pathname,
        timestamp: new Date().toISOString(),
      });
    }
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="bg-destructive/10 rounded-full p-4">
        <svg
          className="text-destructive h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="text-muted-foreground max-w-md text-sm">
        An error occurred while rendering this page. Please try again or contact support if the
        problem persists.
      </p>
      <Button onClick={reset} variant="outline">
        Try again
      </Button>
    </div>
  );
}
