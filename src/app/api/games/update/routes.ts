import { PrismaClient, Prisma } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const game: Prisma.GameUpdateInput = JSON.parse(req.body);
    const updatedGame = await prisma.game.update({
      where: {
        // @ts-ignore
        id: game.id,
      },
      data: {
        ...game,
      },
    });
    res.status(200).json(updatedGame);
  } catch (err) {
    res.status(400).json({ message: "Something went wrong" });
  }
}
