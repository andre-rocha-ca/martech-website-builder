/**
 * Code Connect — CAButton
 *
 * Links the DS_CA Figma component (node 10:56) to the React CAButton.
 *
 * To publish:
 *   cd packages/design-system
 *   npx @figma/code-connect publish
 *
 * Figma file: https://www.figma.com/design/zV7FIUPnP4jAyjW8ZR7otp/DS_CA
 */

import React from "react";
import figma from "@figma/code-connect";
import { CAButton } from "../components/ui/ca-button";

figma.connect(CAButton, "https://www.figma.com/design/zV7FIUPnP4jAyjW8ZR7otp/DS_CA?node-id=10-56", {
  props: {
    color: figma.enum("color", {
      amarelo: "amarelo",
      azul: "azul",
    }),
    variant: figma.enum("Type", {
      Primary: "primary",
      Secondary: "secondary",
    }),
    size: figma.enum("size", {
      XLG: "xlg",
      LG: "lg",
      MD: "md",
    }),
    shape: figma.enum("Style", {
      round: "round",
      square: "square",
    }),
    disabled: figma.enum("State", {
      Default: false,
      hover: false,
      active: false,
      inactive: true,
    }),
  },

  example: ({ color, variant, size, shape, disabled }) => (
    <CAButton color={color} variant={variant} size={size} shape={shape} disabled={disabled}>
      teste grátis
    </CAButton>
  ),
});
