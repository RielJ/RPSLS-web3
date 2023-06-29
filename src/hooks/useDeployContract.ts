import { Address, useWalletClient } from "wagmi";
import { useMutation } from "@tanstack/react-query";
import Rps from "@/contracts/RPS.sol/RPS.json";
import { useHashers } from "./useHashers";
import { parseEther } from "ethers";

export interface IDeployContract {
  address: Address;
  stake: string;
  move: number;
}

export const useDeployContract = () => {
  const { data: walletClient } = useWalletClient();
  const { data: hashes } = useHashers();

  return useMutation({
    mutationFn: async ({ address, stake, move }: IDeployContract) => {
      const accounts = await walletClient?.getAddresses();
      return walletClient?.deployContract({
        abi: Rps.abi,
        bytecode: Rps.bytecode as `0x${string}`,
        account: accounts && accounts[0],
        args: [hashes[move], address],
        // @ts-ignore
        value: parseEther(stake),
        // to: address,
      });
    },
  });
};
