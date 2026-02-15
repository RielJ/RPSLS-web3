import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { cookieStorage, createStorage } from "wagmi";
import {
  fantom,
  fantomTestnet,
  hardhat,
  mainnet,
  polygon,
  polygonAmoy,
  sepolia,
} from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Rock Paper Scissors Spock and Lizard Game",
  projectId: "7f8cb052248fb68ed79a97d91e38f795",
  chains: [
    hardhat,
    polygonAmoy,
    polygon,
    fantom,
    fantomTestnet,
    mainnet,
    sepolia,
  ],
  transports: {
    [hardhat.id]: http(),
    [polygonAmoy.id]: http(),
    [polygon.id]: http(),
    [fantom.id]: http(),
    [fantomTestnet.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});
