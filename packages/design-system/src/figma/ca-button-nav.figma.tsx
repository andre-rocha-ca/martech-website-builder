/**
 * Code Connect — CAButtonNav
 * Figma node 192:400 (Button_nav)
 */

import React from "react";
import figma from "@figma/code-connect";
import { CAButtonNav } from "../components/ui/ca-button-nav";

figma.connect(
  CAButtonNav,
  "https://www.figma.com/design/zV7FIUPnP4jAyjW8ZR7otp/DS_CA?node-id=192-400",
  {
    props: {
      style: figma.enum("Style", {
        Default: "default",
        cinza: "cinza",
      }),
    },

    example: ({ style }) => <CAButtonNav style={style} label="Soluções" href="/solucoes" />,
  }
);
