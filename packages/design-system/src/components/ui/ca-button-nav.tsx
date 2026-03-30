"use client";

/**
 * CAButtonNav — Navigation link button from DS_CA (node 192:400).
 *
 * Tokens:
 *   Default style (on dark bg): white text, white arrow
 *   Default style hover/active: #b9c8d5 text (gray/200), blue arrow
 *   Cinza style (on light bg):  #35414b text (gray/500), gray arrow
 *   Cinza style hover/active:   #2687e9 text (azul_ceu_aberto), blue arrow
 *
 * Font: Ping Pong Regular 18px / line-height 28px
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { imgArrowDown } from "@/assets/icons";

const caButtonNavVariants = cva(
  [
    "inline-flex items-center gap-[7px] cursor-pointer select-none",
    "transition-colors duration-150",
    "text-[18px] leading-[28px]",
    "font-['Ping_Pong',_'Inter',_sans-serif] font-normal",
  ],
  {
    variants: {
      /** Default = nav on dark/blue bg; cinza = nav on white/light bg */
      style: {
        default: "text-white hover:text-[#b9c8d5]",
        cinza: "text-[#35414b] hover:text-[#2687e9]",
      },
    },
    defaultVariants: {
      style: "default",
    },
  }
);

export interface CAButtonNavProps
  extends
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "style">,
    VariantProps<typeof caButtonNavVariants> {
  label: string;
  /** Show dropdown chevron */
  showArrow?: boolean;
}

const CAButtonNav = React.forwardRef<HTMLAnchorElement, CAButtonNavProps>(
  ({ className, style, label, showArrow = false, ...props }, ref) => (
    <a ref={ref} className={cn(caButtonNavVariants({ style }), className)} {...props}>
      {label}
      {showArrow && (
        <img
          src={imgArrowDown}
          alt=""
          aria-hidden
          className={cn(
            "h-4 w-4 transition-colors duration-150",
            style === "cinza" ? "icon-blue" : "icon-white"
          )}
        />
      )}
    </a>
  )
);

CAButtonNav.displayName = "CAButtonNav";

export { CAButtonNav, caButtonNavVariants };
