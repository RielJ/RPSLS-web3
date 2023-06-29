import { Button } from "@/components";
import React from "react";
import { GrDisabledOutline } from "react-icons/gr";

// PLAYER 1:
// 1. Player 1 challenges Player 2 = INITIAL : Disabled Button
// 2. Player 2 didn't accept the challenge and timed out. = INITIAL & TIMEDOUT : "j2Timeout"  Button Action.
// 3. Player 2 accepts the Challenge = PLAYER_2_ACCEPTED : "solve" Button Action
// 4. Player 2 accepts the Challenge but Player 1 Timed Out = PLAYER_2_ACCEPTED & Player1 TIMEDOUT : Disabled Button
//
// PLAYER 2:
// 1. Player 1 challenges Player 2 = INITIAL : "play" Button
// 2. Player 2 didn't press play and timed out = INITIAL & TIMEOUT : Disabled Button.
// 3. Player 2 accepts the Challenge = PLAYER_2_ACCEPTED : Disabled Button
// 3. Player 1 did'tn solve the Challenge = PLAYER_2_ACCEPTED & Player 1 TIMEOUT : "j1TimeOut" Button Action

// [INIT, PLAYER_2_DONE, PLAYER_1_DONE, ALL_DONE]
interface IGamesTableAction {
  action: string;
}

// ["play", "solve", "j1TimeOut", "j2Timeout", "disabled"]
const GamesTableAction = ({ action }: IGamesTableAction) => {
  switch (action) {
    case "play":
      break;
    case "solve":
      break;
    case "j1Timeout":
      break;
    case "j2Timeout":
      break;
    case "disabled":
      return <GrDisabledOutline className="cursor-not-allowed" />;
    default:
      break;
  }

  return <></>;
};

export { GamesTableAction };
