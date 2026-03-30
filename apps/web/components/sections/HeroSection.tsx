"use client";

import { useState, useEffect } from "react";
import { trackButtonClick } from "@/components/layout/SegmentScript";
import { TrackedSection } from "@/components/sections/TrackedSection";
import {
  imgHeroDesktop,
  imgHeroMobile,
  imgCheckCircle,
  imgArrowRight,
} from "@/components/sections/assets";

const checks = ["Financeiros", "Vendas", "Compras e estoque"];

function useStaggerStyles(count: number, stepMs = 120, startMs = 200) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return Array.from(
    { length: count },
    (_, i) =>
      ({
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.65s cubic-bezier(0.22,1,0.36,1) ${startMs + i * stepMs}ms, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${startMs + i * stepMs}ms`,
      }) as React.CSSProperties
  );
}

function HeroContent({ mobile = false }: { mobile?: boolean }) {
  const s = useStaggerStyles(5);

  return (
    <div className="relative z-10 flex w-full max-w-[520px] flex-col gap-4">
      <div style={s[0]}>
        <span
          className="inline-flex items-center rounded-full border border-white px-[18px] py-2 text-[12px] tracking-[1px] text-white"
          style={{ fontFamily: "'Ping Pong', 'Inter', sans-serif", fontWeight: 500 }}
        >
          ERP RELATÓRIO
        </span>
      </div>

      <h1
        className={`${mobile ? "text-[40px] leading-[48px] tracking-[-1.2px]" : "text-[48px] leading-[56px] tracking-[-1.44px]"} text-white`}
        style={{ fontFamily: "'Raleway', sans-serif", ...s[1] }}
      >
        <span style={{ fontWeight: 300 }}>Relatórios pro seu </span>
        {!mobile && <br />}
        <strong style={{ fontWeight: 800 }}>negócio crescer</strong>
      </h1>

      <p
        className={`text-white ${mobile ? "text-[16px] leading-6" : "text-[18px] leading-7"}`}
        style={{ fontFamily: "'Ping Pong', 'Inter', sans-serif", ...s[2] }}
      >
        Acompanhe o desempenho do seu negócio em tempo real com relatórios financeiros prontos e
        personalizáveis da Conta Azul.
      </p>

      <div className="flex flex-wrap gap-4">
        {checks.map((item, i) => (
          <div
            key={item}
            className="flex items-center gap-2"
            style={{
              opacity: s[3].opacity,
              transform: s[3].transform,
              transition: `opacity 0.65s cubic-bezier(0.22,1,0.36,1) ${560 + i * 80}ms, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${560 + i * 80}ms`,
            }}
          >
            <img
              src={imgCheckCircle}
              alt=""
              className={`icon-white ${mobile ? "h-5 w-5" : "h-6 w-6"}`}
            />
            <span
              className={`text-white ${mobile ? "text-[14px] leading-5" : "text-[16px] leading-6"} whitespace-nowrap`}
              style={{ fontFamily: "'Ping Pong', 'Inter', sans-serif" }}
            >
              {item}
            </span>
          </div>
        ))}
      </div>

      <div className="pt-[10px]" style={s[4]}>
        <button
          className={`${mobile ? "w-full justify-center" : ""} flex items-center gap-[6px] rounded-full px-7 py-3 text-[16px] font-extrabold tracking-[-0.16px] transition-all duration-200 hover:scale-105 hover:brightness-110 active:scale-95`}
          style={{
            backgroundColor: "#f9bd1d",
            color: "#20262b",
            fontFamily: "'Raleway', sans-serif",
          }}
          onClick={() =>
            trackButtonClick("teste grátis", "/relatorios", {
              section: mobile ? "hero-mobile" : "hero",
              variant: "primary",
            })
          }
        >
          <img src={imgArrowRight} alt="" className="icon-dark h-4 w-4" />
          teste grátis
        </button>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <TrackedSection name="hero" className="relative w-full overflow-hidden">
      <div className="relative hidden h-[689px] items-center justify-center lg:flex">
        <div className="absolute inset-0 bg-[#eff3f7]" />
        <img
          src={imgHeroDesktop}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden="true"
        />
        <div className="relative z-10 w-full max-w-[1296px] self-center px-6 lg:px-0">
          <HeroContent />
        </div>
      </div>

      <div className="relative flex h-[911px] min-w-[390px] items-end justify-center px-4 pb-[100px] lg:hidden">
        <div className="absolute inset-0 bg-[#134ca2]" />
        <img
          src={imgHeroMobile}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden="true"
        />
        <div className="relative z-10 w-full">
          <HeroContent mobile />
        </div>
      </div>
    </TrackedSection>
  );
}
export default HeroSection;
