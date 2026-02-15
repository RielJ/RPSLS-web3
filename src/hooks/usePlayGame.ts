import { rpsABI } from "@/generated";
import type { Game } from "@prisma/client";
import { useEffect } from "react";
import { parseEther } from "viem";
import {
  usePublicClient,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useDecrypt, useRPSToast, useUpdateGame } from ".";

interface IUsePlayGame {
  game: Game;
  move: string;
}

export const usePlayGame = ({ game, move }: IUsePlayGame) => {
  const publicClient = usePublicClient();
  const { mutateAsync: decrypt } = useDecrypt();
  const { mutate: updateGame } = useUpdateGame();
  const { toastLoader, toast, currentToast, setCurrentToast } = useRPSToast();

  const { writeContract: play, data: hash, isPending } = useWriteContract();

  const { isLoading, data: receipt } = useWaitForTransactionReceipt({
    hash,
  });

  const handlePlay = () => {
    if (Number.parseInt(move) <= 0) return;
    setCurrentToast(
      toastLoader({
        title: "Playing!",
        description: "Submitting Move...",
      }),
    );
    play(
      {
        address: game.contractAddress as `0x${string}`,
        abi: rpsABI,
        functionName: "play",
        args: [Number.parseInt(move)],
        value: parseEther(game.staked),
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
        description: "Move Submitted! Updating Game Status!",
      });
      try {
        if (!publicClient) return;
        const { move: moveEncrypted, moveIV, player1, player2 } = game;
        const [res, block] = await Promise.all([
          decrypt({ move: moveEncrypted, moveIV }),
          publicClient.getBlock({
            blockNumber: receipt?.blockNumber,
          }),
        ]);
        const move1 = Number.parseInt(res.data);
        const move2 = Number.parseInt(move);
        let winStatus = "";

        if (move1 === move2) winStatus = "Tie";
        else if (move1 % 2 === move2 % 2)
          winStatus = move1 < move2 ? player1 : player2;
        else winStatus = move1 > move2 ? player1 : player2;
        updateGame({
          ...game,
          status: "PLAYER_2_DONE",
          winner: winStatus,
          createdAt: new Date(Number(block.timestamp) * 1000),
        });
        toast({
          description: "You've submitted your move successfully!",
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

  return { play: handlePlay, isLoading: isLoading || isPending };
};
