"use client";

import { CursorEffects } from "@/components";
import { useEffect, useState } from "react";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [width, setWidth] = useState<number>(0);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    setWidth(window.innerWidth);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 768;

  return (
    <>
      {!isMobile && <CursorEffects />}
      {children}
    </>
  );
}
