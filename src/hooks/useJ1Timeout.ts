import { RPS__factory } from "@/typechain-types";
import { Game } from "@prisma/client";
import { useEffect } from "react";
import {
  Address,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { useUpdateGame } from "./useUpdateGame";
import { useRPSToast } from "./useRPSToast";

export const useJ1Timeout = ({ game }: { game: Game }) => {
  const { mutateAsync: updateGame } = useUpdateGame();
  const { config } = usePrepareContractWrite({
    address: game.contractAddress as Address,
    abi: RPS__factory.abi,
    functionName: "j1Timeout",
  });
  const { toastLoader, toast, currentToast, setCurrentToast } = useRPSToast();

  const { write: j1Timeout, data } = useContractWrite({
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
          winner: game.player2,
        });
        toast({
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

  return { j1Timeout, isLoading };
};
