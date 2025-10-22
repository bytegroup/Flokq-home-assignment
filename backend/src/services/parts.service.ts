import partRepository, { PartFilters, PaginationOptions } from '../repositories/parts.repository';
import { Prisma } from '@prisma/client';

export class PartService {
    async getAllParts(filters: PartFilters, pagination: PaginationOptions) {
        const { parts, total } = await partRepository.findAll(filters, pagination);

        return {
            parts,
            pagination: {
                page: pagination.page,
                limit: pagination.limit,
                total,
                totalPages: Math.ceil(total / pagination.limit),
            },
        };
    }

    async getPartById(id: number) {
        const part = await partRepository.findById(id);
        if (!part) {
            throw new Error('PART_NOT_FOUND');
        }
        return part;
    }

    async createPart(data: {
        name: string;
        brand: string;
        price: number;
        stock: number;
        category: string;
        imageUrl?: string;
    }) {
        // Business logic: validate stock
        if (data.stock < 0) {
            throw new Error('INVALID_STOCK');
        }

        // Business logic: validate price
        if (data.price <= 0) {
            throw new Error('INVALID_PRICE');
        }

        const part = await partRepository.create(data);
        return part;
    }

    async updatePart(id: number, data: Partial<{
        name: string;
        brand: string;
        price: number;
        stock: number;
        category: string;
        imageUrl: string;
    }>) {
        // Check if part exists
        const exists = await partRepository.existsById(id);
        if (!exists) {
            throw new Error('PART_NOT_FOUND');
        }

        // Business logic: validate if updating stock
        if (data.stock !== undefined && data.stock < 0) {
            throw new Error('INVALID_STOCK');
        }

        // Business logic: validate if updating price
        if (data.price !== undefined && data.price <= 0) {
            throw new Error('INVALID_PRICE');
        }

        // Convert to Prisma-compatible update data
        const updateData: any = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (data.brand !== undefined) updateData.brand = data.brand;
        if (data.price !== undefined) updateData.price = data.price;
        if (data.stock !== undefined) updateData.stock = data.stock;
        if (data.category !== undefined) updateData.category = data.category;
        if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;

        const part = await partRepository.update(id, updateData);
        return part;
    }

    async deletePart(id: number) {
        // Check if part exists
        const exists = await partRepository.existsById(id);
        if (!exists) {
            throw new Error('PART_NOT_FOUND');
        }

        await partRepository.delete(id);
    }

    async getAnalytics() {
        return await partRepository.getAnalytics();
    }

    async getCategories() {
        return await partRepository.getAllCategories();
    }

    async adjustStock(id: number, quantity: number) {
        const part = await partRepository.findById(id);
        if (!part) {
            throw new Error('PART_NOT_FOUND');
        }

        const newStock = part.stock + quantity;
        if (newStock < 0) {
            throw new Error('INSUFFICIENT_STOCK');
        }

        return await partRepository.update(id, { stock: newStock });
    }
}

export default new PartService();