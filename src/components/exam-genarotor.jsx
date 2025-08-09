"use client"; // This component is interactive and uses state.

import React, { useState } from 'react';
import {
    FileSignature,
    BookText,
    ScrollText,
    Hash,
    Clock,
    PlusCircle,
    XCircle,
    Wand2,
    Loader2,
    Download,
} from 'lucide-react';


export default function ExamPaperGeneratorPage() {

    const [subject, setSubject] = useState('');
    const [syllabus, setSyllabus] = useState('');
    const [totalMarks, setTotalMarks] = useState(70);
    const [duration, setDuration] = useState('3 Hours');
    const [questions, setQuestions] = useState([{ text: '', marks: '', subQuestions: [] }]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [paper, setPaper] = useState(null);

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        setQuestions([...questions, { text: '', marks: '', subQuestions: [] }]);
    };

    const removeQuestion = (index) => {
        const newQuestions = questions.filter((_, i) => i !== index);
        setQuestions(newQuestions);
    };


    const handleGeneratePaper = async (e) => {
        e.preventDefault();
        if (!subject || !syllabus) {
            alert("Please provide a subject and syllabus.");
            return;
        }
        setIsLoading(true);
        setPaper(null);

        try {
            const response = await fetch('/api/exam-generator', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ subject, syllabus, totalMarks, duration, questions }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setPaper(data.paper);

        } catch (error) {
            console.error("Failed to fetch exam paper:", error);
            alert("Failed to generate exam paper. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadPdf = async () => {
        if (!paper) return;
        setIsDownloading(true);
        try {
            const response = await fetch('/api/pdf/generate-exam-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paperData: paper }),
            });

            if (!response.ok) {
                throw new Error('PDF generation failed on the server.');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${paper.header.subject.replace(/\s+/g, '_')}_exam.pdf`;
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
        <main className="min-h-screen bg-blue-200 p-4 sm:p-6 lg:p-8 font-sans ">
            <div className="max-w-6xl mx-auto">

                {/* --- Header --- */}
                <header className="text-center mb-10">
                    <FileSignature className="w-16 h-16 text-red-600 mx-auto mb-2" />
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800">Exam Paper Generator</h1>
                    <p className="text-lg text-gray-500 mt-2">Create structured and formatted exam papers effortlessly.</p>
                </header>

                {/* --- Input Form Section --- */}
                <div className="bg-white p-8 rounded-2xl shadow-lg mb-12">
                    <form onSubmit={handleGeneratePaper} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Subject */}
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                <div className="relative">
                                    <BookText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600 " />
                                    <input id="subject" type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g., Data Structures" className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-400" />
                                </div>
                            </div>
                            {/* Total Marks */}
                            <div>
                                <label htmlFor="totalMarks" className="block text-sm font-medium text-gray-700 mb-1">Total Marks</label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
                                    <input id="totalMarks" type="number" value={totalMarks} onChange={(e) => setTotalMarks(e.target.value)} placeholder="e.g., 70" className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-400" />
                                </div>
                            </div>
                            {/* Duration */}
                            <div>
                                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
                                    <input id="duration" type="text" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g., 3 Hours" className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        {/* Syllabus */}
                        <div>
                            <label htmlFor="syllabus" className="block text-sm font-medium text-gray-700 mb-1">Syllabus / Topics to Cover</label>
                            <div className="relative">
                                <ScrollText className="absolute left-3 top-3 w-5 h-5 text-red-600" />
                                <textarea id="syllabus" value={syllabus} onChange={(e) => setSyllabus(e.target.value)} rows="4" placeholder="Enter the syllabus or key topics..." className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-400"></textarea>
                            </div>
                        </div>

                        {/* --- Dynamic Question Structure --- */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Paper Structure</h3>
                            <div className="space-y-4">
                                {questions.map((q, index) => (
                                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <div className="flex items-center gap-4">
                                            <span className="font-bold text-gray-600">Q{index + 1}</span>
                                            <input type="text" value={q.text} onChange={(e) => handleQuestionChange(index, 'text', e.target.value)} placeholder="Enter question text or instruction" className="flex-grow p-2 border rounded-md text-gray-400" />
                                            <input type="number" value={q.marks} onChange={(e) => handleQuestionChange(index, 'marks', e.target.value)} placeholder="Marks" className="w-20 p-2 border rounded-md text-gray-400" />
                                            <button type="button" onClick={() => removeQuestion(index)} className="text-red-500 hover:text-red-700">
                                                <XCircle />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button type="button" onClick={addQuestion} className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800">
                                    <PlusCircle size={20} /> Add Question
                                </button>
                            </div>
                        </div>

                        {/* Generate Button */}
                        <div className="pt-4">
                            <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-3 bg-red-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-red-700 active:scale-95 transition-all shadow-md disabled:bg-red-300">
                                {isLoading ? <Loader2 className="animate-spin" /> : <Wand2 />}
                                {isLoading ? "Generating Paper..." : "Generate Exam Paper"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* --- Loading State --- */}
                {isLoading && (
                    <div className="text-center py-12">
                        <Loader2 className="w-16 h-16 text-red-600 animate-spin mx-auto" />
                        <p className="text-xl font-semibold text-gray-600 mt-4">Constructing your exam paper...</p>
                    </div>
                )}

                {/* --- Paper Output Section --- */}
                {paper && (
                    <section className="bg-white p-8 rounded-2xl shadow-lg">
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                            <h2 className="text-3xl font-bold text-gray-800">Generated Paper</h2>
                            <button
                                onClick={handleDownloadPdf}
                                disabled={isDownloading}
                                className="flex items-center gap-2 bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 disabled:bg-red-300"
                            >
                                {isDownloading ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
                                {isDownloading ? 'Downloading...' : 'Download as PDF'}
                            </button>
                        </div>

                        <div className="border p-6 rounded-md font-serif text-black">
                            {/* Paper Header */}
                            <div className="text-center mb-6">
                                <h3 className="text-2xl font-bold ">{paper.header.university}</h3>
                                <p className="text-lg">Final Examination</p>
                            </div>
                            <div className="flex justify-between text-lg mb-6 border-y py-2">
                                <span><strong>Subject:</strong> {paper.header.subject}</span>
                                <span><strong>Total Marks:</strong> {paper.header.marks}</span>
                                <span><strong>Duration:</strong> {paper.header.duration}</span>
                            </div>

                            {/* Questions */}
                            <div className="space-y-6">
                                {paper.questions.map((q, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between items-start">
                                            <p className="pr-4">
                                                <strong>Q{q.q_num}.</strong> {q.main_question}
                                            </p>
                                            <span className="font-bold whitespace-nowrap">[{q.marks} Marks]</span>
                                        </div>

                                        {/* Subquestions */}
                                        {q.sub_questions && q.sub_questions.length > 0 && (
                                            <div className="pl-8 mt-2 space-y-2">
                                                {q.sub_questions.map((sub, subIndex) => (
                                                    <div
                                                        key={subIndex}
                                                        className="flex justify-between items-start"
                                                    >
                                                        <p className="pr-4">
                                                            <strong>({sub.label})</strong> {sub.text}
                                                        </p>
                                                        <span className="font-bold whitespace-nowrap">
                                                            [{sub.marks} Marks]
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}
