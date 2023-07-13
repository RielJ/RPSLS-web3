import { RPS__factory } from "@/typechain-types";
import { Game } from "@prisma/client";
import {
  Address,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { useUpdateGame } from "./useUpdateGame";
import { useEffect } from "react";
import { useRPSToast } from ".";

export const useJ2Timeout = ({ game }: { game: Game }) => {
  const { mutateAsync: updateGame } = useUpdateGame();
  const { config, status } = usePrepareContractWrite({
    address: game.contractAddress as Address,
    abi: RPS__factory.abi,
    functionName: "j2Timeout",
  });
  const { toastLoader, toast, currentToast, setCurrentToast } = useRPSToast();

  const { write: j2Timeout, data } = useContractWrite({
    ...config,
    onMutate: () => {
      setCurrentToast(
        toastLoader({
          title: "Opponent timeout!",
          description: "Claiming Token!",
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
    hash: data?.hash,
  });

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

  return { j2Timeout, isLoading: isLoading || status !== "success" };
};
