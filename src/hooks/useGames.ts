import type { Game } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useAccount, usePublicClient } from "wagmi";

interface IResponseData {
  data: Game[];
}

export const useGames = () => {
  const publicClient = usePublicClient();
  const { address } = useAccount();

  return useQuery<IResponseData, unknown, Game[]>({
    queryKey: ["games", address, publicClient?.uid],
    queryFn: async () => {
      if (!publicClient) throw new Error("No public client");
      const chainId = await publicClient.getChainId();
      const response = await fetch(
        `/api/games/all?address=${address}&chainId=${chainId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "GET",
        },
      );
      if (!response.ok) {
        throw new Error("Error Fetching data");
      }
      return response.json();
    },
    refetchInterval: 1000,
    select: (data) => data.data,
  });
};
