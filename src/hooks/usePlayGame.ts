import { RPS__factory } from "@/typechain-types";
import { useMutation } from "@tanstack/react-query";
import { ethers, parseEther } from "ethers";
import { Address, usePublicClient, useWalletClient } from "wagmi";

interface IUseMutation {
  address: Address;
  args: [number];
  staked: string;
}

export const usePlayGame = () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const contractAbi = RPS__factory.abi;

  return useMutation({
    mutationFn: async ({ address, args, staked }: IUseMutation) => {
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(address, contractAbi, signer);
    },
  });
};
