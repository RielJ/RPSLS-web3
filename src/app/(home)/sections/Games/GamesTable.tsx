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

  // TODO: Pagination
  return (
    <div className="w-full">
      {games && games.length ? (
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
            {games?.map((game) => (
              <GamesTableRow key={game.id} game={game} />
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="mt-6 flex justify-center">
          <h1 className="font-bold text-xl">
            You have no games played. Create a game with your friend!
          </h1>
        </div>
      )}
    </div>
  );
};

export { GamesTable };
