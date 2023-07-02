import { Address, useAccount, usePublicClient, useWalletClient } from "wagmi";
import { useMutation } from "@tanstack/react-query";
import Rps from "@/contracts/RPS.sol/RPS.json";
import { parseEther } from "ethers";
import { useToast } from "@/components";
import { Game } from "@prisma/client";
import { useAddGame, useEncrypt, useKeccak256 } from ".";

export interface IDeployContract {
  address: Address;
  stake: string;
  move: number;
}

export const useDeployContract = () => {
  const publicClient = usePublicClient();
  const { mutateAsync: encrypt } = useEncrypt();
  const { toast } = useToast();
  const { data: walletClient } = useWalletClient();
  const { mutateAsync: keccak256 } = useKeccak256();
  const { mutate: addGame } = useAddGame();
  const { address } = useAccount();

  return useMutation({
    mutationFn: async ({ address, stake, move }: IDeployContract) => {
      const accounts = await walletClient?.getAddresses();
      const hash = await keccak256({ move });
      return walletClient?.deployContract({
        abi: Rps.abi,
        bytecode: Rps.bytecode as `0x${string}`,
        account: accounts && accounts[0],
        args: [hash, address],
        // @ts-ignore
        value: parseEther(stake),
      });
    },
    onMutate: () => {
      // TODO: Make a pending toast
      // pendingToast({
      //   title: "Creating Game!",
      //   description: "There was a problem with your request.",
      // })
    },
    onSettled: () => {
      // TODO: Make a pending toast
      // pendingToast({
      //   title: "Creating Game!",
      //   description: "There was a problem with your request.",
      // })
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
      // const iv = CryptoJS.lib.WordArray.random(16);
      // const key = process.env.ENCRYPT_PARAPHRASE || "";
      // const response = await fetch(
      //   `/api/crypt/decrypt?move=${variables.move}`,
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     method: "GET",
      //   }
      // );
      // console.log({ response });
      // const { move, moveIV } = await response.json();
      const { move, moveIV } = await encrypt({ move: variables.move });
      const input = {
        status: "INIT",
        move,
        moveIV,
        player1: address || "",
        player2: variables.address,
        staked: variables.stake,
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
