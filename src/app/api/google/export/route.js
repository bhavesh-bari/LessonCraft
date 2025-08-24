// src/app/api/google/export/route.js
import { NextResponse } from "next/server";
import { google } from "googleapis";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/userModel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { quizData, subject, topic } = await req.json();

  const user = await User.findById(session.user.id);
  if (!user?.googleAccessToken) {
    return NextResponse.json({ error: "Google not connected" }, { status: 403 });
  }

  try {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({
      access_token: user.googleAccessToken,
      refresh_token: user.googleRefreshToken,
    });

    const forms = google.forms({ version: "v1", auth });

    // Create new form
    const form = await forms.forms.create({
      requestBody: { info: { title: `${subject} - ${topic} Quiz` } },
    });

    // Add quiz items
    const requests = quizData.map((q, i) => ({
      createItem: {
        item: {
          title: q.question,
          questionItem: {
            question: {
              required: true,
              choiceQuestion: {
                type: "RADIO",
                options: q.options.map((opt) => ({ value: opt })),
                shuffle: false,
              },
            },
          },
        },
        location: { index: i },
      },
    }));

    await forms.forms.batchUpdate({
      formId: form.data.formId,
      requestBody: { requests },
    });

    return NextResponse.json({ formUrl: form.data.responderUri });
  } catch (err) {
    console.error("Google Form export error:", err);
    return NextResponse.json({ error: "Failed to export" }, { status: 500 });
  }
}
