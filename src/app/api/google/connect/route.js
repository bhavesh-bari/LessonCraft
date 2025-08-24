// src/app/api/google/connect/route.js
import { NextResponse } from "next/server";
import { getGoogleAuthURL } from "@/lib/google"; // adjust path

export async function GET() {
  try {
    const url = getGoogleAuthURL();
    return NextResponse.redirect(url);
  } catch (err) {
    console.error("Google connect error:", err);
    return NextResponse.json({ error: "Failed to initiate Google OAuth" }, { status: 500 });
  }
}
