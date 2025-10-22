import Navbar from '@/components/layout/Navbar';
import { Package } from 'lucide-react';

export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="animate-pulse">
                    {/* Breadcrumb skeleton */}
                    <div className="h-4 bg-gray-200 rounded w-32 mb-6"></div>

                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                            {/* Image skeleton */}
                            <div>
                                <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
                                    <Package className="h-40 w-40 text-gray-300 animate-pulse" />
                                </div>
                            </div>

                            {/* Details skeleton */}
                            <div>
                                <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
                                <div className="h-10 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
                                <div className="h-12 bg-gray-200 rounded w-32 mb-6"></div>

                                <div className="space-y-4">
                                    <div className="h-4 bg-gray-200 rounded"></div>
                                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}