"use client";

/**
 * CAFeatureItem — Expandable feature accordion from DS_CA (node 70:509).
 *
 * Active state: title in blue #2687e9, body + link visible, seta_up icon
 * Inactive state: title in #35414b, collapsed, rotated chevron
 *
 * Fonts:
 *   Title: Raleway ExtraBold 20px / 28px tracking-[-0.6px]
 *   Body:  Ping Pong Regular 16px / 24px
 *   Link:  Ping Pong Medium 16px / 24px, underline, blue
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { imgArrowUp, imgArrowRight } from "@/assets/icons";

export interface CAFeatureItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onToggle"> {
  /** Feature title */
  title: string;
  /** Expanded body text — supports plain text or ReactNode */
  body?: React.ReactNode;
  /** Link label, e.g. "Veja seus relatórios financeiros" */
  linkLabel?: string;
  /** Link href */
  linkHref?: string;
  /** Controlled open state */
  open?: boolean;
  /** Default open (uncontrolled) */
  defaultOpen?: boolean;
  /** Called when user toggles */
  onToggle?: (open: boolean) => void;
}

const CAFeatureItem = React.forwardRef<HTMLDivElement, CAFeatureItemProps>(
  (
    {
      className,
      title,
      body,
      linkLabel,
      linkHref = "#",
      open: controlledOpen,
      defaultOpen = false,
      onToggle,
      ...props
    },
    ref
  ) => {
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

    const handleToggle = () => {
      const next = !isOpen;
      setInternalOpen(next);
      onToggle?.(next);
    };

    return (
      <div
        ref={ref}
        className={cn("flex w-full flex-col items-start gap-[9px]", className)}
        {...props}
      >
        {/* Header row */}
        <button
          onClick={handleToggle}
          className="group flex w-full items-center justify-between pb-[5px]"
          aria-expanded={isOpen}
        >
          <span
            className={cn(
              "text-[20px] font-extrabold leading-[28px] tracking-[-0.6px] transition-colors duration-200",
              isOpen ? "text-[#2687e9]" : "text-[#35414b] group-hover:text-[#2687e9]"
            )}
            style={{ fontFamily: "'Raleway', sans-serif" }}
          >
            {title}
          </span>

          {/* Chevron — up when open, down when closed */}
          <span
            className={cn(
              "flex h-4 w-4 shrink-0 items-center justify-center transition-transform duration-300",
              isOpen ? "rotate-0" : "rotate-180"
            )}
          >
            <img
              src={imgArrowUp}
              alt=""
              aria-hidden
              className={cn("h-4 w-4", isOpen ? "icon-blue" : "icon-dark")}
            />
          </span>
        </button>

        {/* Expandable body — CSS grid-rows trick (no JS height) */}
        <div
          className="grid w-full transition-[grid-template-rows] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">
            {/* Body text */}
            {body && (
              <div
                className="w-full text-[#35414b]"
                style={{ fontFamily: "'Ping Pong', 'Inter', sans-serif" }}
              >
                {typeof body === "string" ? (
                  <p className="text-[16px] leading-[24px]">{body}</p>
                ) : (
                  body
                )}
              </div>
            )}

            {/* Link */}
            {linkLabel && (
              <div className="flex flex-col py-2">
                <a
                  href={linkHref}
                  className="inline-flex items-center gap-[5px] text-[16px] leading-[24px] text-[#2687e9] underline underline-offset-2 transition-colors duration-150 hover:text-[#1b69c8]"
                  style={{ fontFamily: "'Ping Pong', 'Inter', sans-serif", fontWeight: 500 }}
                >
                  <img
                    src={imgArrowRight}
                    alt=""
                    aria-hidden
                    className="icon-blue h-[10px] w-[10px] shrink-0"
                  />
                  {linkLabel}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

CAFeatureItem.displayName = "CAFeatureItem";

export { CAFeatureItem };
