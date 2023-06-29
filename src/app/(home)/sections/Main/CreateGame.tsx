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
  Input,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Form,
  Separator,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast,
} from "@/components";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Address, useAccount, useBalance, usePublicClient } from "wagmi";
import * as z from "zod";
import validator from "validator";
import { useAddGame, useDeployContract, useGames } from "@/hooks";
import { Block, Hash } from "viem";
import { Game } from "@prisma/client";

const MOVE = ["Rock", "Paper", "Scissors", "Spock", "Lizard"] as const;

const createGameFormSchema = z.object({
  address: z.string().refine(validator.isEthereumAddress, {
    message: "Must be a valid address.",
  }),
  stake: z.string().refine((val) => validator.isFloat(val, { min: 0 }), {
    message: "Must be a valid ammount",
  }),
  move: z.string().refine((val) => validator.isInt(val, { min: 0, max: 5 })),
});

const CreateGame = () => {
  const publicClient = usePublicClient();
  const { refetch: refetchGames } = useGames();
  const form = useForm<z.infer<typeof createGameFormSchema>>({
    resolver: zodResolver(createGameFormSchema),
    defaultValues: {
      address: "",
      stake: "0",
    },
  });
  const { address } = useAccount();
  const { data: balance } = useBalance({
    address,
    watch: true,
  });
  const {
    mutate: deployContract,
    data: contractHash,
    isLoading: isDeployLoading,
    isError: isDeployError,
  } = useDeployContract();
  const { mutate: addGame, isLoading: isAddGameLoading } = useAddGame();
  const { toast } = useToast();
  const [hash, setHash] = useState<Hash>();
  const [block, setBlock] = useState<Block>();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(false);

  function onSubmit(values: z.infer<typeof createGameFormSchema>) {
    setGame({
      player1: address || "",
      player2: values.address,
      staked: parseInt(values.stake),
      id: "",
      status: "PLAYER_2_MOVE",
      createdAt: new Date(),
    });
    deployContract({
      address: values.address as Address,
      move: parseInt(values.move),
      stake: values.stake,
    });
  }

  useEffect(() => {
    (async () => {
      if (hash) {
        try {
          setLoading(true);
          const receipt = await publicClient.waitForTransactionReceipt({
            hash,
          });
          if (receipt.status === "success") {
            const block = await publicClient.getBlock({
              blockNumber: receipt.blockNumber,
            });
            setBlock(block);
          }
        } catch (err) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
          });
        } finally {
          setLoading(false);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash]);

  useEffect(() => {
    if (block && block.number) {
      addGame({
        ...game,
        id: block.number.toString(),
        createdAt: new Date(Number(block.timestamp) * 1000),
      } as Game);
      toast({
        description: "Game has been created Successfully!",
      });
      refetchGames();
      setGame(null);
      setBlock(undefined);
      setHash(undefined);
    }
  }, [block, game, addGame]);

  useEffect(() => {
    if (contractHash) setHash(contractHash);
  }, [contractHash]);

  useEffect(() => {
    setLoading(isAddGameLoading || isDeployLoading);
  }, [isAddGameLoading, isDeployLoading]);

  useEffect(() => {
    if (isDeployError) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
      setLoading(false);
    }
  }, [isDeployError]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create a Game!</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create an RPSSL Game!</DialogTitle>
          <DialogDescription>
            Stake a coin and challenge your friends to play the game!
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opponent&apos;s Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Address" {...field} />
                  </FormControl>
                  <FormDescription>Opponent&apos;s Address.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                    <Input {...field} type="number" />
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

export { CreateGame };
