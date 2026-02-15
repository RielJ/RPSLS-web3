import { rpsABI } from "@/generated";
import type { Game } from "@prisma/client";
import { useEffect } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useRPSToast } from ".";
import { useUpdateGame } from "./useUpdateGame";

export const useJ2Timeout = ({ game }: { game: Game }) => {
  const { mutateAsync: updateGame } = useUpdateGame();
  const { toastLoader, toast, currentToast, setCurrentToast } = useRPSToast();

  const { writeContract, data: hash, isPending } = useWriteContract();

  const { isLoading, data: receipt } = useWaitForTransactionReceipt({
    hash,
  });

  const j2Timeout = () => {
    setCurrentToast(
      toastLoader({
        title: "Opponent timeout!",
        description: "Claiming Token!",
      }),
    );
    writeContract(
      {
        address: game.contractAddress as `0x${string}`,
        abi: rpsABI,
        functionName: "j2Timeout",
      },
      {
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
      },
    );
  };

  useEffect(() => {
    const update = async () => {
      currentToast?.update({
        id: currentToast.id,
        description: "Token Claimed! Updating Game Status...",
      });
      try {
        updateGame({
          ...game,
          status: "ALL_DONE",
          winner: game.player1,
        });
        toast({
          title: "Claimed!",
          description: "Stake Claimed! Check your Account!",
        });
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
      } finally {
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

  return { j2Timeout, isLoading: isLoading || isPending };
};
