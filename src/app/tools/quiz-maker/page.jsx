// You would place this file at a route like: src/app/tools/quiz-maker/page.js
"use client"; // This component requires state and user interaction.

import React, { useState } from 'react';
import { BookCopy, FileQuestion, Hash, CheckSquare, Wand2, Loader2, FileDown, RefreshCw, HelpCircle, MessageSquareWarning, Star, Shuffle } from 'lucide-react';

// --- Mock Data for Demonstration ---
const mockSubjects = ['Science', 'Mathematics', 'History', 'Literature', 'Computer Science'];

// --- Main Component ---
export default function QuizMakerPage() {
    // --- State Management ---
    const [subject, setSubject] = useState('');
    const [topic, setTopic] = useState('');
    const [numQuestions, setNumQuestions] = useState(10);
    const [questionType, setQuestionType] = useState('mcq');
    const [difficulty, setDifficulty] = useState(2);
    const [isLoading, setIsLoading] = useState(false);
    const [generatedQuiz, setGeneratedQuiz] = useState(null);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showAnswers, setShowAnswers] = useState(false); // State to toggle answer visibility

    // --- Event Handlers ---
    const handleGenerateQuiz = async (e) => {
        e.preventDefault();
        if (!subject || !topic) {
            alert("Please provide both a subject and topic.");
            return;
        }
        setIsLoading(true);
        setGeneratedQuiz(null);
        setShowAnswers(false);

        try {
            const response = await fetch('/api/quiz-maker', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ subject, topic, numQuestions, questionType, difficulty }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setGeneratedQuiz(data.quiz);
            setShowSuccessToast(true);
            setTimeout(() => setShowSuccessToast(false), 3000);

        } catch (error) {
            console.error("Failed to fetch quiz:", error);
            alert("Failed to generate quiz. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegenerate = () => {
        setGeneratedQuiz(null);
    };

    // --- UI Component ---
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* --- Success Toast Notification --- */}
            {showSuccessToast && (
                <div className="fixed top-5 right-5 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-fade-in">
                    <CheckSquare size={20} />
                    <span>Quiz successfully generated!</span>
                </div>
            )}

            <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* --- Header --- */}
                <header className="text-center mb-10">
                    <FileQuestion className="w-12 h-12 text-indigo-600 mx-auto mb-2" />
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800">Quiz Maker</h1>
                    <p className="text-lg text-gray-500 mt-2">Craft custom quizzes for your students in minutes.</p>
                </header>

                {/* --- Input Section --- */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg mb-12">
                    <form onSubmit={handleGenerateQuiz} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end">

                        {/* Subject */}
                        <div className="w-full">
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                            <div className="relative">
                                <BookCopy className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <select id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                                    <option value="">Select a Subject</option>
                                    {mockSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Topic */}
                        <div className="w-full">
                            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">Topic Name</label>
                            <div className="relative">
                                <FileQuestion className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input id="topic" type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Photosynthesis" className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                            </div>
                        </div>

                        {/* Number of Questions */}
                        <div className="w-full">
                            <label htmlFor="numQuestions" className="block text-sm font-medium text-gray-700 mb-1">Number of Questions</label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input id="numQuestions" type="number" value={numQuestions} onChange={(e) => setNumQuestions(e.target.value)} min="1" max="50" className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                            </div>
                        </div>

                        {/* Question Type */}
                        <div className="w-full">
                            <label className="block text-sm font-medium text-gray-700 mb-1 ">Question Type</label>
                            <select value={questionType} onChange={(e) => setQuestionType(e.target.value)} className="w-full py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                                <option value="mcq">Multiple Choice</option>
                                <option value="tf">True/False</option>
                                <option value="fib">Fill in the Blanks</option>
                            </select>
                        </div>

                        {/* Difficulty Slider */}
                        <div className="w-full lg:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                            <div className="relative pt-2">
                                <input type="range" min="1" max="3" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                                <div className="w-full flex justify-between text-xs text-gray-500 px-1 mt-1">
                                    <span>Easy</span>
                                    <span>Medium</span>
                                    <span>Hard</span>
                                </div>
                            </div>
                        </div>

                        {/* Generate Button */}
                        <div className="w-full md:col-span-2 lg:col-span-3">
                            <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-indigo-700 active:scale-95 transition-all shadow-md disabled:bg-indigo-300 disabled:cursor-not-allowed">
                                <Wand2 size={24} />
                                <span>{isLoading ? 'Generating...' : 'Generate Quiz'}</span>
                            </button>
                        </div>
                    </form>
                </div>

                {/* --- Loading State --- */}
                {isLoading && (
                    <div className="text-center py-12">
                        <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mx-auto" />
                        <p className="text-xl font-semibold text-gray-600 mt-4">Crafting your quiz, please wait...</p>
                    </div>
                )}

                {/* --- Quiz Output Section --- */}
                {generatedQuiz && (
                    <section>
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                            <h2 className="text-3xl font-bold text-gray-800">Your Generated Quiz</h2>
                            <div className="flex items-center gap-4 bg-gray-100 p-2 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-700 font-medium">Show Answers</span>
                                    <input type="checkbox" checked={showAnswers} onChange={() => setShowAnswers(!showAnswers)} className="toggle toggle-sm toggle-success" />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-4 mb-8">
                            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                                <FileDown size={18} /> Download as PDF
                            </button>
                            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 6H18v4.5h-4.5V6ZM6 10.5V6h4.5v4.5H6Zm7.5 7.5h4.5V13.5h-4.5V18ZM6 18v-4.5h4.5V18H6Z M13 22l-3-3h6l-3 3zM3 3l3-3h12l3 3v12l-3 3h-6v-2.5h4.5V4.5H7.5v10H5V3Z" /></svg>
                                Export to Google Form
                            </button>
                            <button onClick={handleRegenerate} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors">
                                <RefreshCw size={18} /> Regenerate Quiz
                            </button>
                        </div>

                        {/* Question List */}
                        <div className="space-y-6">
                            {generatedQuiz.map((q, index) => (
                                <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:border-indigo-300 transition-all">
                                    <p className="font-semibold text-lg text-gray-800 mb-4">{index + 1}. {q.question}</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {q.options.map((opt, optIndex) => {
                                            const optionLetter = String.fromCharCode(65 + optIndex);
                                            const isCorrect = opt === q.answer;
                                            return (
                                                <div
                                                    key={opt}
                                                    className={`p-3 rounded-lg border-2 flex items-center gap-3 transition-all ${showAnswers && isCorrect
                                                        ? 'border-green-400 bg-green-50 text-green-800 font-semibold'
                                                        : 'border-gray-200 bg-gray-50'
                                                        }`}
                                                >
                                                    <span className={`font-bold ${showAnswers && isCorrect ? 'text-green-800' : 'text-gray-600'}`}>{optionLetter})</span>
                                                    <span>{opt}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            {/* --- Footer --- */}
            <footer className="text-center p-8 mt-12 border-t border-gray-200">
                <div className="flex justify-center gap-8">
                    <a href="#" className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors">
                        <HelpCircle size={18} /> Help Center
                    </a>
                    <a href="#" className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors">
                        <MessageSquareWarning size={18} /> Contact Support
                    </a>
                    <a href="#" className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors">
                        <Star size={18} /> Give Feedback
                    </a>
                </div>
            </footer>
        </div>
    );
}
