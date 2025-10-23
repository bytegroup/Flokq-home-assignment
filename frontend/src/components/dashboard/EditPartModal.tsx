'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { partsAPI } from '@/lib/api';
import { Part, UpdatePartData } from '@/types';
import { X, Loader2 } from 'lucide-react';

interface EditPartModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    part: Part;
}

const partSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    brand: z.string().min(1, 'Brand is required'),
    price: z.number().positive('Price must be positive'),
    stock: z.number().int().nonnegative('Stock must be non-negative'),
    category: z.string().min(1, 'Category is required'),
    imageUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type PartFormData = z.infer<typeof partSchema>;

const categories = ['Filters', 'Brakes', 'Ignition', 'Electrical', 'Cooling', 'Accessories', 'Oils'];

export default function EditPartModal({ isOpen, onClose, onSuccess, part }: EditPartModalProps) {
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<PartFormData>({
        resolver: zodResolver(partSchema),
    });

    useEffect(() => {
        if (part) {
            reset({
                name: part.name,
                brand: part.brand,
                price: parseFloat(part.price.toString()),
                stock: part.stock,
                category: part.category,
                imageUrl: part.imageUrl || '',
            });
        }
    }, [part, reset]);

    const onSubmit = async (data: PartFormData) => {
        try {
            setIsSubmitting(true);
            setError(null);
            await partsAPI.update(part.id, data as UpdatePartData);
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to update part');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setError(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* Overlay */}
                <div
                    className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                    onClick={handleClose}
                ></div>

                {/* Modal */}
                <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg w-full">
                    {/* Header */}
                    <div className="bg-white px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-gray-900">Edit Part</h3>
                            <button
                                onClick={handleClose}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="bg-white px-6 py-4 space-y-4">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Part Name *
                                </label>
                                <input
                                    {...register('name')}
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                                )}
                            </div>

                            {/* Brand */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Brand *
                                </label>
                                <input
                                    {...register('brand')}
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                                {errors.brand && (
                                    <p className="mt-1 text-sm text-red-600">{errors.brand.message}</p>
                                )}
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category *
                                </label>
                                <select
                                    {...register('category')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    <option value="">Select category</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                                {errors.category && (
                                    <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                                )}
                            </div>

                            {/* Price & Stock */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Price ($) *
                                    </label>
                                    <input
                                        {...register('price', { valueAsNumber: true })}
                                        type="number"
                                        step="0.01"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                    {errors.price && (
                                        <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Stock *
                                    </label>
                                    <input
                                        {...register('stock', { valueAsNumber: true })}
                                        type="number"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                    {errors.stock && (
                                        <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Image URL (Optional) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Image URL (Optional)
                                </label>
                                <input
                                    {...register('imageUrl')}
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="https://example.com/image.jpg"
                                />
                                {errors.imageUrl && (
                                    <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2" size={18} />
                                        Updating...
                                    </>
                                ) : (
                                    'Update Part'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}