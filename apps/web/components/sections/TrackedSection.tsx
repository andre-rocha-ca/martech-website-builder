"use client";

import { useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackSectionView } from "@/components/layout/SegmentScript";

interface TrackedSectionProps {
  name: string;
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

function TrackedSection({ name, children, className, animate }: TrackedSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackSectionView(name, pathname);
          obs.disconnect();
          if (animate) {
            el.classList.add("ca-animate-in");
          }
        }
      },
      { threshold: 0.15 }
    );
    if (animate) {
      el.classList.add("ca-animate-ready");
    }
    obs.observe(el);
    return () => obs.disconnect();
  }, [name, pathname, animate]);

  return (
    <section ref={ref} className={className}>
      {children}
    </section>
  );
}

export { TrackedSection };
export default TrackedSection;
