// src/app/tools/activities/page.js
"use client"; 

import React, { useState } from 'react';
import {
    UsersRound,
    Book,
    Target,
    Shapes,
    Wand2,
    Loader2,
    Download,
    FlaskConical,
    MessageCircle,
    Drama,
    Clock,
    Users,
} from 'lucide-react';

// --- Main Component ---
export default function ClassActivityGeneratorPage() {
    // --- State Management ---
    const [subject, setSubject] = useState('');
    const [topic, setTopic] = useState('');
    const [activityType, setActivityType] = useState('any');
    const [isLoading, setIsLoading] = useState(false);
    const [activities, setActivities] = useState(null);

    // --- Event Handler ---
    const handleGenerateActivities = async (e) => {
        e.preventDefault();
        if (!subject || !topic) {
            alert("Please provide both a subject and topic.");
            return;
        }
        setIsLoading(true);
        setActivities(null);

        try {
            const response = await fetch('/api/activities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ subject, topic, activityType }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setActivities(data.activities);

        } catch (error) {
            console.error("Failed to fetch activities:", error);
            alert("Failed to generate activities. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const IconComponent = ({ name, color }) => {
        const iconColor = `text-${color}-600`;
        switch (name) {
            case 'FlaskConical': return <FlaskConical className={iconColor} size={32} />;
            case 'Drama': return <Drama className={iconColor} size={32} />;
            case 'UsersRound': return <UsersRound className={iconColor} size={32} />;
            default: return <MessageCircle className={iconColor} size={32} />;
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 font-sans">
            <div className="max-w-6xl mx-auto">

                {/* --- Header --- */}
                <header className="text-center mb-10">
                    <UsersRound className="w-16 h-16 text-purple-600 mx-auto mb-2" />
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800">Class Activity Generator</h1>
                    <p className="text-lg text-gray-500 mt-2">Spark engagement with creative classroom activities.</p>
                </header>

                {/* --- Input Form Section --- */}
                <div className="bg-white p-8 rounded-2xl shadow-lg mb-12 max-w-3xl mx-auto">
                    <form onSubmit={handleGenerateActivities} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">

                        {/* Subject */}
                        <div className="md:col-span-1">
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                            <div className="relative">
                                <Book className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input id="subject" type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g., Physics" className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" />
                            </div>
                        </div>

                        {/* Topic */}
                        <div className="md:col-span-1">
                            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                            <div className="relative">
                                <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input id="topic" type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Force and Motion" className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" />
                            </div>
                        </div>

                        {/* Activity Type */}
                        <div className="md:col-span-2">
                            <label htmlFor="activityType" className="block text-sm font-medium text-gray-700 mb-1">Activity Type (Optional)</label>
                            <div className="relative">
                                <Shapes className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <select id="activityType" value={activityType} onChange={(e) => setActivityType(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                                    <option value="any">Any Type</option>
                                    <option value="group">Group Discussion</option>
                                    <option value="lab">Hands-on Lab</option>
                                    <option value="roleplay">Role-Play</option>
                                    <option value="debate">Debate</option>
                                </select>
                            </div>
                        </div>

                        {/* Generate Button */}
                        <div className="md:col-span-2">
                            <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-3 bg-purple-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-purple-700 active:scale-95 transition-all shadow-md disabled:bg-purple-300">
                                {isLoading ? <Loader2 className="animate-spin" /> : <Wand2 />}
                                {isLoading ? "Brainstorming..." : "Generate Activities"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* --- Loading State --- */}
                {isLoading && (
                    <div className="text-center py-12">
                        <Loader2 className="w-16 h-16 text-purple-600 animate-spin mx-auto" />
                        <p className="text-xl font-semibold text-gray-600 mt-4">Brainstorming fun activities for you...</p>
                    </div>
                )}

                {/* --- Activity Output Section --- */}
                {activities && (
                    <section>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold text-gray-800">Activity Ideas</h2>
                            <button onClick={() => alert('Printing activities...')} className="flex items-center gap-2 bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors">
                                <Download size={18} /> Download All
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {activities.map((activity, index) => (
                                <div key={index} className={`bg-white p-6 rounded-xl shadow-lg border-t-4 border-${activity.color}-500 hover:-translate-y-2 transition-transform`}>
                                    <div className="flex items-start gap-4 mb-3">
                                        <div className={`bg-${activity.color}-100 p-3 rounded-lg`}>
                                            <IconComponent name={activity.icon} color={activity.color} />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800 mt-1">{activity.title}</h3>
                                    </div>
                                    <p className="text-gray-600 mb-4">{activity.description}</p>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 border-t pt-3">
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={16} />
                                            <span>{activity.duration}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Users size={16} />
                                            <span>{activity.groupSize}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}
