import { Game, Prisma, PrismaClient } from "@prisma/client";
// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  if (req.method !== "GET") {
    return NextResponse.json(
      { message: "Method not Allowed" },
      { status: 405 }
    );
  }

  try {
    // const user: { address: string } = await req.query;
    //
    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address") || "";
    console.log({ searchParams, address });
    const games: Game[] = await prisma.game.findMany({
      where: {
        OR: [{ player1: address }, { player2: address }],
      },
      orderBy: {
        id: "desc",
      },
    });
    console.log({ games });
    return NextResponse.json({ data: games }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "Something went wrong", error: err },
      { status: 400 }
    );
  }
}

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not Allowed" },
      { status: 405 }
    );
  }

  console.log({ req });
  try {
    const game: Prisma.GameCreateInput = await req.json();
    console.log({ game });
    const savedGame = await prisma.game.create({ data: game });
    return NextResponse.json({ data: savedGame }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "Something went wrong", error: err },
      { status: 400 }
    );
  }
}
