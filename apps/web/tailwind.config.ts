import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    // ─── CA Desktop grid ─────────────────────────────────────
    // 12 cols · max-width 1296px · gutter 32px · centered · px-0
    // Usage:  <div className="ca-grid">  (full 12-col wrapper)
    //         <div className="ca-col-span-6">  (half width)
    // The grid-cols-12 + gap-[32px] are applied by the utility class below.
    extend: {
      // ─── shadcn/ui CSS variable-based colour system ───────
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Brand tokens from Figma (kept for generated pages)
        brand: {
          primary: "var(--color-brand-primary, hsl(var(--primary)))",
          secondary: "var(--color-brand-secondary, hsl(var(--secondary)))",
          accent: "var(--color-brand-accent, hsl(var(--accent)))",
        },
        // ─── ContaAzul brand palette ──────────────────────────
        // Usage: bg-ca-yellow, text-ca-blue, bg-ca-gray-600, etc.
        ca: {
          yellow: "#f9bd1d", // amarelo_amanhecer
          blue: "#2687e9", // azul_ca_base
          "blue-dark": "#205ed7",
          "blue-light": "#00aff0",
          green: "#33cc66", // green/100
          "gray-600": "#20262b",
          "gray-500": "#35414b",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        heading: ["var(--font-heading)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        // ContaAzul brand fonts
        raleway: ["var(--font-raleway)", "Raleway", "sans-serif"],
        "ping-pong": ["'Ping Pong'", "Inter", "var(--font-inter)", "sans-serif"],
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "48px",
        "3xl": "64px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
