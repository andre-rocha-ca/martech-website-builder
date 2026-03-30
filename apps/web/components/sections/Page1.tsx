"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
  cn,
} from "@martech/design-system";
import { ArrowRight, ChevronDown, Menu, MessageCircle, Check } from "lucide-react";
import { trackButtonClick, trackEvent, trackLinkClick } from "@/components/layout/SegmentScript";
import { TrackedSection } from "./TrackedSection";

function NavLink({
  href,
  children,
  section,
}: {
  href: string;
  children: React.ReactNode;
  section: string;
}) {
  const pathname = usePathname();
  return (
    <Link
      href={href}
      onClick={() =>
        trackLinkClick(href, pathname, {
          section,
          label: typeof children === "string" ? children : href,
        })
      }
      className="text-[18px] leading-[28px] text-white"
    >
      {children}
    </Link>
  );
}

function ButtonState({ label, className }: { label: string; className: string }) {
  const pathname = usePathname();
  return (
    <Button
      type="button"
      variant="default"
      size="lg"
      className={cn(
        "pointer-events-none justify-center gap-[6px] px-[28px] py-[12px] text-[14px] font-extrabold leading-[20px] tracking-[-0.14px]",
        className
      )}
      onClick={() =>
        trackButtonClick(label, pathname, { section: "Button States", variant: "default" })
      }
      aria-label={label}
    >
      <ArrowRight className="h-[16px] w-[16px]" />
      <span>button</span>
    </Button>
  );
}

function HeroSection() {
  const pathname = usePathname();
  return (
    <TrackedSection name="Hero" className="bg-[#134ca2] lg:bg-[#eff3f7]">
      <div className="mx-auto flex min-h-[911px] w-full max-w-[1296px] flex-col justify-end px-4 pb-0 pt-0 lg:min-h-[689px] lg:justify-center lg:px-0">
        <div className="flex flex-col gap-4 pb-[32px] lg:w-[520px] lg:pb-0">
          <div className="flex h-[36px] w-[133px] items-center justify-center rounded-full border border-white px-[18px] py-[8px]">
            <span className="text-[12px] font-medium leading-[20px] tracking-[1px] text-white">
              ERP RELATÓRIO
            </span>
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="max-w-[358px] text-[40px] font-extrabold leading-[48px] tracking-[-1.2px] text-white lg:max-w-[520px] lg:text-[48px] lg:font-light lg:leading-[56px] lg:tracking-[-1.44px]">
              Relatórios pro seu negócio crescer
            </h1>
            <p className="max-w-[358px] text-[16px] font-normal leading-[24px] text-white lg:max-w-[520px] lg:text-[18px] lg:leading-[28px]">
              Acompanhe o desempenho do seu negócio em tempo real com relatórios financeiros prontos
              e personalizáveis da Conta Azul.
            </p>
            <div className="flex flex-wrap gap-4 text-white">
              {["Financeiros", "Vendas", "Compras e estoque"].map((label) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white text-[12px] leading-none">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-[14px] leading-[20px]">{label}</span>
                </div>
              ))}
            </div>
            <Button
              size="lg"
              className="mt-2 w-full rounded-full bg-[#f9bd1d] px-[28px] py-[12px] text-[16px] font-extrabold leading-[24px] tracking-[-0.16px] text-[#20262b] hover:bg-[#f0a700] lg:w-[165px]"
              onClick={() =>
                trackButtonClick("teste grátis", pathname, { section: "Hero", variant: "default" })
              }
            >
              <ArrowRight className="mr-[6px] h-[16px] w-[16px]" />
              teste grátis
            </Button>
          </div>
        </div>
      </div>
    </TrackedSection>
  );
}

