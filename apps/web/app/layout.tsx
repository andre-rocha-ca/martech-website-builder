import { Inter, Raleway } from "next/font/google";
import { TooltipProvider } from "@martech/design-system";
import { SegmentScript } from "@/components/layout/SegmentScript";
import { defaultMetadata } from "@/lib/metadata";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Raleway — used for headings in the ContaAzul design system
const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  weight: ["300", "400", "700", "800"],
  display: "swap",
});

export const metadata = defaultMetadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${raleway.variable}`} suppressHydrationWarning>
      <body className="bg-background text-foreground min-h-screen font-sans antialiased">
        <TooltipProvider delayDuration={300}>{children}</TooltipProvider>
        <SegmentScript />
      </body>
    </html>
  );
}
