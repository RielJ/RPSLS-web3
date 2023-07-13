import prisma from "@/prisma-client";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not Allowed" },
      { status: 405 }
    );
  }

  try {
    const game: Prisma.GameUpdateInput = await req.json();
    const savedGame = await prisma.game.update({
      where: {
        id: game.id as string,
      },
      data: game,
    });
    return NextResponse.json({ data: savedGame }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "Something went wrong", error: err },
      { status: 400 }
    );
  }
}
