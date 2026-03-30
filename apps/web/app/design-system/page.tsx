"use client";

import { useState } from "react";
import {
  // Layout / primitives
  cn,
  Separator,
  ScrollArea,
  // Typography / display
  Badge,
  Avatar,
  AvatarImage,
  AvatarFallback,
  // Buttons
  Button,
  // Inputs
  Input,
  Textarea,
  Checkbox,
  Switch,
  Slider,
  RadioGroup,
  RadioGroupItem,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  // Feedback
  Alert,
  AlertTitle,
  AlertDescription,
  Progress,
  Skeleton,
  // Cards
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  // Overlays
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  // Navigation
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  // Table
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@martech/design-system";
import {
  Palette,
  Type,
  Shapes,
  MousePointer,
  FormInput,
  Bell,
  LayoutGrid,
  Navigation,
  Database,
  ChevronRight,
  Copy,
  Check,
  AlertCircle,
  Info,
  CheckCircle2,
  XCircle,
  Settings,
  User,
  LogOut,
  Mail,
  Loader2,
  Star,
  Heart,
  Zap,
} from "lucide-react";

// ─── Brand tokens ────────────────────────────────────────────

const brandColors = [
  { name: "Amarelo Amanhecer", token: "--amarelo-amanhecer", hex: "#f9bd1d", text: "dark" },
  { name: "Azul CA Base", token: "--azul-ca-base", hex: "#2687e9", text: "light" },
  { name: "Azul Escuro", token: "", hex: "#205ed7", text: "light" },
  { name: "Azul Claro", token: "", hex: "#00aff0", text: "dark" },
  { name: "Verde", token: "--green-100", hex: "#33cc66", text: "dark" },
  { name: "Gray 600", token: "--gray-600", hex: "#20262b", text: "light" },
  { name: "Gray 500", token: "--gray-500", hex: "#35414b", text: "light" },
  { name: "Gray 400", token: "", hex: "#536574", text: "light" },
];

const shadcnColors = [
  { name: "Background", hex: "hsl(0 0% 100%)", preview: "#ffffff" },
  { name: "Foreground", hex: "hsl(240 10% 3.9%)", preview: "#0a0a0f" },
  { name: "Primary", hex: "hsl(240 5.9% 10%)", preview: "#18181b" },
  { name: "Secondary", hex: "hsl(240 4.8% 95.9%)", preview: "#f4f4f5" },
  { name: "Destructive", hex: "hsl(0 84.2% 60.2%)", preview: "#ef4444" },
  { name: "Muted", hex: "hsl(240 4.8% 95.9%)", preview: "#f4f4f5" },
  { name: "Border", hex: "hsl(240 5.9% 90%)", preview: "#e4e4e7" },
];

// ─── Type scale ───────────────────────────────────────────────

const typeScale = [
  {
    label: "Display",
    size: "text-[48px]",
    weight: "font-[800]",
    family: "Raleway",
    sample: "Relatórios pro seu negócio crescer",
  },
  {
    label: "H1",
    size: "text-[40px]",
    weight: "font-[800]",
    family: "Raleway",
    sample: "Heading One",
  },
  {
    label: "H2",
    size: "text-[32px]",
    weight: "font-[800]",
    family: "Raleway",
    sample: "Heading Two",
  },
  {
    label: "H3",
    size: "text-[24px]",
    weight: "font-[700]",
    family: "Raleway",
    sample: "Heading Three",
  },
  {
    label: "Body L",
    size: "text-[18px]",
    weight: "font-[400]",
    family: "Ping Pong",
    sample: "Body text large — acompanhe o desempenho",
  },
  {
    label: "Body",
    size: "text-[16px]",
    weight: "font-[400]",
    family: "Ping Pong",
    sample: "Body text regular — dados financeiros",
  },
  {
    label: "Body S",
    size: "text-[14px]",
    weight: "font-[400]",
    family: "Ping Pong",
    sample: "Body text small — relatórios personalizáveis",
  },
  {
    label: "Caption",
    size: "text-[12px]",
    weight: "font-[500]",
    family: "Ping Pong",
    sample: "CAPTION • ERP RELATÓRIO",
  },
];

// ─── Icons ───────────────────────────────────────────────────

const icons = [
  { name: "graph", path: "/assets/icons/graph.svg" },
  { name: "check", path: "/assets/icons/check.svg" },
  { name: "seta_direita", path: "/assets/icons/seta_direita.svg" },
  { name: "seta_down", path: "/assets/icons/seta_down.svg" },
  { name: "seta_up", path: "/assets/icons/seta_up.svg" },
  { name: "whatsapp", path: "/assets/icons/whatsapp.svg" },
  { name: "account_circle", path: "/assets/icons/account_circle.svg" },
  { name: "arrow_down", path: "/assets/icons/arrow_down.svg" },
];

// ─── Nav sections ─────────────────────────────────────────────

const navSections = [
  { id: "grid", label: "Grid", icon: LayoutGrid },
  { id: "colors", label: "Colors", icon: Palette },
  { id: "typography", label: "Typography", icon: Type },
  { id: "icons", label: "Icons", icon: Shapes },
  { id: "buttons", label: "Buttons", icon: MousePointer },
  { id: "forms", label: "Forms", icon: FormInput },
  { id: "feedback", label: "Feedback", icon: Bell },
  { id: "cards", label: "Cards", icon: LayoutGrid },
  { id: "overlays", label: "Overlays", icon: Navigation },
  { id: "data", label: "Data", icon: Database },
];

// ─── Helpers ─────────────────────────────────────────────────

function SectionHeader({
  id,
  title,
  description,
}: {
  id: string;
  title: string;
  description?: string;
}) {
  return (
    <div id={id} className="scroll-mt-20 pb-6 pt-16">
      <h2
        style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 800 }}
        className="text-[28px] leading-tight text-[#20262b]"
      >
        {title}
      </h2>
      {description && (
        <p
          className="mt-1 text-[14px] text-[#536574]"
          style={{ fontFamily: "'Ping Pong', 'Inter', sans-serif" }}
        >
          {description}
        </p>
      )}
      <Separator className="mt-4" />
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="relative mt-3 overflow-hidden rounded-lg bg-[#20262b] font-mono text-[12px] text-[#e4e4e7]">
      <button
        onClick={copy}
        className="absolute right-2 top-2 rounded-md p-1.5 transition-colors hover:bg-white/10"
        aria-label="Copy code"
      >
        {copied ? <Check size={13} className="text-[#33cc66]" /> : <Copy size={13} />}
      </button>
      <pre className="overflow-x-auto p-4 leading-relaxed">{code}</pre>
    </div>
  );
}

