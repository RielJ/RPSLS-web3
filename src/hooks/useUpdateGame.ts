import { Game } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useGames } from "./useGames";

export const useUpdateGame = () => {
  const { refetch } = useGames();

  // TODO: Add Toaster Notification
  return useMutation({
    mutationFn: async (game: Game) => {
      return fetch("/api/games/update", {
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
};
