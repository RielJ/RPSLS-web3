import { PrismaClient, Prisma } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const game: Prisma.GameUpdateInput = JSON.parse(req.body);
    const deletedGame = await prisma.game.delete({
      where: {
        // @ts-ignore
        id: game.id,
      },
    });
    res.status(200).json(deletedGame);
  } catch (err) {
    res.status(400).json({ message: "Something went wrong" });
  }
}
