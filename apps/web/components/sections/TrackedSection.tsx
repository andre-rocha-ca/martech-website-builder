// TrackedSection.tsx
"use client";
import { useRef, useEffect } from "react";
import { trackSectionView } from "@/components/layout/SegmentScript";

function TrackedSection({ name, children }: { name: string; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackSectionView(name, window.location.pathname);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [name]);
  return <section ref={ref}>{children}</section>;
}

export { TrackedSection };
export default TrackedSection;
