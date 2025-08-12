"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookText,
  BotMessageSquare,
  PencilRuler,
  FileText,
  UsersRound,
  UserCircle,
  ClipboardList,
  History
} from "lucide-react";
import { useSession } from "next-auth/react";
import GuestLanding from "./GuestLanding";
export default function HomePage() {
  const { data: session } = useSession();
  if (!session) {
    return <GuestLanding />;
  }

  const user = session.user;

  return (
    <main className="w-full min-h-screen bg-blue-200 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">
              Welcome back, {user.name}!
            </h1>
            <p className="text-lg text-gray-500 mt-1">
              Let's create something amazing today.
            </p>
          </div>
        </header>
        <section>
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/tools/notes-generator" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all">
              <BookText className="w-10 h-10 text-blue-600 mb-3" />
              <h3 className="text-xl font-semibold text-gray-800">Create Notes</h3>
              <p className="text-gray-500 mt-1">Generate detailed notes on any topic.</p>
            </Link>
            <Link href="/tools/quiz-maker" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all">
              <PencilRuler className="w-10 h-10 text-green-600 mb-3" />
              <h3 className="text-xl font-semibold text-gray-800">Make a Quiz</h3>
              <p className="text-gray-500 mt-1">Craft assessments in seconds.</p>
            </Link>
            <Link href="/tools/summarizer" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all">
              <BotMessageSquare className="w-10 h-10 text-purple-600 mb-3" />
              <h3 className="text-xl font-semibold text-gray-800">Summarize Topic</h3>
              <p className="text-gray-500 mt-1">Simplify complex texts and articles.</p>
            </Link>
            <Link href="/tools/exam-generator" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all">
              <FileText className="w-10 h-10 text-red-600 mb-3" />
              <h3 className="text-xl font-semibold text-gray-800">Exam Paper</h3>
              <p className="text-gray-500 mt-1">Build a complete exam paper.</p>
            </Link>
            <Link href="/tools/lesson-plan" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all">
              <ClipboardList className="w-10 h-10 text-yellow-600 mb-3" />
              <h3 className="text-xl font-semibold text-gray-800">Lesson Plan</h3>
              <p className="text-gray-500 mt-1">Create a complete lesson plan.</p>
            </Link>
            <Link href="/tools/activities" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all">
              <UsersRound className="w-10 h-10 text-pink-600 mb-3" />
              <h3 className="text-xl font-semibold text-gray-800">Class Activities</h3>
              <p className="text-gray-500 mt-1">Generate engaging activities.</p>
            </Link>
            <Link href="/dashboard/profile" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all">
              <UserCircle className="w-10 h-10 text-sky-300 mb-3" />
              <h3 className="text-xl font-semibold text-gray-800">Profile</h3>
              <p className="text-gray-500 mt-1">View or edit your profile.</p>
            </Link>
            <Link
              href="/dashboard/work-history"
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <History className="w-10 h-10 text-red-900 mb-3" />
              <h3 className="text-xl font-semibold text-gray-800">Work History</h3>
              <p className="text-gray-500 mt-1">Review your generation history and activities.</p>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
