import { RPS__factory } from "@/typechain-types";
import { Game } from "@prisma/client";
import { Address } from "viem";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { useDecrypt } from "./useDecrypt";
import { useUpdateGame } from "./useUpdateGame";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getSalt } from "@/utils";
import { useRPSToast } from "./useRPSToast";

interface IUseSolveGame {
  game: Game;
}

export const useSolveGame = ({ game }: IUseSolveGame) => {
  const { mutateAsync: decrypt } = useDecrypt();
  const { mutate: updateGame /* , isLoading: isUpdateGameLoading */ } =
    useUpdateGame();
  const salt = useMemo(() => {
    return getSalt({
      address1: game.player1 as Address,
      address2: game.player2 as Address,
      stake: game.staked,
      chainId: parseInt(game.chainId),
    });
  }, [game]);
  const [move, setMove] = useState("0");
  const { toastLoader, toast, currentToast, setCurrentToast } = useRPSToast();

  useEffect(() => {
    const getMove = async () => {
      setMove(
        (
          await decrypt({
            move: game.move,
            moveIV: game.moveIV,
          })
        ).data
      );
    };

    getMove();
  }, [game]);

  const { config } = usePrepareContractWrite({
    address: game.contractAddress as Address,
    abi: RPS__factory.abi,
    functionName: "solve",
    args: [parseInt(move), salt],
    enabled: move !== "0",
  });

  const { write: solve, data } = useContractWrite({
    ...config,
    onMutate: () => {
      console.log({ salt, move });
      setCurrentToast(
        toastLoader({
          title: "Solving!",
          description: "Solving Game...",
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
        description: "Game Solved! Updating Game Status!",
      });
      try {
        updateGame({ ...game, status: "ALL_DONE" });
        const isWinner = game.winner === game.player1;
        toast({
          title: "Done!",
          description: `Game is Done! ${isWinner ? " You Won!" : "You Lost!"}`,
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

  return { solve, isLoading };
};
