"use client";

import { config } from "@/lib";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type React from "react";
import { useEffect, useState } from "react";
import { WagmiProvider } from "wagmi";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
