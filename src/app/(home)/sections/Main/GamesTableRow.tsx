"use client";
import {
  TableRow,
  TableCell,
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components";
import { formatTime, shortify } from "@/utils";
import { Game } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { HiInformationCircle } from "react-icons/hi";
import { GrInProgress } from "react-icons/gr";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { FaEquals } from "react-icons/fa";
import { useAccount, useBalance } from "wagmi";
import { GamesTableAction } from "./GamesTableAction";

interface IGamesTableRow {
  game: Game;
}

const GamesTableRow = ({ game }: IGamesTableRow) => {
  const { address } = useAccount();
  const { data: balance } = useBalance({
    address,
  });
  const [remainingTime, setRemainingTime] = useState(
    Date.now() - new Date(game.createdAt).getTime()
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const currentTime = Date.now();
      const timeDifference = currentTime - new Date(game.createdAt).getTime();

      if (timeDifference > 301_000) {
        clearInterval(timer);
      } else {
        setRemainingTime(timeDifference);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [game]);

  return (
    <TableRow key={game.id}>
      <TableCell className="font-medium">{game.id}</TableCell>
      <TableCell>
        {address === game.player1
          ? shortify(game.player1)
          : shortify(game.player2)}
      </TableCell>
      <TableCell>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <HiInformationCircle className="h-[1rem] w-[1rem] ml-2" />
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {getStatusMessage({
                  remainingTime,
                  game,
                  address,
                })}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell>
        {game.staked} {balance?.symbol}
      </TableCell>
      <TimeCell remainingTime={remainingTime} />
      <TableCell>
        <TooltipProvider>
          <Tooltip>{getWinnerStatus(game, address || "")}</Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell className="text-right">
        <TableActions
          game={game}
          address={address}
          remainingTime={remainingTime}
        />
      </TableCell>
    </TableRow>
  );
};

function getWinnerStatus(game: Game, address: string) {
  if (game.status === "ALL_DONE") {
    if (game.winner === "Tie") {
      return (
        <>
          <TooltipTrigger>
            <FaEquals />
          </TooltipTrigger>
          <TooltipContent>
            <p>Tie</p>
          </TooltipContent>
        </>
      );
    } else if (game.winner === address) {
      return (
        <>
          <TooltipTrigger>
            <AiOutlineCheckCircle />
          </TooltipTrigger>
          <TooltipContent>
            <p>Won</p>
          </TooltipContent>
        </>
      );
    } else {
      return (
        <>
          <TooltipTrigger>
            <AiOutlineCloseCircle />
          </TooltipTrigger>
          <TooltipContent>
            <p>Lost</p>
          </TooltipContent>
        </>
      );
    }
  } else {
    return (
      <>
        <TooltipTrigger>
          <GrInProgress />
        </TooltipTrigger>
        <TooltipContent>
          <p>In Progress</p>
        </TooltipContent>
      </>
    );
  }
}

function TableActions({
  game,
  address = "",
  remainingTime,
}: {
  game: Game;
  address?: string;
  remainingTime: number;
}) {
  const { player1, status, player2 } = game;
  const elapsed = formatTime(remainingTime) === "Elapsed";
  if (elapsed) {
    if (address === player1) {
      if (status === "INIT")
        return <GamesTableAction game={game} action="j2Timeout" />;
      else if (status === "PLAYER_2_DONE")
        return <GamesTableAction game={game} action="disabled" />;
    } else if (address === player2) {
      if (status === "INIT")
        return <GamesTableAction game={game} action="disabled" />;
      else if (status === "PLAYER_2_DONE")
        return <GamesTableAction game={game} action="j1Timeout" />;
    }
  } else {
    if (address === player1) {
      if (status === "INIT")
        return <GamesTableAction game={game} action="disabled" />;
      else if (status === "PLAYER_2_DONE")
        return <GamesTableAction game={game} action="solve" />;
    } else if (address === player2) {
      if (status === "INIT")
        return <GamesTableAction game={game} action="play" />;
      else if (status === "PLAYER_2_DONE")
        return <GamesTableAction game={game} action="disabled" />;
    }
  }

  return <GamesTableAction game={game} action="disabled" />;
}
function getStatusMessage({
  remainingTime,
  game: { status, player1, player2 },
  address = "",
}: {
  remainingTime: number;
  game: Game;
  address?: string;
}) {
  const elapsed = formatTime(remainingTime) === "Elapsed";
  let message = "Game is Done!";
  if (elapsed) {
    // [INIT, PLAYER_2_DONE, ALL_DONE]
    if (address === player1) {
      if (status === "INIT")
        message =
          "Opponent Didn't respond, you can now claim back your staked tokens.";
      else if (status === "PLAYER_2_DONE")
        message =
          "Opps! You didn't respond in time, You are now automatically lost.";
    } else if (address === player2) {
      if (status === "INIT")
        message = "Opps! You didn't respond in time, Game is now terminated!.";
      else if (status === "PLAYER_2_DONE")
        message = "Opponent Didn't respond! You now automatically wins!";
    }
  } else {
    if (address === player1) {
      if (status === "INIT") return "Waiting for the opponent to move.";
      else if (status === "PLAYER_2_DONE")
        message = "You can now solve and see who wins!";
    } else if (address === player2) {
      if (status === "INIT")
        message = "Someone has challenged you to a RPSLS Game!";
      else if (status === "PLAYER_2_DONE")
        message = "Waiting for the opponent to solve the game.";
    }
  }
  return <span>{message}</span>;
}

const TimeCell = ({ remainingTime }: { remainingTime: number }) => {
  return <TableCell>{formatTime(remainingTime)}</TableCell>;
};

export { GamesTableRow };
