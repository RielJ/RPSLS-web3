/*
  Warnings:

  - Added the required column `moveIV` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Game" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "player1" TEXT NOT NULL,
    "player2" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "contractAddress" TEXT NOT NULL,
    "staked" INTEGER NOT NULL,
    "move" TEXT NOT NULL,
    "moveIV" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Game" ("contractAddress", "createdAt", "id", "move", "player1", "player2", "staked", "status") SELECT "contractAddress", "createdAt", "id", "move", "player1", "player2", "staked", "status" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
CREATE UNIQUE INDEX "Game_id_key" ON "Game"("id");
CREATE INDEX "Game_id_player1_player2_idx" ON "Game"("id", "player1", "player2");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
