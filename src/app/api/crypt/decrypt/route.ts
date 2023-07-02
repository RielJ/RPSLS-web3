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
    const iv = CryptoJS.enc.Hex.parse(searchParams.get("moveIV") || "");
    const key = process.env.ENCRYPT_PARAPHRASE || "";
    const decryptedWord = CryptoJS.AES.decrypt(move, key, { iv });
    const decrypted = decryptedWord.toString(CryptoJS.enc.Utf8);
    return NextResponse.json({ data: decrypted }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "Something went wrong", error: err },
      { status: 400 }
    );
  }
}
