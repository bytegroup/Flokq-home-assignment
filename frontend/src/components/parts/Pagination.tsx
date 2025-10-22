'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    search?: string;
    category?: string;
}

export default function Pagination({
                                       currentPage,
                                       totalPages,
                                       search,
                                       category
                                   }: PaginationProps) {
    const buildUrl = (page: number) => {
        const params = new URLSearchParams();
        params.set('page', page.toString());
        if (search) params.set('search', search);
        if (category) params.set('category', category);
        return `/?${params.toString()}`;
    };

    const getPageNumbers = () => {
        const pages = [];
        const showPages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
        let endPage = Math.min(totalPages, startPage + showPages - 1);

        if (endPage - startPage + 1 < showPages) {
            startPage = Math.max(1, endPage - showPages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    return (
        <div className="flex justify-center items-center space-x-2">
            {/* Previous Button */}
            <Link
                href={buildUrl(currentPage - 1)}
                className={`px-4 py-2 rounded-lg border flex items-center ${
                    currentPage === 1
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed pointer-events-none'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
            >
                <ChevronLeft size={20} />
                <span className="ml-1 hidden sm:inline">Previous</span>
            </Link>

            {/* Page Numbers */}
            <div className="flex space-x-2">
                {getPageNumbers().map((page) => (
                    <Link
                        key={page}
                        href={buildUrl(page)}
                        className={`px-4 py-2 rounded-lg border ${
                            page === currentPage
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        {page}
                    </Link>
                ))}
            </div>

            {/* Next Button */}
            <Link
                href={buildUrl(currentPage + 1)}
                className={`px-4 py-2 rounded-lg border flex items-center ${
                    currentPage === totalPages
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed pointer-events-none'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
            >
                <span className="mr-1 hidden sm:inline">Next</span>
                <ChevronRight size={20} />
            </Link>
        </div>
    );
}