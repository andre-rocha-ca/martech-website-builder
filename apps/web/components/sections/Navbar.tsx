"use client";

import { useState } from "react";
import { trackButtonClick, trackEvent } from "@/components/layout/SegmentScript";
import { imgWhatsapp, imgArrowRight } from "@/components/sections/assets";

const NAV_LINKS = [
  { label: "Soluções", href: "/solucoes" },
  { label: "Planos", href: "/planos" },
  { label: "Parceiros", href: "/parceiros" },
  { label: "Aprenda", href: "/aprenda" },
];

const PAGE = "/relatorios";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="ca-animate-ready ca-animate-in w-full"
      style={{ fontFamily: "'Raleway', sans-serif" }}
    >
      {/* Desktop */}
      <nav className="hidden items-center justify-between bg-[#134ca2] px-8 py-4 lg:flex">
        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-2"
          onClick={() => trackEvent("Logo Clicked", { page: PAGE })}
        >
          <svg
            width="120"
            height="28"
            viewBox="0 0 120 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Conta Azul"
          >
            <text
              x="0"
              y="22"
              fill="white"
              fontSize="20"
              fontWeight="700"
              fontFamily="Raleway, sans-serif"
            >
              conta
            </text>
            <text
              x="62"
              y="22"
              fill="#f9bd1d"
              fontSize="20"
              fontWeight="700"
              fontFamily="Raleway, sans-serif"
            >
              azul
            </text>
          </svg>
        </a>

        {/* Nav links */}
        <ul className="flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="relative px-4 py-2 text-[15px] font-semibold text-white/80 transition-colors duration-150 after:absolute after:bottom-0 after:left-4 after:right-4 after:h-[2px] after:origin-left after:scale-x-0 after:bg-[#f9bd1d] after:transition-transform after:duration-200 hover:text-white hover:after:scale-x-100"
                onClick={() =>
                  trackEvent("Navigation Clicked", {
                    label: link.label,
                    href: link.href,
                    page: PAGE,
                  })
                }
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* WhatsApp */}
          <a
            href="https://wa.me/551140400606"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-[14px] font-semibold text-white transition-all duration-200 hover:border-white/70 hover:bg-white/10"
            onClick={() => trackEvent("WhatsApp Clicked", { page: PAGE })}
          >
            <img src={imgWhatsapp} alt="" className="icon-white h-4 w-4" />
            Fale conosco
          </a>

          {/* CTA */}
          <button
            className="flex items-center gap-[6px] rounded-full bg-[#f9bd1d] px-5 py-2 text-[14px] font-extrabold text-[#20262b] shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg hover:brightness-110 active:scale-95"
            onClick={() => trackButtonClick("teste grátis", PAGE, { section: "navbar" })}
          >
            <img src={imgArrowRight} alt="" className="icon-dark h-4 w-4" />
            teste grátis
          </button>
        </div>
      </nav>

      {/* Mobile */}
      <nav className="flex items-center justify-between bg-[#134ca2] px-5 py-4 lg:hidden">
        {/* Logo */}
        <a href="/" onClick={() => trackEvent("Logo Clicked", { page: PAGE })}>
          <svg
            width="100"
            height="24"
            viewBox="0 0 120 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <text
              x="0"
              y="22"
              fill="white"
              fontSize="20"
              fontWeight="700"
              fontFamily="Raleway, sans-serif"
            >
              conta
            </text>
            <text
              x="62"
              y="22"
              fill="#f9bd1d"
              fontSize="20"
              fontWeight="700"
              fontFamily="Raleway, sans-serif"
            >
              azul
            </text>
          </svg>
        </a>

        {/* Hamburger */}
        <button
          className="flex h-8 w-8 flex-col items-center justify-center gap-[5px]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          <span
            className={`h-[2px] w-5 rounded bg-white transition-all duration-200 ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`}
          />
          <span
            className={`h-[2px] w-5 rounded bg-white transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`h-[2px] w-5 rounded bg-white transition-all duration-200 ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
          />
        </button>
      </nav>

      {/* Mobile menu drawer */}
      <div
        className="overflow-hidden bg-[#0d3a8a] transition-all duration-300 lg:hidden"
        style={{ maxHeight: menuOpen ? "400px" : "0px" }}
      >
        <ul className="flex flex-col gap-1 px-5 py-4">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="block border-b border-white/10 py-3 text-[16px] font-semibold text-white/80 transition-colors duration-150 hover:text-white"
                onClick={() => {
                  setMenuOpen(false);
                  trackEvent("Navigation Clicked", {
                    label: link.label,
                    href: link.href,
                    page: PAGE,
                  });
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="pt-4">
            <button
              className="w-full rounded-full bg-[#f9bd1d] py-3 text-[16px] font-extrabold text-[#20262b] transition-all duration-200 hover:brightness-110"
              onClick={() => {
                setMenuOpen(false);
                trackButtonClick("teste grátis", PAGE, { section: "navbar-mobile" });
              }}
            >
              teste grátis
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
}

// backward compat default export (for page-1/page.tsx)
export default Navbar;
