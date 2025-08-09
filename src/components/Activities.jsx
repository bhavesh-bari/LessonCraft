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
    X
} from 'lucide-react';

export default function ClassActivityGeneratorPage() {
    const [subject, setSubject] = useState('');
    const [topic, setTopic] = useState('');
    const [activityType, setActivityType] = useState('any');
    const [isLoading, setIsLoading] = useState(false);
    const [activities, setActivities] = useState([]);
    const [openDetails, setOpenDetails] = useState(null);

    const handleGenerateActivities = async (e) => {
        e.preventDefault();
        if (!subject || !topic) {
            alert("Please provide both a subject and topic.");
            return;
        }
        setIsLoading(true);
        setActivities([]);
        try {
            const response = await fetch('/api/activities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subject, topic, activityType }),
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setActivities(data.activities || []);
        } catch (error) {
            console.error("Failed to fetch activities:", error);
            alert("Failed to generate activities. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadPDF = async (activity) => {
        try {
            const response = await fetch('/api/pdf/generate-activity-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ activity }),
            });
            if (!response.ok) throw new Error("Failed to generate PDF");
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${activity.title.replace(/\s+/g, '_')}_activity.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download error:", error);
            alert("Failed to download PDF. Please try again.");
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
        <main className="min-h-screen bg-blue-200 p-4 sm:p-6 lg:p-8 font-sans">
            <div className="max-w-6xl mx-auto">
                <header className="text-center mb-10">
                    <UsersRound className="w-16 h-16 text-pink-600 mx-auto mb-2" />
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800">Class Activity Generator</h1>
                    <p className="text-lg text-gray-500 mt-2">Spark engagement with creative classroom activities.</p>
                </header>

                <div className="bg-white p-8 rounded-2xl shadow-lg mb-12 max-w-3xl mx-auto">
                    <form onSubmit={handleGenerateActivities} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                            <div className="relative">
                                <Book className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400" />
                                <input id="subject" type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g., Physics" className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-gray-400" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                            <div className="relative">
                                <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400" />
                                <input id="topic" type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Force and Motion" className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-gray-400" />
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="activityType" className="block text-sm font-medium text-gray-700 mb-1">Activity Type (Optional)</label>
                            <div className="relative">
                                <Shapes className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400" />
                                <select id="activityType" value={activityType} onChange={(e) => setActivityType(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-gray-400">
                                    <option value="any">Any Type</option>
                                    <option value="group">Group Discussion</option>
                                    <option value="lab">Hands-on Lab</option>
                                    <option value="roleplay">Role-Play</option>
                                    <option value="debate">Debate</option>
                                </select>
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-3 bg-pink-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-pink-700 active:scale-95 transition-all shadow-md disabled:bg-pink-300">
                                {isLoading ? <Loader2 className="animate-spin" /> : <Wand2 />}
                                {isLoading ? "Brainstorming..." : "Generate Activities"}
                            </button>
                        </div>
                    </form>
                </div>

                {isLoading && (
                    <div className="text-center py-12">
                        <Loader2 className="w-16 h-16 text-pink-600 animate-spin mx-auto" />
                        <p className="text-xl font-semibold text-gray-600 mt-4">Brainstorming fun activities for you...</p>
                    </div>
                )}

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
                            <div className="mt-4 flex gap-3">
                                <button onClick={() => handleDownloadPDF(activity)} className="flex items-center gap-2 bg-gray-700 text-white py-1.5 px-3 rounded-lg hover:bg-gray-800 text-sm">
                                    <Download size={16} />
                                </button>
                                <button onClick={() => setOpenDetails(activity)} className="bg-blue-500 text-white py-1.5 px-3 rounded-lg hover:bg-blue-600 text-sm">
                                    Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {openDetails && (
                    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 text-black">
                        <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl overflow-y-auto max-h-[90vh]">
                            <div className="flex justify-between items-center border-b p-4">
                                <h2 className="text-xl font-bold">{openDetails.title}</h2>
                                <button onClick={() => setOpenDetails(null)}>
                                    <X className="text-gray-500 hover:text-gray-800" />
                                </button>
                            </div>
                            <div className="p-4 space-y-4">
                                <section>
                                    <h3 className="font-semibold">Steps:</h3>
                                    <ol className="list-decimal pl-5">
                                        {openDetails.details.steps.split("\n").map((step, i) => (
                                            <li key={i}>{step.replace(/^\d+\.\s*/, '')}</li>
                                        ))}
                                    </ol>
                                </section>
                                <section>
                                    <h3 className="font-semibold">Learning Objectives:</h3>
                                    <ul className="list-disc pl-5">
                                        {openDetails.details.learningObjectives.split("\n").map((obj, i) => (
                                            <li key={i}>{obj.replace(/^- /, '')}</li>
                                        ))}
                                    </ul>
                                </section>
                                <section>
                                    <h3 className="font-semibold">Materials Needed:</h3>
                                    <ul className="list-disc pl-5">
                                        {openDetails.details.materialsNeeded.split("\n").map((mat, i) => (
                                            <li key={i}>{mat.replace(/^- /, '')}</li>
                                        ))}
                                    </ul>
                                </section>
                                <section>
                                    <h3 className="font-semibold">Assessment:</h3>
                                    <ul className="list-disc pl-5">
                                        {openDetails.details.assessment.split("\n").map((ass, i) => (
                                            <li key={i}>{ass.replace(/^- /, '')}</li>
                                        ))}
                                    </ul>
                                </section>
                                <section>
                                    <h3 className="font-semibold">Example:</h3>
                                    <p className="italic">{openDetails.details.example}</p>
                                </section>
                                <section>
                                    <h3 className="font-semibold">Related Resources:</h3>
                                    <ul className="list-disc pl-5">
                                        {openDetails.details.relatedResources.split("\n").map((link, i) => (
                                            <li key={i}>
                                                <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                                    {link}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                                {openDetails.details.notes && (
                                    <section>
                                        <h3 className="font-semibold">Notes:</h3>
                                        <p>{openDetails.details.notes}</p>
                                    </section>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
