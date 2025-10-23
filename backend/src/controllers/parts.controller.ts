import { Request, Response, NextFunction } from 'express';
import partService from '../services/parts.service';
import { createPartSchema, updatePartSchema, paginationSchema } from '../utils/validation';

export const getAllParts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const query = paginationSchema.parse(req.query);

        const filters = {
            search: query.search,
            category: query.category,
        };

        const pagination = {
            page: parseInt(query.page),
            limit: parseInt(query.limit),
            sortBy: query.sortBy,
            order: query.order,
        };

        const result = await partService.getAllParts(filters, pagination);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

export const getPartById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        const part = await partService.getPartById(id);
        res.json({ part });
    } catch (error: any) {
        if (error.message === 'PART_NOT_FOUND') {
            res.status(404).json({ error: 'Part not found' });
            return;
        }
        next(error);
    }
};

export const createPart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const validatedData = createPartSchema.parse(req.body);
        const part = await partService.createPart(validatedData);

        res.status(201).json({
            message: 'Part created successfully',
            part,
        });
    } catch (error: any) {
        if (error.message === 'INVALID_STOCK' || error.message === 'INVALID_PRICE') {
            res.status(400).json({ error: error.message });
            return;
        }
        next(error);
    }
};

export const updatePart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        const validatedData = updatePartSchema.parse(req.body);
        const part = await partService.updatePart(id, validatedData);

        res.json({
            message: 'Part updated successfully',
            part,
        });
    } catch (error: any) {
        if (error.message === 'PART_NOT_FOUND') {
            res.status(404).json({ error: 'Part not found' });
            return;
        }
        if (error.message === 'INVALID_STOCK' || error.message === 'INVALID_PRICE') {
            res.status(400).json({ error: error.message });
            return;
        }
        next(error);
    }
};

export const deletePart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        await partService.deletePart(id);

        res.json({ message: 'Part deleted successfully' });
    } catch (error: any) {
        if (error.message === 'PART_NOT_FOUND') {
            res.status(404).json({ error: 'Part not found' });
            return;
        }
        next(error);
    }
};

export const getAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const analytics = await partService.getAnalytics();
        res.json(analytics);
    } catch (error) {
        next(error);
    }
};

export const getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const categories = await partService.getCategories();
        res.json({ categories });
    } catch (error) {
        next(error);
    }
};