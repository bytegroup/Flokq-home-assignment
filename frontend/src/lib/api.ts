import axios from './axios';
import {
    RegisterData,
    PartsResponse,
    PartResponse,
    CreatePartData,
    UpdatePartData,
    Analytics,
} from '@/types';

// Auth API (without token for public endpoints)
export const authAPI = {
    register: async (data: RegisterData) => {
        const response = await axios.post('/auth/register', data);
        return response.data;
    },

    getProfile: async () => {
        const response = await axios.get('/auth/profile');
        return response.data;
    },
};

// Parts API
export const partsAPI = {
    getAll: async (params?: {
        page?: number;
        limit?: number;
        search?: string;
        category?: string;
        sortBy?: string;
        order?: 'asc' | 'desc';
    }): Promise<PartsResponse> => {
        const response = await axios.get('/parts', { params });
        return response.data;
    },

    getById: async (id: string | number): Promise<PartResponse> => {
        const response = await axios.get(`/parts/${id}`);
        return response.data;
    },

    getCategories: async (): Promise<string[]> => {
        const response = await axios.get('/parts/categories');
        return response.data.categories;
    },

    create: async (data: CreatePartData) => {
        const response = await axios.post('/parts', data);
        return response.data;
    },

    update: async (id: number, data: UpdatePartData) => {
        const response = await axios.put(`/parts/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        const response = await axios.delete(`/parts/${id}`);
        return response.data;
    },

    getAnalytics: async (): Promise<Analytics> => {
        const response = await axios.get('/parts/analytics/overview');
        return response.data;
    },
};

// Server-side fetch with token (for SSR/SSG)
export const fetchWithToken = async (url: string, token?: string) => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${process.env.API_BASE_URL}${url}`, {
        headers,
        cache: 'no-store', // For SSR
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
};