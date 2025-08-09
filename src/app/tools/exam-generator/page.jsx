import React from 'react'
import ExamPaperGeneratorPage from '@/components/exam-genarotor'
import Navbar from '@/components/Navbar'
function page() {
    return (
        <div className="min-h-screen font-sans bg-blue-200">
            <Navbar />
            <ExamPaperGeneratorPage />
        </div>
    )
}

export default page