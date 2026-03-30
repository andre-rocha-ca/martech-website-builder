"use client";

import * as React from "react";
import { trackSectionView } from "@/components/layout/SegmentScript";

interface TrackedSectionProps {
  name: string;
  children: React.ReactNode;
  className?: string;
  /**
   * When true the section fades up from below when it first enters the
   * viewport. Powered by .ca-animate-ready / .ca-animate-in CSS classes.
   */
  animate?: boolean;
}

export function TrackedSection({
  name,
  children,
  className,
  animate = false,
}: TrackedSectionProps) {
  const ref = React.useRef<HTMLElement | null>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackSectionView(name, window.location.pathname);
          if (animate) setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [name, animate]);

  const animationClasses = animate ? `ca-animate-ready${visible ? " ca-animate-in" : ""}` : "";

  return (
    <section ref={ref} className={[className, animationClasses].filter(Boolean).join(" ")}>
      {children}
    </section>
  );
}
