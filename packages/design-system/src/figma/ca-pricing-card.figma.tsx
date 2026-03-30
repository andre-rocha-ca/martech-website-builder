/**
 * Code Connect — CAPricingCard
 * Figma node 63:156 (card_pricing)
 */

import React from "react";
import figma from "@figma/code-connect";
import { CAPricingCard } from "../components/ui/ca-pricing-card";

figma.connect(
  CAPricingCard,
  "https://www.figma.com/design/zV7FIUPnP4jAyjW8ZR7otp/DS_CA?node-id=63-156",
  {
    props: {},

    example: () => (
      <CAPricingCard
        planName="Controle"
        subtitle="Microempreendedor (ME)"
        originalPrice="499,90"
        price="R$ 309,90"
        savings="190,00"
        description="Pra quem fatura de R$81k até R$360K por ano"
        userAccess="Acesso de 2 usuários"
        ctaLabel="comece agora"
      />
    ),
  }
);
