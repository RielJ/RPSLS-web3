"use client";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components";
import { useGames } from "@/hooks";
import { GamesTableRow } from "./GamesTableRow";

const GamesTable = () => {
  const { data: games } = useGames();
  return (
    <div className="w-full">
      {games ? (
        <Table className="bg-transparent">
          <TableCaption>A list of your recent games.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Block ID</TableHead>
              <TableHead>Opponent</TableHead>
              <TableHead>Information</TableHead>
              <TableHead>Stake</TableHead>
              <TableHead>Time Remaining</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {games?.data.map((game) => (
              <GamesTableRow key={game.id} game={game} />
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="mt-6 flex justify-center">
          <h1 className="font-bold text-xl">
            You have no games played. Create a Game to continue!
          </h1>
        </div>
      )}
    </div>
  );
};

export { GamesTable };
