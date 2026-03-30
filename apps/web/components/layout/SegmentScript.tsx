"use client";

// ─── Segment CDP Analytics ──────────────────────────────────
// Complete tracking infrastructure for AI-generated pages.
// Includes: auto page views, click tracking, section viewport
// tracking, and helper functions for every event type.

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useCallback, Suspense } from "react";

const WRITE_KEY = process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY || "";

// ─── Segment Snippet ────────────────────────────────────────

function getSegmentSnippet(writeKey: string): string {
  return `
    !function(){var i="analytics",analytics=window[i]=window[i]||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","screen","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware","register"];analytics.factory=function(e){return function(){if(window[i].initialized)return window[i][e].apply(window[i],arguments);var n=Array.prototype.slice.call(arguments);if(["track","screen","alias","group","page","identify"].indexOf(e)>-1){var c=document.querySelector("link[rel=canonical]");n.push({__t:"bpc",c:c&&c.getAttribute("href")||void 0,p:location.pathname,u:location.href,s:location.search,t:document.title,r:document.referrer})}n.unshift(e);analytics.push(n);return analytics}};for(var n=0;n<analytics.methods.length;n++){var key=analytics.methods[n];analytics[key]=analytics.factory(key)}analytics.load=function(key,n){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.setAttribute("data-global-segment-analytics-key",i);t.src="https://cdn.segment.com/analytics.js/v1/"+key+"/analytics.min.js";var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(t,r);analytics._loadOptions=n};analytics._writeKey="${writeKey}";analytics.SNIPPET_VERSION="5.2.1";
    analytics.load("${writeKey}");
    analytics.page();
    }}();
  `;
}

// ─── Global Type Declaration ────────────────────────────────

declare global {
  interface Window {
    analytics?: {
      track: (event: string, properties?: Record<string, unknown>) => void;
      page: (name?: string, properties?: Record<string, unknown>) => void;
      identify: (userId: string, traits?: Record<string, unknown>) => void;
      group: (groupId: string, traits?: Record<string, unknown>) => void;
    };
  }
}

// ─── Page View Tracker ──────────────────────────────────────

function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== "undefined" && window.analytics) {
      window.analytics.page(undefined, {
        path: pathname,
        search: searchParams.toString(),
        url: window.location.href,
        title: document.title,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

// ─── Auto Click Tracker ─────────────────────────────────────
// Automatically tracks ALL click events on the page via delegation.
// Captures: buttons, links, and any element with data-track-* attributes.

function AutoClickTracker() {
  const pathname = usePathname();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target || typeof window === "undefined" || !window.analytics) return;

      // Find the closest trackable element
      const trackable = target.closest(
        "button, a, [data-track-event], [role='button']"
      ) as HTMLElement | null;
      if (!trackable) return;

      const tagName = trackable.tagName.toLowerCase();
      const label =
        trackable.getAttribute("data-track-label") ||
        trackable.getAttribute("aria-label") ||
        trackable.textContent?.trim().slice(0, 80) ||
        "";

      // data-track-event override: custom event name
      const customEvent = trackable.getAttribute("data-track-event");
      if (customEvent) {
        const customProps: Record<string, unknown> = { label, page: pathname };
        // Collect all data-track-* attributes as properties
        for (const attr of Array.from(trackable.attributes)) {
          if (
            attr.name.startsWith("data-track-") &&
            attr.name !== "data-track-event" &&
            attr.name !== "data-track-label"
          ) {
            const propName = attr.name.replace("data-track-", "");
            customProps[propName] = attr.value;
          }
        }
        window.analytics!.track(customEvent, customProps);
        return;
      }

      // Auto-track buttons
      if (tagName === "button" || trackable.getAttribute("role") === "button") {
        window.analytics!.track("Button Clicked", {
          label,
          page: pathname,
          variant: trackable.getAttribute("data-variant") || undefined,
          section: trackable.closest("section")?.getAttribute("data-section") || undefined,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Auto-track links
      if (tagName === "a") {
        const href = (trackable as HTMLAnchorElement).href || "";
        window.analytics!.track("Link Clicked", {
          label,
          href,
          page: pathname,
          section: trackable.closest("section")?.getAttribute("data-section") || undefined,
          isExternal: href.startsWith("http") && !href.includes(window.location.hostname),
          timestamp: new Date().toISOString(),
        });
      }
    }

    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, [pathname]);

  return null;
}

// ─── Main Segment Component ─────────────────────────────────

export function SegmentScript() {
  if (!WRITE_KEY) {
    console.warn("[Segment] NEXT_PUBLIC_SEGMENT_WRITE_KEY is not set. Analytics disabled.");
    return null;
  }

  return (
    <>
      <Script
        id="segment-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: getSegmentSnippet(WRITE_KEY),
        }}
      />
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
      <AutoClickTracker />
    </>
  );
}

// ─── Tracking Helpers ───────────────────────────────────────
// Import and call these from generated components for explicit tracking.

export function trackEvent(event: string, properties?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.analytics) {
    window.analytics.track(event, {
      ...properties,
      timestamp: new Date().toISOString(),
    });
  }
}

export function trackButtonClick(label: string, page: string, extra?: Record<string, unknown>) {
  trackEvent("Button Clicked", { label, page, ...extra });
}

export function trackLinkClick(href: string, page: string, extra?: Record<string, unknown>) {
  trackEvent("Link Clicked", { href, page, ...extra });
}

export function trackFormSubmit(formName: string, page: string, extra?: Record<string, unknown>) {
  trackEvent("Form Submitted", { formName, page, ...extra });
}

export function trackSectionView(
  sectionName: string,
  page: string,
  extra?: Record<string, unknown>
) {
  trackEvent("Section Viewed", { sectionName, page, ...extra });
}

export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.analytics) {
    window.analytics.identify(userId, traits);
  }
}

// ─── Tracked Section Component ──────────────────────────────
// Wrap every major page section (hero, features, pricing, etc.)
// in <TrackedSection> to auto-track when it enters the viewport.

export function TrackedSection({
  name,
  className,
  children,
  id,
}: {
  name: string;
  className?: string;
  children: React.ReactNode;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined" || !window.analytics) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackSectionView(name, pathname);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [name, pathname]);

  return (
    <section ref={ref} id={id} className={className} data-section={name}>
      {children}
    </section>
  );
}

// ─── Tracked Card Wrapper ───────────────────────────────────
// Wrap individual cards to track when they enter the viewport.

export function useCardViewTracking(cardTitle: string, section: string, position: number) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined" || !window.analytics) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackEvent("Card Viewed", {
            cardTitle,
            page: pathname,
            section,
            position,
          });
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [cardTitle, section, position, pathname]);

  return ref;
}
