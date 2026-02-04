import { useState } from "react";
import { Shield } from "lucide-react";
import { WindowFrame } from "@/components/WindowFrame";

export default function Index() {
  return (
    <WindowFrame
      title="KittyPass - Менеджер паролей"
      icon={<Shield className="w-4 h-4" />}
    >

    </WindowFrame>
  );
}
