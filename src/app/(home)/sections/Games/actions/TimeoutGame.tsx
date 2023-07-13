"use client";

import { Button, LoadingSpinner } from "@/components";
import { useJ1Timeout, useJ2Timeout } from "@/hooks";
import { Game } from "@prisma/client";

export const J1Timeout = ({ game }: { game: Game }) => {
  const { j1Timeout, isLoading } = useJ1Timeout({ game });
  const canTimeout = !j1Timeout || isLoading;

  return (
    <Button
      className={`relative py-4 px-8 ${isLoading ? "cursor-not-allowed" : ""}`}
      disabled={canTimeout}
      onClick={() => {
        j1Timeout?.();
      }}
    >
      {canTimeout && (
        <span className="absolute right-1 top-1">
          <LoadingSpinner w={3} h={3} />
        </span>
      )}
      Claim
    </Button>
  );
};

export const J2Timeout = ({ game }: { game: Game }) => {
  const { j2Timeout, isLoading } = useJ2Timeout({ game });
  const canTimeout = !j2Timeout || isLoading;
  return (
    <Button
      className={`relative py-4 px-8 ${isLoading ? "cursor-not-allowed" : ""}`}
      disabled={canTimeout}
      onClick={() => {
        j2Timeout?.();
      }}
    >
      {canTimeout && (
        <span className="absolute right-1 top-1">
          <LoadingSpinner w={3} h={3} />
        </span>
      )}
      Claim{" "}
    </Button>
  );
};
