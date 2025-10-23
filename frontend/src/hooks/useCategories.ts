'use client';

import { useState, useEffect } from 'react';
import { partsAPI } from '@/lib/api';

export const useCategories = () => {
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await partsAPI.getCategories();
            setCategories(data);
            setError(null);
        } catch (err: any) {
            setError('Failed to load categories');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const addCategory = (newCategory: string) => {
        if (!categories.includes(newCategory)) {
            setCategories([...categories, newCategory]);
        }
    };

    return {
        categories,
        loading,
        error,
        addCategory,
        refetch: fetchCategories,
    };
};