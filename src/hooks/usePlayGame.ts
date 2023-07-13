import { RPS__factory } from "@/typechain-types";
import { Game } from "@prisma/client";
import { Address, parseEther } from "viem";
import {
  usePublicClient,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { useEffect } from "react";
import { useDecrypt, useRPSToast, useUpdateGame } from ".";

interface IUsePlayGame {
  game: Game;
  move: string;
}

export const usePlayGame = ({ game, move }: IUsePlayGame) => {
  const publicClient = usePublicClient();
  const { mutateAsync: decrypt } = useDecrypt();
  const { mutate: updateGame /* , isLoading: isUpdateGameLoading */ } =
    useUpdateGame();
  const { toastLoader, toast, currentToast, setCurrentToast } = useRPSToast();

  const { config } = usePrepareContractWrite({
    address: game.contractAddress as Address,
    abi: RPS__factory.abi,
    functionName: "play",
    args: [parseInt(move)],
    enabled: parseInt(move) > 0,
    value: parseEther(game.staked),
  });

  const { write: play, data } = useContractWrite({
    ...config,
    onMutate: () => {
      setCurrentToast(
        toastLoader({
          title: "Playing!",
          description: "Submitting Move...",
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
        description: "Move Submitted! Updating Game Status!",
      });
      try {
        const { move: moveEncrypted, moveIV, player1, player2 } = game;
        const [res, block] = await Promise.all([
          decrypt({ move: moveEncrypted, moveIV }),
          publicClient.getBlock({
            blockNumber: receipt?.blockNumber,
          }),
        ]);
        const move1 = parseInt(res.data);
        const move2 = parseInt(move);
        let winStatus = "";

        if (move1 === move2) winStatus = "Tie";
        else if (move1 % 2 === move2 % 2)
          move1 < move2 ? (winStatus = player1) : (winStatus = player2);
        else move1 > move2 ? (winStatus = player1) : (winStatus = player2);
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

  return { play, isLoading };
};
