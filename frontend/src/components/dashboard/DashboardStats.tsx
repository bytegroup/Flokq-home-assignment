'use client';

import { useEffect, useState } from 'react';
import { partsAPI } from '@/lib/api';
import { Analytics } from '@/types';
import { Package, DollarSign, TrendingUp, Loader2 } from 'lucide-react';

export default function DashboardStats() {
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const data = await partsAPI.getAnalytics();
            setAnalytics(data);
            setError(null);
        } catch (err: any) {
            setError('Failed to load analytics');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
            </div>
        );
    }

    if (!analytics) return null;

    const stats = [
        {
            name: 'Total Parts',
            value: analytics.totalParts,
            icon: Package,
            color: 'bg-blue-500',
        },
        {
            name: 'Total Stock',
            value: analytics.totalStock,
            icon: DollarSign,
            color: 'bg-green-500',
        },
        {
            name: 'Categories',
            value: analytics.categories,
            icon: TrendingUp,
            color: 'bg-purple-500',
        },
    ];

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {stat.value.toLocaleString()}
                                </p>
                            </div>
                            <div className={`${stat.color} p-3 rounded-lg`}>
                                <stat.icon className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Category Breakdown */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Parts by Category
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {analytics.categoryBreakdown.map((cat) => (
                        <div
                            key={cat.category}
                            className="bg-gray-50 rounded-lg p-4 text-center"
                        >
                            <p className="text-sm text-gray-600">{cat.category}</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {cat.count}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}