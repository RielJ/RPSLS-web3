import { Game } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useAccount, usePublicClient } from "wagmi";

interface IResponseData {
  data: Game[];
}

export const useGames = () => {
  const publicClient = usePublicClient();
  const { address } = useAccount();

  // TODO: Add Pagination
  return useQuery<IResponseData, unknown, Game[]>(
    ["games", address, { publicClient }],
    async () => {
      const chainId = await publicClient.getChainId();
      const response = await fetch(
        `/api/games/all?address=${address}&chainId=${chainId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error("Error Fetching data");
      }
      return response.json();
    },
    {
      refetchInterval: 1000,
      select: (data) => data.data,
    }
  );
};
