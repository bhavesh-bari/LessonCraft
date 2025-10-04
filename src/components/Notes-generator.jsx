"use client";

import React, { useState } from 'react';
import { BookText, FileText, Sparkles, Loader2, Download, NotebookPen, Clock } from 'lucide-react'; // Added Clock icon
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Helper component for the extended loading status
const PollingStatus = () => (
    <div className="flex flex-col items-center justify-center gap-6 p-6 border border-yellow-300 bg-yellow-50 rounded-lg text-yellow-800">
        <Clock className="w-8 h-8" />
        <h3 className="text-xl font-bold text-center">Notes Generation in Progress...</h3>
        <p className="text-center text-gray-600">
            This process is running in the background to ensure **high-quality, comprehensive notes** are created.
        </p>
        <p className="text-center font-semibold">
            It may take anywhere from **5 to 20 minutes** depending on the topic's complexity. Please keep this window open!
        </p>
    </div>
);

export default function NotesGeneratorPage() {
    const [subject, setSubject] = useState('');
    const [topic, setTopic] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isPolling, setIsPolling] = useState(false); // New state to manage the longer status
    const [generatedNotes, setGeneratedNotes] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleGenerateNotes = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Start loading, showing the initial spinner
        setGeneratedNotes(null);

        const startRes = await fetch("/api/notes-generator/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subject, topic }),
        });

        if (!startRes.ok) {
            setIsLoading(false);
            alert("Failed to start notes generation job.");
            return;
        }

        const { jobId } = await startRes.json();

        // After a short delay (e.g., 3 seconds), switch to the detailed polling status
        setTimeout(() => {
            setIsPolling(true);
        }, 3000); // Wait 3 seconds before showing the long-wait message

        // Polling for status
        // A shorter interval (e.g., 3-5s) is generally better for responsiveness, 
        // though the long message handles the wait expectation.
        const pollInterval = setInterval(async () => {
            const res = await fetch(`/api/notes-generator/status?jobId=${jobId}`);
            const data = await res.json();

            if (data.status === "completed") {
                clearInterval(pollInterval);
                setGeneratedNotes(data.data.notes);
                setIsLoading(false);
                setIsPolling(false);
            } else if (data.status === "failed") {
                clearInterval(pollInterval);
                alert("Failed to generate notes. Please try a different topic.");
                setIsLoading(false);
                setIsPolling(false);
            }
        }, 3000); // Polling every 3 seconds
    };


    const handleDownloadPdf = async () => {
        if (!generatedNotes || !topic) return;
        setIsDownloading(true);

        try {
            const response = await fetch('/api/pdf/generate-note-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    notes: generatedNotes,
                    topic: topic,
                    subject: subject,
                }),
            });

            if (!response.ok) {
                throw new Error(`PDF generation failed! Status: ${response.status}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            const filename = `${topic.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_notes.pdf`;
            link.href = url;
            link.setAttribute('download', filename);

            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Failed to download PDF:", error);
            alert("Could not download the PDF. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <main className="w-full min-h-screen bg-blue-200 p-4 sm:p-6 lg:p-8 text-black">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <NotebookPen className="w-12 h-12 text-blue-700" />
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">Notes Generator</h1>
                        <p className="text-lg text-gray-500">Create high-quality teaching notes in seconds.</p>
                    </div>
                </div>
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
                    {/* Input Form */}
                    {!isLoading && !generatedNotes && (
                        <form onSubmit={handleGenerateNotes} className="space-y-6">
                            <div>
                                <label htmlFor="subject" className="block text-lg font-semibold text-gray-700 mb-2">Subject</label>
                                <div className="relative">
                                    <BookText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                                    <input
                                        id="subject"
                                        type="text"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        placeholder="e.g., Science, History, Mathematics"
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="topic" className="block text-lg font-semibold text-gray-700 mb-2">Topic</label>
                                <div className="relative">
                                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                                    <input
                                        id="topic"
                                        type="text"
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        placeholder="e.g., Photosynthesis, The Mughal Empire"
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-blue-700 active:scale-95 transition-all shadow-md"
                            >
                                <Sparkles className="w-6 h-6" />
                                <span>Generate Notes</span>
                            </button>
                        </form>
                    )}

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center gap-6 py-12">
                            <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                            <p className="text-xl font-semibold text-gray-600">Generating your notes... Please wait.</p>

                            {/* Detailed Polling Status with time estimate */}
                            {isPolling && (
                                <>
                                    <div className="w-full h-px bg-gray-200 my-4" />
                                    <PollingStatus />
                                </>
                            )}
                        </div>
                    )}

                    {/* Generated Notes Display */}
                    {generatedNotes && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Generated Notes for "{topic}"</h2>
                                <button
                                    onClick={handleDownloadPdf}
                                    disabled={isDownloading}
                                    className="flex items-center gap-2 bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors disabled:bg-red-300 disabled:cursor-not-allowed"
                                    title="Click to download notes as PDF"
                                >
                                    {isDownloading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Downloading...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Download className="w-5 h-5" />
                                            <span>Download PDF</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            <article className="prose max-w-none p-6 border border-gray-200 rounded-lg bg-gray-50 h-96 overflow-y-auto">
                                {generatedNotes.map((subtopic, index) => (
                                    <div key={index} className="mb-6">
                                        <h2 className="text-xl font-bold">{subtopic.name}</h2>
                                        <p className="italic mb-2">{subtopic.description}</p>
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {subtopic.content}
                                        </ReactMarkdown>
                                    </div>
                                ))}
                            </article>

                            <button
                                onClick={() => setGeneratedNotes(null)}
                                className="w-full mt-6 text-center text-blue-600 font-semibold hover:underline"
                            >
                                Generate another set of notes
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}