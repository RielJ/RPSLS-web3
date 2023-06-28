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
} from "@/components";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { useAccount, useBalance } from "wagmi";
import * as z from "zod";

const createGameFormSchema = z.object({
  address: z
    .string()
    .startsWith("0x", { message: 'Address must start with "0x"' })
    .min(2, {
      message: "Username must be at least 2 characters.",
    }),
  stake: z.number().positive({ message: "Stake must be greater than 0" }),
});

const CreateGame = () => {
  const form = useForm<z.infer<typeof createGameFormSchema>>({
    resolver: zodResolver(createGameFormSchema),
    defaultValues: {
      address: "",
      stake: 0,
    },
  });
  const { address } = useAccount();
  const { data: balance, refetch } = useBalance({
    address,
    watch: true,
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof createGameFormSchema>) {
    console.log(values);
  }

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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                    <Input type="number" placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormDescription>{balance?.symbol} staked</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
            <DialogFooter>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export { CreateGame };
