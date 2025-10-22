import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Part } from '@/types';
import Navbar from '@/components/layout/Navbar';
import PartDetail from '@/components/parts/PartDetail';

interface PartPageProps {
    params: {
        id: string;
    };
}

// Generate static params for all parts at build time
export async function generateStaticParams() {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/parts?limit=100`,
            { cache: 'no-store' }
        );

        if (!response.ok) {
            return [];
        }

        const data = await response.json();
        const parts = data.parts || [];

        return parts.map((part: Part) => ({
            id: part.id.toString(),
        }));
    } catch (error) {
        console.error('Error generating static params:', error);
        return [];
    }
}

// Fetch part data
async function getPartData(id: string): Promise<Part | null> {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/parts/${id}`,
            {
                next: { revalidate: 60 }, // Revalidate every 60 seconds (ISR)
            }
        );

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        return data.part;
    } catch (error) {
        console.error('Error fetching part:', error);
        return null;
    }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PartPageProps): Promise<Metadata> {
    const part = await getPartData(params.id);

    if (!part) {
        return {
            title: 'Part Not Found',
            description: 'The requested part could not be found',
        };
    }

    return {
        title: `${part.name} - ${part.brand} | Auto Parts`,
        description: `${part.name} by ${part.brand}. Price: $${part.price}. Category: ${part.category}. Stock: ${part.stock} units available.`,
        keywords: [part.name, part.brand, part.category, 'auto parts'],
    };
}

export default async function PartPage({ params }: PartPageProps) {
    const part = await getPartData(params.id);

    if (!part) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <PartDetail part={part} />
        </div>
    );
}