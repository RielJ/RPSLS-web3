import { Address, useAccount, usePublicClient, useWalletClient } from "wagmi";
import { useMutation } from "@tanstack/react-query";
import Rps from "@/contracts/RPS.sol/RPS.json";
import { useHashers } from "./useHashers";
import { parseEther } from "ethers";
import { useToast } from "@/components";
import { useAddGame } from "./useAddGame";
import { Game } from "@prisma/client";
import CryptoJS from "crypto-js";

export interface IDeployContract {
  address: Address;
  stake: string;
  move: number;
}

export const useDeployContract = () => {
  const publicClient = usePublicClient();
  const { toast } = useToast();
  const { data: walletClient } = useWalletClient();
  const { data: hashes } = useHashers();
  const { mutate: addGame } = useAddGame();
  const { address } = useAccount();

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
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    },
    onSuccess: async (data, variables) => {
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: data as Address,
      });
      const block = await publicClient.getBlock({
        blockNumber: receipt.blockNumber,
      });
      const iv = CryptoJS.lib.WordArray.random(16);
      const key = process.env.ENCRYPT_PARAPHRASE || "";
      const input = {
        status: "INIT",
        move: CryptoJS.AES.encrypt((variables.move + 1).toString(), key, {
          iv,
        }).toString(),
        moveIV: iv.toString(CryptoJS.enc.Hex),
        player1: address || "",
        player2: variables.address,
        staked: parseInt(variables.stake),
        contractAddress: receipt.contractAddress,
        id: block.number?.toString(),
        createdAt: new Date(Number(block.timestamp) * 1000),
      } as Game;
      addGame(input);
      toast({
        description: "Successfully created a game!",
      });
    },
  });
};
