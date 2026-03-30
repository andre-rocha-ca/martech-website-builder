"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button, Badge, Separator, cn } from "@martech/design-system";
import { Menu, ChevronDown, ChevronRight, Check } from "lucide-react";
import { trackButtonClick, trackEvent, trackLinkClick } from "@/components/layout/SegmentScript";
import { TrackedSection } from "@/components/sections/TrackedSection";

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
      className="inline-flex h-11 items-center gap-1 px-0 text-[18px] font-normal leading-[28px] text-white"
      onClick={() =>
        trackLinkClick(href, pathname, {
          section,
          label: typeof children === "string" ? children : href,
        })
      }
    >
      <span>{children}</span>
      <ChevronDown className="h-6 w-6" aria-hidden="true" />
    </Link>
  );
}

function HeroChecks() {
  const pathname = usePathname();
  const items = ["Financeiros", "Vendas", "Compras e estoque"];
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 sm:gap-x-6">
      {items.map((item) => (
        <div key={item} className="flex items-center gap-2">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/90">
            <Check className="h-3.5 w-3.5 text-white" aria-hidden="true" />
          </span>
          <span className="text-[14px] leading-5 text-white">{item}</span>
        </div>
      ))}
      <Button
        size="lg"
        className="mt-2 h-12 rounded-[204px] bg-[#f9bd1d] px-7 text-[16px] font-extrabold leading-4 tracking-[-0.16px] text-[#20262b] hover:bg-[#f0a700] sm:mt-0"
        onClick={() =>
          trackButtonClick("teste grátis", pathname, { section: "Hero", variant: "default" })
        }
      >
        <ChevronRight className="mr-2 h-4 w-4" aria-hidden="true" />
        teste grátis
      </Button>
    </div>
  );
}

