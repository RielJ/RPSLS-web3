"use client";
import { Button } from "@/components";
import { useSolveGame } from "@/hooks";
import { Game } from "@prisma/client";

export const SolveGame = ({ game }: { game: Game }) => {
  const { solve, isLoading } = useSolveGame({ game });

  return (
    <Button disabled={isLoading} onClick={solve}>
      Solve
    </Button>
  );
};
