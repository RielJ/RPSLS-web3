import {
  TableRow,
  TableCell,
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components";
import { shortify } from "@/utils";
import { Game } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { HiInformationCircle } from "react-icons/hi";
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
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(game.createdAt));

  useEffect(() => {
    const id = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(game.createdAt));
      if (isElapsed(timeLeft)) clearTimeout(id);
    }, 1000);

    return () => {
      clearTimeout(id);
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
              <p>{getStatusMessage({ game, address })}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell>
        {game.staked} {balance?.symbol}
      </TableCell>
      <TimeCell timeLeft={timeLeft} />
      <TableCell className="text-right">
        <TableActions game={game} address={address} timeLeft={timeLeft} />
      </TableCell>
    </TableRow>
  );
};

function TableActions({
  game: { player1, status, player2 },
  address = "",
  timeLeft,
}: {
  game: Game;
  address?: string;
  timeLeft: { minutes: number; seconds: number };
}) {
  const elapsed = isElapsed(timeLeft);
  if (elapsed) {
    if (address === player1) {
      if (status === "INIT") return <GamesTableAction action="j2Timeout" />;
      else if (status === "PLAYER_2_DONE")
        return <GamesTableAction action="disabled" />;
    } else if (address === player2) {
      if (status === "INIT") return <GamesTableAction action="disabled" />;
      else if (status === "PLAYER_2_DONE")
        return <GamesTableAction action="j1Timeout" />;
    }
  } else {
    if (address === player1) {
      if (status === "INIT") return <GamesTableAction action="disabled" />;
      else if (status === "PLAYER_2_DONE")
        return <GamesTableAction action="solve" />;
    } else if (address === player2) {
      if (status === "INIT") return <GamesTableAction action="play" />;
      else if (status === "PLAYER_2_DONE")
        return <GamesTableAction action="disabled" />;
    }
  }

  return <GamesTableAction action="disabled" />;
}
function getStatusMessage({
  game: { status, createdAt, player1, player2 },
  address = "",
}: {
  game: Game;
  address?: string;
}) {
  const elapsed = isElapsed(calculateTimeLeft(createdAt));
  let message = "Game is Done!";
  if (elapsed) {
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

function calculateTimeLeft(dateCreated: Date) {
  const difference = -new Date().getTime() + new Date(dateCreated).getTime();
  let timeLeft = {
    minutes: 0,
    seconds: 0,
  };

  if (difference > 0) {
    timeLeft = {
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }
  console.log(timeLeft.minutes, timeLeft.seconds);

  return timeLeft;
}

function isElapsed(timeLeft: { minutes: number; seconds: number }) {
  return timeLeft.minutes === 0 && timeLeft.seconds === 0;
}

const TimeCell = ({
  timeLeft,
}: {
  timeLeft: { minutes: number; seconds: number };
}) => {
  return (
    <TableCell>
      {!isElapsed(timeLeft) ? (
        <>
          <span>{timeLeft.minutes}</span>
          <span>
            :
            {timeLeft.seconds.toString().length == 1
              ? `0${timeLeft.seconds}`
              : timeLeft.seconds}
          </span>{" "}
          <span>{timeLeft.minutes > 0 ? "Minutes Left" : "Seconds Left"}</span>
        </>
      ) : (
        "Elapsed"
      )}
    </TableCell>
  );
};

export { GamesTableRow };
