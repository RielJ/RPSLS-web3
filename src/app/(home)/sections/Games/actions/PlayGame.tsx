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
} from "@/components";
import { MOVE } from "@/constants";
import { usePlayGame } from "@/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { Game } from "@prisma/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import validator from "validator";
import { useAccount, useBalance } from "wagmi";
import { z } from "zod";

const playFormSchema = z.object({
  stake: z.string().refine((val) => validator.isFloat(val, { min: 0 }), {
    message: "Must be a valid ammount",
  }),
  move: z.string().refine((val) => validator.isInt(val, { min: 0, max: 5 })),
});

export const PlayGame = ({ game }: { game: Game }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  const form = useForm<z.infer<typeof playFormSchema>>({
    resolver: zodResolver(playFormSchema),
    defaultValues: {
      stake: game.staked.toString(),
    },
  });
  const move = form.watch("move");
  const { play, isLoading } = usePlayGame({ game, move });

  function onSubmit() {
    if (play) {
      setIsOpen(false);
      play?.();
    }
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
                        <SelectItem value={(i + 1).toString()} key={`${move}`}>
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
              <Button type="submit" disabled={!play || isLoading}>
                Play
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
