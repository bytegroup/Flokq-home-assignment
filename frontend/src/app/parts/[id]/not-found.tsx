import Link from 'next/link';
import { Package } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="text-center">
                <Package className="h-24 w-24 text-gray-400 mx-auto mb-6" />
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Part Not Found</h1>
                <p className="text-lg text-gray-600 mb-8">
                    The part you're looking for doesn't exist or has been removed.
                </p>
                <Link
                    href="/"
                    className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
}