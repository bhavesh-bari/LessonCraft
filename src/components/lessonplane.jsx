
"use client"; // This component uses state and event handlers.

import React, { useState } from 'react';
import {
    Book,
    NotebookPen,
    Users,
    Wand2,
    Loader2,
    Download,
    ClipboardList,
    LayoutList,
    CheckCircle2,
    XCircle,
} from 'lucide-react';

// --- Mock Data for Demonstration ---
const mockLessonPlan = {
    introduction: "Begin with a 5-minute interactive discussion asking students what they know about the water cycle. Use a visual aid like a simple diagram or a short video to capture their interest and introduce the key terms: evaporation, condensation, and precipitation.",
    objectives: [
        "Students will be able to define evaporation, condensation, and precipitation.",
        "Students will be able to draw a diagram of the water cycle and label its key stages.",
        "Students will be able to explain the importance of the water cycle for life on Earth."
    ],
    materials: [
        "Whiteboard or smartboard",
        "Markers or pens",
        "Projector for video",
        "Worksheet with a blank water cycle diagram",
        "Art supplies (crayons, colored pencils)"
    ],
    activities: [
        {
            title: "Interactive Diagramming (15 mins)",
            description: "As a class, collectively draw the water cycle on the whiteboard. Have students come up to the board to draw different parts (sun, clouds, ocean, rain)."
        },
        {
            title: "Worksheet Activity (10 mins)",
            description: "Students will individually label the parts of the water cycle on their provided worksheets."
        }
    ],
    assessment: "Review the completed worksheets to check for understanding. Ask 3-4 wrap-up questions to the class, such as 'What happens to water after it evaporates?'",
    conclusion: "Summarize the key stages of the water cycle. Briefly touch upon its real-world importance, like how it provides fresh water for drinking and farming. Assign a simple homework task to observe a real-world example of the water cycle (e.g., a puddle drying up)."
};

// --- Main Component ---
export default function LessonPlanGeneratorPage() {
    // --- State Management ---
    const [subject, setSubject] = useState('');
    const [topic, setTopic] = useState(''); // Corrected from useState to useState
    const [level, setLevel] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [lessonPlan, setLessonPlan] = useState(null);

    // --- Event Handler ---
    const handleGeneratePlan = (e) => {
        e.preventDefault();
        if (!subject || !topic || !grade) {
            alert("Please fill in Subject, Topic, and Grade.");
            return;
        }
        setIsLoading(true);
        setLessonPlan(null);

        // Simulate API call
        setTimeout(() => {
            setLessonPlan(mockLessonPlan);
            setIsLoading(false);
        }, 3000);
    };

    return (
        <main className="min-h-screen bg-blue-200 p-4 sm:p-6 lg:p-8 font-sans">
            <div className="max-w-5xl mx-auto">

                {/* --- Header --- */}
                <header className="flex items-center gap-4 mb-8">
                    <NotebookPen className="w-12 h-12 text-yellow-600" />
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">Lesson Plan Generator</h1>
                        <p className="text-lg text-gray-500">Design structured and effective lesson plans with AI.</p>
                    </div>
                </header>

                {/* --- Input Form Section --- */}
                <div className="bg-white p-8 rounded-2xl shadow-lg mb-12">
                    <form onSubmit={handleGeneratePlan} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Subject */}
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                            <div className="relative">
                                <Book className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400 " />
                                <input id="subject" type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g., General Science" className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 text-gray-400" />
                            </div>
                        </div>

                        {/* Topic */}
                        <div>
                            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                            <div className="relative">
                                <NotebookPen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400 " />
                                <input id="topic" type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., The Water Cycle" className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 text-gray-400" />
                            </div>
                        </div>

                        {/* /Level */}
                        <div>
                            <label htmlFor="Level" className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                            <div className="relative">
                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5  text-yellow-400" />
                                <select id="Level" value={level} onChange={(e) => setLevel(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 text-gray-400">
                                    <option value="">Select Level</option>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                    <option value="Expert">Expert</option>
                                </select>
                            </div>
                        </div>

                        {/* Generate Button */}
                        <div className="md:col-span-2">
                            <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-3 bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-yellow-700 active:scale-95 transition-all shadow-md disabled:bg-yellow-300">
                                {isLoading ? <Loader2 className="animate-spin" /> : <Wand2 />}
                                {isLoading ? "Generating Plan..." : "Generate Lesson Plan"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* --- Loading State --- */}
                {isLoading && (
                    <div className="text-center py-12">
                        <Loader2 className="w-16 h-16 text-yellow-600 animate-spin mx-auto" />
                        <p className="text-xl font-semibold text-gray-600 mt-4">Building your lesson plan...</p>
                    </div>
                )}

                {/* --- Lesson Plan Preview --- */}
                {lessonPlan && (
                    <div className="bg-white p-8 rounded-2xl shadow-lg">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Your Lesson Plan: {topic}</h2>
                            <button onClick={() => alert('Downloading PDF...')} className="mt-4 sm:mt-0 flex items-center gap-2 bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors">
                                <Download size={18} /> Download as PDF
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Introduction */}
                            <div>
                                <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-700 mb-2"><LayoutList className="text-yellow-500" /> Introduction</h3>
                                <p className="text-gray-600 pl-8">{lessonPlan.introduction}</p>
                            </div>
                            {/* Objectives */}
                            <div>
                                <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-700 mb-2"><CheckCircle2 className="text-green-500" /> Objectives</h3>
                                <ul className="list-disc list-inside pl-8 space-y-1 text-gray-600">
                                    {lessonPlan.objectives.map((obj, i) => <li key={i}>{obj}</li>)}
                                </ul>
                            </div>
                            {/* Materials */}
                            <div>
                                <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-700 mb-2"><ClipboardList className="text-yellow-500" /> Materials</h3>
                                <ul className="list-disc list-inside pl-8 space-y-1 text-gray-600">
                                    {lessonPlan.materials.map((mat, i) => <li key={i}>{mat}</li>)}
                                </ul>
                            </div>
                            {/* Activities */}
                            <div>
                                <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-700 mb-2"><Wand2 className="text-purple-500" /> Activities</h3>
                                <div className="pl-8 space-y-3">
                                    {lessonPlan.activities.map((act, i) => (
                                        <div key={i}>
                                            <p className="font-semibold text-gray-700">{act.title}</p>
                                            <p className="text-gray-600">{act.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Assessment */}
                            <div>
                                <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-700 mb-2"><NotebookPen className="text-blue-500" /> Assessment</h3>
                                <p className="text-gray-600 pl-8">{lessonPlan.assessment}</p>
                            </div>
                            {/* Conclusion */}
                            <div>
                                <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-700 mb-2"><XCircle className="text-red-500" /> Conclusion</h3>
                                <p className="text-gray-600 pl-8">{lessonPlan.conclusion}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
