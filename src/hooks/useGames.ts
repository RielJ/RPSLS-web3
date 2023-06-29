import { Game } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";

interface IResponseData {
  data: Game[];
}

export const useGames = () => {
  const { address } = useAccount();

  return useQuery<IResponseData>({
    queryKey: ["games", address],
    queryFn: async () => {
      const response = await fetch(`/games/all?address=${address}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Error Fetching data");
      }
      return response.json();
    },
    refetchInterval: 1000,
  });
};
