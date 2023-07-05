/*
  Warnings:

  - Added the required column `chainId` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Game_id_player1_player2_idx";

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "chainId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Game_id_player1_player2_chainId_idx" ON "Game"("id", "player1", "player2", "chainId");
