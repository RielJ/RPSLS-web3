import Rps from "@/contracts/RPS.sol/RPS.json";
import { getSalt } from "@/utils";
import { Game } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { concat, keccak256, toBytes, parseEther } from "viem";
import {
  Address,
  useAccount,
  usePublicClient,
  useWaitForTransaction,
  useWalletClient,
} from "wagmi";
import { useAddGame, useEncrypt, useRPSToast } from ".";

export interface IDeployContract {
  address: Address;
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
      const chainId = await publicClient.getChainId();
      const salt = getSalt({
        address1: address,
        address2: opponentAddress,
        stake,
        chainId,
      });
      const hash = keccak256(
        concat([toBytes(move), toBytes(salt, { size: 32 })])
      );
      return walletClient?.deployContract({
        abi: Rps.abi,
        bytecode: Rps.bytecode as `0x${string}`,
        account: address,
        args: [hash, opponentAddress],
        // @ts-ignore
        value: parseEther(stake),
      });
    },
    onMutate: () => {
      setCurrentToast(
        toastLoader({
          title: "Creating an RPS Game",
          description: "Deploying Contract...",
        })
      );
    },
    onSuccess: () => {
      currentToast?.update({
        id: currentToast.id,
        description: "Waiting for the block to be mined",
      });
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
  const { isLoading, data: receipt } = useWaitForTransaction({
    hash: data,
  });

  useEffect(() => {
    const update = async () => {
      currentToast?.update({
        id: currentToast.id,
        description: "Contract Deployed, Publishing Move!",
      });
      try {
        if (!variables) return;
        const [chainId, block, res] = await Promise.all([
          publicClient.getChainId(),
          publicClient.getBlock({
            blockNumber: receipt?.blockNumber,
          }),
          encrypt({ move: variables.move }),
        ]);
        const { move, moveIV } = res.data;

        console.log({ res });

        const input = {
          status: "INIT",
          winner: "",
          move,
          moveIV,
          player1: address || "",
          player2: variables.address,
          staked: variables.stake,
          contractAddress: receipt?.contractAddress,
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
    };

    if (receipt?.status === "success") {
      update();
    }
    if (receipt?.status === "reverted") {
      currentToast?.dismiss();
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    }
  }, [receipt]);

  return { ...props, isLoading };
};
