"use client";
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import { Poppins } from "next/font/google";
import { Providers } from "./providers";
import { ThemeProvider } from "./theme-provider";
import { CursorEffects, Toaster } from "@/components";
import { useState, useEffect } from "react";

// export const metadata = {
//   title: "Kleros RPS",
// };

const poppins = Poppins({
  weight: "700",
  subsets: ["latin"],
  variable: "--font-poppins",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [width, setWidth] = useState<number>(0);

  // TODO: Determine how to disable CursorEffects when
  // it's on touch only devices.
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
    <html lang="en">
      <body
        className={`${poppins.variable} font-primary min-w-[100vw] min-h-[100vh]`}
      >
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            {!isMobile && <CursorEffects />}
            {children}
            <Toaster />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
