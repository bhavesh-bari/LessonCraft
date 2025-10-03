// src/app/api/google/status/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ connected: false });

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    return Response.json({ connected: !!user?.googleAccessToken });
}
