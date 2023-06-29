import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig } from "wagmi";
import { polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

const walletConnectProjectId = process.env.WALLET_PROJECT_ID;

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    polygonMumbai,
    // hardhat,
    // ...(process.env.NODE_ENV === "development" ? [goerli] : []),
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Kleros RPS",
  chains,
  projectId: walletConnectProjectId,
});

export const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export { chains };
