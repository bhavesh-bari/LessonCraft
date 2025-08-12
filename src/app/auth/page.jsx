import React from 'react'
import AuthPage from '@/components/Auth'
import Navbar from '@/components/Navbar'
function page() {
    return (
        <div className="min-h-screen font-sans bg-blue-200">
            <Navbar />
            <AuthPage />
        </div>
    )
}

export default page