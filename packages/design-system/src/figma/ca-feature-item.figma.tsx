/**
 * Code Connect — CAFeatureItem
 * Figma node 70:509 (Feature)
 */

import React from "react";
import figma from "@figma/code-connect";
import { CAFeatureItem } from "../components/ui/ca-feature-item";

figma.connect(
  CAFeatureItem,
  "https://www.figma.com/design/zV7FIUPnP4jAyjW8ZR7otp/DS_CA?node-id=70-509",
  {
    props: {
      defaultOpen: figma.enum("state", {
        active: true,
        inactive: false,
      }),
    },

    example: ({ defaultOpen }) => (
      <CAFeatureItem
        title="Relatórios financeiros"
        body="Entenda a saúde financeira sem complicação."
        linkLabel="Veja seus relatórios financeiros"
        linkHref="/relatorios"
        defaultOpen={defaultOpen}
      />
    ),
  }
);
