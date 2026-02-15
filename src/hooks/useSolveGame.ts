import { rpsABI } from "@/generated";
import { getSalt } from "@/utils";
import type { Game } from "@prisma/client";
import { useEffect, useMemo, useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useDecrypt } from "./useDecrypt";
import { useRPSToast } from "./useRPSToast";
import { useUpdateGame } from "./useUpdateGame";

interface IUseSolveGame {
  game: Game;
}

export const useSolveGame = ({ game }: IUseSolveGame) => {
  const { mutateAsync: decrypt } = useDecrypt();
  const { mutate: updateGame } = useUpdateGame();
  const salt = useMemo(() => {
    return getSalt({
      address1: game.player1 as `0x${string}`,
      address2: game.player2 as `0x${string}`,
      stake: game.staked,
      chainId: Number.parseInt(game.chainId),
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
        ).data,
      );
    };

    getMove();
  }, [game]);

  const { writeContract, data: hash, isPending } = useWriteContract();

  const { isLoading, data: receipt } = useWaitForTransactionReceipt({
    hash,
  });

  const solve = () => {
    if (move === "0") return;
    setCurrentToast(
      toastLoader({
        title: "Solving!",
        description: "Solving Game...",
      }),
    );
    writeContract(
      {
        address: game.contractAddress as `0x${string}`,
        abi: rpsABI,
        functionName: "solve",
        args: [Number.parseInt(move), salt],
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

  return { solve, isLoading: isLoading || isPending };
};
