// FAQSection component with tracking
import { trackSectionView } from "@/components/layout/SegmentScript";
import { useEffect, useRef } from "react";

export default function FAQSection() {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        trackSectionView("FAQ", window.location.pathname);
        observer.disconnect();
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-white p-8">
      <h2 className="mb-4 text-2xl font-bold text-[#2687e9]">FAQ</h2>
      <div className="flex flex-col gap-4">
        <div className="border-b border-[#b9c8d5] pb-4">
          <h3 className="text-lg font-bold text-[#2687e9]">
            Quais relatórios financeiros posso gerar no ERP da Conta Azul?
          </h3>
          <p className="text-base text-[#35414b]">
            Os relatórios financeiros no ERP da Conta Azul oferecem uma visão completa da saúde do
            seu negócio...
          </p>
        </div>
        {/* Additional FAQ items can be added here */}
      </div>
    </section>
  );
}
