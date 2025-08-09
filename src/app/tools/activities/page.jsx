import React from 'react'
import Navbar from '@/components/Navbar'
import Activities from '@/components/Activities'
function page() {
    return (
        <div className="min-h-screen font-sans bg-blue-200">
            <Navbar />
            <Activities />
        </div>
    )
}

export default page