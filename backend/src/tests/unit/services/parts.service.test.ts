import { PartService } from '../../../services/parts.service';
import partRepository from '../../../repositories/parts.repository';

jest.mock('../../../repositories/parts.repository');

describe('PartService', () => {
    let partService: PartService;

    beforeEach(() => {
        partService = new PartService();
        jest.clearAllMocks();
    });

    describe('createPart', () => {
        it('should create a part successfully', async () => {
            const partData = {
                name: 'Oil Filter',
                brand: 'Bosch',
                price: 15.99,
                stock: 100,
                category: 'Filters',
            };

            const mockPart = {
                id: 1,
                ...partData,
                imageUrl: null,
                createdAt: new Date(),
            };

            (partRepository.create as jest.Mock).mockResolvedValue(mockPart);

            const result = await partService.createPart(partData);

            expect(result).toEqual(mockPart);
            expect(partRepository.create).toHaveBeenCalledWith(partData);
        });

        it('should throw error if stock is negative', async () => {
            const partData = {
                name: 'Oil Filter',
                brand: 'Bosch',
                price: 15.99,
                stock: -10,
                category: 'Filters',
            };

            await expect(partService.createPart(partData)).rejects.toThrow('INVALID_STOCK');
            expect(partRepository.create).not.toHaveBeenCalled();
        });

        it('should throw error if price is zero or negative', async () => {
            const partData = {
                name: 'Oil Filter',
                brand: 'Bosch',
                price: 0,
                stock: 100,
                category: 'Filters',
            };

            await expect(partService.createPart(partData)).rejects.toThrow('INVALID_PRICE');
            expect(partRepository.create).not.toHaveBeenCalled();
        });
    });

    describe('updatePart', () => {
        it('should update part successfully', async () => {
            const partId = 1;
            const updateData = { price: 20.99, stock: 150 };

            const mockUpdatedPart = {
                id: partId,
                name: 'Oil Filter',
                brand: 'Bosch',
                price: 20.99,
                stock: 150,
                category: 'Filters',
                imageUrl: null,
                createdAt: new Date(),
            };

            (partRepository.existsById as jest.Mock).mockResolvedValue(true);
            (partRepository.update as jest.Mock).mockResolvedValue(mockUpdatedPart);

            const result = await partService.updatePart(partId, updateData);

            expect(result).toEqual(mockUpdatedPart);
            expect(partRepository.existsById).toHaveBeenCalledWith(partId);
            expect(partRepository.update).toHaveBeenCalledWith(partId, updateData);
        });

        it('should throw error if part not found', async () => {
            (partRepository.existsById as jest.Mock).mockResolvedValue(false);

            await expect(partService.updatePart(999, { price: 20 })).rejects.toThrow(
                'PART_NOT_FOUND'
            );
            expect(partRepository.update).not.toHaveBeenCalled();
        });
    });

    describe('deletePart', () => {
        it('should delete part successfully', async () => {
            const partId = 1;

            (partRepository.existsById as jest.Mock).mockResolvedValue(true);
            (partRepository.delete as jest.Mock).mockResolvedValue(undefined);

            await partService.deletePart(partId);

            expect(partRepository.existsById).toHaveBeenCalledWith(partId);
            expect(partRepository.delete).toHaveBeenCalledWith(partId);
        });

        it('should throw error if part not found', async () => {
            (partRepository.existsById as jest.Mock).mockResolvedValue(false);

            await expect(partService.deletePart(999)).rejects.toThrow('PART_NOT_FOUND');
            expect(partRepository.delete).not.toHaveBeenCalled();
        });
    });
});