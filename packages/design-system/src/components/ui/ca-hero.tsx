"use client";

/**
 * CAHero — Hero section component from DS_CA (node 192:1375).
 *
 * 7 variants across 2 axes:
 *   bg:           "image" | "blue" | "white" | "gradient"
 *   contentAlign: "left"  | "center"
 *
 * Tokens:
 *   azul_ceu_aberto     #2687e9  blue bg
 *   azul_ceu_anoitecer  #1b69c8  white-bg headline color
 *   azul_profundo       #00084f  white-bg pill text (left variant)
 *   gray/500            #35414b  white-bg body text, pill text (center)
 *   gray/600            #20262b  CTA text
 *   amarelo_amanhecer   #f9bd1d  CTA button
 *   gradient:           196.78deg #205ed7 1.84%, #2687e9 37.96%, #00aff0 95.1%
 *
 * Typography:
 *   badge:    Ping Pong Medium 12px/20px tracking-[1px]
 *   headline: Raleway Light 48px/56px tracking-[-1.44px] + ExtraBold for emphasis
 *   body:     Ping Pong Regular 18px/28px
 *   CTA:      Raleway ExtraBold 16px/24px tracking-[-0.16px]
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { imgArrowRight } from "@/assets/icons";

// ─── Constants ───────────────────────────────────────────────────────────────

const GRADIENT = "linear-gradient(196.78deg, #205ed7 1.84%, #2687e9 37.96%, #00aff0 95.1%)";

// ─── Sub-components ──────────────────────────────────────────────────────────

function HeroBadge({ dark = false }: { dark?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-[18px] py-2 text-[12px] leading-[20px] tracking-[1px]",
        dark ? "border-[#35414b] text-[#35414b]" : "border-white text-white"
      )}
      style={{ fontFamily: "'Ping Pong', 'Inter', sans-serif", fontWeight: 500 }}
    >
      ERP RELATÓRIO
    </span>
  );
}

function HeroHeadline({ dark = false, center = false }: { dark?: boolean; center?: boolean }) {
  return (
    <p
      className={cn(
        "text-[48px] leading-[56px] tracking-[-1.44px]",
        center && "text-center",
        dark ? "text-[#1b69c8]" : "text-white"
      )}
      style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 300 }}
    >
      Relatórios pro seu <strong style={{ fontWeight: 800 }}>negócio crescer</strong>
    </p>
  );
}

function HeroBody({ dark = false, center = false }: { dark?: boolean; center?: boolean }) {
  return (
    <p
      className={cn(
        "text-[18px] leading-[28px]",
        center && "max-w-[668px] text-center",
        dark ? "text-[#35414b]" : "text-white"
      )}
      style={{ fontFamily: "'Ping Pong', 'Inter', sans-serif" }}
    >
      Acompanhe o desempenho do seu negócio em tempo real com relatórios financeiros prontos e
      personalizáveis da Conta Azul.
    </p>
  );
}

function HeroCTA({ center = false }: { center?: boolean }) {
  return (
    <div className={cn("pt-[10px]", center && "flex justify-center")}>
      <button
        className="inline-flex items-center gap-[6px] rounded-full bg-[#f9bd1d] px-7 py-3 text-[16px] font-extrabold leading-[24px] tracking-[-0.16px] text-[#20262b] transition-all duration-200 hover:bg-[#f0a700] active:scale-[0.97]"
        style={{ fontFamily: "'Raleway', sans-serif" }}
      >
        <img src={imgArrowRight} alt="" className="icon-dark h-4 w-4" />
        teste grátis
      </button>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export interface CAHeroProps extends React.HTMLAttributes<HTMLElement> {
  /** Background style */
  bg?: "image" | "blue" | "white" | "gradient";
  /** Content alignment */
  contentAlign?: "left" | "center";
  /** Background image URL (for bg="image") */
  backgroundImage?: string;
  /** Override badge text */
  badgeText?: string;
  /** Override headline — ReactNode allows rich formatting */
  headline?: React.ReactNode;
  /** Override body text */
  body?: string;
  /** CTA button label */
  ctaLabel?: string;
  /** CTA click handler */
  onCtaClick?: () => void;
}

