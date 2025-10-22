'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Part } from '@/types';
import {
    Package,
    DollarSign,
    Box,
    Tag,
    Calendar,
    TrendingUp,
    ChevronLeft,
    Share2
} from 'lucide-react';

interface PartDetailProps {
    part: Part;
}

export default function PartDetail({ part }: PartDetailProps) {
    const [copied, setCopied] = useState(false);
    const price = typeof part.price === 'string' ? parseFloat(part.price) : part.price;

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <div className="mb-6">
                <Link
                    href="/"
                    className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700"
                >
                    <ChevronLeft size={16} />
                    <span className="ml-1">Back to all parts</span>
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                    {/* Left Column - Image */}
                    <div>
                        <div className="bg-gradient-to-br from-indigo-100 to-blue-100 rounded-lg h-96 flex items-center justify-center">
                            <Package className="h-40 w-40 text-indigo-400" />
                        </div>

                        {/* Quick Actions */}
                        <div className="mt-6 flex gap-4">
                            <button
                                onClick={handleShare}
                                className="flex-1 flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            >
                                <Share2 size={18} className="mr-2" />
                                {copied ? 'Link Copied!' : 'Share'}
                            </button>
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div>
                        {/* Category Badge */}
                        <span className="inline-block px-3 py-1 text-sm font-semibold text-indigo-600 bg-indigo-100 rounded-full mb-4">
              {part.category}
            </span>

                        {/* Part Name */}
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            {part.name}
                        </h1>

                        {/* Brand */}
                        <p className="text-xl text-gray-600 mb-6">{part.brand}</p>

                        {/* Price */}
                        <div className="flex items-baseline mb-6 pb-6 border-b border-gray-200">
              <span className="text-4xl font-bold text-green-600">
                ${price.toFixed(2)}
              </span>
                            <span className="ml-2 text-gray-500">per unit</span>
                        </div>

                        {/* Stock Status */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Availability
                </span>
                                <span
                                    className={`text-sm font-semibold ${
                                        part.stock > 0 ? 'text-green-600' : 'text-red-600'
                                    }`}
                                >
                  {part.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className={`h-2.5 rounded-full ${
                                        part.stock > 50
                                            ? 'bg-green-600'
                                            : part.stock > 0
                                                ? 'bg-yellow-500'
                                                : 'bg-red-600'
                                    }`}
                                    style={{
                                        width: `${Math.min((part.stock / 100) * 100, 100)}%`,
                                    }}
                                ></div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                                {part.stock} units available
                            </p>
                        </div>

                        {/* Specifications */}
                        <div className="bg-gray-50 rounded-lg p-6 mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Specifications
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <Tag className="h-5 w-5 text-gray-400 mr-3" />
                                    <span className="text-sm text-gray-600 w-24">Part ID:</span>
                                    <span className="text-sm font-medium text-gray-900">
                    #{part.id}
                  </span>
                                </div>
                                <div className="flex items-center">
                                    <Package className="h-5 w-5 text-gray-400 mr-3" />
                                    <span className="text-sm text-gray-600 w-24">Category:</span>
                                    <span className="text-sm font-medium text-gray-900">
                    {part.category}
                  </span>
                                </div>
                                <div className="flex items-center">
                                    <TrendingUp className="h-5 w-5 text-gray-400 mr-3" />
                                    <span className="text-sm text-gray-600 w-24">Brand:</span>
                                    <span className="text-sm font-medium text-gray-900">
                    {part.brand}
                  </span>
                                </div>
                                <div className="flex items-center">
                                    <Box className="h-5 w-5 text-gray-400 mr-3" />
                                    <span className="text-sm text-gray-600 w-24">Stock:</span>
                                    <span className="text-sm font-medium text-gray-900">
                    {part.stock} units
                  </span>
                                </div>
                                <div className="flex items-center">
                                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                                    <span className="text-sm text-gray-600 w-24">Added:</span>
                                    <span className="text-sm font-medium text-gray-900">
                    {formatDate(part.createdAt)}
                  </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <Link
                                href="/"
                                className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition text-center"
                            >
                                Browse More Parts
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Additional Information Section */}
                <div className="border-t border-gray-200 bg-gray-50 p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Shipping Info */}
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-3">
                                Shipping Information
                            </h4>
                            <ul className="text-sm text-gray-600 space-y-2">
                                <li>• Free shipping on orders over $50</li>
                                <li>• Standard delivery: 3-5 business days</li>
                                <li>• Express delivery available</li>
                            </ul>
                        </div>

                        {/* Return Policy */}
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-3">
                                Return Policy
                            </h4>
                            <ul className="text-sm text-gray-600 space-y-2">
                                <li>• 30-day return policy</li>
                                <li>• Free returns on defective items</li>
                                <li>• Full refund or exchange</li>
                            </ul>
                        </div>

                        {/* Warranty */}
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Warranty</h4>
                            <ul className="text-sm text-gray-600 space-y-2">
                                <li>• 1-year manufacturer warranty</li>
                                <li>• Covers manufacturing defects</li>
                                <li>• Extended warranty available</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Parts Section */}
            <div className="mt-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        More from {part.category}
                    </h2>
                    <Link
                        href={`/?category=${part.category}`}
                        className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                    >
                        View all →
                    </Link>
                </div>
                <div className="bg-white rounded-lg shadow p-6 text-center text-gray-600">
                    Browse more parts in the {part.category} category
                </div>
            </div>
        </div>
    );
}