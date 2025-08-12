"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function GuestLanding() {
    return (
        <section className="w-full bg-blue-200 py-16 md:py-24 min-h-screen flex items-center">
            <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-12">
                <div className="md:w-1/2 text-center md:text-left">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 leading-tight">
                        Welcome to LessonCraft AI
                    </h1>
                    <p className="text-lg text-gray-600 mt-4 max-w-lg mx-auto md:mx-0">
                        Your AI-powered teaching assistant. Save time on preparation and focus on what matters most: your students.
                    </p>
                    <Link href="/auth">
                        <button className="mt-8 bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-blue-700 transition-colors shadow-lg">
                            Get Started
                        </button>
                    </Link>
                </div>
                <div className="md:w-1/3">
                    <Image
                        src="/LessonCraftLogo.png"
                        alt="LessonCraft AI Logo"
                        width={300}
                        height={300}
                        className="rounded-full shadow-2xl"
                    />
                </div>
            </div>
        </section>
    );
}
