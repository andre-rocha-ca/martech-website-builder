"use client";

import { trackButtonClick } from "@/components/layout/SegmentScript";
import { TrackedSection } from "@/components/sections/TrackedSection";
import { imgArrowRight } from "@/components/sections/assets";

const GRADIENT = "linear-gradient(196.78deg, #205ed7 1.84%, #2687e9 37.96%, #00aff0 95.1%)";

export function CTASection() {
  return (
    <TrackedSection name="cta-bottom" animate>
      <div className="flex items-center justify-center px-4 py-20" style={{ background: GRADIENT }}>
        <div className="flex max-w-[600px] flex-col items-center gap-6 text-center">
          <h2
            className="text-[40px] leading-[48px] tracking-[-1.44px] text-white lg:text-[48px] lg:leading-[56px]"
            style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 300 }}
          >
            Comece a crescer com{" "}
            <strong style={{ fontWeight: 800 }}>relatórios inteligentes</strong>
          </h2>

          <button
            className="flex items-center gap-[6px] rounded-full px-8 py-4 text-[18px] font-extrabold tracking-[-0.18px] shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl hover:brightness-110 active:scale-95"
            style={{
              backgroundColor: "#f9bd1d",
              color: "#20262b",
              fontFamily: "'Raleway', sans-serif",
            }}
            onClick={() =>
              trackButtonClick("teste grátis", "/relatorios", {
                section: "cta-bottom",
                variant: "primary",
              })
            }
          >
            <img src={imgArrowRight} alt="" className="icon-dark h-4 w-4" />
            teste grátis
          </button>
        </div>
      </div>
    </TrackedSection>
  );
}
