"use client";

import { TrackedSection } from "@/components/sections/TrackedSection";
import { imgGraphIcon } from "@/components/sections/assets";

const cards = [
  {
    text1: "Veja os números do seu negócio",
    text2: "em relatórios simples, sem planilhas.",
  },
  {
    text1: "Dados financeiros, vendas e estoque",
    text2: "em relatórios centralizados no ERP.",
  },
  {
    text1: "Acesse seus relatórios de qualquer lugar",
    text2: "a qualquer hora, pelo celular ou computador.",
  },
];

const GRADIENT = "linear-gradient(196.78deg, #205ed7 1.84%, #2687e9 37.96%, #00aff0 95.1%)";

export function BenefitsSection() {
  return (
    <TrackedSection name="benefits" animate className="ca-section bg-white py-12">
      <div
        className="ca-grid"
        style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "32px" }}
      >
        {cards.map((card, i) => (
          <div
            key={i}
            className="ca-col-12 lg:ca-col-4 flex items-start gap-[18px] rounded-bl-[30px] rounded-br-[30px] rounded-tr-[30px] px-6 py-8 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
            style={{
              backgroundImage: GRADIENT,
              /* Stagger each card entrance independently via CSS delay */
              animationDelay: `${i * 150}ms`,
            }}
          >
            {/* Icon circle */}
            <div className="flex h-[54px] w-[54px] flex-shrink-0 items-center justify-center rounded-full bg-white transition-transform duration-300 group-hover:scale-110">
              <img src={imgGraphIcon} alt="" className="icon-blue h-6 w-6" />
            </div>

            {/* Text */}
            <div
              className="flex flex-col justify-end text-[18px] leading-7 text-white"
              style={{ fontFamily: "'Ping Pong', 'Inter', sans-serif" }}
            >
              <p>{card.text1}</p>
              <p>{card.text2}</p>
            </div>
          </div>
        ))}
      </div>
    </TrackedSection>
  );
}
