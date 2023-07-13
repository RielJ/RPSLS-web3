"use client";
import { Game } from "@prisma/client";
import React from "react";
import { GrDisabledOutline } from "react-icons/gr";
import { J1Timeout, J2Timeout, PlayGame, SolveGame } from "./actions";

interface IGamesTableAction {
  action: string;
  game: Game;
}

const GamesTableAction = ({ action, game }: IGamesTableAction) => {
  switch (action) {
    case "play":
      return <PlayGame game={game} />;
    case "solve":
      return <SolveGame game={game} />;
    case "j1Timeout":
      return <J1Timeout game={game} />;
    case "j2Timeout":
      return <J2Timeout game={game} />;
    default:
      return (
        <GrDisabledOutline
          color="white"
          className="color-white cursor-not-allowed inline-block"
        />
      );
  }
};

export { GamesTableAction };
