// src/app/api/google/callback/route.js
import { NextResponse } from "next/server";
import { getGoogleOAuthClient } from "@/lib/google";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/userModel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // adjust path

export async function GET(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Missing OAuth code" }, { status: 400 });
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login`);
    }

    const oauth2Client = getGoogleOAuthClient();
    const { tokens } = await oauth2Client.getToken(code);

    await User.findByIdAndUpdate(session.user.id, {
      googleAccessToken: tokens.access_token,
      googleRefreshToken: tokens.refresh_token,
      googleTokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
    });

    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?google=connected`);
  } catch (err) {
    console.error("Google callback error:", err);
    return NextResponse.json({ error: "Google OAuth failed" }, { status: 500 });
  }
}
