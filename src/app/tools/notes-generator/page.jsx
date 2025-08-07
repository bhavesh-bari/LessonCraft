// src/app/tools/notes-generator/page.js
"use client";

import React, { useState } from 'react';
import { BookText, FileText, Sparkles, Loader2, Download, NotebookPen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function NotesGeneratorPage() {
    const [subject, setSubject] = useState('');
    const [topic, setTopic] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedNotes, setGeneratedNotes] = useState(null);

    const handleGenerateNotes = async (e) => {
        e.preventDefault();
        if (!subject || !topic) {
            alert("Please enter both subject and topic.");
            return;
        }
        setIsLoading(true);
        setGeneratedNotes(null);

        try {
            const response = await fetch('/api/notes-generator', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ subject, topic }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setGeneratedNotes(data.notes);

        } catch (error) {
            console.error("Failed to fetch notes:", error);
            alert("Failed to generate notes. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadPdf = () => {
        alert("Downloading PDF...");
    };

    return (
        <main className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <NotebookPen className="w-12 h-12 text-blue-700" />
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">Notes Generator</h1>
                        <p className="text-lg text-gray-500">Create high-quality teaching notes in seconds.</p>
                    </div>
                </div>
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
                    {!isLoading && !generatedNotes && (
                        <form onSubmit={handleGenerateNotes} className="space-y-6">
                            <div>
                                <label htmlFor="subject" className="block text-lg font-semibold text-gray-700 mb-2">Subject</label>
                                <div className="relative">
                                    <BookText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
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
                                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
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
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center gap-4 py-12">
                            <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                            <p className="text-xl font-semibold text-gray-600">Generating your notes... Please wait.</p>
                        </div>
                    )}

                    {generatedNotes && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Generated Notes for "{topic}"</h2>
                                <button
                                    onClick={handleDownloadPdf}
                                    className="flex items-center gap-2 bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                                    title="Click to download notes as PDF"
                                >
                                    <Download className="w-5 h-5" />
                                    <span>Download PDF</span>
                                </button>
                            </div>

                            <article className="prose max-w-none p-6 border border-gray-200 rounded-lg bg-gray-50 h-96 overflow-y-auto">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {generatedNotes}
                                </ReactMarkdown>
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
