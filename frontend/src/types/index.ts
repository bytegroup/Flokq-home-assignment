// User & Auth Types
export interface User {
    id: number;
    name: string;
    email: string;
    createdAt?: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

// Part Types
export interface Part {
    id: number;
    name: string;
    brand: string;
    price: number | string;
    stock: number;
    category: string;
    imageUrl?: string | null;
    createdAt?: string;
}

export interface CreatePartData {
    name: string;
    brand: string;
    price: number;
    stock: number;
    category: string;
    imageUrl?: string;
}

export interface UpdatePartData extends Partial<CreatePartData> {}

// API Response Types
export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface PartsResponse {
    parts: Part[];
    pagination: PaginationMeta;
}

export interface PartResponse {
    part: Part;
}

export interface Analytics {
    totalParts: number;
    totalStock: number;
    categories: number;
    categoryBreakdown: {
        category: string;
        count: number;
    }[];
}

export interface ApiError {
    error: string;
    details?: any;
}