function PreviewBox({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 rounded-lg border border-[#e4e4e7] bg-[#fafafa] p-6",
        className
      )}
    >
      {children}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────

export default function DesignSystemPage() {
  const [activeSection, setActiveSection] = useState("colors");
  const [progress, setProgress] = useState(60);
  const [switchOn, setSwitchOn] = useState(true);
  const [checked, setChecked] = useState(true);
  const [sliderVal, setSliderVal] = useState([40]);
  const [radio, setRadio] = useState("option1");

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-white">
        {/* ── Top bar ── */}
        <header className="sticky top-0 z-40 border-b border-[#e4e4e7] bg-white/90 backdrop-blur-sm">
          <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-lg"
                style={{ background: "linear-gradient(196.78deg, #205ed7, #2687e9, #00aff0)" }}
              >
                <Shapes size={14} className="text-white" />
              </div>
              <span
                style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 800 }}
                className="text-[16px] text-[#20262b]"
              >
                DS ContaAzul
              </span>
              <Badge variant="secondary" className="text-[10px]">
                v1.0
              </Badge>
            </div>
            <span
              className="text-[12px] text-[#536574]"
              style={{ fontFamily: "'Ping Pong', 'Inter', sans-serif" }}
            >
              @martech/design-system
            </span>
          </div>
        </header>

        <div className="mx-auto flex max-w-[1400px] gap-8 px-6">
          {/* ── Sidebar ── */}
          <aside className="hidden w-52 flex-shrink-0 pt-8 lg:block">
            <div className="sticky top-20">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[#536574]">
                Sections
              </p>
              <nav className="flex flex-col gap-0.5">
                {navSections.map(({ id, label, icon: Icon }) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    onClick={() => setActiveSection(id)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition-colors",
                      activeSection === id
                        ? "bg-[#2687e9]/10 font-semibold text-[#2687e9]"
                        : "text-[#536574] hover:bg-[#f4f4f5] hover:text-[#20262b]"
                    )}
                    style={{ fontFamily: "'Ping Pong', 'Inter', sans-serif" }}
                  >
                    <Icon size={14} />
                    {label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* ── Main content ── */}
          <main className="min-w-0 flex-1 pb-24">
            {/* Hero intro */}
            <div className="pb-2 pt-10">
              <h1
                style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 800 }}
                className="text-[40px] leading-tight text-[#20262b]"
              >
                Design System
              </h1>
              <p
                className="mt-2 max-w-[560px] text-[16px] text-[#536574]"
                style={{ fontFamily: "'Ping Pong', 'Inter', sans-serif" }}
              >
                All components, tokens, and patterns that make up the ContaAzul martech pages.
                Import everything from{" "}
                <code className="rounded bg-[#f4f4f5] px-1.5 py-0.5 font-mono text-[13px]">
                  @martech/design-system
                </code>
                .
              </p>
            </div>

            {/* ══ GRID ════════════════════════════════════════════════ */}
            <SectionHeader
              id="grid"
              title="Grid"
              description="12-column desktop grid · max-width 1296px · gutter 32px · centered · px-0"
            />

            {/* Visual column preview */}
            <div className="mb-6 overflow-x-auto">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
                  gap: "8px",
                  minWidth: "480px",
                }}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <div
                    key={i}
                    className="flex h-8 items-center justify-center rounded bg-[#2687e9]/15"
                  >
                    <span className="text-[10px] font-semibold text-[#2687e9]">{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Span examples */}
            <div className="mb-6 space-y-2">
              {[
                { label: "ca-col-12", span: 12, desc: "Full width" },
                { label: "ca-col-8 + ca-col-4", span: 8, span2: 4, desc: "2/3 + 1/3" },
                { label: "ca-col-6 + ca-col-6", span: 6, span2: 6, desc: "Half + half" },
                { label: "ca-col-4 × 3", span: 4, span2: 4, span3: 4, desc: "Thirds" },
                { label: "ca-col-3 × 4", span: 3, span2: 3, span3: 3, desc: "Quarters" },
              ].map(({ label, span, span2, span3, desc }) => (
                <div key={label}>
                  <p className="mb-1 font-mono text-[11px] text-[#b0b8c1]">
                    {label} <span className="text-[#e4e4e7]">·</span> {desc}
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{ gridColumn: `span ${span}` }}
                      className="flex h-7 items-center justify-center rounded-md bg-[#2687e9]"
                    >
                      <span className="text-[10px] font-bold text-white">{span}</span>
                    </div>
                    {span2 && (
                      <div
                        style={{ gridColumn: `span ${span2}` }}
                        className="flex h-7 items-center justify-center rounded-md bg-[#2687e9]/40"
                      >
                        <span className="text-[10px] font-bold text-[#2687e9]">{span2}</span>
                      </div>
                    )}
                    {span3 && (
                      <div
                        style={{ gridColumn: `span ${span3}` }}
                        className="flex h-7 items-center justify-center rounded-md bg-[#2687e9]/20"
                      >
                        <span className="text-[10px] font-bold text-[#2687e9]">{span3}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-6 grid grid-cols-3 gap-4 text-center">
              {[
                { label: "Max-width", value: "1296px" },
                { label: "Columns", value: "12" },
                { label: "Gutter", value: "32px" },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl border border-[#e4e4e7] bg-[#fafafa] p-4">
                  <p
                    className="text-[24px] font-bold text-[#2687e9]"
                    style={{ fontFamily: "'Raleway', sans-serif" }}
                  >
                    {value}
                  </p>
                  <p className="mt-0.5 text-[12px] text-[#536574]">{label}</p>
                </div>
              ))}
            </div>

            <CodeBlock
              code={`/* Wrap any section in .ca-section for full-bleed centering */
<section className="ca-section py-12 bg-white">

  {/* .ca-grid = 12 cols, 32px gutter, max-width 1296px, px-0 */}
  <div className="ca-grid">
    <div className="ca-col-12 lg:ca-col-8">Main content</div>
    <div className="ca-col-12 lg:ca-col-4">Sidebar</div>
  </div>

</section>

/* Just the centered container (no grid) */
<div className="ca-container">
  Full-width block, centered, max 1296px, px-0
</div>`}
            />

            {/* ══ COLORS ══════════════════════════════════════════════ */}
            <SectionHeader
              id="colors"
              title="Colors"
              description="Brand palette and shadcn/ui semantic tokens"
            />

            <p className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-[#20262b]">
              Brand palette
            </p>
            <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {brandColors.map((c) => (
                <div key={c.hex} className="overflow-hidden rounded-xl border border-[#e4e4e7]">
                  <div className="h-16" style={{ backgroundColor: c.hex }} />
                  <div className="bg-white p-2.5">
                    <p className="text-[12px] font-semibold text-[#20262b]">{c.name}</p>
                    <p className="font-mono text-[11px] text-[#536574]">{c.hex}</p>
                    {c.token && (
                      <p className="mt-0.5 font-mono text-[10px] text-[#536574]">{c.token}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <p className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-[#20262b]">
              Semantic tokens (shadcn)
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {shadcnColors.map((c) => (
                <div key={c.name} className="overflow-hidden rounded-xl border border-[#e4e4e7]">
                  <div
                    className="h-12 border-b border-[#e4e4e7]"
                    style={{ backgroundColor: c.preview }}
                  />
                  <div className="bg-white p-2.5">
                    <p className="text-[12px] font-semibold text-[#20262b]">{c.name}</p>
                    <p className="mt-0.5 font-mono text-[10px] text-[#536574]">{c.hex}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Gradient */}
            <div className="mt-4 overflow-hidden rounded-xl border border-[#e4e4e7]">
              <div
                className="h-16"
                style={{
                  background:
                    "linear-gradient(196.78deg, #205ed7 1.84%, #2687e9 37.96%, #00aff0 95.1%)",
                }}
              />
              <div className="flex items-center justify-between bg-white p-3">
                <div>
                  <p className="text-[12px] font-semibold text-[#20262b]">gradient_azul</p>
                  <p className="font-mono text-[11px] text-[#536574]">
                    196.78deg · #205ed7 → #2687e9 → #00aff0
                  </p>
                </div>
              </div>
            </div>

            <CodeBlock
              code={`/* Tailwind arbitrary */
className="bg-[#2687e9]"            // azul_ca_base
className="bg-ca-yellow"            // amarelo_amanhecer (tailwind.config)
className="text-ca-gray-600"        // #20262b

/* CSS variable */
color: var(--azul-ca-base);`}
            />

            {/* ══ TYPOGRAPHY ══════════════════════════════════════════ */}
            <SectionHeader
              id="typography"
              title="Typography"
              description="Two brand fonts: Raleway (headings) and Ping Pong (body)"
            />

            <div className="space-y-1">
              {typeScale.map((t) => (
                <div
                  key={t.label}
                  className="flex items-baseline gap-4 border-b border-[#f4f4f5] py-3 last:border-0"
                >
                  <div className="w-20 flex-shrink-0">
                    <span className="font-mono text-[11px] text-[#536574]">{t.label}</span>
                    <p className="text-[10px] text-[#b0b8c1]">{t.size}</p>
                  </div>
                  <p
                    className={cn(t.size, t.weight, "truncate leading-tight text-[#20262b]")}
                    style={{
                      fontFamily:
                        t.family === "Raleway"
                          ? "'Raleway', sans-serif"
                          : "'Ping Pong', 'Inter', sans-serif",
                    }}
                  >
                    {t.sample}
                  </p>
                </div>
              ))}
            </div>

            <CodeBlock
              code={`/* Heading — Raleway */
style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 800 }}

/* Body — Ping Pong (falls back to Inter) */
style={{ fontFamily: "'Ping Pong', 'Inter', sans-serif" }}

/* Or Tailwind */
className="font-raleway font-[800]"
className="font-ping-pong"`}
            />

            {/* ══ ICONS ═══════════════════════════════════════════════ */}
            <SectionHeader
              id="icons"
              title="Icons"
              description="SVG icons from packages/design-system/assets/icons/ — served from /public/assets/icons/"
            />

            <div className="mb-4 grid grid-cols-4 gap-3 sm:grid-cols-8">
              {icons.map((ic) => (
                <div
                  key={ic.name}
                  className="group flex flex-col items-center gap-2 rounded-xl border border-[#e4e4e7] bg-[#fafafa] p-3 transition-colors hover:border-[#2687e9]"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e4e4e7] bg-white">
                    <img src={ic.path} alt={ic.name} className="h-4 w-4" />
                  </div>
                  <span className="text-center font-mono text-[10px] leading-tight text-[#536574]">
                    {ic.name}
                  </span>
                </div>
              ))}
            </div>

            <p className="mb-2 text-[13px] text-[#536574]">Color filter helpers:</p>
            <div className="mb-2 flex flex-wrap gap-3">
              {[
                { cls: "icon-white", bg: "#20262b", label: "icon-white" },
                { cls: "icon-blue", bg: "#fafafa", label: "icon-blue" },
                { cls: "icon-dark", bg: "#fafafa", label: "icon-dark" },
                { cls: "icon-yellow", bg: "#20262b", label: "icon-yellow" },
              ].map(({ cls, bg, label }) => (
                <div
                  key={cls}
                  className="flex items-center gap-2 rounded-lg border border-[#e4e4e7] px-3 py-2"
                  style={{ backgroundColor: bg }}
                >
                  <img src="/assets/icons/graph.svg" alt="" className={cn(cls, "h-4 w-4")} />
                  <code
                    className="text-[11px]"
                    style={{ color: bg === "#20262b" ? "#e4e4e7" : "#536574" }}
                  >
                    .{label}
                  </code>
                </div>
              ))}
            </div>

            <CodeBlock
              code={`<img src="/assets/icons/graph.svg" className="icon-blue w-5 h-5" />
<img src="/assets/icons/check.svg" className="icon-white w-5 h-5" />
<img src="/assets/icons/seta_direita.svg" className="icon-dark w-4 h-4" />`}
            />

            {/* ══ BUTTONS ═════════════════════════════════════════════ */}
            <SectionHeader
              id="buttons"
              title="Buttons"
              description="All variants from @martech/design-system Button"
            />

            <p className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-[#536574]">
              Variants
            </p>
            <PreviewBox>
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </PreviewBox>

            <p className="mb-2 mt-4 text-[12px] font-semibold uppercase tracking-wider text-[#536574]">
              Sizes
            </p>
            <PreviewBox className="items-center">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon">
                <Star size={16} />
              </Button>
            </PreviewBox>

            <p className="mb-2 mt-4 text-[12px] font-semibold uppercase tracking-wider text-[#536574]">
              States
            </p>
            <PreviewBox>
              <Button disabled>Disabled</Button>
              <Button>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Loading
              </Button>
            </PreviewBox>

            <p className="mb-2 mt-4 text-[12px] font-semibold uppercase tracking-wider text-[#536574]">
              Brand CTA
            </p>
            <PreviewBox className="bg-[#20262b]">
              <button
                className="flex items-center gap-[6px] rounded-full px-7 py-3 text-[16px] font-extrabold tracking-[-0.16px] transition-all duration-200 hover:scale-105 hover:brightness-110 active:scale-95"
                style={{
                  backgroundColor: "#f9bd1d",
                  color: "#20262b",
                  fontFamily: "'Raleway', sans-serif",
                }}
              >
                <img src="/assets/icons/seta_direita.svg" alt="" className="icon-dark h-4 w-4" />
                teste grátis
              </button>
              <button
                className="flex items-center gap-[6px] rounded-full border border-white px-7 py-3 text-[16px] font-extrabold tracking-[-0.16px] text-white transition-all duration-200 hover:scale-105"
                style={{ fontFamily: "'Raleway', sans-serif" }}
              >
                saiba mais
              </button>
            </PreviewBox>

            <CodeBlock
              code={`import { Button } from "@martech/design-system";

<Button>Default</Button>
<Button variant="outline" size="lg">Outline Large</Button>
<Button variant="destructive" disabled>Disabled</Button>`}
            />

            {/* ══ BADGES ══════════════════════════════════════════════ */}
            <div className="mt-8">
              <p className="mb-3 text-[14px] font-semibold text-[#20262b]">Badge</p>
              <PreviewBox>
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge className="bg-[#2687e9] text-white">CA Blue</Badge>
                <Badge className="bg-[#f9bd1d] text-[#20262b]">CA Yellow</Badge>
                <Badge className="bg-[#33cc66] text-white">CA Green</Badge>
              </PreviewBox>
              <CodeBlock
                code={`<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge className="bg-[#2687e9] text-white">CA Blue</Badge>`}
              />
            </div>

            {/* ══ FORMS ═══════════════════════════════════════════════ */}
            <SectionHeader
              id="forms"
              title="Forms"
              description="Input, Textarea, Select, Checkbox, Switch, RadioGroup, Slider"
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Input */}
              <div>
                <p className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-[#536574]">
                  Input
                </p>
                <div className="space-y-2">
                  <Input placeholder="Email address" type="email" />
                  <Input placeholder="Disabled input" disabled />
                  <div className="relative">
                    <Mail
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#536574]"
                    />
                    <Input placeholder="With icon" className="pl-8" />
                  </div>
                </div>
              </div>

              {/* Textarea */}
              <div>
                <p className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-[#536574]">
                  Textarea
                </p>
                <Textarea placeholder="Write your message here…" rows={4} />
              </div>

              {/* Select */}
              <div>
                <p className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-[#536574]">
                  Select
                </p>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um plano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="starter">Starter</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Slider */}
              <div>
                <p className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-[#536574]">
                  Slider — {sliderVal[0]}%
                </p>
                <Slider value={sliderVal} onValueChange={setSliderVal} max={100} step={1} />
              </div>

              {/* Checkbox */}
              <div>
                <p className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-[#536574]">
                  Checkbox
                </p>
                <div className="space-y-2">
                  {["Relatórios financeiros", "Relatórios de vendas", "Exportar para Excel"].map(
                    (item, i) => (
                      <div key={item} className="flex items-center gap-2">
                        <Checkbox id={`cb-${i}`} defaultChecked={i === 0} />
                        <Label htmlFor={`cb-${i}`} className="text-[14px] text-[#35414b]">
                          {item}
                        </Label>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Switch + RadioGroup */}
              <div className="space-y-4">
                <div>
                  <p className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-[#536574]">
                    Switch
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Switch checked={switchOn} onCheckedChange={setSwitchOn} id="sw1" />
                      <Label htmlFor="sw1">{switchOn ? "Ativado" : "Desativado"}</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch disabled />
                      <Label className="text-[#b0b8c1]">Disabled</Label>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-[#536574]">
                    Radio Group
                  </p>
                  <RadioGroup value={radio} onValueChange={setRadio}>
                    {["Mensal", "Anual", "Bienal"].map((opt, i) => (
                      <div key={opt} className="flex items-center gap-2">
                        <RadioGroupItem value={`option${i + 1}`} id={`r${i}`} />
                        <Label htmlFor={`r${i}`}>{opt}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </div>

            <CodeBlock
              code={`import { Input, Select, SelectTrigger, SelectValue,
  SelectContent, SelectItem, Switch, Checkbox } from "@martech/design-system";

<Input placeholder="Email" type="email" />

<Select>
  <SelectTrigger><SelectValue placeholder="Selecione…" /></SelectTrigger>
  <SelectContent>
    <SelectItem value="pro">Pro</SelectItem>
  </SelectContent>
</Select>

<Switch checked={on} onCheckedChange={setOn} />`}
            />

            {/* ══ FEEDBACK ════════════════════════════════════════════ */}
            <SectionHeader id="feedback" title="Feedback" description="Alert, Progress, Skeleton" />

            <div className="mb-6 space-y-3">
              <Alert>
                <Info size={16} />
                <AlertTitle>Info</AlertTitle>
                <AlertDescription>
                  Seus relatórios foram atualizados em tempo real.
                </AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <XCircle size={16} />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>
                  Não foi possível carregar os dados. Tente novamente.
                </AlertDescription>
              </Alert>
              <Alert className="border-[#33cc66] text-[#33cc66]">
                <CheckCircle2 size={16} />
                <AlertTitle>Sucesso</AlertTitle>
                <AlertDescription className="text-[#35414b]">
                  Relatório exportado com sucesso.
                </AlertDescription>
              </Alert>
            </div>

            <p className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-[#536574]">
              Progress
            </p>
            <div className="mb-6 space-y-3">
              <div className="flex items-center gap-3">
                <Progress value={progress} className="flex-1" />
                <span className="w-10 text-right text-[13px] text-[#536574]">{progress}%</span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setProgress(Math.max(0, progress - 10))}
                >
                  −10
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setProgress(Math.min(100, progress + 10))}
                >
                  +10
                </Button>
              </div>
            </div>

            <p className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-[#536574]">
              Skeleton
            </p>
            <div className="space-y-2">
              <Skeleton className="h-6 w-[240px]" />
              <Skeleton className="h-4 w-[320px]" />
              <Skeleton className="h-4 w-[280px]" />
              <div className="mt-3 flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-[160px]" />
                  <Skeleton className="h-3 w-[120px]" />
                </div>
              </div>
            </div>

            <CodeBlock
              code={`import { Alert, AlertTitle, AlertDescription, Progress, Skeleton } from "@martech/design-system";

<Alert>
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>Something happened.</AlertDescription>
</Alert>

<Progress value={60} />
<Skeleton className="h-6 w-[240px]" />`}
            />

            {/* ══ CARDS ════════════════════════════════════════════════ */}
            <SectionHeader id="cards" title="Cards" description="Card, Avatar, Separator" />

            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Relatórios</CardTitle>
                  <CardDescription>Dados financeiros em tempo real</CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={75} />
                  <p className="mt-2 text-[13px] text-[#536574]">75% das metas atingidas</p>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button size="sm">Ver mais</Button>
                  <Button size="sm" variant="outline">
                    Exportar
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-[#2687e9]/30 bg-gradient-to-br from-white to-[#f0f7ff]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-[#2687e9]">Pro</CardTitle>
                    <Badge className="bg-[#2687e9] text-white">Popular</Badge>
                  </div>
                  <CardDescription>Para empresas em crescimento</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-[32px] font-bold text-[#20262b]">
                    R$97<span className="text-[14px] text-[#536574]">/mês</span>
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" style={{ backgroundColor: "#2687e9" }}>
                    Começar agora
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-[#2687e9] text-white">CA</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-[15px]">Conta Azul</CardTitle>
                      <CardDescription className="text-[12px]">admin@contaazul.com</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-3">
                  <div className="space-y-1">
                    {["Dashboard", "Relatórios", "Configurações"].map((item) => (
                      <div key={item} className="flex items-center justify-between py-1.5">
                        <span className="text-[13px] text-[#35414b]">{item}</span>
                        <ChevronRight size={14} className="text-[#b0b8c1]" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <p className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-[#536574]">
              Avatar
            </p>
            <PreviewBox>
              <Avatar>
                <AvatarFallback className="bg-[#2687e9] text-white">CA</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback className="bg-[#f9bd1d] text-[#20262b]">AB</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback className="bg-[#33cc66] text-white">GR</AvatarFallback>
              </Avatar>
              <Avatar className="h-12 w-12">
                <AvatarFallback>LG</AvatarFallback>
              </Avatar>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-[11px]">SM</AvatarFallback>
              </Avatar>
            </PreviewBox>

            <CodeBlock
              code={`import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@martech/design-system";

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter><Button>Action</Button></CardFooter>
</Card>`}
            />

            {/* ══ OVERLAYS ════════════════════════════════════════════ */}
            <SectionHeader
              id="overlays"
              title="Overlays"
              description="Dialog, Sheet, Tooltip, Popover, Dropdown"
            />

            <PreviewBox className="flex-wrap gap-3">
              {/* Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Open Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirmar exportação</DialogTitle>
                    <DialogDescription>
                      O relatório será exportado em formato PDF. Deseja continuar?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button style={{ backgroundColor: "#2687e9" }}>Exportar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Sheet */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">Open Sheet</Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filtros</SheetTitle>
                    <SheetDescription>
                      Ajuste os filtros para personalizar seu relatório.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    <div>
                      <Label>Período</Label>
                      <Input className="mt-1" type="date" />
                    </div>
                    <div>
                      <Label>Categoria</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Todas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Tooltip */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">
                    <Info size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Dados atualizados em tempo real</TooltipContent>
              </Tooltip>

              {/* Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">Popover</Button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <p className="mb-1 text-[13px] font-semibold">Sobre os relatórios</p>
                  <p className="text-[12px] text-[#536574]">
                    Seus dados são atualizados a cada 60 segundos automaticamente.
                  </p>
                </PopoverContent>
              </Popover>

              {/* Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <User size={14} className="mr-2" />
                    Conta
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings size={13} className="mr-2" />
                    Configurações
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Heart size={13} className="mr-2" />
                    Favoritos
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-500">
                    <LogOut size={13} className="mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </PreviewBox>

            <CodeBlock
              code={`import { Dialog, DialogTrigger, DialogContent, DialogHeader,
  DialogTitle, DialogFooter, DialogClose } from "@martech/design-system";

<Dialog>
  <DialogTrigger asChild><Button>Open</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm</DialogTitle>
    </DialogHeader>
    <DialogFooter>
      <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`}
            />

            {/* ══ DATA ════════════════════════════════════════════════ */}
            <SectionHeader id="data" title="Data" description="Tabs, Accordion, Table" />

            {/* Tabs */}
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-[#536574]">
              Tabs
            </p>
            <Tabs defaultValue="financeiro" className="mb-8">
              <TabsList>
                <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
                <TabsTrigger value="vendas">Vendas</TabsTrigger>
                <TabsTrigger value="estoque">Estoque</TabsTrigger>
              </TabsList>
              <TabsContent value="financeiro" className="mt-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[13px] text-[#536574]">Receita total</p>
                        <p className="text-[28px] font-bold text-[#20262b]">R$ 48.200</p>
                      </div>
                      <Badge className="border-[#33cc66]/20 bg-[#33cc66]/10 text-[#33cc66]">
                        ↑ 12%
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="vendas" className="mt-4">
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-[#536574]">Dados de vendas aqui.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="estoque" className="mt-4">
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-[#536574]">Dados de estoque aqui.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Accordion */}
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-[#536574]">
              Accordion
            </p>
            <Accordion type="single" collapsible className="mb-8">
              {[
                {
                  q: "Como exportar um relatório?",
                  a: "Clique em Exportar no canto superior e escolha o formato desejado — PDF ou Excel.",
                },
                {
                  q: "Os dados são em tempo real?",
                  a: "Sim! Todos os relatórios são atualizados automaticamente a cada minuto.",
                },
                {
                  q: "Posso compartilhar com minha equipe?",
                  a: "Basta clicar em Compartilhar e adicionar os emails dos colaboradores.",
                },
              ].map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-[15px] text-[#20262b]">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-[#536574]">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Table */}
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-[#536574]">
              Table
            </p>
            <div className="mb-4 overflow-hidden rounded-lg border border-[#e4e4e7]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#fafafa]">
                    <TableHead>Relatório</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Atualizado</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      name: "DRE Gerencial",
                      cat: "Financeiro",
                      date: "Hoje, 14:32",
                      status: "Ativo",
                    },
                    {
                      name: "Fluxo de Caixa",
                      cat: "Financeiro",
                      date: "Hoje, 12:10",
                      status: "Ativo",
                    },
                    {
                      name: "Desempenho de Vendas",
                      cat: "Vendas",
                      date: "Ontem, 18:00",
                      status: "Rascunho",
                    },
                    { name: "Estoque Atual", cat: "Compras", date: "Seg, 09:15", status: "Ativo" },
                  ].map((row) => (
                    <TableRow key={row.name} className="hover:bg-[#fafafa]">
                      <TableCell className="font-medium text-[#20262b]">{row.name}</TableCell>
                      <TableCell className="text-[#536574]">{row.cat}</TableCell>
                      <TableCell className="text-[13px] text-[#536574]">{row.date}</TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={row.status === "Ativo" ? "default" : "secondary"}
                          className={row.status === "Ativo" ? "bg-[#33cc66]/10 text-[#33cc66]" : ""}
                        >
                          {row.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <CodeBlock
              code={`import { Tabs, TabsList, TabsTrigger, TabsContent,
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from "@martech/design-system";`}
            />

            {/* Footer */}
            <div className="mt-16 flex items-center justify-between border-t border-[#e4e4e7] pt-8">
              <p className="text-[12px] text-[#b0b8c1]">@martech/design-system · ContaAzul</p>
              <div className="flex items-center gap-2">
                <Zap size={12} className="text-[#f9bd1d]" />
                <p className="text-[12px] text-[#b0b8c1]">Powered by shadcn/ui + Figma</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
