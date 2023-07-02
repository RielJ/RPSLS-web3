"use client";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  useToast,
} from "@/components";
import { Game } from "@prisma/client";
import React, { useState } from "react";
import { GrDisabledOutline } from "react-icons/gr";
import {
  Address,
  useAccount,
  useBalance,
  useContractWrite,
  usePublicClient,
} from "wagmi";
import { RPS__factory } from "@/typechain-types";
import { parseEther } from "ethers";
import * as z from "zod";
import validator from "validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MOVE } from "@/constants";
import { useUpdateGame } from "@/hooks/useUpdateGame";
import CryptoJS from "crypto-js";
import { useDecrypt } from "@/hooks";

// PLAYER 1:
// 1. Player 1 challenges Player 2 = INITIAL : Disabled Button
// 2. Player 2 didn't accept the challenge and timed out. = INITIAL & TIMEDOUT : "j2Timeout"  Button Action.
// 3. Player 2 accepts the Challenge = PLAYER_2_ACCEPTED : "solve" Button Action
// 4. Player 2 accepts the Challenge but Player 1 Timed Out = PLAYER_2_ACCEPTED & Player1 TIMEDOUT : Disabled Button
//
// PLAYER 2:
// 1. Player 1 challenges Player 2 = INITIAL : "play" Button
// 2. Player 2 didn't press play and timed out = INITIAL & TIMEOUT : Disabled Button.
// 3. Player 2 accepts the Challenge = PLAYER_2_ACCEPTED : Disabled Button
// 3. Player 1 did'tn solve the Challenge = PLAYER_2_ACCEPTED & Player 1 TIMEOUT : "j1TimeOut" Button Action
//

// [INIT, PLAYER_2_DONE, PLAYER_1_DONE, ALL_DONE]
interface IGamesTableAction {
  action: string;
  game: Game;
}

// ["play", "solve", "j1TimeOut", "j2Timeout", "disabled"]
const GamesTableAction = ({ action, game }: IGamesTableAction) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const gameContract = {
    address: game.contractAddress as Address,
    abi: RPS__factory.abi,
  };
  const { mutateAsync: decrypt } = useDecrypt();
  const { mutate: updateGame, isLoading: isUpdateGameLoading } =
    useUpdateGame();
  const { write: solve, isLoading: solveLoading } = useContractWrite({
    ...gameContract,
    functionName: "solve",
    onSuccess: async () => {
      updateGame({ ...game, status: "ALL_DONE" });
      toast({
        description: "Stake Claimed! Check your Account!",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    },
  });
  const { write: j2Time, isLoading: j2TimeLoading } = useContractWrite({
    ...gameContract,
    functionName: "j2Timeout",
    onSuccess: () => {
      updateGame({ ...game, status: "ALL_DONE", winner: game.player1 });
      toast({
        description: "Stake Claimed! Check your Account!",
      });
    },
    onError: (err) => {
      console.log({ err });
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    },
  });
  const { write: j1Time, isLoading: j1TimeLoading } = useContractWrite({
    ...gameContract,
    functionName: "j1Timeout",
    onSuccess: () => {
      updateGame({ ...game, status: "ALL_DONE", winner: game.player2 });
      toast({
        description: "Stake Claimed! Check your Account!",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    },
  });
  const { write: play, isLoading: playLoading } = useContractWrite({
    ...gameContract,
    functionName: "play",
    args: [0],
    value: parseEther(game.staked.toString()),
    onSuccess: async (_, variables) => {
      const move1 = await decrypt({ move: game.move, moveIV: game.moveIV });
      const move2 = (variables.args && variables.args[0]) || 0;
      let winStatus = "";
      if (move1 === move2) winStatus = "Tie";
      else if (move1 % 2 === move2 % 2)
        move1 < move2 ? (winStatus = game.player1) : (winStatus = game.player2);
      else
        move1 > move2 ? (winStatus = game.player1) : (winStatus = game.player2);
      updateGame({ ...game, status: "PLAYER_2_DONE", winner: winStatus });
      toast({
        description: "You've submitted your move successfully!",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    },
  });

  switch (action) {
    case "play":
      return (
        <PlayDialog
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          play={(move: string) => {
            play({ args: [parseInt(move) + 1] });
          }}
          game={game}
          loading={playLoading || isUpdateGameLoading}
        />
      );
    case "solve":
      return (
        <Button
          disabled={solveLoading}
          onClick={() => {
            const iv = CryptoJS.enc.Hex.parse(game.moveIV);
            const key = process.env.ENCRYPT_PARAPHRASE || "";
            const move = CryptoJS.AES.decrypt(game.move, key, { iv });
            solve({
              args: [
                parseInt(move.toString(CryptoJS.enc.Utf8)),
                BigInt(process.env.SALT || 0),
              ],
            });
          }}
        >
          Solve
        </Button>
      );
    case "j1Timeout":
      return (
        <Button
          disabled={j1TimeLoading}
          onClick={() => {
            j1Time();
          }}
        >
          Claim
        </Button>
      );
    case "j2Timeout":
      return (
        <Button
          disabled={j2TimeLoading}
          onClick={() => {
            j2Time();
          }}
        >
          Claim
        </Button>
      );
    default:
      return (
        <GrDisabledOutline
          color="white"
          className="color-white cursor-not-allowed inline-block"
        />
      );
  }
};

const playFormSchema = z.object({
  stake: z.string().refine((val) => validator.isFloat(val, { min: 0 }), {
    message: "Must be a valid ammount",
  }),
  move: z.string().refine((val) => validator.isInt(val, { min: 0, max: 5 })),
});

const PlayDialog = ({
  play,
  game,
  loading,
  isOpen,
  setIsOpen,
}: {
  play: (move: string) => void;
  game: Game;
  loading: boolean;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { address } = useAccount();
  const { data: balance } = useBalance({
    address,
    watch: true,
    cacheTime: 5000,
  });
  const form = useForm<z.infer<typeof playFormSchema>>({
    resolver: zodResolver(playFormSchema),
    defaultValues: {
      stake: game.staked.toString(),
    },
  });

  function onSubmit(values: z.infer<typeof playFormSchema>) {
    play(values.move);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button>Play</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Respond to Challenge</DialogTitle>
          <DialogDescription>Choose a move</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="stake"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between">
                    <FormLabel>Stake</FormLabel>
                    <div>
                      {balance?.formatted} {balance?.symbol}
                    </div>
                  </div>
                  <FormControl>
                    <Input {...field} readOnly type="number" />
                  </FormControl>
                  <FormDescription>{balance?.symbol} staked</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="move"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Move</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a move to play" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MOVE.map((move, i) => (
                        <SelectItem value={i.toString()} key={`${move}`}>
                          {move}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Your Move to Make (Irreversible)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export { GamesTableAction };
