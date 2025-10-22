'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
    initialSearch?: string;
    initialCategory?: string;
}

const categories = [
    'All Categories',
    'Filters',
    'Brakes',
    'Ignition',
    'Electrical',
    'Cooling',
    'Accessories',
    'Oils',
];

export default function SearchBar({ initialSearch = '', initialCategory = '' }: SearchBarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(initialSearch);
    const [category, setCategory] = useState(initialCategory);

    const handleSearch = () => {
        const params = new URLSearchParams();

        if (search) params.set('search', search);
        if (category && category !== 'All Categories') params.set('category', category);

        router.push(`/?${params.toString()}`);
    };

    const handleClear = () => {
        setSearch('');
        setCategory('');
        router.push('/');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search Input */}
                <div className="md:col-span-2">
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                        Search Parts
                    </label>
                    <div className="relative">
                        <input
                            id="search"
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Search by name or brand..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                </div>

                {/* Category Filter */}
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                    </label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat === 'All Categories' ? '' : cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
                <button
                    onClick={handleSearch}
                    className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition flex items-center justify-center"
                >
                    <Search size={20} className="mr-2" />
                    Search
                </button>

                {(search || category) && (
                    <button
                        onClick={handleClear}
                        className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition flex items-center"
                    >
                        <X size={20} className="mr-2" />
                        Clear
                    </button>
                )}
            </div>
        </div>
    );
}