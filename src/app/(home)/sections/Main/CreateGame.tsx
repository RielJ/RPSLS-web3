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
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Address, useAccount, useBalance } from "wagmi";
import * as z from "zod";
import validator from "validator";
import { useDeployContract } from "@/hooks";
import { MOVE } from "@/constants";

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
  const form = useForm<z.infer<typeof createGameFormSchema>>({
    resolver: zodResolver(createGameFormSchema),
    defaultValues: {
      address: "",
      stake: "0",
    },
  });
  const [isOpen, setIsOpen] = useState(false);
  const { address } = useAccount();
  const { data: balance } = useBalance({
    address,
    watch: true,
  });
  const { mutate: deployContract, isLoading: isDeployLoading } =
    useDeployContract();
  const { toast } = useToast();

  function onSubmit(values: z.infer<typeof createGameFormSchema>) {
    if (balance && parseInt(values.stake) > balance?.value) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "You don't have enough tokens to stake!",
      });
    } else {
      deployContract({
        address: values.address as Address,
        move: parseInt(values.move),
        stake: values.stake,
      });
      setIsOpen(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
              <Button type="submit" disabled={isDeployLoading}>
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
