'use client';

import { useEffect, useState } from 'react';
import { partsAPI } from '@/lib/api';
import { Part } from '@/types';
import { Edit2, Trash2, Loader2, Search } from 'lucide-react';

interface PartsTableProps {
    onEditClick: (part: Part) => void;
    onDeleteSuccess: () => void;
}

export default function PartsTable({ onEditClick, onDeleteSuccess }: PartsTableProps) {
    const [parts, setParts] = useState<Part[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<number | null>(null);
    const [search, setSearch] = useState('');
    const [filteredParts, setFilteredParts] = useState<Part[]>([]);

    useEffect(() => {
        fetchParts();
    }, []);

    useEffect(() => {
        if (search.trim() === '') {
            setFilteredParts(parts);
        } else {
            const filtered = parts.filter(
                (part) =>
                    part.name.toLowerCase().includes(search.toLowerCase()) ||
                    part.brand.toLowerCase().includes(search.toLowerCase()) ||
                    part.category.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredParts(filtered);
        }
    }, [search, parts]);

    const fetchParts = async () => {
        try {
            setLoading(true);
            const data = await partsAPI.getAll({ limit: 100 });
            setParts(data.parts);
            setFilteredParts(data.parts);
        } catch (err) {
            console.error('Failed to fetch parts:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this part?')) {
            return;
        }

        try {
            setDeleting(id);
            await partsAPI.delete(id);
            setParts(parts.filter((p) => p.id !== id));
            onDeleteSuccess();
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to delete part');
        } finally {
            setDeleting(null);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow">
                <div className="p-6 flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow">
            {/* Search Bar */}
            <div className="p-6 border-b border-gray-200">
                <div className="relative">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search parts by name, brand, or category..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Brand
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Stock
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {filteredParts.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                {search ? 'No parts found matching your search' : 'No parts available'}
                            </td>
                        </tr>
                    ) : (
                        filteredParts.map((part) => (
                            <tr key={part.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    #{part.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{part.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {part.brand}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold text-indigo-600 bg-indigo-100 rounded-full">
                      {part.category}
                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                    ${parseFloat(part.price.toString()).toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                    <span
                        className={`text-sm font-medium ${
                            part.stock > 0 ? 'text-gray-900' : 'text-red-600'
                        }`}
                    >
                      {part.stock}
                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => onEditClick(part)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                        title="Edit"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(part.id)}
                                        disabled={deleting === part.id}
                                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                        title="Delete"
                                    >
                                        {deleting === part.id ? (
                                            <Loader2 size={18} className="animate-spin" />
                                        ) : (
                                            <Trash2 size={18} />
                                        )}
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <p className="text-sm text-gray-600">
                    Showing {filteredParts.length} of {parts.length} parts
                </p>
            </div>
        </div>
    );
}