function Navbar() {
  const pathname = usePathname();
  return (
    <header className="bg-white">
      <div className="mx-auto flex h-[84px] w-full max-w-[1296px] items-center justify-between px-4 py-4 lg:h-[68px] lg:px-0">
        <Link
          href="/page-1"
          onClick={() => trackLinkClick("/page-1", pathname, { section: "Header", label: "Logo" })}
          aria-label="Conta Azul home"
        >
          <Image
            src="/assets/images/85-1740.png"
            alt="Conta Azul logo"
            width={167}
            height={24}
            className="h-6 w-auto"
          />
        </Link>
        <nav className="hidden items-center gap-[42px] lg:flex" aria-label="Primary navigation">
          <NavLink href="#solucoes" section="Header">
            Soluções
          </NavLink>
          <NavLink href="#funcionalidades" section="Header">
            Funcionalidades
          </NavLink>
          <NavLink href="#planos" section="Header">
            Planos
          </NavLink>
          <NavLink href="#parceiros" section="Header">
            Parceiros
          </NavLink>
          <NavLink href="#aprenda" section="Header">
            Apreenda
          </NavLink>
          <NavLink href="#entrar" section="Header">
            Entrar
          </NavLink>
          <Button
            className="h-[36px] rounded-full bg-[#f9bd1d] px-[24px] py-[8px] text-[14px] font-extrabold leading-[20px] tracking-[-0.14px] text-[#20262b] hover:bg-[#f0a700]"
            onClick={() =>
              trackButtonClick("teste grátis", pathname, { section: "Header", variant: "default" })
            }
          >
            <ArrowRight className="mr-[6px] h-[14px] w-[14px]" />
            teste grátis
          </Button>
        </nav>
        <Button
          variant="ghost"
          size="icon"
          className="h-11 w-11 lg:hidden"
          aria-label="Open menu"
          onClick={() =>
            trackEvent("Navigation Clicked", {
              label: "Menu",
              href: "#menu",
              page: pathname,
              menuLevel: "top",
            })
          }
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}

function BenefitsCards() {
  const pathname = usePathname();
  const items = [
    "Veja os números do seu negócio\nem relatórios simples, sem planilhas.",
    "Dados financeiro, vendas e estoque\nem relatórios centralizados no ERP.",
    "Dados financeiro, vendas e estoque\nem relatórios centralizados no ERP.",
  ];
  return (
    <TrackedSection name="Benefits" className="bg-white py-0">
      <div className="mx-auto flex w-full max-w-[1296px] flex-col gap-4 px-4 py-6 lg:flex-row lg:gap-0 lg:px-0">
        {items.map((text, idx) => (
          <Card
            key={idx}
            className="w-full rounded-none border-0 bg-[#2a2a2a] p-0 shadow-none lg:w-[416px]"
          >
            <CardContent className="flex h-[120px] items-center gap-[18px] px-[24px] py-[32px]">
              <div className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-white">
                <Image
                  src="/assets/images/85-1739.png"
                  alt="Analytics icon"
                  width={26}
                  height={26}
                  className="h-[26px] w-[26px]"
                />
              </div>
              <p className="whitespace-pre-line text-[18px] font-normal leading-[28px] text-white">
                {text}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </TrackedSection>
  );
}

function FAQ() {
  const pathname = usePathname();
  const question = "Quais relatórios financeiros posso gerar no ERP da Conta Azul?";
  const answer =
    "Os relatórios financeiros no ERP da Conta Azul oferecem uma visão completa da saúde do seu negócio. Você pode gerar análises detalhadas de categorias financeiras, contas a pagar e a receber, desempenho de vendedores, centros de custo e muito mais! Há diversas opções disponíveis, como DRE gerencial e fluxo de caixa, com filtros por período, visão por competência, vencimento ou baixa, garantindo que você tome decisões mais estratégicas e seguras.";
  return (
    <TrackedSection name="FAQ" className="bg-white py-12">
      <div className="mx-auto w-full max-w-[1296px] px-4 lg:px-0">
        <div className="space-y-6">
          {[true, false, false, false, false].map((open, idx) => (
            <div key={idx}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 text-left"
                onClick={() =>
                  trackButtonClick(question, pathname, { section: "FAQ", variant: "ghost" })
                }
                aria-expanded={open}
                aria-label={question}
              >
                <h2
                  className={cn(
                    "text-[20px] font-extrabold leading-[28px] tracking-[-0.6px]",
                    open ? "text-[#2687e9]" : "text-[#35414b]"
                  )}
                >
                  {question}
                </h2>
                <ChevronDown
                  className={cn("h-4 w-4 shrink-0", open ? "text-[#2687e9]" : "text-[#35414b]")}
                />
              </button>
              {open && <p className="mt-6 text-[16px] leading-[24px] text-[#35414b]">{answer}</p>}
              <Separator className="mt-6 bg-[#b9c8d5]" />
            </div>
          ))}
        </div>
      </div>
    </TrackedSection>
  );
}

function FeatureCollapse() {
  const pathname = usePathname();
  const features = [
    {
      title: "Relatórios financeiros",
      description:
        "Entenda a saúde financeira sem complicação.\nAcompanhe entradas, saídas, contas a pagar e a receber em relatórios financeiros claros e atualizados. Veja atrasos, previsões de caixa e resultados por período para tomar decisões com mais segurança.",
      cta: "Veja seus relatórios financeiros",
      active: true,
    },
    {
      title: "Relatórios de vendas e receitas recorrentes",
      description:
        "Veja o que vende mais e onde crescer.\u2028Analise o desempenho das vendas, receitas recorrentes e contratos em relatórios de vendas completos. Acompanhe ticket médio, lucratividade, clientes ativos e identifique oportunidades para vender mais e melhor.",
      cta: "Acompanhe suas vendas",
      active: false,
    },
    {
      title: "Relatórios de compras",
      description:
        "Mais controle sobre gastos e fornecedores.\u2028Visualize compras por período, produto ou fornecedor em relatórios de compras organizados. Identifique padrões de consumo, controle custos e planeje melhor o orçamento direto no ERP da Conta Azul.",
      cta: "Controle suas compras",
      active: false,
    },
  ];
  return (
    <TrackedSection name="Features" className="bg-white py-12">
      <div className="mx-auto w-full max-w-[631px] px-4 lg:px-0">
        <div className="space-y-6">
          {features.map((f, idx) => (
            <div key={f.title}>
              <div className="flex items-start justify-between gap-4 pb-[5px]">
                <h3
                  className={cn(
                    "text-[20px] font-extrabold leading-[28px] tracking-[-0.6px]",
                    f.active ? "text-[#2687e9]" : "text-[#35414b]"
                  )}
                >
                  {f.title}
                </h3>
                <ChevronDown
                  className={cn("mt-[6px] h-4 w-4", f.active ? "text-[#2687e9]" : "text-[#35414b]")}
                />
              </div>
              <p className="whitespace-pre-line text-[16px] leading-[24px] text-[#35414b]">
                {f.description}
              </p>
              <button
                type="button"
                className="mt-2 flex items-center gap-[5px] text-left text-[16px] font-medium leading-[24px] text-[#2687e9]"
                onClick={() =>
                  trackButtonClick(f.cta, pathname, { section: "Features", variant: "link" })
                }
              >
                <ArrowRight className="h-[10px] w-[10px]" />
                {f.cta}
              </button>
              {idx < features.length - 1 && <Separator className="mt-6 bg-[#b9c8d5]" />}
            </div>
          ))}
        </div>
      </div>
    </TrackedSection>
  );
}

function ButtonStates() {
  const pathname = usePathname();
  const states = [
    {
      label: "Default amarelo round XLG",
      className: "bg-[#f9bd1d] text-[#20262b] rounded-full w-[137px] h-[52px]",
    },
    {
      label: "Hover amarelo round XLG",
      className: "bg-[#f0a700] text-[#20262b] rounded-full w-[137px] h-[52px]",
    },
    {
      label: "Active amarelo round XLG",
      className:
        "bg-[#f0a700] border border-[#f9bd1d] text-[#20262b] rounded-full w-[137px] h-[52px]",
    },
    {
      label: "Inactive amarelo round XLG",
      className: "bg-[#b9c8d5] text-[#536574] rounded-full w-[137px] h-[52px]",
    },
    {
      label: "Default azul round XLG",
      className: "bg-[#2687e9] text-white rounded-full w-[137px] h-[52px]",
    },
    {
      label: "Hover azul round XLG",
      className: "bg-[#5aadf1] text-white rounded-full w-[137px] h-[52px]",
    },
    {
      label: "Active azul round XLG",
      className: "bg-[#1b69c8] text-white rounded-full w-[137px] h-[52px]",
    },
    {
      label: "Inactive azul round XLG",
      className: "bg-[#b9c8d5] text-[#536574] rounded-full w-[137px] h-[52px]",
    },
    {
      label: "Secondary amarelo",
      className:
        "border border-[#f9bd1d] text-[#f9bd1d] rounded-full w-[137px] h-[52px] bg-transparent",
    },
    {
      label: "Secondary azul",
      className:
        "border border-[#2687e9] text-[#2687e9] rounded-full w-[137px] h-[52px] bg-transparent",
    },
  ];
  return (
    <TrackedSection name="Button States" className="bg-[#2a2a2a] py-12 text-white">
      <div className="mx-auto grid w-full max-w-[988px] grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-3">
        {states.map((s) => (
          <Button
            key={s.label}
            className={cn(
              "justify-center gap-[6px] px-[28px] py-[12px] text-[16px] font-extrabold leading-[24px] tracking-[-0.16px]",
              s.className
            )}
            onClick={() =>
              trackButtonClick(s.label, pathname, { section: "Button States", variant: "default" })
            }
          >
            <ArrowRight className="h-[16px] w-[16px]" />
            button
          </Button>
        ))}
      </div>
    </TrackedSection>
  );
}

export default function Page1() {
  return (
    <main className="min-h-screen bg-[#2a2a2a]">
      <Navbar />
      <HeroSection />
      <BenefitsCards />
      <FeatureCollapse />
      <FAQ />
      <ButtonStates />
    </main>
  );
}
