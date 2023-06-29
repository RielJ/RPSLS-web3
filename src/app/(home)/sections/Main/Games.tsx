import React, { Suspense } from "react";
import { GamesTable } from "./GamesTable";
import { GamesLoading } from "./GamesLoading";

const Games = () => {
  return (
    <>
      <Suspense
        fallback={
          <>
            <GamesLoading />
          </>
        }
      >
        <GamesTable />
      </Suspense>
    </>
  );
};

export { Games };
