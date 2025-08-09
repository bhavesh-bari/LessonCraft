"use client";

import React, { useState } from 'react';
import { FiBookOpen, FiFileText, FiDownload, FiCpu, FiLoader, FiZap } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function TopicSummarizerPage() {
    const [topic, setTopic] = useState('');
    const [subject, setSubject] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
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

    const handleDownloadPdf = async () => {
        const summaryElement = document.getElementById('summary-content');
        if (!summaryElement) return;

        setIsDownloading(true);

        try {
            const logoUrl = `${window.location.origin}/LessonCraftLogo.png`;

            const response = await fetch('/api/pdf/generate-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    htmlContent: summaryElement.innerHTML,
                    topic: topic,
                    logoUrl: logoUrl,
                }),
            });

            if (!response.ok) {
                throw new Error('PDF generation failed on the server.');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${topic.replace(/\s+/g, '_')}_summary.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("PDF Download Error:", error);
            alert("Sorry, we couldn't generate the PDF. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <main className="container mx-auto px-6 py-12">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white p-8 rounded-xl shadow-md transition-all">
                    <h2 className="text-2xl font-semibold text-purple-600 text-center mb-6">Enter a Topic to Summarize</h2>
                    <form onSubmit={handleGenerateSummary} className="space-y-6">
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-600 mb-1">Subject</label>
                            <div className="relative">
                                <FiBookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-600" />
                                <input
                                    id="subject"
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="e.g., World History, Biology"
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 transition text-gray-400"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="topic" className="block text-sm font-medium text-gray-600 mb-1">Topic</label>
                            <div className="relative">
                                <FiFileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-600" />
                                <input
                                    id="topic"
                                    type="text"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="e.g., The Industrial Revolution"
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 transition text-gray-400"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-purple-700 active:scale-95 transition-all shadow-lg hover:shadow-purple-300 disabled:bg-purple-300 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <><FiLoader className="animate-spin w-6 h-6" /><span>Generating...</span></>
                            ) : (
                                <><FiZap className="w-6 h-6" /><span>Generate Summary</span></>
                            )}
                        </button>
                    </form>
                </div>

                {summary && (
                    <div className="mt-10 bg-white p-8 rounded-xl shadow-md animate-fade-in">
                        <div className="flex flex-col sm:flex-row justify-between items-center border-b pb-4 mb-4 gap-4">
                            <h3 className="text-2xl font-semibold text-gray-800 text-center sm:text-left">Summary of "{topic}"</h3>
                            <button
                                className="flex items-center gap-2 bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors disabled:bg-green-300"
                                onClick={handleDownloadPdf}
                                disabled={isDownloading}
                            >
                                {isDownloading ? <FiLoader className="animate-spin" /> : <FiDownload />}
                                <span>{isDownloading ? 'Preparing PDF...' : 'Download PDF'}</span>
                            </button>
                        </div>

                        <article id="summary-content" className="prose max-w-none text-gray-500">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {summary}
                            </ReactMarkdown>
                        </article>
                    </div>
                )}
            </div>
        </main>
    );
}
