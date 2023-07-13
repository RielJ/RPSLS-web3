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
    const decryptedMove = parseInt(searchParams.get("move") || "0");
    const iv = CryptoJS.lib.WordArray.random(16);
    const key = CryptoJS.enc.Hex.parse(process.env.ENCRYPT_PARAPHRASE || "");
    const encrypted = CryptoJS.AES.encrypt(decryptedMove.toString(), key, {
      iv,
    });
    const cipher = encrypted.ciphertext.toString(CryptoJS.enc.Hex);
    return NextResponse.json(
      { data: { move: cipher, moveIV: iv.toString(CryptoJS.enc.Hex) } },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Something went wrong", error: err },
      { status: 400 }
    );
  }
}
