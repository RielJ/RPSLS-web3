import { Game } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useGames } from "./useGames";

export const useAddGame = () => {
  const { refetch } = useGames();
  const { ...props } = useMutation({
    mutationFn: async (game: Game) => {
      return fetch("/api/games/all", {
        body: JSON.stringify({
          ...game,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
    },
    onSuccess: () => {
      refetch();
    },
    onError: (err) => {
      console.error({ err });
    },
  });
  return { ...props };
};
