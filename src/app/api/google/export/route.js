import { NextResponse } from "next/server";
import { google } from "googleapis";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/userModel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getAuthedGoogleClientFromUser } from "@/lib/google";

export async function POST(req) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { quizData, subject, topic } = await req.json();
  if (!quizData?.length) {
    return NextResponse.json({ error: "No quiz data" }, { status: 400 });
  }

  const user = await User.findById(session.user.id);
  if (!user?.googleAccessToken) {
    return NextResponse.json({ error: "Google not connected" }, { status: 403 });
  }

  try {
    // Build client + auto-refresh if needed
    const { auth, refreshed } = await getAuthedGoogleClientFromUser(user);

    // If refreshed, persist new tokens
    if (refreshed?.access_token) {
      user.googleAccessToken = refreshed.access_token;
    }
    if (refreshed?.refresh_token) {
      user.googleRefreshToken = refreshed.refresh_token;
    }
    if (refreshed?.expiry_date) {
      user.googleTokenExpiry = new Date(refreshed.expiry_date);
    }
    if (refreshed) await user.save();

    const forms = google.forms({ version: "v1", auth });

    // 1) Create a new Form
    const created = await forms.forms.create({
      requestBody: { info: { title: `${subject || "Quiz"} - ${topic || ""}`.trim() } },
    });

    const formId = created.data.formId;

    // 2) Add items and set quiz mode
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
              // Add grading information to make it a self-grading quiz
              grading: {
                pointValue: 1,
                correctAnswers: {
                  answers: [{ value: q.answer }],
                },
              },
            },
          },
        },
        location: { index: i },
      },
    }));

    // Add a request to enable quiz settings on the form
    requests.push({
      updateFormSettings: {
        settings: {
          quizSettings: {
            isQuiz: true
          }
        },
        updateMask: 'quizSettings.isQuiz'
      }
    });

    await forms.forms.batchUpdate({
      formId,
      requestBody: { requests },
    });

    // 3) Return URLs
    return NextResponse.json({
      formId,
      formUrl: created.data.responderUri,
      editorUrl: `https://docs.google.com/forms/d/${formId}/edit`,
    });
  } catch (err) {
    console.error("Google Form export error:", err?.response?.data || err);
    return NextResponse.json({ error: "Failed to export" }, { status: 500 });
  }
}