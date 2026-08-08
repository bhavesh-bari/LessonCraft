"use client";
import React, { useState } from 'react';
import {
    FileText,
    Download,
    Search,
    BookOpen,
    FileQuestion,
    Layers,
    Calendar,
    ExternalLink,
    Filter,
    MoreVertical,
    X,
    Clock,
    User
} from 'lucide-react';

// --- DUMMY DATA ---
const DUMMY_HISTORY = [
    {
        _id: "h1",
        subject: "Quantum Physics",
        topic: "Wave-Particle Duality",
        module: "NOTE_GENERATOR",
        description: "Detailed study notes covering De Broglie hypothesis.",
        createdAt: "2026-01-28T14:30:00Z",
        content: {
            title: "Understanding Wave-Particle Duality",
            introduction: "Light and matter exhibit properties of both waves and particles.",
            keyPoints: ["De Broglie wavelength", "Photoelectric effect", "Double-slit experiment"],
            conclusion: "Quantum mechanics requires a probabilistic approach to particles."
        },
        pdf: { fileName: "physics_notes_duality.pdf" }
    },
    {
        _id: "h2",
        subject: "World History",
        topic: "The Renaissance",
        module: "QUIZ",
        description: "15 Multiple choice questions on Italian art.",
        createdAt: "2026-01-25T09:15:00Z",
        content: {
            quizTitle: "Renaissance Art & Science",
            questions: [
                { q: "Who painted the Mona Lisa?", a: "Leonardo da Vinci" },
                { q: "Where did the Renaissance begin?", a: "Florence, Italy" }
            ]
        },
        pdf: { fileName: "renaissance_quiz.pdf" }
    }
];

const getModuleConfig = (module) => {
    const configs = {
        ACTIVITY: { color: "bg-blue-100 text-blue-700", icon: <Layers size={14} /> },
        NOTE_GENERATOR: { color: "bg-emerald-100 text-emerald-700", icon: <FileText size={14} /> },
        EXAM_PAPER: { color: "bg-purple-100 text-purple-700", icon: <BookOpen size={14} /> },
        QUIZ: { color: "bg-orange-100 text-orange-700", icon: <FileQuestion size={14} /> },
        LESSON_PLAN: { color: "bg-pink-100 text-pink-700", icon: <Calendar size={14} /> },
    };
    return configs[module] || configs.NOTE_GENERATOR;
};

const HistoryModule = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterModule, setFilterModule] = useState("ALL");
    const [selectedItem, setSelectedItem] = useState(null); // For Modal

    const filteredData = DUMMY_HISTORY.filter(item => {
        const matchesSearch = item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.topic.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterModule === "ALL" || item.module === filterModule;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-slate-900">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Resource Vault</h1>
                    <p className="text-slate-500 mt-2">Access your AI-generated pedagogical materials.</p>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search history..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 outline-none"
                        onChange={(e) => setFilterModule(e.target.value)}
                    >
                        <option value="ALL">All Modules</option>
                        <option value="NOTE_GENERATOR">Notes</option>
                        <option value="QUIZ">Quizzes</option>
                    </select>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 gap-4">
                    {filteredData.map((item) => {
                        const config = getModuleConfig(item.module);
                        return (
                            <div key={item._id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex gap-4 items-start">
                                    <div className={`p-3 rounded-xl ${config.color}`}>{config.icon}</div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${config.color}`}>
                                                {item.module.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-800">{item.subject}: {item.topic}</h3>
                                        <p className="text-sm text-slate-500 line-clamp-1">{item.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setSelectedItem(item)}
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                                    >
                                        <ExternalLink size={16} /> View
                                    </button>
                                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                                        <Download size={16} /> PDF
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* --- CONTENT DIALOGUE BOX (MODAL) --- */}
            {selectedItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">

                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${getModuleConfig(selectedItem.module).color}`}>
                                        {selectedItem.module}
                                    </span>
                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                        <Clock size={12} /> {new Date(selectedItem.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800">{selectedItem.topic}</h2>
                                <p className="text-slate-500 text-sm">{selectedItem.subject}</p>
                            </div>
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body (Content Area) */}
                        <div className="p-8 overflow-y-auto flex-1 bg-white">
                            <div className="prose prose-slate max-w-none">
                                {/* Simulated Document Header */}
                                <div className="text-center mb-8 border-b pb-8">
                                    <h1 className="text-3xl font-serif mb-2">{selectedItem.topic}</h1>
                                    <p className="text-slate-400 italic">Generated Study Material</p>
                                </div>

                                {/* Dynamic Content Rendering */}
                                <div className="space-y-6 text-slate-700 leading-relaxed">
                                    {/* This maps the Mixed 'content' field to readable text */}
                                    {Object.entries(selectedItem.content).map(([key, value]) => (
                                        <div key={key}>
                                            <h4 className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-2">{key.replace(/([A-Z])/g, ' $1')}</h4>
                                            {Array.isArray(value) ? (
                                                <ul className="list-disc pl-5 space-y-2">
                                                    {value.map((val, i) => (
                                                        <li key={i}>{typeof val === 'object' ? JSON.stringify(val) : val}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-lg">{value}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="px-6 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
                            >
                                Close
                            </button>
                            <button className="flex items-center gap-2 px-6 py-2 text-sm font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all">
                                <Download size={16} /> Download {selectedItem.pdf.fileName}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HistoryModule;