// ─── Relatórios — ContaAzul landing page ─────────────────────
// Fonts: Raleway (headings), Ping Pong (body — ContaAzul brand font)
// Colors: exact hex values from Figma DS_CA design tokens
//
// Sections live in components/sections/ and are reusable across pages.

import { Navbar } from "@/components/sections/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { FAQSection } from "@/components/sections/FAQ";
import { CTASection } from "@/components/sections/CTASection";

export default function RelatoriosPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="relative">
        <Navbar />
        <HeroSection />
      </div>

      <BenefitsSection />
      <FAQSection />
      <CTASection />
    </main>
  );
}
