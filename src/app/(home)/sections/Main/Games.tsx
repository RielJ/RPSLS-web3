"use client";
import React, { Suspense } from "react";
import { useAccount } from "wagmi";
import { GamesTable } from "./GamesTable";

const Games = () => {
  const { address } = useAccount();

  return (
    <>
      <Suspense fallback={<>Loading...</>}>
        <GamesTable />
      </Suspense>
    </>
  );
};

export { Games };
