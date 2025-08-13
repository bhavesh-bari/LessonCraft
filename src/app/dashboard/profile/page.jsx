import React from 'react';
import { HardHat } from 'lucide-react'; // Import a relevant icon

function Page() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-2000 text-gray-800">
            <HardHat className="w-24 h-24 text-yellow-500 mb-6" />
            <h1 className="text-4xl font-bold mb-2">
                Under Construction
            </h1>
            <p className="text-lg text-gray-600">
                We're working hard to bring you something amazing. Please check back soon!
            </p>
        </div>
    );
}

export default Page;