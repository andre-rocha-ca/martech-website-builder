"use client";

/**
 * CAWhatsAppButton — Floating WhatsApp button from DS_CA (node 141:454).
 *
 * Tokens:
 *   green/200  #1b9b45  default background
 *   green/100  #33cc66  hover background
 *
 * Shape: rounded except bottom-left corner (brand detail — pill top + square bl)
 * Size: 44×44px icon container, 24px icon
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { imgWhatsapp } from "@/assets/icons";

export interface CAWhatsAppButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** WhatsApp number with country code, e.g. "551140400606" */
  phone?: string;
  /** UTM source label for tracking */
  label?: string;
  size?: "sm" | "md";
}

const CAWhatsAppButton = React.forwardRef<HTMLAnchorElement, CAWhatsAppButtonProps>(
  ({ className, phone = "551140400606", label, size = "md", children, ...props }, ref) => {
    const href =
      props.href ?? `https://wa.me/${phone}${label ? `?text=${encodeURIComponent(label)}` : ""}`;
    const dim = size === "sm" ? "w-9 h-9" : "w-11 h-11";
    const iconDim = size === "sm" ? "w-5 h-5" : "w-6 h-6";

    return (
      <a
        ref={ref}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Fale conosco pelo WhatsApp"
        className={cn(
          // Shape: all corners rounded except bottom-left (brand detail)
          "inline-flex items-center justify-center",
          "rounded-bl-[0px] rounded-br-[12px] rounded-tl-[12px] rounded-tr-[12px]",
          // Colors
          "bg-[#1b9b45] hover:bg-[#33cc66]",
          // Transition
          "transition-colors duration-200",
          // Sizing
          dim,
          className
        )}
        {...props}
      >
        {children ?? <img src={imgWhatsapp} alt="WhatsApp" className={cn("icon-white", iconDim)} />}
      </a>
    );
  }
);

CAWhatsAppButton.displayName = "CAWhatsAppButton";

export { CAWhatsAppButton };
