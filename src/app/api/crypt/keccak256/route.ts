import { NextResponse } from "next/server";
import { concat, keccak256, toBytes } from "viem";

export async function GET(req: Request) {
  if (req.method !== "GET") {
    return NextResponse.json(
      { message: "Method not Allowed" },
      { status: 405 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const move = searchParams.get("move") || "";
    const salt = process.env.SALT || "";
      const hash = keccak256(
        concat([toBytes(move), toBytes(salt, { size: 32 })])
      );
    return NextResponse.json(
      { data: hash },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Something went wrong", error: err },
      { status: 400 }
    );
  }
}
