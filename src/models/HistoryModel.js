import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        subject: {
            type: String,
            required: true,
            trim: true,
        },

        topic: {
            type: String,
            required: true,
            trim: true,
        },

        module: {
            type: String,
            enum: [
                "ACTIVITY",
                "NOTE_GENERATOR",
                "EXAM_PAPER",
                "LESSON_PLAN",
                "QUIZ",
                "SUMMARIZER",
            ],
            required: true,
        },

        content: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },

        description: {
            type: String,
            default: "",
        },


        pdf: {
            data: {
                type: Buffer,
                required: true,
            },
            contentType: {
                type: String,
                default: "application/pdf",
            },
            fileName: {
                type: String,
                required: true,
            },
        },
    },
    { timestamps: true }
);

export default mongoose.models.History ||
    mongoose.model("History", historySchema);
