"use client";

/**
 * CAButton — Conta Azul branded button component.
 *
 * Variants extracted directly from DS_CA Figma file (node 10:56).
 * Using CVA instead of the generated if/else tree for maintainability.
 *
 * Figma design tokens:
 *   amarelo_amanhecer   #f9bd1d  (yellow default)
 *   amarelo_entardecer  #f0a700  (yellow hover / active)
 *   azul_ceu_aberto     #2687e9  (blue default)
 *   azul_ceu_amanhecer  #5aadf1  (blue hover)
 *   azul_ceu_anoitecer  #1b69c8  (blue active / pressed)
 *   gray/600            #20262b  (dark text)
 *   gray/400            #536574  (disabled text)
 *   gray/200            #b9c8d5  (disabled bg / border)
 *   gray/100            #eff3f7  (light text on blue primary)
 *
 * Usage:
 *   <CAButton color="amarelo" variant="primary" size="xlg" shape="round">
 *     teste grátis
 *   </CAButton>
 */

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ─── Design tokens ───────────────────────────────────────────────────────────

const TOKENS = {
  amarelo: {
    default: "#f9bd1d",
    hover: "#f0a700",
    active: "#f0a700",
    disabled: "#b9c8d5",
  },
  azul: {
    default: "#2687e9",
    hover: "#5aadf1",
    active: "#1b69c8",
    disabled: "#b9c8d5",
  },
  text: {
    amareloPrimary: "#20262b",
    azulPrimary: "#eff3f7",
    azulPrimaryHover: "#ffffff",
    disabled: "#536574",
  },
} as const;

// ─── CVA variant definition ──────────────────────────────────────────────────

const caButtonVariants = cva(
  // Base — shared across all variants
  [
    "inline-flex items-center justify-center gap-[6px]",
    "font-extrabold whitespace-nowrap",
    "transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "active:scale-[0.97]",
    "disabled:pointer-events-none cursor-pointer select-none",
    "font-['Raleway',sans-serif]",
  ],
  {
    variants: {
      /** Brand color — amarelo (yellow) or azul (blue) */
      color: {
        amarelo: "",
        azul: "",
      },
      /** Primary = filled, Secondary = outlined ghost */
      variant: {
        primary: "",
        secondary: "bg-transparent border border-solid",
      },
      /** Three sizes matching Figma: MD / LG / XLG */
      size: {
        md: "px-6 py-2 text-[14px] leading-[20px] tracking-[-0.14px]",
        lg: "px-7 py-3 text-[16px] leading-[24px] tracking-[-0.16px]",
        xlg: "px-7 py-3 text-[18px] leading-[28px] tracking-[-0.18px]",
      },
      /** Pill (round) or rounded-rect (square) */
      shape: {
        round: "rounded-[204px]",
        square: "rounded-[12px]",
      },
    },

    // ── Compound variants: color × variant combinations ──
    compoundVariants: [
      // ── amarelo + primary ──
      {
        color: "amarelo",
        variant: "primary",
        className: [
          "bg-[#f9bd1d] text-[#20262b]",
          "hover:bg-[#f0a700]",
          "active:bg-[#f0a700] active:ring-1 active:ring-[#f9bd1d]",
          "disabled:bg-[#b9c8d5] disabled:text-[#536574]",
        ],
      },
      // ── amarelo + secondary ──
      {
        color: "amarelo",
        variant: "secondary",
        className: [
          "border-[#f9bd1d] text-[#f9bd1d]",
          "hover:border-[#f0a700] hover:text-[#f0a700]",
          "active:border-[#f0a700] active:text-[#f9bd1d]",
          "disabled:border-[#b9c8d5] disabled:text-[#536574]",
        ],
      },
      // ── azul + primary ──
      {
        color: "azul",
        variant: "primary",
        className: [
          "bg-[#2687e9] text-[#eff3f7]",
          "hover:bg-[#5aadf1] hover:text-white",
          "active:bg-[#1b69c8] active:text-white",
          "disabled:bg-[#b9c8d5] disabled:text-[#536574]",
        ],
      },
      // ── azul + secondary ──
      {
        color: "azul",
        variant: "secondary",
        className: [
          "border-[#2687e9] text-[#2687e9]",
          "hover:border-[#5aadf1] hover:text-[#5aadf1]",
          "active:border-[#1b69c8] active:text-[#1b69c8]",
          "disabled:border-[#b9c8d5] disabled:text-[#536574]",
        ],
      },
    ],

    defaultVariants: {
      color: "amarelo",
      variant: "primary",
      size: "xlg",
      shape: "round",
    },
  }
);

// ─── Component ───────────────────────────────────────────────────────────────

// Omit the HTML `color` attribute so our CVA `color` variant takes precedence
export interface CAButtonProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color">,
    VariantProps<typeof caButtonVariants> {
  /** Render as child element (Radix Slot pattern) */
  asChild?: boolean;
  /** Optional left icon — renders before the label */
  iconLeft?: React.ReactNode;
  /** Optional right icon — renders after the label */
  iconRight?: React.ReactNode;
}

const CAButton = React.forwardRef<HTMLButtonElement, CAButtonProps>(
  (
    {
      className,
      color,
      variant,
      size,
      shape,
      asChild = false,
      iconLeft,
      iconRight,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(caButtonVariants({ color, variant, size, shape }), className)}
        {...props}
      >
        {iconLeft && (
          <span className="inline-flex shrink-0 items-center" aria-hidden>
            {iconLeft}
          </span>
        )}
        {children}
        {iconRight && (
          <span className="inline-flex shrink-0 items-center" aria-hidden>
            {iconRight}
          </span>
        )}
      </Comp>
    );
  }
);

CAButton.displayName = "CAButton";

export { CAButton, caButtonVariants, TOKENS };
