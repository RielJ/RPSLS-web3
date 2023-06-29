import { Game } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";

export const useAddGame = () => {
  const { ...props } = useMutation({
    mutationFn: async (game: Game) => {
      return fetch("/api/games", {
        body: JSON.stringify({
          ...game,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
    },
  });
  return { ...props };
};
