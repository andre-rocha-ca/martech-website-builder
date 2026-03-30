"use client";

import { Button } from "@martech/design-system";
import { trackButtonClick } from "@/components/layout/SegmentScript";

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center bg-[#eff3f7] p-8">
      <h1 className="text-4xl font-bold text-white">Relatórios pro seu negócio crescer</h1>
      <p className="mt-4 text-lg text-white">
        Acompanhe o desempenho do seu negócio em tempo real com relatórios financeiros prontos e
        personalizáveis da Conta Azul.
      </p>
      <Button
        variant="default"
        className="mt-6"
        onClick={() => trackButtonClick("Teste Grátis", "/page-1", { section: "Hero" })}
      >
        teste grátis
      </Button>
    </section>
  );
}
