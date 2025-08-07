// src/app/tools/summarizer/page.js
"use client";

import React, { useState } from 'react';
import { FiBookOpen, FiFileText, FiDownload, FiCpu, FiLoader, FiZap } from 'react-icons/fi';
// --- 1. IMPORT THE MARKDOWN RENDERER ---
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // For extended features like tables

export default function TopicSummarizerPage() {
    const [topic, setTopic] = useState('');
    const [subject, setSubject] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [summary, setSummary] = useState(null);

    const handleGenerateSummary = async (e) => {
        e.preventDefault();
        if (!topic || !subject) {
            alert("Please provide both a topic and a subject.");
            return;
        }
        setIsLoading(true);
        setSummary(null);
        try {
            const res = await fetch("/api/summarizer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic, subject }),
            });
            const data = await res.json();
            if (res.ok) {
                setSummary(data.summary);
            } else {
                alert(data.error || "Something went wrong.");
            }
        } catch (err) {
            alert("Network error or API failure.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen font-sans bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-6 py-4 flex items-center gap-3">
                    <FiBookOpen className="w-8 h-8 text-blue-600" />
                    <h1 className="text-2xl font-bold text-gray-800">Topic Summarizer</h1>
                </div>
            </header>

            <main className="container mx-auto px-6 py-12">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white p-8 rounded-xl shadow-md transition-all">
                        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">Enter a Topic to Summarize</h2>
                        <form onSubmit={handleGenerateSummary} className="space-y-6">
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-600 mb-1">Subject</label>
                                <div className="relative">
                                    <FiBookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        id="subject"
                                        type="text"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        placeholder="e.g., World History, Biology"
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition text-gray-400"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="topic" className="block text-sm font-medium text-gray-600 mb-1">Topic</label>
                                <div className="relative">
                                    <FiFileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        id="topic"
                                        type="text"
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        placeholder="e.g., The Industrial Revolution"
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition text-gray-400"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-blue-700 active:scale-95 transition-all shadow-lg hover:shadow-blue-300 disabled:bg-blue-300 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <><FiLoader className="animate-spin w-6 h-6" /><span>Generating...</span></>
                                ) : (
                                    <><FiZap className="w-6 h-6" /><span>Generate Summary</span></>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* --- UPDATED SUMMARY OUTPUT SECTION --- */}
                    {summary && (
                        <div className="mt-10 bg-white p-8 rounded-xl shadow-md animate-fade-in">
                            <div className="flex justify-between items-center border-b pb-4 mb-4">
                                <h3 className="text-2xl font-semibold text-gray-800">Summary of "{topic}"</h3>
                                <button
                                    className="flex items-center gap-2 bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                                    onClick={() => alert('Downloading PDF...')}
                                >
                                    <FiDownload />
                                    <span>Download PDF</span>
                                </button>
                            </div>

                            {/* --- 2. USE REACTMARKDOWN AND PROSE CLASS --- */}
                            <article className="prose max-w-none text-gray-500">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {summary}
                                </ReactMarkdown>
                            </article>
                        </div>
                    )}
                </div>
            </main>

            <footer className="text-center py-8 mt-8">
                <p className="text-gray-500 flex items-center justify-center gap-2">
                    <FiCpu />
                    Powered by Generative AI
                </p>
            </footer>
        </div>
    );
}
