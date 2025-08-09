import React from 'react'
import LessonPlane from '@/components/lessonplane'
import Navbar from '@/components/Navbar'
function page() {
    return (
        <div className="min-h-screen font-sans bg-blue-200">
            <Navbar />
            <LessonPlane />
        </div>
    )
}

export default page