/**
 * Code Connect — CAWhatsAppButton
 * Figma node 141:454 (button_whatsapp)
 */

import React from "react";
import figma from "@figma/code-connect";
import { CAWhatsAppButton } from "../components/ui/ca-whatsapp-button";

figma.connect(
  CAWhatsAppButton,
  "https://www.figma.com/design/zV7FIUPnP4jAyjW8ZR7otp/DS_CA?node-id=141-454",
  {
    props: {},
    example: () => <CAWhatsAppButton phone="551140400606" />,
  }
);
