import Rps from "@/contracts/RPS.sol/RPS.json";
import { config } from "@/lib";
import { getSalt } from "@/utils";
import type { Game } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { concat, keccak256, parseEther, toBytes } from "viem";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import { useAddGame, useEncrypt, useRPSToast } from ".";

export interface IDeployContract {
  address: `0x${string}`;
  stake: string;
  move: number;
}

export const useCreateGame = () => {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const { mutateAsync: encrypt } = useEncrypt();
  const { mutateAsync: addGame } = useAddGame();
  const { toastLoader, toast, currentToast, setCurrentToast } = useRPSToast();

  const { data, variables, reset, ...props } = useMutation({
    mutationFn: async ({
      address: opponentAddress,
      stake,
      move,
    }: IDeployContract) => {
      if (!publicClient || !walletClient || !address) {
        throw new Error("Wallet not connected");
      }
      const chainId = await publicClient.getChainId();
      const salt = getSalt({
        address1: address,
        address2: opponentAddress,
        stake,
        chainId,
      });
      const hash = keccak256(
        concat([toBytes(move), toBytes(salt, { size: 32 })]),
      );
      const txHash = await walletClient.deployContract({
        abi: Rps.abi,
        bytecode: Rps.bytecode as `0x${string}`,
        account: address,
        args: [hash, opponentAddress],
        value: parseEther(stake),
      });

      const receipt = await waitForTransactionReceipt(config, {
        hash: txHash,
      });
      return receipt;
    },
    onMutate: () => {
      setCurrentToast(
        toastLoader({
          title: "Creating an RPS Game",
          description: "Deploying Contract...",
        }),
      );
    },
    onSuccess: async (receipt) => {
      currentToast?.update({
        id: currentToast.id,
        description: "Contract Deployed, Publishing Move!",
      });
      try {
        if (!variables || !publicClient || !address) return;
        const [chainId, block, res] = await Promise.all([
          publicClient.getChainId(),
          publicClient.getBlock({
            blockNumber: receipt.blockNumber,
          }),
          encrypt({ move: variables.move }),
        ]);
        const { move, moveIV } = res.data;

        const input = {
          status: "INIT",
          winner: "",
          move,
          moveIV,
          player1: address || "",
          player2: variables.address,
          staked: variables.stake,
          contractAddress: receipt.contractAddress || "",
          chainId: chainId?.toString(),
          id: `${chainId?.toString()}-${block.number?.toString()}`,
          createdAt: new Date(Number(block.timestamp) * 1000),
        } as Game;
        await addGame(input);
        toast({
          title: "Game Created!",
          description:
            "Successfully created an RPS Game! Please wait for the opponent's response.",
        });
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
      } finally {
        reset();
        currentToast?.dismiss();
      }
    },
    onError: () => {
      currentToast?.dismiss();
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    },
  });

  return { ...props, isLoading: props.isPending };
};
