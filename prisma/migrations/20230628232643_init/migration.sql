-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "player1" TEXT NOT NULL,
    "player2" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "staked" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "Game_id_player1_player2_idx" ON "Game"("id", "player1", "player2");
