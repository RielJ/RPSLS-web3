import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig } from "wagmi";
import { polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

const walletConnectProjectId = "7f8cb052248fb68ed79a97d91e38f795";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    polygonMumbai,
    // hardhat,
    // ...(process.env.NODE_ENV === "development" ? [goerli] : []),
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "My wagmi + RainbowKit App",
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
