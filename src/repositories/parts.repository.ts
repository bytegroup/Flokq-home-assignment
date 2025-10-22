import prisma from '../config/database';
import { Part, Prisma } from '@prisma/client';

export interface PartFilters {
    search?: string;
    category?: string;
}

export interface PaginationOptions {
    page: number;
    limit: number;
    sortBy: string;
    order: 'asc' | 'desc';
}

export class PartRepository {
    async findAll(
        filters: PartFilters,
        pagination: PaginationOptions
    ): Promise<{ parts: Part[]; total: number }> {
        const { page, limit, sortBy, order } = pagination;
        const skip = (page - 1) * limit;

        // Build where clause
        const where: Prisma.PartWhereInput = {};

        if (filters.search) {
            where.OR = [
                { name: { contains: filters.search } },
                { brand: { contains: filters.search } },
            ];
        }

        if (filters.category) {
            where.category = filters.category;
        }

        // Execute queries in parallel
        const [parts, total] = await Promise.all([
            prisma.part.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: order },
            }),
            prisma.part.count({ where }),
        ]);

        return { parts, total };
    }

    async findById(id: number): Promise<Part | null> {
        return await prisma.part.findUnique({
            where: { id },
        });
    }

    async create(data: {
        name: string;
        brand: string;
        price: number;
        stock: number;
        category: string;
        imageUrl?: string;
    }): Promise<Part> {
        return await prisma.part.create({
            data: {
                ...data,
                imageUrl: data.imageUrl || null,
            },
        });
    }

    async update(id: number, data: any): Promise<Part> {
        return await prisma.part.update({
            where: { id },
            data,
        });
    }

    async delete(id: number): Promise<void> {
        await prisma.part.delete({
            where: { id },
        });
    }

    async existsById(id: number): Promise<boolean> {
        const count = await prisma.part.count({
            where: { id },
        });
        return count > 0;
    }

    async getAnalytics() {
        const [totalParts, categories, totalStock] = await Promise.all([
            prisma.part.count(),
            prisma.part.groupBy({
                by: ['category'],
                _count: {
                    category: true,
                },
            }),
            prisma.part.aggregate({
                _sum: {
                    stock: true,
                },
            }),
        ]);

        return {
            totalParts,
            totalStock: totalStock._sum.stock || 0,
            categories: categories.length,
            categoryBreakdown: categories.map((cat) => ({
                category: cat.category,
                count: cat._count.category,
            })),
        };
    }

    async getAllCategories(): Promise<string[]> {
        const categories = await prisma.part.findMany({
            select: { category: true },
            distinct: ['category'],
        });
        return categories.map((c) => c.category);
    }
}

export default new PartRepository();