import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components";
import { useGames } from "@/hooks";
import { shortify } from "@/utils";
import { useEffect, useState } from "react";
import { useAccount, useBalance } from "wagmi";
import { HiInformationCircle } from "react-icons/hi";
import { GamesTableRow } from "./GamesTableRow";

const GamesTable = () => {
  const { data: games } = useGames();
  return (
    <div className="w-full">
      {games ? (
        <Table>
          <TableCaption>A list of your recent games.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Block ID</TableHead>
              <TableHead>Opponent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Stake</TableHead>
              <TableHead>Time Remaining</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {games?.data.map((game) => (
              <GamesTableRow game={game} />
            ))}
          </TableBody>
        </Table>
      ) : (
        <h1>You have no games played. Create a Game to continue!</h1>
      )}
    </div>
  );
};

export { GamesTable };
