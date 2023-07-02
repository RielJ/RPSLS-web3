"use client";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, mainnet } from "wagmi";
import { fantom, fantomTestnet, goerli, polygon, polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    polygonMumbai,
    polygon,
    fantom,
    fantomTestnet,
    mainnet,
    goerli
    // hardhat,
    // ...(process.env.NODE_ENV === "development" ? [goerli] : []),
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Rock Paper Scissors Spock and Lizard Game",
  chains,
  projectId: "7f8cb052248fb68ed79a97d91e38f795",
});

export const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export { chains };
