"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/components/layout/SegmentScript";
import { TrackedSection } from "@/components/sections/TrackedSection";
import { imgArrowDown } from "@/components/sections/assets";

const FAQ_ITEMS = [
  {
    question: "Quais relatórios financeiros posso gerar no ERP da Conta Azul?",
    answer:
      "No ERP da Conta Azul você acessa relatórios de DRE, fluxo de caixa, contas a pagar e receber, extrato bancário e muito mais. Todos os relatórios são atualizados em tempo real e podem ser filtrados por período, centro de custo ou categoria.",
  },
  {
    question: "Preciso instalar algum programa para acessar os relatórios?",
    answer:
      "Não. A Conta Azul é 100% online e funciona direto no navegador. Você acessa seus relatórios de qualquer dispositivo — computador, tablet ou celular — sem precisar instalar nada.",
  },
  {
    question: "Os relatórios são atualizados em tempo real?",
    answer:
      "Sim. Cada lançamento financeiro, venda ou movimentação de estoque é refletido imediatamente nos relatórios. Você sempre tem a visão mais atualizada do seu negócio, sem precisar aguardar fechamentos manuais.",
  },
  {
    question: "Posso exportar os relatórios para Excel ou PDF?",
    answer:
      "Sim. Todos os relatórios podem ser exportados em formato Excel (.xlsx) ou PDF com apenas um clique, facilitando o compartilhamento com sócios, contadores ou investidores.",
  },
  {
    question: "Os dados dos relatórios ficam seguros na Conta Azul?",
    answer:
      "Absolutamente. A Conta Azul utiliza criptografia SSL e segue as melhores práticas de segurança da informação. Seus dados ficam armazenados em servidores redundantes com backup automático diário.",
  },
];

function FAQItem({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: { question: string; answer: string };
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  return (
    <div className="border-b border-[#e2e8f0] last:border-b-0">
      <button
        type="button"
        className="group flex w-full items-center justify-between gap-4 py-5 text-left"
        onClick={() => {
          onToggle();
          trackEvent("FAQ Item Clicked", {
            question: item.question,
            action: isOpen ? "close" : "open",
            index,
            page: pathname,
          });
        }}
        aria-expanded={isOpen}
      >
        <span
          className="text-[18px] font-semibold leading-[26px] text-[#20262b] transition-colors duration-200 group-hover:text-[#2687e9]"
          style={{ fontFamily: "'Raleway', sans-serif" }}
        >
          {item.question}
        </span>

        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#eff3f7] transition-all duration-300 group-hover:bg-[#dbeafe]">
          <img
            src={imgArrowDown}
            alt=""
            className="icon-blue h-4 w-4 transition-transform duration-300"
            style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        </span>
      </button>

      {/* CSS grid-rows accordion — no JS height measurement needed */}
      <div className={isOpen ? "faq-body-grid open" : "faq-body-grid"}>
        <div className="min-h-0">
          <p
            className="pb-5 pr-12 text-[16px] leading-[26px] text-[#536574]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <TrackedSection name="faq" animate className="ca-section bg-white py-16">
      <div className="ca-container">
        <div className="mb-10 flex flex-col gap-3 text-center">
          <p
            className="text-[14px] font-bold uppercase tracking-[2px] text-[#2687e9]"
            style={{ fontFamily: "'Raleway', sans-serif" }}
          >
            Dúvidas frequentes
          </p>
          <h2
            className="text-[32px] leading-[40px] tracking-[-0.96px] text-[#20262b] lg:text-[40px] lg:leading-[48px]"
            style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 300 }}
          >
            Perguntas sobre os <strong style={{ fontWeight: 800 }}>relatórios da Conta Azul</strong>
          </h2>
        </div>

        <div className="mx-auto max-w-[780px]">
          {FAQ_ITEMS.map((item, i) => (
            <FAQItem
              key={i}
              item={item}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </TrackedSection>
  );
}

// backward compat default export (for page-1/page.tsx)
export default FAQSection;
