import React from 'react'
import QuizMaker from '@/components/quiz-maker'
import Navbar from '@/components/Navbar'
function page() {
    return (
        <div className="min-h-screen font-sans bg-blue-200">
            <Navbar />
            <QuizMaker />
        </div>
    )
}

export default page