function AccordionItem({
  question,
  answer,
  open = false,
}: {
  question: string;
  answer: string;
  open?: boolean;
}) {
  const pathname = usePathname();
  return (
    <div>
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 py-4 text-left"
        aria-expanded={open}
        onClick={() => trackEvent("FAQ Toggled", { page: pathname, question, open })}
      >
        <h3 className="text-[20px] font-extrabold leading-7 tracking-[-0.6px] text-[#2687e9]">
          {question}
        </h3>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-[#2687e9] transition-transform",
            open && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>
      {open ? <p className="pb-6 text-[16px] leading-6 text-[#35414b]">{answer}</p> : null}
      <Separator className="bg-[#b9c8d5]" />
    </div>
  );
}

export function Page1Client() {
  const pathname = usePathname();
  const faq =
    "Os relatórios financeiros no ERP da Conta Azul oferecem uma visão completa da saúde do seu negócio. Você pode gerar análises detalhadas de categorias financeiras, contas a pagar e a receber, desempenho de vendedores, centros de custo e muito mais! Há diversas opções disponíveis, como DRE gerencial e fluxo de caixa, com filtros por período, visão por competência, vencimento ou baixa, garantindo que você tome decisões mais estratégicas e seguras.";

  return (
    <main className="min-h-screen bg-[#2a2a2a] text-white">
      <header className="sticky top-0 z-50 bg-white">
        <div className="mx-auto flex h-[84px] w-full max-w-[1296px] items-center justify-between px-4 md:px-8">
          <Link
            href="/page-1"
            className="flex items-center"
            onClick={() =>
              trackLinkClick("/page-1", pathname, { section: "Header", label: "Logo" })
            }
            aria-label="Conta Azul home"
          >
            <Image
              src="/assets/images/85-1739.png"
              alt="Conta Azul logo"
              width={167}
              height={24}
              className="h-6 w-auto"
            />
          </Link>
          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
            <NavLink href="#solucoes" section="Header">
              Soluções
            </NavLink>
            <NavLink href="#funcionalidades" section="Header">
              Funcionalidades
            </NavLink>
            <Link
              href="#planos"
              className="text-[18px] leading-7 text-white"
              onClick={() =>
                trackLinkClick("#planos", pathname, { section: "Header", label: "Planos" })
              }
            >
              Planos
            </Link>
            <NavLink href="#aprenda" section="Header">
              Aprenda
            </NavLink>
          </nav>
          <div className="hidden items-center gap-8 md:flex">
            <Button
              variant="ghost"
              className="h-11 px-0 text-[18px] font-normal leading-7 text-white hover:bg-transparent hover:text-white"
              onClick={() =>
                trackButtonClick("Entrar", pathname, { section: "Header", variant: "ghost" })
              }
            >
              Entrar
            </Button>
            <Button
              className="h-11 rounded-[60px] bg-[#f9bd1d] px-[18px] text-[16px] font-extrabold leading-4 tracking-[-0.16px] text-[#20262b] hover:bg-[#f0a700]"
              onClick={() =>
                trackButtonClick("teste grátis", pathname, {
                  section: "Header",
                  variant: "default",
                })
              }
            >
              <ChevronRight className="mr-2 h-4 w-4" aria-hidden="true" />
              teste grátis
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 md:hidden"
            aria-label="Open menu"
            onClick={() =>
              trackButtonClick("Menu", pathname, { section: "Header", variant: "ghost" })
            }
          >
            <Menu className="h-5 w-5 text-[#20262b]" aria-hidden="true" />
          </Button>
        </div>
      </header>

      <TrackedSection name="Hero" className="bg-[#134ca2] lg:bg-[#eff3f7]">
        <section className="mx-auto flex min-h-[911px] w-full max-w-[1296px] items-end px-4 pb-10 pt-10 lg:min-h-[689px] lg:items-center lg:px-0 lg:pb-0 lg:pt-0">
          <div className="w-full max-w-[358px] lg:max-w-[520px]">
            <div className="inline-flex h-9 items-center rounded-full border border-white px-[18px] text-[12px] font-medium uppercase tracking-[1px] text-white">
              ERP RELATÓRIO
            </div>
            <div className="mt-4 flex flex-col gap-4">
              <h1 className="leading-12 max-w-[358px] text-[40px] font-extrabold tracking-[-1.2px] text-white lg:max-w-[520px] lg:text-[48px] lg:font-light lg:leading-[56px] lg:tracking-[-1.44px] lg:text-white">
                Relatórios pro seu negócio crescer
              </h1>
              <p className="max-w-[358px] text-[16px] leading-6 text-white lg:max-w-[520px] lg:text-[18px] lg:leading-7">
                Acompanhe o desempenho do seu negócio em tempo real com relatórios financeiros
                prontos e personalizáveis da Conta Azul.
              </p>
              <HeroChecks />
            </div>
          </div>
        </section>
      </TrackedSection>

      <TrackedSection name="Benefits" className="bg-white py-0">
        <section className="mx-auto grid w-full max-w-[1296px] grid-cols-1 gap-0 px-0 md:grid-cols-3">
          {[
            "Veja os números do seu negócio\nem relatórios simples, sem planilhas.",
            "Dados financeiro, vendas e estoque\nem relatórios centralizados no ERP.",
            "Dados financeiro, vendas e estoque\nem relatórios centralizados no ERP.",
          ].map((text, idx) => (
            <article key={idx} className="flex h-[120px] items-stretch gap-[18px] px-6 py-8">
              <div className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-full bg-white">
                <Image
                  src="/assets/images/85-1740.png"
                  alt="Analytics icon"
                  width={26}
                  height={26}
                  className="h-[26px] w-[26px]"
                />
              </div>
              <p className="max-w-[296px] whitespace-pre-line text-[18px] leading-7 text-white">
                {text}
              </p>
            </article>
          ))}
        </section>
      </TrackedSection>

      <TrackedSection name="Features" className="bg-white py-10">
        <section id="funcionalidades" className="mx-auto w-full max-w-[1296px] px-4 md:px-8">
          <div className="max-w-[631px]">
            <div className="space-y-0">
              <div className="py-0">
                <button
                  className="flex w-full items-center justify-between py-0 text-left"
                  onClick={() =>
                    trackEvent("Feature Toggled", {
                      page: pathname,
                      feature: "Relatórios financeiros",
                    })
                  }
                >
                  <h2 className="text-[20px] font-extrabold leading-7 tracking-[-0.6px] text-[#2687e9]">
                    Relatórios financeiros
                  </h2>
                  <ChevronDown className="h-4 w-4 rotate-180 text-[#2687e9]" aria-hidden="true" />
                </button>
                <p className="mt-2 text-[16px] leading-6 text-[#35414b]">
                  Entenda a saúde financeira sem complicação. Acompanhe entradas, saídas, contas a
                  pagar e a receber em relatórios financeiros claros e atualizados. Veja atrasos,
                  previsões de caixa e resultados por período para tomar decisões com mais
                  segurança.
                </p>
                <Button
                  variant="link"
                  className="mt-2 h-auto p-0 text-[16px] font-medium text-[#2687e9]"
                  onClick={() =>
                    trackButtonClick("Veja seus relatórios financeiros", pathname, {
                      section: "Features",
                      variant: "link",
                    })
                  }
                >
                  <ChevronRight className="mr-1 h-3 w-3" aria-hidden="true" />
                  Veja seus relatórios financeiros
                </Button>
              </div>
              <Separator className="my-4 bg-[#b9c8d5]" />
              <div>
                <button
                  className="flex w-full items-center justify-between py-0 text-left"
                  onClick={() =>
                    trackEvent("Feature Toggled", {
                      page: pathname,
                      feature: "Relatórios de vendas e receitas recorrentes",
                    })
                  }
                >
                  <h2 className="text-[20px] font-extrabold leading-7 tracking-[-0.6px] text-[#35414b]">
                    Relatórios de vendas e receitas recorrentes
                  </h2>
                  <ChevronDown className="h-4 w-4 text-[#35414b]" aria-hidden="true" />
                </button>
                <p className="mt-2 text-[16px] leading-6 text-[#35414b]">
                  Veja o que vende mais e onde crescer. Analise o desempenho das vendas, receitas
                  recorrentes e contratos em relatórios de vendas completos. Acompanhe ticket médio,
                  lucratividade, clientes ativos e identifique oportunidades para vender mais e
                  melhor.
                </p>
                <Button
                  variant="link"
                  className="mt-2 h-auto p-0 text-[16px] font-medium text-[#2687e9]"
                  onClick={() =>
                    trackButtonClick("Acompanhe suas vendas", pathname, {
                      section: "Features",
                      variant: "link",
                    })
                  }
                >
                  <ChevronRight className="mr-1 h-3 w-3" aria-hidden="true" />
                  Acompanhe suas vendas
                </Button>
              </div>
              <Separator className="my-4 bg-[#b9c8d5]" />
              <div>
                <button
                  className="flex w-full items-center justify-between py-0 text-left"
                  onClick={() =>
                    trackEvent("Feature Toggled", {
                      page: pathname,
                      feature: "Relatórios de compras",
                    })
                  }
                >
                  <h2 className="text-[20px] font-extrabold leading-7 tracking-[-0.6px] text-[#35414b]">
                    Relatórios de compras
                  </h2>
                  <ChevronDown className="h-4 w-4 text-[#35414b]" aria-hidden="true" />
                </button>
                <p className="mt-2 text-[16px] leading-6 text-[#35414b]">
                  Mais controle sobre gastos e fornecedores. Visualize compras por período, produto
                  ou fornecedor em relatórios de compras organizados. Identifique padrões de
                  consumo, controle custos e planeje melhor o orçamento direto no ERP da Conta Azul.
                </p>
                <Button
                  variant="link"
                  className="mt-2 h-auto p-0 text-[16px] font-medium text-[#2687e9]"
                  onClick={() =>
                    trackButtonClick("Controle suas compras", pathname, {
                      section: "Features",
                      variant: "link",
                    })
                  }
                >
                  <ChevronRight className="mr-1 h-3 w-3" aria-hidden="true" />
                  Controle suas compras
                </Button>
              </div>
            </div>
          </div>
        </section>
      </TrackedSection>

      <TrackedSection name="FAQ" className="bg-white py-10">
        <section id="aprenda" className="mx-auto w-full max-w-[1296px] px-4 md:px-8">
          <div className="space-y-0">
            <AccordionItem
              question="Quais relatórios financeiros posso gerar no ERP da Conta Azul?"
              answer={faq}
              open
            />
            <AccordionItem
              question="Quais relatórios financeiros posso gerar no ERP da Conta Azul?"
              answer={faq}
            />
            <AccordionItem
              question="Quais relatórios financeiros posso gerar no ERP da Conta Azul?"
              answer={faq}
            />
            <AccordionItem
              question="Quais relatórios financeiros posso gerar no ERP da Conta Azul?"
              answer={faq}
            />
            <AccordionItem
              question="Quais relatórios financeiros posso gerar no ERP da Conta Azul?"
              answer={faq}
            />
          </div>
        </section>
      </TrackedSection>
    </main>
  );
}
