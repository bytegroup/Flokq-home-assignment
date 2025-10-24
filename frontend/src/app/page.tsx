import { Metadata } from 'next';
import { Part, PartsResponse } from '@/types';
import Navbar from '@/components/layout/Navbar';
import PartsGrid from '@/components/parts/PartsGrid';
import SearchBar from '@/components/parts/SearchBar';
import Hero from '@/components/layout/Hero';

export const metadata: Metadata = {
    title: 'Auto Parts Inventory - Browse All Parts',
    description: 'Browse our complete inventory of auto parts with detailed specifications',
};

// This page uses SSR - data is fetched on every request
export const dynamic = 'force-dynamic';

interface HomePageProps {
    searchParams: {
        page?: string;
        search?: string;
        category?: string;
    };
}

async function getPartsData(searchParams: HomePageProps['searchParams']): Promise<PartsResponse> {
    try {
        const page = parseInt(searchParams.page || '1');
        const search = searchParams.search;
        const category = searchParams.category;

        const params = new URLSearchParams({
            page: page.toString(),
            limit: '12',
            ...(search && { search }),
            ...(category && { category }),
        });

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const response = await fetch(
            `${apiUrl}/parts?${params}`,
            {
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch parts');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching parts:', error);
        return {
            parts: [],
            pagination: {
                page: 1,
                limit: 12,
                total: 0,
                totalPages: 0,
            },
        };
    }
}

export default async function HomePage({ searchParams }: HomePageProps) {
    const data = await getPartsData(searchParams);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Hero />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Browse Parts</h2>
                    <SearchBar initialSearch={searchParams.search} initialCategory={searchParams.category} />
                </div>

                <PartsGrid
                    parts={data.parts}
                    pagination={data.pagination}
                    currentPage={parseInt(searchParams.page || '1')}
                    search={searchParams.search}
                    category={searchParams.category}
                />
            </main>
        </div>
    );
}