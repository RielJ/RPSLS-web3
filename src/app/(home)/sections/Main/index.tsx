import {
  NotConnected,
  Connected,
  ConnectButton,
  Card,
  CardHeader,
  CardDescription,
  Separator,
  CardContent,
} from "@/components";
import React from "react";
import { CreateGame } from "./CreateGame";
import { Games } from "./Games";

const Main = () => {
  return (
    <section className="container w-full h-full flex justify-center pb-[10rem]">
      <NotConnected>
        <div className="flex flex-col justify-center items-center space-y-3">
          <div>
            <h1 className="text-xl font-bold">
              Connect Your Wallet to Play The Game!
            </h1>
          </div>
          <ConnectButton />
        </div>
      </NotConnected>
      <Connected>
        <Card className="max-w-5xl w-full">
          <CardHeader>
            <div className="flex flex-row justify-between items-center">
              <h1 className="text-xl font-bold">Kleros RPSSL</h1>
              <CreateGame />
            </div>

            <CardDescription>
              <div>A Rock, Paper, Scissors, Spock, and Lizard Game</div>
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent>
            <div className="w-full">
              <Games />
            </div>
          </CardContent>
        </Card>
      </Connected>
    </section>
  );
};

export { Main };
