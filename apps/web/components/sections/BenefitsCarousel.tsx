// Benefits Carousel Section
"use client";
import { useRef, useEffect } from "react";
import { trackSectionView } from "@/components/layout/SegmentScript";

function BenefitsCarousel() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackSectionView("BenefitsCarousel", window.location.pathname);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-white py-8">
      <div className="container mx-auto flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="flex items-center gap-4 rounded-lg border border-[#b9c8d5] p-4">
            <div className="rounded-full bg-[#ffffff] p-2">
              <span className="material-icons text-[#1b69c8]">check</span>
            </div>
            <p className="text-[16px] font-[400] text-[#35414b]">
              Veja os números do seu negócio em relatórios simples, sem planilhas.
            </p>
          </div>
          <div className="flex items-center gap-4 rounded-lg border border-[#b9c8d5] p-4">
            <div className="rounded-full bg-[#ffffff] p-2">
              <span className="material-icons text-[#1b69c8]">check</span>
            </div>
            <p className="text-[16px] font-[400] text-[#35414b]">
              Dados financeiros, vendas e estoque em relatórios centralizados no ERP.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BenefitsCarousel;
