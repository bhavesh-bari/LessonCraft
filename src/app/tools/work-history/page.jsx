// You would place this file at a route like: src/app/dashboard/work-history/page.js
"use client"; // This component is interactive and uses state.

import React, { useState, useMemo } from 'react';
import {
    History,
    Search,
    FileText,
    ListChecks,
    FileSignature,
    Eye,
    Download,
    Trash2,
    Filter,
} from 'lucide-react';

// --- Mock Data for Demonstration ---
const mockHistoryItems = [
    {
        id: 1,
        type: 'Exam Paper',
        title: 'Final Exam for Data Structures',
        date: '2023-10-26',
        icon: FileSignature,
        color: 'red'
    },
    {
        id: 2,
        type: 'Quiz',
        title: 'Quiz on The Solar System',
        date: '2023-10-24',
        icon: ListChecks,
        color: 'green'
    },
    {
        id: 3,
        type: 'Notes',
        title: 'Notes on The Renaissance Period',
        date: '2023-10-22',
        icon: FileText,
        color: 'blue'
    },
    {
        id: 4,
        type: 'Quiz',
        title: 'Algebra Basics Quiz',
        date: '2023-10-21',
        icon: ListChecks,
        color: 'green'
    },
];

// --- Main Component ---
export default function WorkHistoryPage() {
    // --- State Management ---
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');

    const filteredItems = useMemo(() => {
        return mockHistoryItems
            .filter(item => {
                if (filterType === 'All') return true;
                return item.type === filterType;
            })
            .filter(item =>
                item.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [searchTerm, filterType]);

    const filterOptions = ['All', 'Notes', 'Quiz', 'Exam Paper'];

    return (
        <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 font-sans">
            <div className="max-w-7xl mx-auto">

                {/* --- Header --- */}
                <header className="text-center mb-10">
                    <History className="w-16 h-16 text-gray-700 mx-auto mb-2" />
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800">Work History</h1>
                    <p className="text-lg text-gray-500 mt-2">Review, manage, and re-download your generated content.</p>
                </header>

                {/* --- Controls: Search and Filter --- */}
                <div className="bg-white p-4 rounded-xl shadow-md mb-8 sticky top-20 z-40">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search Input */}
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by title..."
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500"
                            />
                        </div>
                        {/* Filter Buttons */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2">
                            <Filter className="text-gray-500 flex-shrink-0" />
                            {filterOptions.map(option => (
                                <button
                                    key={option}
                                    onClick={() => setFilterType(option)}
                                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex-shrink-0 ${filterType === option
                                        ? 'bg-gray-800 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- History List --- */}
                <section>
                    {filteredItems.length > 0 ? (
                        <div className="space-y-4">
                            {filteredItems.map(item => {
                                const Icon = item.icon;
                                return (
                                    <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-gray-200 hover:border-blue-500">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                            {/* Icon and Title */}
                                            <div className="flex items-center gap-4 flex-grow">
                                                <Icon className={`w-8 h-8 text-${item.color}-500 flex-shrink-0`} />
                                                <div>
                                                    <h3 className="font-bold text-lg text-gray-800">{item.title}</h3>
                                                    <p className="text-sm text-gray-500">{item.type} • Created on {item.date}</p>
                                                </div>
                                            </div>
                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                                                <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full" title="View">
                                                    <Eye size={20} />
                                                </button>
                                                <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-gray-100 rounded-full" title="Download">
                                                    <Download size={20} />
                                                </button>
                                                <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-full" title="Delete">
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        // --- Empty State ---
                        <div className="text-center py-16">
                            <h3 className="text-2xl font-semibold text-gray-700">No History Found</h3>
                            <p className="text-gray-500 mt-2">
                                {searchTerm ? `No results found for "${searchTerm}".` : "You haven't generated any content yet. Start creating!"}
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
