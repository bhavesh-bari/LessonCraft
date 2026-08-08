import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import History from "@/models/HistoryModel";
import mongoose from "mongoose";

export async function POST(req) {
    try {
        const user = await requireAuth(); // must return user object
        const {
            subject,
            topic,
            module,
            content,
            description,
            pdfBase64,
            fileName,
        } = await req.json();

        if (!pdfBase64) {
            return NextResponse.json(
                { error: "PDF data is required" },
                { status: 400 }
            );
        }

        const pdfBuffer = Buffer.from(pdfBase64, "base64");

        const history = await History.create({
            userId: user._id,
            subject,
            topic,
            module,
            content,
            description,
            pdf: {
                data: pdfBuffer,
                fileName: fileName || `${subject.replace(/\s+/g, "_")}.pdf`,
            },
        });

        return NextResponse.json({
            success: true,
            historyId: history._id,
        });

    } catch (error) {
        console.error("Save History Error:", error);
        return NextResponse.json(
            { error: "Failed to save history" },
            { status: 500 }
        );
    }
}
