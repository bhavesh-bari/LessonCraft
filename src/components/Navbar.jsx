import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

function Navbar() {
    const isLoggedIn = true;

    return (
        <nav className="w-full bg-blue-300 shadow-md p-2 md:p-3 flex items-center justify-between border-b-2 border-gray-800 sticky top-0 z-50">
            <Link href="/" className="flex items-center gap-2">
                <Image
                    src="/LessonCraftLogo.png"
                    alt="LessonCraft AI Logo"
                    width={50}
                    height={50}
                    className="rounded-full"
                />
                <span className="text-lg sm:block md:text-2xl font-bold text-gray-800">
                    LessonCraft AI
                </span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-4 mr-2">
                {isLoggedIn ? (
                    <button className="bg-red-500 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg text-sm sm:text-base hover:bg-red-600 transition-colors">
                        Logout
                    </button>
                ) : (
                    <>
                        <Link
                            href="/login"
                            className="font-semibold text-gray-600 hover:text-blue-600 transition-colors text-sm sm:text-base"
                        >
                            Login
                        </Link>
                        <Link
                            href="/signup"
                            className="bg-blue-600 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg text-sm sm:text-base hover:bg-blue-700 transition-colors"
                        >
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
