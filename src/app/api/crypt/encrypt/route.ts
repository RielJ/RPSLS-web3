import { NextResponse } from "next/server";
import CryptoJS from "crypto-js";

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
    const iv = CryptoJS.lib.WordArray.random(16);
    const key = process.env.ENCRYPT_PARAPHRASE || "";
    const encrypted = CryptoJS.AES.encrypt((move + 1).toString(), key, {
      iv,
    }).toString();
    return NextResponse.json(
      { data: { move: encrypted, moveIV: iv.toString(CryptoJS.enc.Hex) } },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Something went wrong", error: err },
      { status: 400 }
    );
  }
}
