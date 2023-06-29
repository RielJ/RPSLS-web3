-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "player1" TEXT NOT NULL,
    "player2" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "contractAddress" TEXT NOT NULL,
    "staked" INTEGER NOT NULL,
    "move" TEXT NOT NULL,
    "winner" TEXT DEFAULT '',
    "moveIV" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Game_id_key" ON "Game"("id");

-- CreateIndex
CREATE INDEX "Game_id_player1_player2_idx" ON "Game"("id", "player1", "player2");