const CAHero = React.forwardRef<HTMLElement, CAHeroProps>(
  (
    {
      className,
      bg = "image",
      contentAlign = "left",
      backgroundImage,
      badgeText,
      headline,
      body,
      ctaLabel,
      onCtaClick,
      children,
      ...props
    },
    ref
  ) => {
    const isCenter = contentAlign === "center";
    const isDark = bg === "white";

    // Background styles per variant
    const bgStyles: React.CSSProperties =
      bg === "gradient"
        ? { background: GRADIENT }
        : bg === "blue"
          ? { backgroundColor: "#2687e9" }
          : bg === "white"
            ? { backgroundColor: "#ffffff" }
            : {};

    return (
      <section
        ref={ref}
        className={cn("relative flex min-h-[551px] w-full flex-col items-center", className)}
        style={bgStyles}
        {...props}
      >
        {/* Background image (only for bg="image") */}
        {bg === "image" && backgroundImage && (
          <img
            src={backgroundImage}
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* Container */}
        <div
          className={cn(
            "relative z-10 flex w-full max-w-[1296px] flex-1 flex-col justify-center px-8",
            isCenter ? "items-center" : "items-start"
          )}
        >
          {/* Content column */}
          <div
            className={cn(
              "flex flex-col gap-4",
              isCenter ? "items-center" : "items-start",
              !isCenter && bg === "image" && "max-w-[520px]"
            )}
          >
            {/* Badge */}
            {badgeText !== undefined ? (
              <span
                className={cn(
                  "inline-flex items-center rounded-full border px-[18px] py-2 text-[12px] leading-[20px] tracking-[1px]",
                  isDark ? "border-[#35414b] text-[#35414b]" : "border-white text-white"
                )}
                style={{ fontFamily: "'Ping Pong', 'Inter', sans-serif", fontWeight: 500 }}
              >
                {badgeText}
              </span>
            ) : (
              <HeroBadge dark={isDark} />
            )}

            {/* Headline */}
            {headline ? (
              <div
                className={cn(
                  "text-[48px] leading-[56px] tracking-[-1.44px]",
                  isCenter && "text-center",
                  isDark ? "text-[#1b69c8]" : "text-white"
                )}
                style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 300 }}
              >
                {headline}
              </div>
            ) : (
              <HeroHeadline dark={isDark} center={isCenter} />
            )}

            {/* Body */}
            {body ? (
              <p
                className={cn(
                  "text-[18px] leading-[28px]",
                  isCenter && "max-w-[668px] text-center",
                  isDark ? "text-[#35414b]" : "text-white"
                )}
                style={{ fontFamily: "'Ping Pong', 'Inter', sans-serif" }}
              >
                {body}
              </p>
            ) : (
              <HeroBody dark={isDark} center={isCenter} />
            )}

            {/* CTA */}
            <div className={cn("pt-[10px]", isCenter && "flex justify-center")}>
              <button
                onClick={onCtaClick}
                className="inline-flex items-center gap-[6px] rounded-full bg-[#f9bd1d] px-7 py-3 text-[16px] font-extrabold leading-[24px] tracking-[-0.16px] text-[#20262b] transition-all duration-200 hover:bg-[#f0a700] active:scale-[0.97]"
                style={{ fontFamily: "'Raleway', sans-serif" }}
              >
                <img src={imgArrowRight} alt="" className="icon-dark h-4 w-4" />
                {ctaLabel ?? "teste grátis"}
              </button>
            </div>

            {/* Slot for extra content (e.g. check items, cards) */}
            {children}
          </div>
        </div>
      </section>
    );
  }
);

CAHero.displayName = "CAHero";

export { CAHero };
