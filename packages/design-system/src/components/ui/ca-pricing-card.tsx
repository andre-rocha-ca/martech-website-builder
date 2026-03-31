"use client";

/**
 * CAPricingCard — Pricing plan card from DS_CA (node 63:156).
 *
 * Tokens:
 *   azul_ceu_aberto  #2687e9  plan name, CTA button
 *   red/100          #ff3d32  crossed-out original price
 *   gray/600         #20262b  text, big price
 *   gray/100         #eff3f7  CTA button text
 *   shadow on hover: 0 0 32px rgba(38,135,233,0.2)
 *
 * Shape: rounded tl-[40px] tr-[40px] br-[80px] — asymmetric brand detail
 * Fonts: Ping Pong Bold (plan name), Raleway ExtraBold (plan type), Ping Pong XBold (price)
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { imgArrowRight, imgAccountCircle } from "@/assets/icons";

export interface CAPricingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Plan display name, e.g. "Controle" */
  planName: string;
  /** Subtitle, e.g. "Microempreendedor (ME)" */
  subtitle?: string;
  /** Original price (shown with strikethrough), e.g. "499,90" */
  originalPrice?: string;
  /** Current price, e.g. "309,90" */
  price: string;
  /** Unit suffix, e.g. "/mês" */
  priceUnit?: string;
  /** Savings line, e.g. "R$ 190,00 por mês" */
  savings?: string;
  /** Description, e.g. "Pra quem fatura de R$81k até R$360K por ano" */
  description?: string;
  /** User access label, e.g. "Acesso de 2 usuários" */
  userAccess?: string;
  /** CTA button label */
  ctaLabel?: string;
  /** CTA click handler */
  onCtaClick?: () => void;
  /** Highlight (hover shadow) state — can be controlled or uncontrolled */
  highlighted?: boolean;
}

const CAPricingCard = React.forwardRef<HTMLDivElement, CAPricingCardProps>(
  (
    {
      className,
      planName,
      subtitle,
      originalPrice,
      price,
      priceUnit = "/mês",
      savings,
      description,
      userAccess,
      ctaLabel = "comece agora",
      onCtaClick,
      highlighted = false,
      ...props
    },
    ref
  ) => {
    const [hovered, setHovered] = React.useState(false);
    const isHighlighted = highlighted || hovered;

    return (
      <div
        ref={ref}
        className={cn(
          "flex w-[386px] flex-col items-start overflow-hidden bg-white px-8 py-[42px]",
          // Asymmetric brand shape
          "rounded-bl-[0px] rounded-br-[80px] rounded-tl-[40px] rounded-tr-[40px]",
          // Shadow on hover
          "transition-shadow duration-300",
          isHighlighted && "shadow-[0_0_32px_0_rgba(38,135,233,0.2)]",
          className
        )}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        {...props}
      >
        {/* Plan header */}
        <div className="flex w-full flex-col items-center gap-1 pb-2">
          <p
            className="w-full text-center text-[24px] font-extrabold leading-[32px] tracking-[-0.72px] text-[#2687e9]"
            style={{ fontFamily: "'Raleway', sans-serif" }}
          >
            {planName}
          </p>
          {subtitle && (
            <p
              className="w-full text-center text-[16px] leading-[24px] text-[#20262b]"
              style={{ fontFamily: "'Ping Pong', 'Inter', sans-serif" }}
            >
              {subtitle}
            </p>
          )}
          {originalPrice && (
            <p
              className="w-full text-center text-[20px] leading-[28px] tracking-[-2px] text-[#ff3d32] line-through"
              style={{ fontFamily: "'Ping Pong', 'Inter', sans-serif", fontWeight: 500 }}
            >
              de {originalPrice}
            </p>
          )}

          {/* "a partir de" divider */}
          <div className="flex w-full items-center gap-2 pt-2">
            <div className="h-px flex-1 bg-[#e2e8f0]" />
            <span
              className="whitespace-nowrap text-center text-[14px] leading-[20px] text-[#20262b]"
              style={{ fontFamily: "'Ping Pong', 'Inter', sans-serif", fontWeight: 500 }}
            >
              a partir de
            </span>
            <div className="h-px flex-1 bg-[#e2e8f0]" />
          </div>
        </div>

        {/* Price */}
        <div className="flex w-full flex-col items-center gap-px pb-4">
          <p className="w-full text-center text-[#20262b]" style={{ lineHeight: 0 }}>
            <span
              className="text-[40px] leading-[48px] tracking-[-2px]"
              style={{ fontFamily: "'Ping Pong', 'Inter', sans-serif", fontWeight: 800 }}
            >
              {price}
            </span>
            <span
              className="text-[24px] leading-[normal]"
              style={{ fontFamily: "'Ping Pong', 'Inter', sans-serif", fontWeight: 500 }}
            >
              {priceUnit}
            </span>
          </p>
          {savings && (
            <p
              className="w-full text-center text-[14px] leading-[20px] text-[#20262b]"
              style={{ fontFamily: "'Ping Pong', 'Inter', sans-serif" }}
            >
              Você economiza <strong style={{ fontWeight: 700 }}>R$ {savings}</strong> por mês
            </p>
          )}
        </div>

        {/* CTA Button */}
        <button
          onClick={onCtaClick}
          className={cn(
            "flex w-full items-center justify-center gap-[6px] rounded-full px-7 py-3",
            "bg-[#2687e9] text-[#eff3f7]",
            "text-[16px] font-extrabold leading-[24px] tracking-[-0.16px]",
            "hover:bg-[#5aadf1] active:bg-[#1b69c8]",
            "mb-4 transition-colors duration-200"
          )}
          style={{ fontFamily: "'Raleway', sans-serif" }}
        >
          <img src={imgArrowRight} alt="" className="icon-white h-4 w-4" />
          {ctaLabel}
        </button>

        {/* Description */}
        {description && (
          <div className="flex w-full flex-col items-center gap-4 pb-3">
            <p
              className="w-full text-center text-[16px] leading-[24px] text-[#20262b]"
              style={{ fontFamily: "'Ping Pong', 'Inter', sans-serif" }}
            >
              {description.split("\n").map((line, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </p>
            <div className="h-px w-full bg-[#e2e8f0]" />
            {userAccess && (
              <div className="flex w-full items-center justify-center gap-1">
                <img src={imgAccountCircle} alt="" className="icon-dark h-6 w-6" />
                <span
                  className="whitespace-nowrap text-[16px] leading-[24px] text-[#20262b]"
                  style={{ fontFamily: "'Ping Pong', 'Inter', sans-serif" }}
                >
                  {userAccess}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

CAPricingCard.displayName = "CAPricingCard";

export { CAPricingCard };
